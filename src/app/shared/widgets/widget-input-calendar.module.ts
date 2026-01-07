import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WidgetSelectComponent } from './app-widget-select';
import { DropdownModule } from 'primeng/dropdown';
import { WidgetInputCalendarComponent } from './app-widget-input-calendar';
import { CalendarModule } from 'primeng/calendar';

@NgModule({
  declarations: [WidgetInputCalendarComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule,CalendarModule],
  exports: [WidgetInputCalendarComponent],
})
export class WidgetInputCalendarModule {}