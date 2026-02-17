import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListaRoutingModule } from './lista-routing.module';
import { ListaComponent } from './lista.component';
import { ButtonModule } from 'primeng/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { SharedModule } from 'src/app/shared/shared.module';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { RouterModule } from '@angular/router';
import { ChartModule } from 'primeng/chart';

@NgModule({
    imports: [
        CommonModule,
        ListaRoutingModule,
        ButtonModule,
        InputTextModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        TableModule,
        CardModule,
        DropdownModule,
        RouterModule,
        ChartModule
    ],
    declarations: [ListaComponent]
})
export class ListaModule { }
