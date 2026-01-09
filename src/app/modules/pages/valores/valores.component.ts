import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValoresService } from 'src/app/services/valores.service';
import { Valor } from 'src/app/shared/interfaces/valor.interface';

@Component({
    templateUrl: './valores.component.html',
    providers: [MessageService],
    styleUrl: './valores.component.scss',
})
export class ValoresComponent implements OnInit {
    @ViewChild('dt') table!: Table;
    
    wait = true;
    valorForm: FormGroup;
    ID_DATA: string = '';
    newDialog: boolean = false;
    valores: Valor[] = [];
    valorSelected: Valor = null;
    loading: boolean = false;
    rowsPerPageOptions = [5, 10, 20];
    editar = false;
    showInfo = false;
    iconButton = 'pi pi-check';
    
    columnasTable = [
        { field: 'nombre', header: 'Nombre' },
        { field: 'tipo', header: 'Tipo' },
        { field: 'cantidad', header: 'Cantidad' },
    ];

    saving_state = false;
    showConfirmDelete = false;
    loadingConfirmDelete: boolean = false;

    constructor(
        private valorService: ValoresService,
        private fb: FormBuilder,
        private messageService: MessageService
    ) {
        this.valorForm = this.fb.group({
            id: [''],
            nombre: ['', [Validators.required]],
            tipo: [''],
            cantidad: [0],
            descripcion: [''],
        });
    }

    async ngOnInit() {
        this.getData();
    }

    cleanForm() {
        this.valorForm = this.fb.group({
            id: [''],
            nombre: ['', [Validators.required]],
            tipo: [''],
            cantidad: [0],
            descripcion: [''],
        });
        this.ID_DATA = '';
    }

    async getData() {
        this.wait = true;
        this.valores = await this.valorService.getValores();
        this.wait = false;
    }

    openNew() {
        this.iconButton = 'pi pi-check';
        this.editar = false;
        this.showInfo = true;
        this.cleanForm();
    }

    editRecord(valor: Valor) {
        this.iconButton = 'pi pi-pencil';
        this.editar = true;
        this.showInfo = true;
        this.ID_DATA = valor.id;
        this.valorForm.patchValue({
            id: valor.id,
            nombre: valor.nombre,
            tipo: valor.tipo,
            cantidad: valor.cantidad,
            descripcion: valor.descripcion,
        });
    }

    hideDialog() {
        this.newDialog = false;
        this.showInfo = false;
        this.cleanForm();
        this.editar = false;
    }

    async saveRecord() {
        if (this.valorForm.invalid) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'Por favor completa los campos requeridos'
            });
            return;
        }

        this.saving_state = true;

        try {
            const formValue = this.valorForm.value;
            const valor: Valor = {
                id: formValue.id,
                nombre: formValue.nombre,
                tipo: formValue.tipo || '',
                cantidad: formValue.cantidad || 0,
                descripcion: formValue.descripcion || ''
            };
            
            if (this.editar) {
                const success = await this.valorService.updateValor(valor);
                if (success) {
                    this.messageService.add({
                        severity: 'info',
                        summary: 'Actualización',
                        detail: 'Valor actualizado con éxito'
                    });
                }
            } else {
                const docId = await this.valorService.addValor(valor);
                if (docId) {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Éxito',
                        detail: 'Valor guardado con éxito'
                    });
                }
            }
            
            this.hideDialog();
            this.cleanForm();
            await this.getData();
        } catch (error) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Error al guardar el valor'
            });
        } finally {
            this.saving_state = false;
        }
    }

    deleteRecord(valor: Valor) {
        this.valorSelected = valor;
        this.showConfirmDelete = true;
    }

    async confirmDelete() {
        this.loadingConfirmDelete = true;
        try {
            const success = await this.valorService.deleteValor(this.valorSelected.id);
            if (success) {
                this.messageService.add({
                    severity: 'warn',
                    summary: 'Advertencia',
                    detail: 'Valor eliminado con éxito'
                });
                await this.getData();
            }
            this.showConfirmDelete = false;
            this.valorSelected = null;
        } catch (error) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Error al eliminar el valor'
            });
        } finally {
            this.loadingConfirmDelete = false;
        }
    }

    onSearch(event: any) {
        this.table.filterGlobal(event.target.value, 'contains');
    }
}
