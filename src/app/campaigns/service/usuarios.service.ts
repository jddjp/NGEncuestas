import { Injectable } from '@angular/core';
import { Firestore, getDocs, } from '@angular/fire/firestore';
import { collection, doc, DocumentData, CollectionReference, getFirestore, getDoc, addDoc, updateDoc, deleteDoc, setDoc } from 'firebase/firestore';
import { ConstantsComponent } from '../../shared/constants.component';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  collection: CollectionReference<DocumentData>;


  constructor(private db: Firestore,
  ) {
    this.db = getFirestore();
    this.collection = collection(this.db, ConstantsComponent.users_app_collection);
  }

  async add(usuario: Usuario): Promise<string | undefined> {
    try {
     // const docRef = await addDoc(collection(this.db, ConstantsComponent.users_app_collection), usuario);
     const docRef = await setDoc(doc(this.db,ConstantsComponent.users_app_collection,usuario.uid),usuario);

      return "finish";
    } catch (error) {
      return undefined;
    }
  }

  async update(usuario: Usuario): Promise<boolean> {
    try {
      const docRef = await updateDoc(doc(this.db, ConstantsComponent.users_app_collection, usuario.id), usuario as any);
      console.log('El usuario se actualizo ');
      return true;
    } catch (error) {
      console.log('El libro no se actualizo ', error);
      return false;
    }
  }

  async delete(docId:String){
    const docRef = doc(this.db, ConstantsComponent.users_app_collection, docId.toString())
    await deleteDoc(docRef);
  }


  async getAll(): Promise<Usuario[]> {
    const snapshot = await getDocs(this.collection);

    const portadaPromises = snapshot.docs.map(async (item) => {
      const portadaData: Usuario = item.data() as Usuario;
      portadaData.id = item.id;
      return portadaData;
    });
    return Promise.all(portadaPromises);
  }
}

export interface Usuario {
  id: string;
  user:string;
  nombre: string;
  rol: string;
  uid: string;
  estatus:boolean;
}