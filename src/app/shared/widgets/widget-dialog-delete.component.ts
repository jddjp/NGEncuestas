import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-widget-dialog-delete',
  template: `
    <p-dialog [(visible)]="deleteProductDialog" header="Confirmar" [modal]="true" [style]="{width:'450px'}">
            <div class="flex align-items-center justify-content-center">
                <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem"></i>
                <span>Esta seguro que quiere eliminar <b>{{nombre}}</b>?</span>
            </div>
            <ng-template pTemplate="footer">
                <button pButton pRipple icon="pi pi-times" class="p-button-text" label="No"
                    (click)="deleteProductDialog = false"></button>
                <button pButton pRipple icon="pi pi-check" class="p-button-text" label="Yes"
                    (click)="confirmCustom()" [loading]="loading"></button>
            </ng-template>
        </p-dialog>
  `,
})
export class WidgetDialogDeleteComponent {
  @Output() confirm = new EventEmitter<void>();

  nombre: string;
  uid: string;
  collection: string;
  loading: boolean = false;

  constructor(private messageService: MessageService) {
     
  }

  deleteProductDialog: boolean = false;
  open(nombre: string) {
    this.nombre = nombre;
    this.deleteProductDialog = true;
  }

  /**
 * Abre el dialgo con la capacidad de eliminar la coleccion
 *
 * @param {string} uid - Uid de la coleccion de firebase
 */
  openFB(nombre: string, uid: string, collection: string) {
    this.nombre = nombre;
    this.uid = uid;
    this.collection = collection;
    this.deleteProductDialog = true;
  }

  close() {
    this.loading = false;
    this.deleteProductDialog = false;
  }

  /**
 * Detecta el evento al dar clic en confirmar
 *
 * @param {string} uuid - Uid de la coleccion de firebase
 */
  confirmCustom() {
    
    
  }
}
