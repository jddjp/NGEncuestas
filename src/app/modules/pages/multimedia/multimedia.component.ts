import { Component, OnInit, OnDestroy } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { MultimediaService } from 'src/app/campaigns/service/multimedia.service';
import { Multimedia, Category, MEDIA_CATEGORIES, MultimediaCategory, MultimediaType } from 'src/app/models/multimedia';
import { Subscription } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Component({
  providers: [MessageService, ConfirmationService],
  templateUrl: './multimedia.component.html',
  styleUrl: './multimedia.component.scss'
})
export class MultimediaComponent implements OnInit, OnDestroy {
  selectedFile: File | null = null;
  mediaList: Multimedia[] = [];
  loading = false;
  uploadLoading = false;

  description: string = '';
  showDescriptionInput = false;
  editingEvent: Multimedia | null = null;
  eventDescription: string = '';
  editEventDialogVisible: boolean = false;

  categories: Category[] = MEDIA_CATEGORIES;
  selectedCategory: Category | null = null;
  activeTabIndex = 0;

  private mediaSubscription?: Subscription;

  constructor(
    private multimediaService: MultimediaService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.loadMedia();
  }

  ngOnDestroy() {
    if (this.mediaSubscription) {
      this.mediaSubscription.unsubscribe();
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      
      if (!this.selectedCategory) {
        if (this.selectedFile.type.startsWith('image/')) {
          this.selectedCategory = this.categories.find(c => c.id === 'photo') || null;
        } else if (this.selectedFile.type.startsWith('video/')) {
          this.selectedCategory = this.categories.find(c => c.id === 'video') || null;
        }
      }
      
      this.showDescriptionInput = this.selectedCategory?.id === 'event';
    }
  }

  onCategoryChange() {
    this.showDescriptionInput = this.selectedCategory?.id === 'event';
  }

  async upload() {
    if (!this.selectedFile || !this.selectedCategory) return;
    this.uploadLoading = true;
    
    try {
      const mediaType: MultimediaType = this.selectedFile.type.startsWith('image/') 
        ? 'image' 
        : this.selectedFile.type.startsWith('video/') 
          ? 'video' 
          : 'other';
      
      const metadata = { 
        category: this.selectedCategory.id,
        description: this.description,
        mediaType
      };
      
      const result = await this.multimediaService.uploadMedia(this.selectedFile, metadata);
      this.mediaList.unshift(result);
      this.messageService.add({ 
        severity: 'success', 
        summary: 'Archivo subido', 
        detail: 'El archivo se ha subido correctamente' 
      });

      this.selectedFile = null;
      this.description = '';
      
    } catch (error) {
      console.error('Error uploading file:', error);
      this.messageService.add({ 
        severity: 'error', 
        summary: 'Error', 
        detail: 'No se pudo subir el archivo. Intente nuevamente.' 
      });
    } finally {
      this.uploadLoading = false;
    }
  }

  loadMedia() {
    this.loading = true;
    
    try {
      this.multimediaService.getAllMedia()
        .then(media => {
          this.mediaList = media;
          this.loading = false;
        })
        .catch(err => {
          console.error('Error loading media:', err);
          this.loading = false;
          this.messageService.add({ 
            severity: 'error', 
            summary: 'Error', 
            detail: 'No se pudieron cargar los archivos multimedia.' 
          });
        });
    } catch (err) {
      console.error('Error setting up media load:', err);
      this.loading = false;
    }
  }

  deleteMedia(media: Multimedia) {
    this.confirmationService.confirm({
      message: '¿Está seguro que desea eliminar este archivo?',
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        this.loading = true;
        try {
          const success = await this.multimediaService.deleteMedia(
            media.id || '',
            media.url || ''
          );
          if (success) {
            this.messageService.add({ 
              severity: 'success', 
              summary: 'Eliminado', 
              detail: 'El archivo ha sido eliminado correctamente' 
            });
            
            this.mediaList = this.mediaList.filter(m => {
              if (media.id && m.id) {
                return m.id !== media.id;
              }
              return m.url !== media.url;
            });
          } else {
            throw new Error('Failed to delete');
          }
        } catch (error) {
          console.error('Error deleting media:', error);
          this.messageService.add({ 
            severity: 'error', 
            summary: 'Error', 
            detail: 'No se pudo eliminar el archivo' 
          });
        } finally {
          this.loading = false;
        }
      }
    });
  }

  onTabChange(event: any) {
    this.activeTabIndex = event.index;
  }

  getCategoryLabel(categoryId: MultimediaCategory): string {
    const category = this.categories.find(c => c.id === categoryId);
    return category ? category.name : 'Sin categoría';
  }
  
  getTypeLabel(type?: MultimediaType): string {
    switch(type) {
      case 'image': return 'Imagen';
      case 'video': return 'Video';
      default: return 'Archivo';
    }
  }

  // Filename from URL
  getFileName(url: string | null): string {
    if (!url) return 'Archivo';
    const parts = url.split('/');
    const fullName = parts[parts.length - 1];
    return fullName.split('?')[0];
  }

  isFirebaseStoragePath(url: string | null): boolean {
    if (!url) return false;
    return url.startsWith('/') && url.includes('%2F') && !url.startsWith('http');
  }

  get filteredMediaList(): Multimedia[] {
    if (this.activeTabIndex === 0) {
      return this.mediaList;
    } else {
      const categoryMap: { [key: number]: MultimediaCategory } = {
        1: 'photo',
        2: 'video', 
        3: 'event'
      };
      
      const selectedCategory = categoryMap[this.activeTabIndex];
      return this.mediaList.filter(item => item.category === selectedCategory);
    }
  } 
  openMediaUrl(url: string) {
    if (this.isFirebaseStoragePath(url)) {
      const storageUrl = `https://firebasestorage.googleapis.com/v0/b/${environment.firebaseConfig.storageBucket}/o${url.startsWith('/') ? url.substring(1) : url}`;
      window.open(storageUrl, '_blank');
    } else {
      window.open(url, '_blank');
    }
  }

  editEventDescription(media: Multimedia) {
    if (media.category !== 'event' || !media.id) return;
    
    this.editingEvent = media;
    this.eventDescription = media.description || '';
    this.editEventDialogVisible = true;
  }

  saveEventDescription() {
    if (!this.editingEvent || !this.editingEvent.id) return;
    
    this.multimediaService.updateEventDescription(this.editingEvent.id, this.eventDescription)
      .then(() => {
        if (this.editingEvent) {
          this.editingEvent.description = this.eventDescription;
        }
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Descripción actualizada correctamente'
        });
        this.editEventDialogVisible = false;
      })
      .catch((error: any) => {
        console.error('Error updating description:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo actualizar la descripción'
        });
      });
  }

  cancelEventDescriptionEdit() {
    this.editEventDialogVisible = false;
    this.editingEvent = null;
    this.eventDescription = '';
  }
}