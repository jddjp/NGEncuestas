import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConstantsComponent } from 'src/app/shared/constants.component';
import { WidgetDialogDeleteComponent } from 'src/app/shared/widgets/widget-dialog-delete.component';
import { EstadosService } from 'src/app/services/estados.service';
import { Estado } from 'src/app/shared/interfaces/estado.interface';

@Component({
    templateUrl: './estados.component.html',
    providers: [MessageService],
    styleUrl: './estados.component.scss',
})
export class EstadosComponent implements OnInit {
    @ViewChild('dt') table!: Table;
    
    wait = true;
    estadoForm: FormGroup;
    ID_DATA: string = '';
    newDialog: boolean = false;
    estados: Estado[] = [];
    estadoSelected: Estado = null;
    loading: boolean = false;
    rowsPerPageOptions = [5, 10, 20];
    editar = false;
    showInfo = false;
    iconButton = 'pi pi-check';
    
    columnasTable = [
        { field: 'nombre', header: 'Nombre' },
        { field: 'codigo', header: 'Código' },
        { field: 'region', header: 'Región' },
        { field: 'poblacion', header: 'Población' },
    ];

    saving_state = false;
    showConfirmDelete = false;
    loadingConfirmDelete: boolean = false;

    constructor(
        private estadoService: EstadosService,
        private fb: FormBuilder,
        private messageService: MessageService
    ) {
        this.estadoForm = this.fb.group({
            id: [''],
            nombre: ['', [Validators.required]],
            codigo: [''],
            region: [''],
            poblacion: [''],
            descripcion: [''],
        });
    }

    async ngOnInit() {
        this.getData();
    }

    cleanForm() {
        this.estadoForm = this.fb.group({
            id: [''],
            nombre: ['', [Validators.required]],
            codigo: [''],
            region: [''],
            poblacion: [''],
            descripcion: [''],
        });
        this.ID_DATA = '';
    }

    async getData() {
        this.wait = true;
        this.estados = await this.estadoService.getEstados();
        this.wait = false;
    }

    openNew() {
        this.iconButton = 'pi pi-check';
        this.editar = false;
        this.showInfo = true;
        this.cleanForm();
    }

    editRecord(estado: Estado) {
        this.iconButton = 'pi pi-pencil';
        this.editar = true;
        this.showInfo = true;
        this.ID_DATA = estado.id;
        this.estadoForm.patchValue({
            id: estado.id,
            nombre: estado.nombre,
            codigo: estado.codigo,
            region: estado.region,
            poblacion: estado.poblacion,
            descripcion: estado.descripcion,
        });
    }

    hideDialog() {
        this.newDialog = false;
        this.showInfo = false;
        this.cleanForm();
        this.editar = false;
    }

    async saveRecord() {
        if (this.estadoForm.invalid) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'Por favor completa los campos requeridos'
            });
            return;
        }

        this.saving_state = true;

        try {
            const formValue = this.estadoForm.value;
            const estado: Estado = {
                id: formValue.id,
                nombre: formValue.nombre,
                codigo: formValue.codigo,
                region: formValue.region,
                poblacion: formValue.poblacion || '',
                descripcion: formValue.descripcion || ''
            };
            
            if (this.editar) {
                // Actualizar
                const success = await this.estadoService.updateEstado(estado);
                if (success) {
                    this.messageService.add({
                        severity: 'info',
                        summary: 'Actualización',
                        detail: 'Estado actualizado con éxito'
                    });
                }
            } else {
                // Crear nuevo
                const docId = await this.estadoService.addEstado(estado);
                if (docId) {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Éxito',
                        detail: 'Estado guardado con éxito'
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
                detail: 'Error al guardar el estado'
            });
        } finally {
            this.saving_state = false;
        }
    }

    deleteRecord(estado: Estado) {
        this.estadoSelected = estado;
        this.showConfirmDelete = true;
    }

    async confirmDelete() {
        this.loadingConfirmDelete = true;
        try {
            const success = await this.estadoService.deleteEstado(this.estadoSelected.id);
            if (success) {
                this.messageService.add({
                    severity: 'warn',
                    summary: 'Advertencia',
                    detail: 'Estado eliminado con éxito'
                });
                await this.getData();
            }
            this.showConfirmDelete = false;
            this.estadoSelected = null;
        } catch (error) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Error al eliminar el estado'
            });
        } finally {
            this.loadingConfirmDelete = false;
        }
    }

    onSearch(event: any) {
        this.table.filterGlobal(event.target.value, 'contains');
    }
}
