import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputSwitchModule } from 'primeng/inputswitch';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { WidgetDialogAskEnglishComponent } from './widget-dialog-ask-english.component';

@NgModule({
    declarations: [WidgetDialogAskEnglishComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        InputSwitchModule,
        DialogModule,
        ButtonModule,
    ],
    exports: [WidgetDialogAskEnglishComponent],
})
export class WidgetDialogAskEnglishModule {}