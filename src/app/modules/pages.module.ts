import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesRoutingModule } from './pages-routing.module';
import { LoadingComponent } from '../shared/loading/loading.component';
import { SharedModule } from 'primeng/api';
import { CrudService } from '../campaigns/service/crud.service';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        PagesRoutingModule,
        SharedModule,
        
    ]
})
export class PagesModule { }
