import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WidgetSelectComponent } from './app-widget-select';
import { DropdownModule } from 'primeng/dropdown';

@NgModule({
  declarations: [WidgetSelectComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule,DropdownModule],
  exports: [WidgetSelectComponent],
})
export class WidgetInputSelectModule {}