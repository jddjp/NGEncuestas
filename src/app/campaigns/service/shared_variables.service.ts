import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class SharedVariablesService  {
  editar = false;
  wait = true;
  loading = false;
  ID_DATA = "";
  newDialog = false;
  dataForm: FormGroup;
  rowsPerPageOptions = [5, 10, 20];

  constructor() { }

  obtenerFechaActual() {
    const fecha = new Date();
  
    // Obtenemos los componentes de la fecha
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0'); // Sumamos 1 porque enero es 0
    const año = fecha.getFullYear();
    const hora = String(fecha.getHours()).padStart(2, '0');
    const minutos = String(fecha.getMinutes()).padStart(2, '0');
    const segundos = String(fecha.getSeconds()).padStart(2, '0');
  
    // Formateamos la fecha y hora según el formato requerido
    const fechaFormateada = `${dia}-${mes}-${año}T${hora}:${minutos}:${segundos}`;
  
    return fechaFormateada;
  }
}
