import { Injectable } from '@angular/core';
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, updateDoc, DocumentData, CollectionReference, onSnapshot, QuerySnapshot, query, orderBy, where } from 'firebase/firestore';
import { collectionData, Firestore } from '@angular/fire/firestore';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
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
    private toastr: ToastrService,
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



    return this.toastr.success('Registro Guardado  con éxito!!', 'Exito');
  }

  async deleteUsuario(docId: String) {
    const querySnapshot = await getDocs(query(collection(this.db, "usuarios/"), where("uid", "==", docId)));
    querySnapshot.forEach((doc) => {
      this.Uid = doc.id
    })
    const docRef = doc(this.db, 'usuarios', this.Uid)
    await deleteDoc(docRef);
    return this.toastr.error('Registro Eliminado con éxito!!', 'Advertencia');
  }

  async updateUsuario(uid: any, email: String, firstName: String, lastName: String, displayName: String, phone: String, address: String, photoURL: String, rol: String) {

    const querySnapshot = await getDocs(query(collection(this.db, "usuarios/"), where("uid", "==", uid)));
    querySnapshot.forEach((doc) => {
      this.Uid = doc.id
    })
    //console.log(this.Uid);

    const docRef = doc(this.db, 'usuarios', this.Uid);
    await updateDoc(docRef, {
      uid,
      email,
      firstName,
      lastName,
      displayName,
      phone,
      address,
      photoURL,
      rol,

    })
    return this.toastr.warning('Registro Actualizado con éxito!!', 'Actualizacion');
  }


  getusuarios() {
    const usuariosCollection = collection(this.firestore, 'usuarios');
    return collectionData(usuariosCollection);
  }




}



