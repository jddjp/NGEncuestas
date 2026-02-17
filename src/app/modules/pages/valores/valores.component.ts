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

    valores: Valor[] = [];
    allValores: Valor[] = [];
    valoresTranspuestos: any[] = [];

    estados: Estado[] = [];
    partidos: Partido[] = [];
    allPartidos: Partido[] = [];
    partidosFiltrados: Partido[] = [];

    selectedEstadoId: string | null = null;
    selectedPartidoId: string | null = null;

    mesesRequeridos: string[] = [
        'ENE','FEB','MAR','ABR','MAY','JUN',
        'JUL','AGO','SEP','OCT','NOV','DIC'
    ];

    rowsPerPageOptions = [5, 10, 20];

    constructor(
        private valorService: ValoresService,
        private estadoService: EstadosService,
        private partidoService: PartidosService,
        private fb: FormBuilder,
        private messageService: MessageService
    ) {
        this.valorForm = this.fb.group({
            id: [''],
            nombre: ['', Validators.required],
            mes: [''],
            porcentaje: [0],
            estadoId: ['', Validators.required],
            partidoId: ['', Validators.required],
            descripcion: [''],
        });
    }

    async ngOnInit() {
        await this.loadEstados();
        await this.loadPartidos();

        if (this.estados.length) {
            this.selectedEstadoId = this.estados[0].codigo;
            this.filterPartidosByEstado();
        }

        await this.getData();
    }

    async loadEstados() {
        this.estados = await this.estadoService.getEstados();
    }

    async loadPartidos() {
        this.allPartidos = await this.partidoService.getPartidos();
    }

    filterPartidosByEstado() {
        this.partidosFiltrados = this.selectedEstadoId
            ? this.allPartidos.filter(p => p.estadoId === this.selectedEstadoId)
            : [...this.allPartidos];
    }

    async getData() {
        this.wait = true;
        try {
            this.allValores = await this.valorService.getValores();
            this.applyFilters();
        } finally {
            this.wait = false;
        }
    }

    applyFilters() {
        let filtered = [...this.allValores];

        if (this.selectedEstadoId) {
            filtered = filtered.filter(v => v.estadoId === this.selectedEstadoId);
        }

        if (this.selectedPartidoId) {
            filtered = filtered.filter(v => v.partidoId === this.selectedPartidoId);
        }

        this.valoresTranspuestos = this.generarValoresTranspuestos(filtered);
    }

    // 🔑 CLAVE: partido + año
    generarValoresTranspuestos(valores: Valor[]): any[] {
        const filasMap = new Map<string, any>();

        valores.forEach(v => {
            const anio = v.anio ?? new Date().getFullYear();
            const key = `${v.partidoId}-${anio}`;

            if (!filasMap.has(key)) {
                filasMap.set(key, {
                    rowKey: key,
                    partidoId: v.partidoId,
                    partidoNombre: v.partidoNombre,
                    estadoId: v.estadoId,
                    estadoNombre: v.estadoNombre,
                    anio
                });
            }

            const fila = filasMap.get(key);
            fila[v.mes] = {
                id: v.id,
                porcentaje: v.porcentaje ?? 0,
                nombre: v.nombre ?? '-',
                mes: v.mes,
                isTemp: !v.id
            };
        });

        filasMap.forEach(fila => {
            this.mesesRequeridos.forEach(m => {
                if (!fila[m]) {
                    fila[m] = {
                        id: null,
                        porcentaje: 0,
                        nombre: '-',
                        mes: m,
                        isTemp: true
                    };
                }
            });
        });

        return Array.from(filasMap.values());
    }

    async onMesValueChange(fila: any, mes: string, valor: number) {
        const data = fila[mes];
        const estado = this.estados.find(e => e.codigo === fila.estadoId);

        const obj: Valor = {
            id: data.id && !data.isTemp ? data.id : null,
            nombre: data.nombre === '-' ? '' : data.nombre,
            anio: fila.anio,
            mes,
            porcentaje: valor,
            estadoId: fila.estadoId,
            partidoId: fila.partidoId,
            estadoNombre: estado?.nombre ?? '',
            partidoNombre: fila.partidoNombre,
            descripcion: ''
        };

        if (!data.id || data.isTemp) {
            await this.valorService.addValor(obj);
        } else {
            await this.valorService.updateValor(obj);
        }
    }

    agregarAnio() {
        if (!this.selectedPartidoId) return;

        const partido = this.allPartidos.find(p => p.id === this.selectedPartidoId);
        const estado = this.estados.find(e => e.codigo === partido?.estadoId);
        const anio = new Date().getFullYear();

        const fila: any = {
            rowKey: `${partido?.id}-${anio}-${Date.now()}`,
            partidoId: partido?.id,
            partidoNombre: partido?.nombre,
            estadoId: estado?.codigo,
            estadoNombre: estado?.nombre,
            anio
        };

        this.mesesRequeridos.forEach(m => {
            fila[m] = { id: null, porcentaje: 0, nombre: '-', mes: m, isTemp: true };
        });

        this.valoresTranspuestos = [fila, ...this.valoresTranspuestos];
    }

    onEstadoFilterChange(id: string) {
        this.selectedEstadoId = id;
        this.filterPartidosByEstado();
        this.applyFilters();
    }

    async agregarAnioAnteriorDesdeFila(fila: any) {

    const nuevoAnio = fila.anio - 1;

    // 🚫 Opcional: evitar años inválidos
    if (nuevoAnio < 1900) {
        this.messageService.add({
            severity: 'warn',
            summary: 'Aviso',
            detail: `No se permiten años menores a 1900`
        });
        return;
    }

    // Evitar duplicados
    const existe = this.allValores.some(v =>
        v.partidoId === fila.partidoId && v.anio === nuevoAnio
    );

    if (existe) {
        this.messageService.add({
            severity: 'warn',
            summary: 'Aviso',
            detail: `El año ${nuevoAnio} ya existe para este partido`
        });
        return;
    }

    const estado = this.estados.find(e => e.codigo === fila.estadoId);

    // Crear 12 registros en BD
    for (const mes of this.mesesRequeridos) {
        const valor: Valor = {
            id: null,
            nombre: '',
            anio: nuevoAnio,
            mes,
            porcentaje: 0,
            estadoId: fila.estadoId,
            partidoId: fila.partidoId,
            estadoNombre: estado?.nombre ?? '',
            partidoNombre: fila.partidoNombre,
            descripcion: ''
        };

        await this.valorService.addValor(valor);
    }

    await this.getData(); // refrescar tabla
}

 
async agregarAnioDesdeFila(fila: any) {

    const nuevoAnio = fila.anio + 1;

    // Evitar duplicados
    const existe = this.allValores.some(v =>
        v.partidoId === fila.partidoId && v.anio === nuevoAnio
    );
    if (existe) {
        this.messageService.add({
            severity: 'warn',
            summary: 'Aviso',
            detail: `El año ${nuevoAnio} ya existe para este partido`
        });
        return;
    }

    const estado = this.estados.find(e => e.codigo === fila.estadoId);

    // Crear 12 registros en BD
    for (const mes of this.mesesRequeridos) {
        const valor: Valor = {
            id: null,
            nombre: '',
            anio: nuevoAnio,
            mes,
            porcentaje: 0,
            estadoId: fila.estadoId,
            partidoId: fila.partidoId,
            estadoNombre: estado?.nombre ?? '',
            partidoNombre: fila.partidoNombre,
            descripcion: ''
        };

        await this.valorService.addValor(valor);
    }

    await this.getData(); // refrescar tabla
}

async eliminarFila(fila: any) {

    const confirmar = confirm(
        `¿Eliminar todos los valores de ${fila.partidoNombre} (${fila.anio})?`
    );
    if (!confirmar) return;

    const registros = this.allValores.filter(v =>
        v.partidoId === fila.partidoId && v.anio === fila.anio
    );

    for (const r of registros) {
        if (r.id) {
            await this.valorService.deleteValor(r.id);
        }
    }

    await this.getData();
}


}
