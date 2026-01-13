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
    
    // Datos mock
    mockValores = [
        {
            "partido": "partido1",
            "valores": {
                "ene": 10, "feb": 15, "mar": 25, "abr": 25, "may": 12, "jun": 59,
                "jul": 15, "ago": 12, "sep": 78, "oct": 78, "nov": 45, "dic": 45
            }
        },
        {
            "partido": "partido2",
            "valores": {
                "ene": 45, "feb": 23, "mar": 48, "abr": 25, "may": 65, "jun": 23,
                "jul": 47, "ago": 87, "sep": 98, "oct": 36, "nov": 26, "dic": 47
            }
        }
    ];
    
    wait = true;
    valorForm: FormGroup;
    ID_DATA: string = '';
    newDialog: boolean = false;
    valores: Valor[] = [];
    allValores: Valor[] = [];
    valoresTranspuestos: any[] = [];
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
    mesesRequeridos: string[] = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC']; // Los 12 meses que deben estar registrados
    
    columnasTable = [
        { field: 'partidoNombre', header: 'Partido' },
    ];
    
    columnasMeses = this.mesesRequeridos.map(mes => ({ field: mes, header: mes }));

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
            // No seleccionar ningún partido por defecto para mostrar todos
            this.selectedPartidoId = null;
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
        // Usar datos mock
        this.allValores = this.mapearDatosAValores(this.mockValores);
        this.applyFilters();
        this.wait = false;
    }

    mapearDatosAValores(datos: any[]): Valor[] {
        const resultado: Valor[] = [];
        const mesesMap: { [key: string]: string } = {
            'ene': 'ENE', 'feb': 'FEB', 'mar': 'MAR', 'abr': 'ABR',
            'may': 'MAY', 'jun': 'JUN', 'jul': 'JUL', 'ago': 'AGO',
            'sep': 'SEP', 'oct': 'OCT', 'nov': 'NOV', 'dic': 'DIC'
        };

        datos.forEach((item, index) => {
            // Buscar partido por nombre (case-insensitive)
            const partido = this.allPartidos.find(p => 
                p.nombre?.toLowerCase().includes(item.partido.toLowerCase()) ||
                item.partido.toLowerCase().includes(p.nombre?.toLowerCase())
            );
            
            // Si no existe partido exacto, usar el primero del estado o el primer estado
            const estado = partido ? 
                this.estados.find(e => e.codigo === partido.estadoId) : 
                this.estados[0];
            
            // Procesar cada mes del objeto valores
            Object.entries(item.valores).forEach(([mesCorto, valor]) => {
                const mesLargo = mesesMap[mesCorto.toLowerCase()];
                if (mesLargo) {
                    resultado.push({
                        id: `temp-${index}-${mesCorto}`,
                        nombre: `-`,
                        mes: mesLargo,
                        porcentaje: Number(valor) || 0,
                        estadoId: estado?.codigo || '',
                        partidoId: partido?.id || `partido-${index}`,
                        estadoNombre: estado?.nombre || 'Sin estado',
                        partidoNombre: partido?.nombre || item.partido,
                        descripcion: ''
                    });
                }
            });
        });
        
        return resultado;
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
        
        // Generar filas completas asegurando que todos los partidos tengan ambos meses
        this.valores = this.generarFilasCompletas(filtered);
        
        // Generar estructura transpuesta para la tabla
        this.valoresTranspuestos = this.generarValoresTranspuestos(this.valores);
        console.log('Valores transpuestos:', this.valoresTranspuestos);
    }

    generarFilasCompletas(valoresFiltrados: Valor[]): Valor[] {
        const resultado: Valor[] = [];
        
        // Agrupar valores por partido
        const valoresPorPartido = new Map<string, Valor[]>();
        valoresFiltrados.forEach(valor => {
            if (!valoresPorPartido.has(valor.partidoId)) {
                valoresPorPartido.set(valor.partidoId, []);
            }
            valoresPorPartido.get(valor.partidoId)!.push(valor);
        });
        
        // Para cada partido, asegurar que tenga todos los meses
        valoresPorPartido.forEach((valoresDelPartido, partidoId) => {
            const primerValor = valoresDelPartido[0];
            
            this.mesesRequeridos.forEach(mes => {
                // Buscar si ya existe un valor para este mes
                const valorExistente = valoresDelPartido.find(
                    v => (v.mes || '').toUpperCase().startsWith(mes)
                );
                
                if (valorExistente) {
                    // Si existe, usar el valor real
                    resultado.push(valorExistente);
                } else {
                    // Si no existe, crear una fila con valores por defecto
                    resultado.push({
                        id: `temp-${partidoId}-${mes}`,
                        nombre: '-',
                        mes: mes,
                        porcentaje: 0,
                        estadoId: primerValor.estadoId,
                        partidoId: primerValor.partidoId,
                        estadoNombre: primerValor.estadoNombre,
                        partidoNombre: primerValor.partidoNombre,
                        descripcion: ''
                    });
                }
            });
        });
        
        return resultado;
    }

    generarValoresTranspuestos(valores: Valor[]): any[] {
        const resultado: any[] = [];
        
        // Obtener partidos únicos
        const partidosUnicos = new Map<string, any>();
        
        valores.forEach(valor => {
            if (!partidosUnicos.has(valor.partidoId)) {
                partidosUnicos.set(valor.partidoId, {
                    partidoId: valor.partidoId,
                    partidoNombre: valor.partidoNombre,
                    estadoId: valor.estadoId,
                    estadoNombre: valor.estadoNombre
                });
            }
        });
        
        // Para cada partido, crear una fila con los 12 meses como propiedades
        partidosUnicos.forEach((partido) => {
            const fila: any = {
                partidoId: partido.partidoId,
                partidoNombre: partido.partidoNombre,
                estadoId: partido.estadoId,
                estadoNombre: partido.estadoNombre
            };
            
            // Agregar cada mes como propiedad
            this.mesesRequeridos.forEach(mes => {
                const valorMes = valores.find(
                    v => v.partidoId === partido.partidoId && (v.mes || '').toUpperCase().startsWith(mes)
                );
                
                fila[mes] = {
                    id: valorMes?.id || null,
                    porcentaje: valorMes?.porcentaje || 0,
                    nombre: valorMes?.nombre || '-',
                    mes: mes,
                    isTemp: valorMes?.id?.startsWith('temp-') || !valorMes?.id
                };
            });
            
            resultado.push(fila);
        });
        
        return resultado;
    }

    async onPorcentajeBlur(valor: Valor) {
        if (!valor.id || valor.id.startsWith('temp-')) {
            valor.id = null;
             await this.valorService.addValor({ ...valor });
             return
        }
        console.log('Actualizando valor:', valor);
        try {
            await this.valorService.updateValor({ ...valor });
            this.messageService.add({
                severity: 'success',
                summary: 'Actualizado',
                detail: 'Valor actualizado'
            });
            await this.getData();
        } catch (error) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'No se pudo actualizar el valor'
            });
        }
    }

    async onMesValueChange(filaPartido: any, mes: string, nuevoValor: number) {
        const mesData = filaPartido[mes];
        const estado = this.estados.find(e => e.codigo === filaPartido.estadoId);
        
        const valorObj: Valor = {
            id: mesData.id && !mesData.isTemp ? mesData.id : null,
            nombre: mesData.nombre === '-' ? '' : mesData.nombre,
            mes: mes,
            porcentaje: nuevoValor,
            estadoId: filaPartido.estadoId,
            partidoId: filaPartido.partidoId,
            estadoNombre: estado ? estado.nombre : '',
            partidoNombre: filaPartido.partidoNombre,
            descripcion: ''
        };
        
        try {
            if (!mesData.id || mesData.isTemp) {
                // Crear nuevo registro
                await this.valorService.addValor(valorObj);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Creado',
                    detail: 'Valor guardado'
                });
            } else {
                // Actualizar registro existente
                await this.valorService.updateValor(valorObj);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Actualizado',
                    detail: 'Valor actualizado'
                });
            }
            await this.getData();
        } catch (error) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'No se pudo guardar el valor'
            });
        }
    }

    onEstadoFilterChange(estadoId: string | null) {
        this.selectedEstadoId = estadoId;
        this.filterPartidosByEstado();
        // No seleccionar ningún partido al cambiar de estado para mostrar todos
        this.selectedPartidoId = null;
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
