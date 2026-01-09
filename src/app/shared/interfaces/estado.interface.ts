export interface Estado {
    id?: string;
    nombre: string;
    codigo: string;
    region: string;
    poblacion: string;
    descripcion: string;
    fechaCreacion?: Date;
    fechaActualizacion?: Date;
}
