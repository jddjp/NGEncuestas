import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WidgetDialogDeleteComponent } from './widget-dialog-delete.component';
import { InputSwitchModule } from 'primeng/inputswitch';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { WidgetDialogAskComponent } from './widget-dialog-ask.component';

@NgModule({
    declarations: [WidgetDialogAskComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        InputSwitchModule,
        DialogModule,
        ButtonModule,
    ],
    exports: [WidgetDialogAskComponent],
})
export class WidgetDialogAskModule {}