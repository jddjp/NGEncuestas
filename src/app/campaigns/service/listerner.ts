import { Injectable } from "@angular/core";
import { Firestore, getDocs } from "@angular/fire/firestore";
import { Functions, httpsCallableData } from '@angular/fire/functions';
import {
  collection,
  doc,
  DocumentData,
  CollectionReference,
  getFirestore,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { ConstantsComponent } from "../../shared/constants.component";
import { EMPTY, Observable } from 'rxjs';

@Injectable({
  providedIn: "root",
})
export class ListenerService {
  notifFunction: (data: any) => Observable<any>;
  constructor(private db: Firestore,functions: Functions) {
    this.db = getFirestore();
    this.notifFunction = httpsCallableData(functions, 'sendNotification', { timeout: 3_000 });
  }
  response$: Observable<any> = EMPTY;


  async sendNotification(title: string, body: string, tokenUser: string) {
    if (tokenUser == "") {
      this.response$ = this.notifFunction({ title: title, body: body });
    };

    if (tokenUser != "") {
      //const book_ids = books
      /*.filter(objeto => objeto.uid !== undefined) // Filtra los objetos con 'id' definido
      .map(objeto => objeto.uid) // Extrae los IDs
      .join('|');*/
      this.response$ = this.notifFunction({ title: title, body: body, token: tokenUser });
    };
  }
}
