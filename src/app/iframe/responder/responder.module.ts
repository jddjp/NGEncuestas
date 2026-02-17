import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResponderRoutingModule } from './responder-routing.module';
import { ResponderComponent } from './responder.component';
import { ButtonModule } from 'primeng/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { SharedModule } from 'src/app/shared/shared.module';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CardModule } from 'primeng/card';

@NgModule({
    imports: [
        CommonModule,
        ResponderRoutingModule,
        ButtonModule,
        InputTextModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        RadioButtonModule,
        CheckboxModule,
        InputTextareaModule,
        CardModule
    ],
    declarations: [ResponderComponent]
})
export class ResponderModule { }
