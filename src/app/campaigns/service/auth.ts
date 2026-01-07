import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat';


@Injectable()
export class AuthService {

    constructor(private _auth: AngularFireAuth) { }

    async login(email: string, password: string) {
        try {
            return await this._auth.signInWithEmailAndPassword(email, password);
        }
        catch (error) {
            console.log("No se ha podido hacer el log-in correctamente. Error: " + error);
            return null;
        }
    }

    async logOut(){
        this._auth.signOut();
    }

    getInfoUsuerLogin(){
        return this._auth.authState;
    }
}


