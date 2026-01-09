import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConstantsComponent } from 'src/app/shared/constants.component';
import { WidgetDialogDeleteComponent } from 'src/app/shared/widgets/widget-dialog-delete.component';
import { PartidosService } from 'src/app/services/partidos.service';
import { Partido } from 'src/app/shared/interfaces/partido.interface';
import { EstadosService } from 'src/app/services/estados.service';
import { Estado } from 'src/app/shared/interfaces/estado.interface';

@Component({
    templateUrl: './partidos.component.html',
    providers: [MessageService],
    styleUrl: './partidos.component.scss',
})
export class PartidosComponent implements OnInit {
    @ViewChild('dt') table!: Table;
    
    wait = true;
    partidoForm: FormGroup;
    ID_DATA: string = '';
    newDialog: boolean = false;
    partidos: Partido[] = [];
    allPartidos: Partido[] = [];
    partidoSelected: Partido = null;
    loading: boolean = false;
    rowsPerPageOptions = [5, 10, 20];
    editar = false;
    showInfo = false;
    iconButton = 'pi pi-check';
    estados: Estado[] = [];
    selectedEstadoId: string | null = null;
    showCloneDialog = false;
    selectedEstadoClone: string | null = null;
    partidoToClone: Partido | null = null;
    
    columnasTable = [
        { field: 'nombre', header: 'Nombre' },
        { field: 'siglas', header: 'Siglas' },
        { field: 'estadoNombre', header: 'Estado' },
        { field: 'color', header: 'Color' },
        { field: 'logo', header: 'Logo' },
    ];

    saving_state = false;
    showConfirmDelete = false;
    loadingConfirmDelete: boolean = false;

    constructor(
        private partidoService: PartidosService,
        private estadoService: EstadosService,
        private fb: FormBuilder,
        private messageService: MessageService
    ) {
        this.partidoForm = this.fb.group({
            id: [''],
            nombre: ['', [Validators.required]],
            siglas: [''],
            color: [''],
            logo: [''],
            estadoId: ['', [Validators.required]],
            descripcion: [''],
        });
    }

    async ngOnInit() {
        await this.loadEstados();
        this.selectedEstadoId = this.estados.length ? this.estados[0].codigo : null;
        await this.getData();
    }

    async loadEstados() {
        this.estados = await this.estadoService.getEstados();
    }

    cleanForm() {
        this.partidoForm = this.fb.group({
            id: [''],
            nombre: ['', [Validators.required]],
            siglas: [''],
            color: [''],
            logo: [''],
            estadoId: ['', [Validators.required]],
            descripcion: [''],
        });
        this.ID_DATA = '';
    }

    async getData() {
        this.wait = true;
        const partidos = await this.partidoService.getPartidos();
        // Agregar nombre del estado a cada partido
        this.allPartidos = partidos.map(partido => {
            const estado = this.estados.find(e => e.codigo === partido.estadoId);
            return {
                ...partido,
                estadoNombre: estado ? estado.nombre : 'Sin estado'
            };
        });
        this.applyEstadoFilter();
        this.wait = false;
    }

    openNew() {
        this.iconButton = 'pi pi-check';
        this.editar = false;
        this.showInfo = true;
        this.cleanForm();
    }

    editRecord(partido: Partido) {
        this.iconButton = 'pi pi-pencil';
        this.editar = true;
        this.showInfo = true;
        this.ID_DATA = partido.id;
        this.partidoForm.patchValue({
            id: partido.id,
            nombre: partido.nombre,
            siglas: partido.siglas,
            color: partido.color,
            logo: partido.logo,
            estadoId: partido.estadoId,
            descripcion: partido.descripcion,
        });
    }

    hideDialog() {
        this.newDialog = false;
        this.showInfo = false;
        this.cleanForm();
        this.editar = false;
    }

    async saveRecord() {
        if (this.partidoForm.invalid) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'Por favor completa los campos requeridos'
            });
            return;
        }

        this.saving_state = true;

        try {
            const formValue = this.partidoForm.value;
            const estado = this.estados.find(e => e.codigo === formValue.estadoId);
            const partido: Partido = {
                id: formValue.id,
                nombre: formValue.nombre,
                siglas: formValue.siglas || '',
                color: formValue.color || '',
                logo: formValue.logo || '',
                estadoId: formValue.estadoId,
                estadoNombre: estado ? estado.nombre : '',
                descripcion: formValue.descripcion || ''
            };
            
            if (this.editar) {
                // Actualizar
                const success = await this.partidoService.updatePartido(partido);
                if (success) {
                    this.messageService.add({
                        severity: 'info',
                        summary: 'Actualización',
                        detail: 'Partido actualizado con éxito'
                    });
                }
            } else {
                // Crear nuevo
                const docId = await this.partidoService.addPartido(partido);
                if (docId) {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Éxito',
                        detail: 'Partido guardado con éxito'
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
                detail: 'Error al guardar el partido'
            });
        } finally {
            this.saving_state = false;
        }
    }

    deleteRecord(partido: Partido) {
        this.partidoSelected = partido;
        this.showConfirmDelete = true;
    }

    openClone(partido: Partido) {
        this.partidoToClone = partido;
        this.selectedEstadoClone = null;
        this.showCloneDialog = true;
    }

    closeCloneDialog() {
        this.showCloneDialog = false;
        this.selectedEstadoClone = null;
        this.partidoToClone = null;
    }

    async confirmClone() {
        if (!this.partidoToClone || !this.selectedEstadoClone) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'Selecciona un estado destino'
            });
            return;
        }

        const estado = this.estados.find(e => e.codigo === this.selectedEstadoClone);
        const nuevoPartido: Partido = {
            ...this.partidoToClone,
            id: null,
            estadoId: this.selectedEstadoClone,
            estadoNombre: estado ? estado.nombre : ''
        };
        console.log('Clonando partido:', nuevoPartido);
        try {
            const docId = await this.partidoService.addPartido(nuevoPartido);
            if (docId) {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Clonado',
                    detail: 'Partido clonado correctamente'
                });
                await this.getData();
            }
        } catch (error) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'No se pudo clonar el partido'
            });
        } finally {
            this.closeCloneDialog();
        }
    }

    async confirmDelete() {
        this.loadingConfirmDelete = true;
        try {
            const success = await this.partidoService.deletePartido(this.partidoSelected.id);
            if (success) {
                this.messageService.add({
                    severity: 'warn',
                    summary: 'Advertencia',
                    detail: 'Partido eliminado con éxito'
                });
                await this.getData();
            }
            this.showConfirmDelete = false;
            this.partidoSelected = null;
        } catch (error) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Error al eliminar el partido'
            });
        } finally {
            this.loadingConfirmDelete = false;
        }
    }

    onSearch(event: any) {
        this.table.filterGlobal(event.target.value, 'contains');
    }

    onEstadoFilterChange(estadoId: string | null) {
        this.selectedEstadoId = estadoId;
        this.applyEstadoFilter();
    }

    applyEstadoFilter() {
        if (!this.selectedEstadoId) {
            this.partidos = [...this.allPartidos];
            return;
        }
        this.partidos = this.allPartidos.filter(p => p.estadoId === this.selectedEstadoId);
    }
}
