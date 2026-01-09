import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EstadosRoutingModule } from './estados-routing.module';
import { EstadosComponent } from './estados.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
    declarations: [EstadosComponent],
    imports: [
        CommonModule,
        EstadosRoutingModule,
        SharedModule
    ],
})
export class EstadosModule {}
