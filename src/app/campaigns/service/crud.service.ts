import { Inject, Injectable } from "@angular/core";
import { Firestore, getDocs } from "@angular/fire/firestore";
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
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

@Injectable({
  providedIn: "root",
})
export class CrudService {
  //@Inject('APP_CONFIG') private config: any
  //collectionName: string = ConstantsComponent.users_collection;
  constructor(
    // private storage: Storage,
    private db: Firestore
  ) {
    this.db = getFirestore();
  }

  async add_(data: any, collectionName: any): Promise<string | undefined> {
    try {
      var table = collection(this.db, collectionName);
      const docRef = await addDoc(table, data);
      console.log("El registro se grabó con el ID: ", docRef.id);
      return docRef.id;
    } catch (error) {
      console.log("El registro no se grabó: ", error);
      return undefined;
    }
  }

  async getAll(collectionName: string): Promise<any[]> {
    try {
      const table = collection(this.db, collectionName);
      const querySnapshot = await getDocs(table);
      const data: any[] = [];
      querySnapshot.forEach((doc) => {
        const docData = doc.data();
        // Asegurar que el id de Firebase sea el que prevalezca
        data.push({ ...docData, id: doc.id });
      });
      return data;
    } catch (error) {
      console.error("Error fetching documents:", error);
      return [];
    }
  }

  async update(data: any, collectionName: string): Promise<boolean> {
    try {
      const docRef = await updateDoc(
        doc(this.db, collectionName, data.id),
        data
      );
      console.log("El registro se actualizo ");
      return true;
    } catch (error) {
      console.log("El registro no se actualizo ", error);
      return false;
    }
  }

  async delete(uid: string, collectionName: string): Promise<boolean> {
    try {
      await deleteDoc(doc(this.db, collectionName, uid));
      console.log("El registro se eliminó correctamente");
      return true;
    } catch (error) {
      console.log("El registro no se eliminó", error);
      return false;
    }
  }

  async saveImage(file,path:String): Promise<string> {
    return new Promise(async (resolve, reject) => {
      const imageName = Date.now().toString() + ".png";
      if (!file) {
        resolve("");
        return "";
      }

      try {
        const storage = getStorage();
        const storageRef = ref(storage, `${path}${imageName}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        await uploadTask.then((snapshot) => {
          getDownloadURL(storageRef)
            .then((url) => {
              console.log(`URL de descarga: ${url}`);
              resolve(url.split(ConstantsComponent.url_storage)[1]);
            })
            .catch((error) => {
              console.error(`Error al obtener la URL de descarga: ${error}`);
              reject(error);
            });
        });
      } catch (e) {
        console.error(e);
        reject(e);
      }
      return "";
    });
  }

 normalizeUrl(url: string): string {
  const decodedOnce = decodeURIComponent(url);
  const decodedTwice = decodeURIComponent(decodedOnce);
  return decodedTwice;
}
  async deleteFile(url_file: string): Promise<boolean> {
    try {
      const storage = getStorage();
      const storageRef = ref(storage, this.normalizeUrl(url_file));
      const deleteTask = deleteObject(storageRef);
      await deleteTask;
      console.log(`File deleted successfully.`);
      return true;
    } catch (e) {
      console.error(e);
      // La eliminación falló
      return false;
    }
  }
}
