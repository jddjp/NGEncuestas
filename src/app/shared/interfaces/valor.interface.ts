export interface Valor {
    id?: string;
    nombre: string;
    mes: string;
    porcentaje: number;
    estadoId: string;
    partidoId: string;
    estadoNombre?: string;
    partidoNombre?: string;
    descripcion: string;
    fechaCreacion?: Date;
    fechaActualizacion?: Date;
}
