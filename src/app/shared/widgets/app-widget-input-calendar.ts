import { Component, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
    selector: 'app-widget-input-calendar',
    template: `
        <div class="mb-3 col-12 p-0">
      <label [for]="nombre"  class="block  text-xl font-medium mb-2">{{ label }}</label>
      <p-calendar  [id]="nombre"  [ngModel]="defaultDate" [formControl]="control"  [placeholder]="placeholder" showIcon="true"
              appendTo="body"  [view]="view" [dateFormat]="format"></p-calendar >
    </div>
  `,
})
export class WidgetInputCalendarComponent {
    @Input() nombre: string;
    @Input() label: string;
    @Input() tipo: string = 'text';
    @Input() placeholder: string = '';
    @Input() formGroup: FormGroup;
    @Input() defaultDate: Date = new Date();
    @Input() format = 'yy';
    @Input() view = 'year';

    /*get defaultDate(){
        console.log(this.formGroup.value)
        return  new Date(this.formGroup.value['year_publication'])
    }*/
    //defaultDate = new Date(this.formGroup.value['year_publication'])
    get control() {
        return this.formGroup.get(this.nombre) as FormControl;
    }

    formControlInvalid(error: string) {
        if (
            this.control?.invalid &&
            this.control?.touched &&
            this.control?.errors[error]
        ) {
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
