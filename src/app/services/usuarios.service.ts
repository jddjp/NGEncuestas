import { Injectable } from '@angular/core';
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, updateDoc, DocumentData, CollectionReference, onSnapshot, QuerySnapshot, query, where } from 'firebase/firestore';
import { collectionData, Firestore } from '@angular/fire/firestore';
import { Subject } from 'rxjs';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  db: Firestore;
  usuarioCol: CollectionReference<DocumentData>;
  private updatedSnapshot = new Subject<QuerySnapshot<DocumentData>>();
  obsr_UpdatedSnapshot = this.updatedSnapshot.asObservable();
  Uid: any;

  constructor(
    private messageService: MessageService,
    private firestore: Firestore
  ) {
    this.db = getFirestore();
    this.usuarioCol = collection(this.db, 'usuarios');
    // Get Realtime Data
    onSnapshot(this.usuarioCol, (snapshot) => {
      this.updatedSnapshot.next(snapshot);
    }, (err) => {
      //console.log(err);
    })
  }

  async addUsuario(address: String, email: String, displayName: String, firstName: String, lastName: String, phone: String, photoURL: String, rol: String, uid: String) {
    await addDoc(this.usuarioCol, {
      address,
      displayName,
      email,
      firstName,
      lastName,
      phone,
      photoURL,
      rol,
      uid
    })

    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Registro guardado con éxito!!' });
    return true;
  }

  async deleteUsuario(docId: String) {
    const querySnapshot = await getDocs(query(collection(this.db, "usuarios"), where("uid", "==", docId)));
    querySnapshot.forEach((docItem) => {
      this.Uid = docItem.id
    })
    const docRef = doc(this.db, 'usuarios', this.Uid)
    await deleteDoc(docRef);
    this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'Registro eliminado con éxito!!' });
    return true;
  }

  async updateUsuario(uid: any, email: String, firstName: String, lastName: String, displayName: String, phone: String, address: String, photoURL: String, rol: String) {
    const querySnapshot = await getDocs(query(collection(this.db, "usuarios"), where("uid", "==", uid)));
    querySnapshot.forEach((docItem) => {
      this.Uid = docItem.id
    })
    //console.log(this.Uid);

    const docRef = doc(this.db, 'usuarios', this.Uid);
    await updateDoc(docRef, {
      uid: uid,
      email: email,
      firstName: firstName,
      lastName: lastName,
      displayName: displayName,
      phone: phone,
      address: address,
      photoURL: photoURL,
      rol: rol
    })
    this.messageService.add({ severity: 'info', summary: 'Actualización', detail: 'Registro actualizado con éxito!!' });
    return true;
  }

  getusuarios() {
    const usuariosCollection = collection(this.firestore, 'usuarios');
    return collectionData(usuariosCollection);
  }
}



