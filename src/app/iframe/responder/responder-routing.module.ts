import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ResponderComponent } from './responder.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: ResponderComponent }
    ])],
    exports: [RouterModule]
})
export class ResponderRoutingModule { }
