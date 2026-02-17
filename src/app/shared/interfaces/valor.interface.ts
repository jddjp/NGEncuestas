export interface Valor {
    id?: string;
    nombre: string;
    mes: string;
     anio: number;
    porcentaje: number;
    estadoId: string;
    partidoId: string;
    estadoNombre?: string;
    partidoNombre?: string;
    descripcion: string;
    fechaCreacion?: Date;
    fechaActualizacion?: Date;
}
