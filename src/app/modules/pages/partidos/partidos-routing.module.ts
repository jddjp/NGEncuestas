import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PartidosComponent } from './partidos.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: PartidosComponent }
    ])],
    exports: [RouterModule]
})
export class PartidosRoutingModule { }
