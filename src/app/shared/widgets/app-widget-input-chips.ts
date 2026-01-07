import { Component, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
    selector: 'app-widget-input-chips',
    template: `
    <div class="mb-3 col-12 p-0">
      <label [for]="nombre" class="block  text-xl font-medium mb-2">{{ label }}</label>
      <p-chips  [id]="nombre"  [formControl]="control"></p-chips >
    </div>
  `,
})
export class WidgetInputChipsComponent {
    @Input() nombre: string;
    @Input() label: string;
    @Input() tipo: string = 'text';
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
