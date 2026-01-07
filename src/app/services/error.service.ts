import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  constructor() { }


  error(code: string): String {
    switch (code) {
      case 'auth/email-already-in-use':
        return 'El email ya está en uso';
      case 'auth/invalid-email':
        return 'El email no es válido';
      case 'auth/operation-not-allowed':
        return 'La operación no está permitida';
      case 'auth/weak-password':
        return 'La contraseña es débil';
      case 'auth/wrong-password':
        return 'La contraseña es incorrecta';
      case 'auth/user-not-found':
        return 'El usuario no existe';
      case 'auth/user-disabled':
        return 'El usuario está deshabilitado';
      default:
        return 'Ocurrió un error desconocido';
    }
  }
}
