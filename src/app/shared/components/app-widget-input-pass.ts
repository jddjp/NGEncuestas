import { Component, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-widget-input-pass',
  template: `
    <div class="mb-3 col-12 p-0">
      <label [for]="nombre" class="block text text-xl mb-2">{{ label }}</label>
      <p-password 
      [id]="nombre" 
      [formControl]="control"  
      [toggleMask] = "true" 
      [placeholder]="placeholder" 
      styleClass="form-control" 
      inputStyleClass="w-full p-3 md:w-30rem"
      [feedback]="false"
      [ngClass]="{'ng-invalid ng-dirty' : control.invalid && (control.dirty || control.touched)}"></p-password>
      <span class="block w-100 mt-1 p-error" *ngIf="formControlInvalid('required')">
        {{ label.toLowerCase() }} <strong>es requerida</strong>
      </span>
      <span class="block mt-1 p-error" *ngIf="formControlInvalid('email')">
        {{ label.toLowerCase() }} <strong>no es válido</strong>
      </span>
    </div>
  `,
})
export class WidgetInputPassComponent {
  @Input() nombre: string;
  @Input() label: string;
  @Input() placeholder: string = '';
  @Input() formGroup: FormGroup;
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
