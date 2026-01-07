import { NgModule } from '@angular/core';
import { PathLocationStrategy, LocationStrategy } from '@angular/common';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppLayoutModule } from './layout/app.layout.module';
import { AuthService } from './campaigns/service/auth';
import { AngularFireModule } from '@angular/fire/compat';
import { AppConfig, environment } from 'src/environments/environment';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { WidgetInputSwitchModule } from './shared/widgets/widget-input-switch.module';
import { provideDatabase, getDatabase } from '@angular/fire/database';
import { getFirestore, provideFirestore, } from '@angular/fire/firestore';
import { provideAuth, getAuth, AuthModule } from '@angular/fire/auth';
import { getMessaging, provideMessaging} from '@angular/fire/messaging';
import { getFunctions, provideFunctions } from '@angular/fire/functions';

import { RadioButtonModule } from 'primeng/radiobutton';

import {
  provideStorage,
  getStorage,
  StorageModule,
} from '@angular/fire/storage';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { HttpClientModule } from '@angular/common/http';
import { SharedVariablesService } from './campaigns/service/shared_variables.service';
//import { SharedModule } from './campaigns/modules/widgets/shared.module';
import { CheckboxModule } from 'primeng/checkbox';
import { SharedModule } from './shared/shared.module';
import { BUCKET } from '@angular/fire/compat/storage';
@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        AuthModule,
        ReactiveFormsModule,
        HttpClientModule,
        AngularFireModule.initializeApp(environment.firebaseConfig),
        provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
        provideFirestore(() => getFirestore()),
        provideDatabase(() => getDatabase()),
        provideAuth(() => getAuth()),
        provideStorage(() => getStorage()),
        provideFunctions(() => getFunctions()),
        provideMessaging(() => getMessaging()),
        AngularFireModule,
        AngularFireAuthModule,
        AppRoutingModule,
        StorageModule,
        AppLayoutModule,
        WidgetInputSwitchModule,
        InputTextModule,
        SharedModule,
        CheckboxModule,
        RadioButtonModule
    ],
    providers: [
        //  CrudService,
        { provide: LocationStrategy, useClass: PathLocationStrategy },
        AuthService,
        SharedVariablesService,
        { provide: 'APP_CONFIG', useValue: AppConfig },
        { provide: BUCKET, useValue: environment.firebaseConfig.storageBucket }
    ],
    bootstrap: [AppComponent],
})
export class AppModule { }
