import { Multimedia, MultimediaCategory, MultimediaType, Event } from 'src/app/models/multimedia';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';

interface MediaUploadMetadata {
  category: MultimediaCategory;
  description?: string;
  mediaType?: MultimediaType;
}

@Injectable({
  providedIn: 'root',
})
export class MultimediaService {
  constructor(
    private afs: AngularFirestore,
    private storage: AngularFireStorage
  ) {}

  async updateEventDescription(id: string, newDescription: string): Promise<void> {
    if (!id) throw new Error('Event is required');
    return this.afs.collection('gallery').doc(id).update({
      description: newDescription
    });
  }

  async uploadMedia(file: File, metadata: MediaUploadMetadata): Promise<Multimedia> {
    if (!file) throw new Error("No file provided");
    if (!metadata.category) throw new Error("Category is required");

   const fileName = file.name;
    
    const mediaType = metadata.mediaType || 
      (file.type.startsWith('image/') ? 'image' : file.type.startsWith('video/') ? 'video' : 'other');
    
    const filePath = `media/${metadata.category}/${fileName}`;
    const fileRef = this.storage.ref(filePath);
    
    const task = this.storage.upload(filePath, file);
    
    return new Promise<Multimedia>((resolve, reject) => {
      task.snapshotChanges().pipe(
        finalize(async () => {
          try {
            const url = await fileRef.getDownloadURL().toPromise();
            let storedUrl = url;
            if (metadata.category === 'event') {
              const parsed = new URL(url);
              let path = parsed.pathname;
              const oIndex = path.indexOf('/o/');
              if (oIndex !== -1) {
                path = path.substring(oIndex + 2);
              }
              storedUrl = path + parsed.search;
            }
            const mediaItem: Multimedia = {
              url: storedUrl,
              category: metadata.category,
              type: mediaType
            };
            if (metadata.category === 'event') {
              if (!metadata.description) {
                reject(new Error("Description is required for events"));
                return;
              }
              const eventItem: Event = {
                description: metadata.description,
                url: storedUrl,
                type: mediaType
              };
              const docRef = await this.afs.collection('gallery').add(eventItem);
              resolve({ ...mediaItem, id: docRef.id, description: metadata.description });
            } else {
              resolve(mediaItem);
            }
          } catch (error) {
            reject(error);
          }
        })
      ).subscribe({
        error: (error) => reject(error)
      });
    });
  }

  async getAllMedia(): Promise<Multimedia[]> {
    const mediaList: Multimedia[] = [];
    
    // Get events from Firestore
    const eventsSnapshot = await this.afs.collection('gallery').get().toPromise();
    
    eventsSnapshot?.docs.forEach(doc => {
      const data = doc.data() as Event;
      mediaList.push({
        id: doc.id,
        url: data.url,
        category: 'event',
        type: data.type,
        description: data.description
      });
    });
    
    // Get photos from Storage
    try {
      const photoListRef = this.storage.ref('media/photo');
      const photoList = await photoListRef.listAll().toPromise();
      
      if (photoList && photoList.items) {
        for (const item of photoList.items) {
          const url = await item.getDownloadURL();
          mediaList.push({
            url,
            category: 'photo',
            type: 'image'
          });
        }
      }
    } catch (error) {
      console.error('Error loading photos:', error);
    }
    
    // Get videos from storage
    try {
      const videoListRef = this.storage.ref('media/video');
      const videoList = await videoListRef.listAll().toPromise();
      
      if (videoList && videoList.items) {
        for (const item of videoList.items) {
          const url = await item.getDownloadURL();
          mediaList.push({
            url,
            category: 'video',
            type: 'video'
          });
        }
      }
    } catch (error) {
      console.error('Error loading videos:', error);
    }
    
    return mediaList;
  }

  async getMediaByCategory(category: MultimediaCategory): Promise<Multimedia[]> {
    if (category === 'event') {
      const snapshot = await this.afs.collection('gallery').get().toPromise();
      const data: Multimedia[] = [];
      snapshot?.forEach((doc) => {
        const eventData = doc.data() as Event;
        data.push({ 
          id: doc.id, 
          url: eventData.url,
          category: 'event',
          type: eventData.type,
          description: eventData.description
        });
      });
      
      return data;
    } else {
      try {
        const mediaListRef = this.storage.ref(`media/${category}`);
        const mediaList = await mediaListRef.listAll().toPromise();
        const mediaItems: Multimedia[] = [];
        
        if (mediaList && mediaList.items) {
          for (const item of mediaList.items) {
            const url = await item.getDownloadURL();
            mediaItems.push({
              url,
              category,
              type: category === 'photo' ? 'image' : 'video'
            });
          }
        }
        
        return mediaItems;
      } catch (error) {
        console.error(`Error loading ${category}:`, error);
        return [];
      }
    }
  }

  // Delete media item either from btoh or just Storage
  async deleteMedia(id: string, url: string): Promise<boolean> {
    try {
      if (id) {
        const eventDoc = await this.afs.collection('gallery').doc(id).get().toPromise();
        
        if (eventDoc?.exists) {
          await this.afs.collection('gallery').doc(id).delete();
          
          try {
            const storagePath = this.getStoragePathFromUrl(url);
            if (storagePath) {
              await this.storage.ref(storagePath).delete().toPromise();
            }
          } catch (storageError) {
            console.warn('Could not delete associated file:', storageError);
          }
          return true;
        }
      }
      
      if (!id || !(await this.afs.collection('gallery').doc(id).get().toPromise())?.exists) {
        const storagePath = this.getStoragePathFromUrl(url);
        if (storagePath) {
          await this.storage.ref(storagePath).delete().toPromise();
          return true;
        } else {
          throw new Error("Could not extract storage path from URL");
        }
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting media:', error);
      return false;
    }
  }

  private getStoragePathFromUrl(url: string): string | null {
    try {
      const parsedUrl = new URL(url);
      const pathname = parsedUrl.pathname;
      
      const pathMatch = pathname.match(/\/o\/(.+)$/);
      if (pathMatch && pathMatch[1]) {
        return decodeURIComponent(pathMatch[1]);
      }
      return null;
    } catch {
      return null;
    }
  }
}
