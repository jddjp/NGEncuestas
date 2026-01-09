import { Component, OnInit } from '@angular/core';

interface Partido {
    siglas: string;
    nombre: string;
    nombreCompleto: string;
    porcentaje: number;
    color: string;
    colorPorcentaje: string;
}

interface Estado {
    nombre: string;
    codigo: string;
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

    constructor() { }

    ngOnInit(): void {
        this.cargarEstados();
        this.cargarPartidos();
        this.cargarEncuestas();
    }

    cargarEstados(): void {
        this.estados = [
            { nombre: 'Guerrero', codigo: 'GRO' },
            { nombre: 'Estado de México', codigo: 'MEX' },
            { nombre: 'Michoacán', codigo: 'MICH' },
            { nombre: 'Morelos', codigo: 'MOR' },
            { nombre: 'Nayarit', codigo: 'NAY' },
            { nombre: 'Nuevo León', codigo: 'NL' },
            { nombre: 'Oaxaca', codigo: 'OAX' },
            { nombre: 'Puebla', codigo: 'PUE' },
            { nombre: 'Querétaro', codigo: 'QRO' },
            { nombre: 'San Luis Potosí', codigo: 'SLP' }
        ];
        this.estadoSeleccionado = this.estados[0];
    }

    cargarPartidos(): void {
        this.partidos = [
            {
                siglas: 'MORENA',
                nombre: 'MORENA',
                nombreCompleto: 'MOVIMIENTO DE REGENERACIÓN NACIONAL',
                porcentaje: 48.2,
                color: '#8B0000',
                colorPorcentaje: '#8B0000'
            },
            {
                siglas: 'PRI',
                nombre: 'PRI',
                nombreCompleto: 'PARTIDO REVOLUCIONARIO INSTITUCIONAL',
                porcentaje: 10.2,
                color: '#006847',
                colorPorcentaje: '#006847'
            },
            {
                siglas: 'PAN',
                nombre: 'PAN',
                nombreCompleto: 'PARTIDO ACCIÓN NACIONAL',
                porcentaje: 15.5,
                color: '#0057B8',
                colorPorcentaje: '#0057B8'
            },
            {
                siglas: 'MC',
                nombre: 'MC',
                nombreCompleto: 'MOVIMIENTO CIUDADANO',
                porcentaje: 8.3,
                color: '#FF6600',
                colorPorcentaje: '#FF6600'
            },
            {
                siglas: 'PVEM',
                nombre: 'PVEM',
                nombreCompleto: 'PARTIDO VERDE ECOLOGISTA DE MÉXICO',
                porcentaje: 5.1,
                color: '#00A650',
                colorPorcentaje: '#00A650'
            }
        ];
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
