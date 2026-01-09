export interface Partido {
    id?: string;
    nombre: string;
    siglas: string;
    color: string;
    logo: string;
    estadoId: string;
    estadoNombre?: string;
    descripcion: string;
    fechaCreacion?: Date;
    fechaActualizacion?: Date;
}
