import { Component, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
    selector: 'app-widget-input-text',
    template: `
    <div class="mb-3 col-12 p-0">
      <label [for]="nombre" class="block text-xl font-medium mb-2">{{ label }}</label>
      <input [id]="nombre" type="text" pInputText [formControl]="control" [type]="tipo" [placeholder]="placeholder" [disabled]="true"  autofocus
              style="padding:1rem" class="p-inputtext w-full"
             [ngClass]="{'ng-dirty ng-invalid' : control.invalid && (control.dirty || control.touched)}">
      <span class="block mt-1 p-error" *ngIf="formControlInvalid('required')">
        {{ label }} <strong>es requerido</strong>
      </span>
      <span class="block mt-1 p-error" *ngIf="formControlInvalid('email')">
        {{ label }} <strong>no es válido</strong>
      </span>
    </div>
  `,
})
export class WidgetInputTextComponent {
    @Input() nombre: string;
    @Input() label: string;
    @Input() tipo: string = 'text';
    @Input() placeholder: string = '';
    @Input() formGroup: FormGroup;
    @Input() disabled: boolean;

    get control() {
        return this.formGroup.get(this.nombre) as FormControl;
    }

    formControlInvalid(error: string) {
        if (this.control?.invalid && this.control?.touched && this.control?.errors[error]) {
            return true;
        }
        return false;
    }

    formControlInvalidInput() {
        if (this.control?.invalid && this.control?.touched) {
            return true;
        }
        return false;
    }
}
