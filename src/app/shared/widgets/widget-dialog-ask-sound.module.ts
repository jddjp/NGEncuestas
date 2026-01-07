import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputSwitchModule } from 'primeng/inputswitch';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { WidgetDialogAskSoundComponent } from './widget-dialog-ask-sound.component';

@NgModule({
    declarations: [WidgetDialogAskSoundComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        InputSwitchModule,
        DialogModule,
        ButtonModule,
    ],
    exports: [WidgetDialogAskSoundComponent],
})
export class WidgetDialogAskSoundModule {}