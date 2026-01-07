import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentChangeAction } from '@angular/fire/compat/firestore';
import { Comment } from 'src/app/shared/interfaces/comment.interface';
import { ConstantsComponent } from '../../shared/constants.component';
import { map } from 'rxjs/operators';
import { Observable, firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommentsService {
  private commentsCollection;

  constructor(private afs: AngularFirestore) {
    this.commentsCollection = this.afs.collection<Comment>(ConstantsComponent.comments_collection);
  }

  addComment(comment: Comment): Promise<any> {
    return this.commentsCollection.add(comment);
  }

  

  getComments(): Observable<Comment[]> {
    return this.commentsCollection.snapshotChanges().pipe(
      map((actions: DocumentChangeAction<Comment>[]) =>
        actions.map(a => {
          const data = a.payload.doc.data() as Comment;
          const id = a.payload.doc.id;
          return { id, ...data };
        })
      )
    );
  }

  updateComment(comment: Comment): Promise<void> {
    if (!comment.id) throw new Error('Comment id is required for update');
    const { id, ...commentData } = comment;
    return this.commentsCollection.doc(id).update(commentData);
  }

  deleteComment(commentId: string): Promise<void> {
    return this.commentsCollection.doc(commentId).delete();
  }

  async exportCommentsToCSV(filename: string = 'comments'): Promise<void> {
    try {
      let comments = await firstValueFrom(this.getComments());

      comments.sort((a, b) => {
        const getTimestamp = (item: any) => {
          if (!item.createdAt) return 0;
          try {
            if (item.createdAt instanceof Date) return item.createdAt.getTime();
            if (item.createdAt?.toDate) return item.createdAt.toDate().getTime();
            return 0;
          } catch (e) {
            console.warn('Error parsing date:', e);
            return 0;
          }
        };
        
        return getTimestamp(a) - getTimestamp(b);
      });
      
      const csvHeader = ['ID', 'Author', 'Email', 'Comment', 'Date', 'Time', 'Edited'];
      
      const csvRows = comments.map(comment => {
        let formattedDate = 'Unknown date';
        let formattedTime = '';
        
        try {
          let date: Date;
          
          if (comment.createdAt instanceof Date) {
            date = comment.createdAt;
          } else if (comment.createdAt?.toDate) {
            date = comment.createdAt.toDate();
          } else {
            throw new Error('Invalid date');
          }
          
          formattedDate = date.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          });
          
          formattedTime = date.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          });
          
        } catch (e) {
          console.warn('Error formatting date:', e);
          formattedDate = 'Unknown date';
          formattedTime = '';
        }
        
        const escapedText = comment.text ? `"${comment.text.replace(/"/g, '""')}"` : '""';
        const authorText = comment.author ? `"${comment.author.replace(/"/g, '""')}"` : '""';
        const emailText = comment.email ? `"${comment.email.replace(/"/g, '""')}"` : '';
        
        return [
          comment.id || '',
          authorText,
          emailText,
          escapedText,
          formattedDate,
          formattedTime,
          comment.isEdited ? 'Yes' : 'No'
        ].join(',');
      });
      
      const csvContent = [csvHeader.join(','), ...csvRows].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `${filename}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      return Promise.resolve();
    } catch (error) {
      console.error('Error exporting comments to CSV:', error);
      return Promise.reject(error);
    }
  }
}