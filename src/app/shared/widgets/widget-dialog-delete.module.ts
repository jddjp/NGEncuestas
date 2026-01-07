import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WidgetDialogDeleteComponent } from './widget-dialog-delete.component';
import { InputSwitchModule } from 'primeng/inputswitch';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

@NgModule({
    declarations: [WidgetDialogDeleteComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        InputSwitchModule,
        DialogModule,
        ButtonModule,
    ],
    exports: [WidgetDialogDeleteComponent],
})
export class WidgetDialogDeleteModule {}