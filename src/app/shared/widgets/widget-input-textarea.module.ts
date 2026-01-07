import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WidgetInputTextAreaComponent } from './app-widget-inputarea-text';

@NgModule({
  declarations: [WidgetInputTextAreaComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  exports: [WidgetInputTextAreaComponent],
})
export class WidgetInputTextAreaModule {}