import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ValoresComponent } from './valores.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: ValoresComponent }
    ])],
    exports: [RouterModule]
})
export class ValoresRoutingModule { }
