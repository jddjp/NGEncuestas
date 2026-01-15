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

interface DatoMensual {
    mes: string;
    datos: { partido: string; porcentaje: number; color: string; }[];
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
    datosMensuales: DatoMensual[] = [];
    mesesAbreviados = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
    mesesCompletos = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    
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
        
        // Obtener valores del mes actual para todos los partidos
        const valoresMesActual = partidosDelEstado.map(partido => {
            const valorMesActual = this.allValores.find(
                v => v.partidoId === partido.id && 
                     v.estadoId === this.estadoSeleccionado.codigo &&
                     v.mes === mesActual
            );
            
            return {
                partido: partido,
                valorOriginal: valorMesActual?.porcentaje || 0
            };
        });
        
        // Calcular el total del mes actual (solo partidos con valores > 0)
        const totalMesActual = valoresMesActual
            .filter(v => v.valorOriginal > 0)
            .reduce((total, v) => total + v.valorOriginal, 0);
        
        // Mapear partidos con sus porcentajes reales
        this.partidos = valoresMesActual.map(item => {
            const porcentajeReal = totalMesActual > 0 ? Math.round((item.valorOriginal / totalMesActual) * 100 * 100) / 100 : 0;
            
            return {
                siglas: item.partido.siglas || item.partido.nombre,
                nombre: item.partido.nombre,
                nombreCompleto: item.partido.nombre,
                porcentaje: porcentajeReal,
                color: item.partido.color || '#666666',
                colorPorcentaje: item.partido.color || '#666666'
            };
        }).filter(p => p.porcentaje > 0) // Solo mostrar partidos con valores
         .sort((a, b) => b.porcentaje - a.porcentaje); // Ordenar por porcentaje descendente
        
        // Actualizar datos mensuales
        this.actualizarDatosMensuales();
    }

    actualizarDatosMensuales(): void {
        if (!this.estadoSeleccionado) return;
        
        // Filtrar partidos del estado seleccionado
        const partidosDelEstado = this.allPartidos.filter(p => p.estadoId === this.estadoSeleccionado.codigo);
        
        this.datosMensuales = this.mesesAbreviados.map((mesAbbr, index) => {
            // Obtener todos los valores de este mes para todos los partidos
            const valoresDelMes = partidosDelEstado.map(partido => {
                const valor = this.allValores.find(
                    v => v.partidoId === partido.id && 
                         v.estadoId === this.estadoSeleccionado.codigo &&
                         v.mes === mesAbbr
                );
                
                return {
                    partido: partido.nombre,
                    valorOriginal: valor?.porcentaje || 0,
                    color: partido.color || '#666666'
                };
            });
            
            // Calcular el total de votos del mes (solo de partidos con valores > 0)
            const totalDelMes = valoresDelMes
                .filter(v => v.valorOriginal > 0)
                .reduce((total, v) => total + v.valorOriginal, 0);
            
            // Calcular porcentajes reales
            const datos = valoresDelMes.map(item => ({
                partido: item.partido,
                porcentaje: totalDelMes > 0 ? Math.round((item.valorOriginal / totalDelMes) * 100 * 100) / 100 : 0,
                color: item.color
            })).sort((a, b) => b.porcentaje - a.porcentaje); // Ordenar por porcentaje
            
            return {
                mes: this.mesesCompletos[index],
                datos: datos
            };
        });
    }

    getUniquePadridos(): string[] {
        if (!this.estadoSeleccionado) return [];
        
        // Obtener todos los partidos del estado seleccionado
        const partidosDelEstado = this.allPartidos.filter(p => p.estadoId === this.estadoSeleccionado.codigo);
        const partidos = partidosDelEstado.map(p => p.nombre);
        
        return partidos.sort();
    }

    getPartidoColor(partidoNombre: string): string {
        if (!this.estadoSeleccionado) return '#666666';
        
        // Buscar el partido en la lista de partidos del estado
        const partido = this.allPartidos.find(p => 
            p.estadoId === this.estadoSeleccionado.codigo && 
            p.nombre === partidoNombre
        );
        
        return partido?.color || '#666666';
    }

    getPercentageForPartyAndMonth(partidoNombre: string, mesNombre: string): number {
        const mes = this.datosMensuales.find(m => m.mes === mesNombre);
        if (!mes) return 0;
        
        const dato = mes.datos.find(d => d.partido === partidoNombre);
        return dato ? dato.porcentaje : 0;
    }

    onEstadoChange(): void {
        // Al cambiar el estado, actualizar los partidos mostrados
        this.actualizarPartidosParaGrafico();
    }

    trackByPartido(index: number, partido: string): string {
        return partido;
    }

    getTotalVotosDelMes(mesNombre: string): number {
        const mes = this.datosMensuales.find(m => m.mes === mesNombre);
        if (!mes) return 0;
        
        return mes.datos.reduce((total, dato) => total + dato.porcentaje, 0);
    }

    getVotosOriginalesDelMes(mesNombre: string): number {
        if (!this.estadoSeleccionado) return 0;
        
        const mesIndex = this.mesesCompletos.findIndex(m => m === mesNombre);
        if (mesIndex === -1) return 0;
        
        const mesAbbr = this.mesesAbreviados[mesIndex];
        const partidosDelEstado = this.allPartidos.filter(p => p.estadoId === this.estadoSeleccionado.codigo);
        
        return partidosDelEstado.reduce((total, partido) => {
            const valor = this.allValores.find(
                v => v.partidoId === partido.id && 
                     v.estadoId === this.estadoSeleccionado.codigo &&
                     v.mes === mesAbbr
            );
            return total + (valor?.porcentaje || 0);
        }, 0);
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
