import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', loadChildren: () => import('./lista/lista.module').then(m => m.ListaModule) },
        { path: 'responder/:id', loadChildren: () => import('./responder/responder.module').then(m => m.ResponderModule) },
        { path: '**', redirectTo: '' }
    ])],
    exports: [RouterModule]
})
export class EncuestasRoutingModule { }
