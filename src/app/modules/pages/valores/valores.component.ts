import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValoresService } from 'src/app/services/valores.service';
import { Valor } from 'src/app/shared/interfaces/valor.interface';
import { EstadosService } from 'src/app/services/estados.service';
import { Estado } from 'src/app/shared/interfaces/estado.interface';
import { PartidosService } from 'src/app/services/partidos.service';
import { Partido } from 'src/app/shared/interfaces/partido.interface';

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
    allValores: Valor[] = [];
    valorSelected: Valor = null;
    loading: boolean = false;
    rowsPerPageOptions = [5, 10, 20];
    editar = false;
    showInfo = false;
    iconButton = 'pi pi-check';
    estados: Estado[] = [];
    partidos: Partido[] = [];
    allPartidos: Partido[] = [];
    partidosFiltrados: Partido[] = [];
    selectedEstadoId: string | null = null;
    selectedPartidoId: string | null = null;
    
    columnasTable = [
        { field: 'partidoNombre', header: 'Partido' },
        { field: 'mes', header: 'Mes' },
        { field: 'porcentaje', header: 'Porcentaje' },
        { field: 'nombre', header: 'Encuesta' },
    ];

    saving_state = false;
    showConfirmDelete = false;
    loadingConfirmDelete: boolean = false;

    constructor(
        private valorService: ValoresService,
        private estadoService: EstadosService,
        private partidoService: PartidosService,
        private fb: FormBuilder,
        private messageService: MessageService
    ) {
        this.valorForm = this.fb.group({
            id: [''],
            nombre: ['', [Validators.required]],
            mes: [''],
            porcentaje: [0],
            estadoId: ['', [Validators.required]],
            partidoId: ['', [Validators.required]],
            descripcion: [''],
        });
    }

    async ngOnInit() {
        await this.loadEstados();
        await this.loadPartidos();
        if (this.estados.length) {
            this.selectedEstadoId = this.estados[0].codigo;
            this.filterPartidosByEstado();
            if (this.partidosFiltrados.length) {
                this.selectedPartidoId = this.partidosFiltrados[0].id;
            }
        }
        await this.getData();
    }

    async loadEstados() {
        this.estados = await this.estadoService.getEstados();
    }

    async loadPartidos() {
        this.allPartidos = await this.partidoService.getPartidos();
        const partidos = this.allPartidos.map(partido => {
            const estado = this.estados.find(e => e.codigo === partido.estadoId);
            return {
                ...partido,
                estadoNombre: estado ? estado.nombre : 'Sin estado'
            };
        });
        this.allPartidos = partidos;
    }

    filterPartidosByEstado() {
        if (!this.selectedEstadoId) {
            this.partidosFiltrados = [...this.allPartidos];
        } else {
            this.partidosFiltrados = this.allPartidos.filter(p => p.estadoId === this.selectedEstadoId);
        }
    }

    cleanForm() {
        this.valorForm = this.fb.group({
            id: [''],
            nombre: ['', [Validators.required]],
            mes: [''],
            porcentaje: [0],
            estadoId: ['', [Validators.required]],
            partidoId: ['', [Validators.required]],
            descripcion: [''],
        });
        this.ID_DATA = '';
    }

    async getData() {
        this.wait = true;
        const valores = await this.valorService.getValores();
        this.allValores = valores.map(valor => {
            const estado = this.estados.find(e => e.codigo === valor.estadoId);
            const partido = this.allPartidos.find(p => p.id === valor.partidoId);
            return {
                ...valor,
                estadoNombre: estado ? estado.nombre : 'Sin estado',
                partidoNombre: partido ? partido.nombre : 'Sin partido'
            };
        });
        console.log('Valores cargados:', this.allValores);
        this.applyFilters();
        this.wait = false;
    }

    applyFilters() {
        let filtered = [...this.allValores];
        
        // Solo aplicar filtros si están seleccionados
        if (this.selectedEstadoId) {
            filtered = filtered.filter(v => v.estadoId === this.selectedEstadoId);
        }
        
        if (this.selectedPartidoId) {
            filtered = filtered.filter(v => v.partidoId === this.selectedPartidoId);
        }
        
        this.valores = filtered;
    }

    onEstadoFilterChange(estadoId: string | null) {
        this.selectedEstadoId = estadoId;
        this.filterPartidosByEstado();
        if (this.partidosFiltrados.length) {
            this.selectedPartidoId = this.partidosFiltrados[0].id;
        } else {
            this.selectedPartidoId = null;
        }
        this.applyFilters();
    }

    onPartidoFilterChange(partidoId: string | null) {
        this.selectedPartidoId = partidoId;
        this.applyFilters();
    }

    onFormEstadoChange(estadoId: string) {
        const partidoActual = this.valorForm.get('partidoId')?.value;
        this.filterPartidosByEstado();
        const existePartido = this.partidosFiltrados.find(p => p.id === partidoActual);
        if (!existePartido && this.partidosFiltrados.length) {
            this.valorForm.patchValue({ partidoId: this.partidosFiltrados[0].id });
        }
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
            mes: valor.mes,
            porcentaje: valor.porcentaje,
            estadoId: valor.estadoId,
            partidoId: valor.partidoId,
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
            const estado = this.estados.find(e => e.codigo === formValue.estadoId);
            const partido = this.allPartidos.find(p => p.id === formValue.partidoId);
            const valor: any = {
                id: formValue.id,
                nombre: formValue.nombre,
                mes: formValue.mes || '',
                porcentaje: formValue.porcentaje || 0,
                estadoId: formValue.estadoId,
                partidoId: formValue.partidoId,
                estadoNombre: estado ? estado.nombre : '',
                partidoNombre: partido ? partido.nombre : '',
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
