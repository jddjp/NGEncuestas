import { Component, OnInit } from '@angular/core';
import { ValoresService } from 'src/app/services/valores.service';
import { EstadosService } from 'src/app/services/estados.service';
import { PartidosService } from 'src/app/services/partidos.service';
import { Estado } from 'src/app/shared/interfaces/estado.interface';
import { Partido as PartidoDB } from 'src/app/shared/interfaces/partido.interface';
import { Valor } from 'src/app/shared/interfaces/valor.interface';

interface Partido {
    siglas: string;
    nombre: string;
    nombreCompleto: string;
    porcentaje: number;
    color: string;
    colorPorcentaje: string;
}

interface Encuesta {
    id: string;
    titulo: string;
    descripcion: string;
    fecha: Date;
}

@Component({
    selector: 'app-lista-encuestas',
    templateUrl: './lista.component.html',
    styleUrls: ['./lista.component.scss']
})
export class ListaComponent implements OnInit {
    
    encuestas: Encuesta[] = [];
    partidos: Partido[] = [];
    estados: Estado[] = [];
    estadoSeleccionado: Estado | null = null;
    fechaActual: Date = new Date();
    
    // Datos de valores de Firebase
    allPartidos: PartidoDB[] = [];
    allValores: Valor[] = [];
    loading: boolean = true;

    constructor(
        private valorService: ValoresService,
        private estadoService: EstadosService,
        private partidoService: PartidosService
    ) { }

    async ngOnInit(): Promise<void> {
        await this.cargarEstados();
        await this.cargarPartidos();
        await this.cargarValores();
        this.cargarEncuestas();
    }

    async cargarEstados(): Promise<void> {
        try {
            this.estados = await this.estadoService.getEstados();
            if (this.estados.length > 0) {
                this.estadoSeleccionado = this.estados[0];
            }
        } catch (error) {
            console.error('Error cargando estados:', error);
        }
    }

    async cargarPartidos(): Promise<void> {
        try {
            this.allPartidos = await this.partidoService.getPartidos();
        } catch (error) {
            console.error('Error cargando partidos:', error);
        }
    }

    async cargarValores(): Promise<void> {
        try {
            this.loading = true;
            const valoresDB = await this.valorService.getValores();
            this.allValores = this.completarPartidosFaltantes(valoresDB);
            this.actualizarPartidosParaGrafico();
        } catch (error) {
            console.error('Error cargando valores:', error);
        } finally {
            this.loading = false;
        }
    }

    completarPartidosFaltantes(valoresDB: Valor[]): Valor[] {
        const resultado = [...valoresDB];
        const mesesRequeridos = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
        
        // Para cada estado
        this.estados.forEach(estado => {
            // Obtener partidos de este estado
            const partidosDelEstado = this.allPartidos.filter(p => p.estadoId === estado.codigo);
            
            // Para cada partido del estado
            partidosDelEstado.forEach(partido => {
                // Verificar si existe algún valor para este partido
                const tieneValores = valoresDB.some(v => v.partidoId === partido.id);
                
                // Si no tiene valores, crear registros con 0 para todos los meses
                if (!tieneValores) {
                    mesesRequeridos.forEach(mes => {
                        resultado.push({
                            id: `auto-created-${partido.id}-${mes}`,
                            nombre: '-',
                            mes: mes,
                            porcentaje: 0,
                            estadoId: estado.codigo,
                            partidoId: partido.id,
                            estadoNombre: estado.nombre,
                            partidoNombre: partido.nombre,
                            descripcion: ''
                        });
                    });
                }
            });
        });
        
        return resultado;
    }

    actualizarPartidosParaGrafico(): void {
        if (!this.estadoSeleccionado) return;
        
        // Filtrar partidos del estado seleccionado
        const partidosDelEstado = this.allPartidos.filter(p => p.estadoId === this.estadoSeleccionado.codigo);
        
        // Obtener el mes actual
        const mesActual = new Date().toLocaleString('es', { month: 'short' }).toUpperCase().substring(0, 3);
        
        // Mapear partidos con sus valores actuales
        this.partidos = partidosDelEstado.map(partido => {
            // Buscar el valor del mes actual para este partido
            const valorMesActual = this.allValores.find(
                v => v.partidoId === partido.id && 
                     v.estadoId === this.estadoSeleccionado.codigo &&
                     v.mes === mesActual
            );
            
            return {
                siglas: partido.siglas || partido.nombre,
                nombre: partido.nombre,
                nombreCompleto: partido.nombre,
                porcentaje: valorMesActual?.porcentaje || 0,
                color: partido.color || '#666666',
                colorPorcentaje: partido.color || '#666666'
            };
        }).filter(p => p.porcentaje > 0); // Solo mostrar partidos con valores
        
        // Ordenar por porcentaje descendente
        this.partidos.sort((a, b) => b.porcentaje - a.porcentaje);
    }

    onEstadoChange(): void {
        // Al cambiar el estado, actualizar los partidos mostrados
        this.actualizarPartidosParaGrafico();
    }

    cargarEncuestas(): void {
        this.encuestas = [
            {
                id: '1',
                titulo: 'Preferencias Electorales 2027',
                descripcion: 'Encuesta sobre intención de voto para las próximas elecciones',
                fecha: new Date('2026-01-08')
            },
            {
                id: '2',
                titulo: 'Aprobación de Gobierno',
                descripcion: 'Evaluación del desempeño del gobierno actual',
                fecha: new Date('2026-01-05')
            },
            {
                id: '3',
                titulo: 'Temas de Interés Ciudadano',
                descripcion: '¿Cuáles son los temas que más te preocupan?',
                fecha: new Date('2026-01-03')
            }
        ];
    }
}
