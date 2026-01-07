import { Component, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
    selector: 'app-widget-select',
    template: `
    <div class="mb-3 col-12 p-0">
 
      <label [for]="nombre" class="block text-xl font-medium mb-2">{{ label }}</label>
      <p-dropdown
              [options] = "options"
              [id]="nombre"  
              appendTo="body"
              [formControl]="control"
              optionLabel="name"
              >
        </p-dropdown>
        <span class="block mt-1 p-error" *ngIf="formControlInvalid('required')">
        {{ label }} <strong>es requerido</strong>
      </span>
    </div>
  `,
})
export class WidgetSelectComponent {
    @Input() nombre: string;
    @Input() label: string;
    @Input() tipo: string = 'text';
    @Input() placeholder: string = '';
    @Input() formGroup: FormGroup;
    @Input() options: []

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
