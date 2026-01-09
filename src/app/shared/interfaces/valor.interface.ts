export interface Valor {
    id?: string;
    nombre: string;
    tipo: string;
    cantidad: number;
    descripcion: string;
    fechaCreacion?: Date;
    fechaActualizacion?: Date;
}
