import { Component, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
    selector: 'app-widget-input-textarea',
    template: `
    <div class="mb-3 w-full p-0">
      <label [for]="nombre" class="block  text-xl font-medium mb-2">{{ label }}</label>
      <textarea [id]="nombre" [rows]="rows" cols="20" [formControl]="control" [placeholder]="placeholder" pInputTextarea autofocus
             class="w-full p-inputtextarea p-inputtext" style="padding:1rem"
             [ngClass]="{'ng-invalid ng-dirty' : control.invalid && (control.dirty || control.touched)}"></textarea>
             <button
    type="button"
    (click)="clearText()"
    class="absolute top-9 right-3 text-gray-500 hover:text-black"
    *ngIf="control?.value">
    <i class="pi pi-times-circle"></i>
  </button>
      <span class="block mt-1 p-error" *ngIf="formControlInvalid('required')">
        {{ label }} <strong>es requerido</strong>
      </span>
      <span class="block mt-1 p-error" *ngIf="formControlInvalid('email')">
        {{ label }} <strong>no es válido</strong>
      </span>
    </div>
  `,
})
export class WidgetInputTextAreaComponent {
    @Input() nombre: string;
    @Input() label: string;
    @Input() tipo: string = 'text';
    @Input() placeholder: string = '';
    @Input() formGroup: FormGroup;
    @Input() rows: 3
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

  clearText() {
    this.control.setValue('');
  }
}
