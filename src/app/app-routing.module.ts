import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AppLayoutComponent } from "./layout/app.layout.component";
import { NotFoundComponent } from './not-found/not-found.component';
import { AuthGuard } from 'src/config/auth.guard';

const routes: Routes = [
      {
          path: 'dashboard', component: AppLayoutComponent,
          children: [ 
              { path: '',
                loadChildren: () => import('./modules/pages.module').then(m => m.PagesModule),
                canLoad: [AuthGuard],
                //canActivate: [AuthGuard]
              }
          ],
        
          },
      { path: 'login', 
        loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),
        canActivate: [AuthGuard]
       },
      { path: 'encuestas', 
        loadChildren: () => import('./encuestas/encuestas.module').then(m => m.EncuestasModule)
       },
      { path: '**', redirectTo: '/encuestas' },
  ];
  
  @NgModule({
  
    declarations: [
      NotFoundComponent
    ],
    imports: [
      RouterModule.forRoot(routes)
    ],
    exports: [
      RouterModule,
      NotFoundComponent
    ]
  })
  export class AppRoutingModule { }
  