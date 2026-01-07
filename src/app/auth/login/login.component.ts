import { Component, OnInit, Optional } from '@angular/core';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { AuthService } from 'src/app/campaigns/service/auth';
import { Router } from '@angular/router';
import { Message, MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Messaging, getToken, onMessage } from '@angular/fire/messaging';
import { EMPTY, from, Observable } from 'rxjs';
import { share, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Firestore, collection, getDocs, getFirestore, query, where } from 'firebase/firestore';
import { ProfileUser } from 'src/app/models/user';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styles: [
        `
            :host ::ng-deep .pi-eye,
            :host ::ng-deep .pi-eye-slash {
                transform: scale(1.6);
                margin-right: 1rem;
                color: var(--primary-color) !important;
            }
        `,
    ],
})
export class LoginComponent implements OnInit {
    valCheck: string[] = ['remember'];

    password!: string;
    messages: Message[] | undefined;

    loginForm: FormGroup;

    token$: Observable<any> = EMPTY;
    message$: Observable<any> = EMPTY;
    db: Firestore = getFirestore();
    constructor(
        private fb: FormBuilder,
        public layoutService: LayoutService,
        //private messageService: MessageService,
        private authService: AuthService,
        private router: Router,
        @Optional() messaging: Messaging,

    ) {
        this.loginForm = this.fb.group({
            user: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required],
        });

        if (messaging) {
            this.token$ = from(
                navigator.serviceWorker
                    .register('firebase-messaging-sw.js', {
                        type: 'module',
                        scope: '__',
                    })
                    .then((serviceWorkerRegistration) =>
                        getToken(messaging, {
                            serviceWorkerRegistration,
                            vapidKey: environment.firebaseConfig.vapidKey,
                        })
                    )
            ).pipe(
                tap((token) => console.log('FCM', { token })),
                share()
            );
            this.message$ = new Observable((sub) =>
                onMessage(messaging, (it) => sub.next(it))
            ).pipe(tap((token) => console.log('FCM', { token })));
        }
    }
    ngOnInit(): void {
        // throw new Error('Method not implemented.');
    }

    request() {
        Notification.requestPermission();
    }

    requestPermission() {}

    async onLogin() {
        this.loginForm.markAllAsTouched();
        this.requestPermission();

        if (!this.loginForm.valid) {
            return;
        }
      
        const userValid = await this.authService.login(
            this.loginForm.value.user,
            this.loginForm.value.password
        );
        if (!userValid) {
            this.messages = [
                {
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Usuario o contraseña incorrecta',
                },
            ];
            return;
        } else {
            console.log('Login successful', userValid.user.uid);
            const querySnapshot = getDocs(query(collection(this.db, "users/"), where("uid", "==", userValid.user.uid)));
              (await querySnapshot).forEach((doc) => {
                var userdata = doc.data();
                this.setLocalStorageUser(userdata, userdata.rol);
                localStorage.d = JSON.stringify(userdata);
                 this.messages = [
                {
                    severity: 'success',
                    summary: 'Correcto',
                    detail: 'Acceso correcto, Usuario: ' + userdata.name,
                },
            ]   ;
                console.log(userdata)
                  if (userdata.rol === "A") {
                      this.router.navigate(['/dashboard/dashboard']);
                  }
                  else{
                      this.router.navigate(['/dashboard/comments']);
                  }
            
            })
        }
        
    }

    formControlInvalid(formControl: string, error: string) {
        if (
            this.loginForm.get(formControl)?.invalid &&
            this.loginForm.get(formControl)?.touched &&
            this.loginForm.get(formControl)?.errors[error]
        ) {
            return true;
        }
        return false;
    }

    formControlInvalidInput(formControl: string) {
        if (
            this.loginForm.get(formControl)?.invalid &&
            this.loginForm.get(formControl)?.touched
        ) {
            return true;
        }
        return false;
    }

 setLocalStorageUser(user: any, roldata: String) {
    const usuario: ProfileUser = {
      uid: user.uid,
      email: user.email,
      rol: roldata
    }
    localStorage.setItem('user', JSON.stringify(usuario));
  }
}
