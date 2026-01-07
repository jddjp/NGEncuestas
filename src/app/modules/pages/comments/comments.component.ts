import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ConfirmationService, MessageService } from "primeng/api";
import { CommentsService } from "src/app/campaigns/service/comments.service";
import { Comment } from 'src/app/shared/interfaces/comment.interface';
import { of, Subscription } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  providers: [MessageService, ConfirmationService],
  templateUrl: "./comments.component.html",
  styleUrls: ["./comments.component.scss"],
})
export class CommentsComponent implements OnInit, OnDestroy {
  commentForm: FormGroup;
  comments: Comment[] = [];
  loading = false;
  exportLoading = false;
  editMode = false;
  currentCommentId: string | null = null;
  displayModal = false;
  userDisplayName: string = 'User';
  userEmail: string = '';
  subscriptions: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private commentsService: CommentsService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private afAuth: AngularFireAuth
  ) {
    console.log('[CommentsComponent] Constructor called');
    
    this.commentForm = this.fb.group({
      author: ["", Validators.required],
      text: ["", Validators.required],
    });
  }

  ngOnInit() {
    this.subscriptions.push(
      this.afAuth.authState.subscribe(user => {
        if (user) {
          this.userDisplayName = user.displayName || user.email || `User ${user.uid.substring(0, 5)}`;
          this.commentForm.patchValue({
            author: this.userDisplayName
          });
        } else {
          this.userDisplayName = 'User';
        }
      })
    );
    
    this.loadComments();
  }
  
  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  getTimestamp(date: any): number {
    if (date?.toDate) {
      // Firebase Timestamp
      return date.toDate().getTime();
    } else if (date instanceof Date) {
      // Or a JavaScript Date
      return date.getTime();
    }
    return Date.now();
  }

  loadComments() {
    this.loading = true;
    this.subscriptions.push(
      this.commentsService.getComments()
        .pipe(
          catchError(err => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudieron cargar los comentarios de Firebase.'
            });
            return of([]);
          })
        )
        .subscribe(comments => {
          // Sort by newest first
          this.comments = comments.sort((a: any, b: any) => {
            const dateA = this.getTimestamp(a.createdAt);
            const dateB = this.getTimestamp(b.createdAt);
            return dateB - dateA;
          });
          this.loading = false;
        })
    );
  }

  openNewCommentModal() {
    this.resetForm();
    this.displayModal = true;
  }
  
  closeModal() {
    this.displayModal = false;
    this.resetForm();
  }

  saveComment() {
    if (this.commentForm.invalid) return;
    
    this.loading = true;
    const formValue = this.commentForm.getRawValue();
    const author = formValue.author;
    const email = formValue.email;
    const text = formValue.text;
    
    if (this.editMode && this.currentCommentId) {
      const updatedComment: Comment = {
        id: this.currentCommentId,
        author,
        email,
        text,
        createdAt: new Date(),
        isEdited: true
      };
      this.commentsService.updateComment(updatedComment)
        .then(() => {
          this.messageService.add({ severity: "success", summary: "Actualizado", detail: "Comentario actualizado con éxito" });
          this.loadComments();
          this.resetForm();
          this.displayModal = false;
        })
        .catch(error => {
          this.messageService.add({ severity: "error", summary: "Error", detail: `No se pudo actualizar el comentario: ${error.message || 'Error desconocido'}` });
        })
        .finally(() => {
          this.loading = false;
        });
    } else {
      const newComment: Comment = {
        author,
        email,
        text,
        createdAt: new Date()
      };
      this.commentsService.addComment(newComment)
        .then(() => {
          this.messageService.add({ severity: "success", summary: "Agregado", detail: "Comentario agregado con éxito" });
          this.loadComments();
          this.resetForm();
          this.displayModal = false;
        })
        .catch(error => {
          this.messageService.add({ severity: "error", summary: "Error", detail: `No se pudo agregar el comentario: ${error.message || 'Error desconocido'}` });
        })
        .finally(() => {
          this.loading = false;
        });
    }
  }

  editComment(comment: any) {
    this.editMode = true;
    this.currentCommentId = comment.id;
    this.commentForm.patchValue({
      author: comment.author,
      email: comment.email || '',
      text: comment.text,
    });
    
    // Author field is disabled when editing
    this.commentForm.get('author')?.disable();
    
    this.displayModal = true;
  }

  cancelEdit() {
    this.resetForm();
    this.displayModal = false;
  }

  resetForm() {
    this.editMode = false;
    this.currentCommentId = null;
    this.commentForm.reset();
    this.commentForm.get('author')?.enable();
  }

  confirmDelete(comment: any) {
    this.confirmationService.confirm({
      message: "¿Realmente quieres eliminar este comentario?",
      accept: () => this.deleteComment(comment.id),
    });
  }

  deleteComment(id: string) {
    this.loading = true;
    this.currentCommentId = id;
    
    this.commentsService.deleteComment(id)
      .then(() => {
        this.messageService.add({ 
          severity: "success", 
          summary: "Eliminado", 
          detail: "Comentario eliminado con éxito" 
        });
        this.loadComments();
      })
      .catch(error => {
        this.messageService.add({ severity: "error", summary: "Error", detail: `No se pudo eliminar el comentario: ${error.message || 'Error desconocido'}` });
      })
      .finally(() => {
        this.loading = false;
      });
  }

  exportToCSV() {
    this.exportLoading = true;
    this.commentsService.exportCommentsToCSV('comentarios')
      .then(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Exportado',
          detail: 'Comentarios exportados a CSV con éxito'
        });
      })
      .catch(error => {
        console.error('Error exporting to CSV:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron exportar los comentarios'
        });
      })
      .finally(() => {
        this.exportLoading = false;
      });
  }
}