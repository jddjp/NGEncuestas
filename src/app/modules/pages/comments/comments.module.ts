import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommentsRoutingModule } from './comments-routing.module';
import { CommentsComponent } from './comments.component';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { TooltipModule } from 'primeng/tooltip';

@NgModule({
  declarations: [
    CommentsComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    CommentsRoutingModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    InputTextareaModule,
    ToastModule,
    ConfirmDialogModule,
    DialogModule,
    TooltipModule
  ]
})
export class CommentsModule { }