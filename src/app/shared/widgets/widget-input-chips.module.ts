import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WidgetInputChipsComponent } from './app-widget-input-chips';
import { ChipsModule } from 'primeng/chips';

@NgModule({
  declarations: [WidgetInputChipsComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule,ChipsModule],
  exports: [WidgetInputChipsComponent],
})
export class WidgetInputChipsModule {}