import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WidgetInputSwitchComponent } from './widget-input-switch.component';
import { InputSwitchModule } from 'primeng/inputswitch';

@NgModule({
  declarations: [WidgetInputSwitchComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule,
    InputSwitchModule,],
  exports: [WidgetInputSwitchComponent],
})
export class WidgetInputSwitchModule { }