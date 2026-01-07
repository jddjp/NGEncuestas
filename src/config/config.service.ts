import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  baseUrl: String;
  headers = new BehaviorSubject(null);

  constructor(
  ) {
    this.baseUrl = environment.apiService;
  }

  setLocal() {
    let headers = { 'Content-Type': 'application/json' };
    let token = this.Usuario;
    // if (token)
    //   headers['Authorization'] = `Bearer ${token}`;
    // this.headers.next(headers);
  }

  get Usuario() {
    return localStorage.d;
  }
}
