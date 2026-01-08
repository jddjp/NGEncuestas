import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MultimediaRoutingModule } from './multimedia-routing.module';
import { MultimediaComponent } from './multimedia.component';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CardModule } from 'primeng/card';
import { TabViewModule } from 'primeng/tabview';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { CalendarModule } from 'primeng/calendar';
@NgModule({
  declarations: [
    MultimediaComponent
    ],
  imports: [
    CommonModule,
    FormsModule,
    MultimediaRoutingModule,
    ButtonModule,
    ToastModule,
    ConfirmDialogModule,
    ProgressSpinnerModule,
    CardModule,
    TabViewModule,
    DropdownModule,
    InputTextModule,
    DialogModule,
    InputTextareaModule,
    AngularFireStorageModule,
    AngularFirestoreModule,
    CalendarModule
  ],
  providers: []
})
export class MultimediaModule { }
