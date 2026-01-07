import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { Toast } from '../shared/models/toast.model';
import { SwalModel } from 'src/app/shared/models/swal.model';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class VariablesService {

  showSideUser = new Subject<boolean>();
  showSideBar = new Subject<boolean>();
  changeTipoMenu = new Subject<boolean>();

  toastLogin = new BehaviorSubject<Toast>(null);
  toast = new BehaviorSubject<Toast>(null);
  swal = new BehaviorSubject<SwalModel>(null);
  pagina = new BehaviorSubject<String>("");
  endProcessCargaCompleta = new BehaviorSubject<boolean>(false);
  endProcessNominacion = new BehaviorSubject<String>(null);
  endProcessContacto = new BehaviorSubject<String>(null);
  endProcessreservacion = new BehaviorSubject<String>(null);

  constructor(
    private router: Router
  ) {
  }

  getStatusPantalla(): number {
    let width = window.screen.width;

    if (width < 640) return 1;
    else if (width > 640 && width < 769) return 10;
    else return 17;
  }

  removeCredential() {
    localStorage.d = "";
    localStorage.clear();
    location.reload();
    this.router.navigate(['/portal/login'], { replaceUrl: true });
  }

  changeTheme(darkTheme: boolean){
    localStorage.setItem('darkTheme', JSON.stringify(darkTheme));
  }


  getDataTable(data: any): any {
    let arregloCols: any[] = [];
    let headers = Object.keys(data[0]);

    headers.map(h => {
      if (h.substring(0, 2).toLowerCase() != "id") {
        arregloCols.push({
          field: h,
          header: h
        });
      }
    });

    let arregloRows: any[] = [];
    data.map((row) => {
      let x: any = [];
      headers.map((h) => {
        x[h] = row[h];
      });
      arregloRows.push(x)
    });

    return { cols: arregloCols, rows: arregloRows };
  }

  checkPassword(group: FormGroup): any {
    const pass = group.controls.password?.value;
    const confirmPassword = group.controls.repetirPassword?.value;
    return pass === confirmPassword ? null : { notSame: true };
  }
}
