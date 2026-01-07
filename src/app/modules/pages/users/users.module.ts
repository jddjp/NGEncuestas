import { NgModule } from '@angular/core';
import { ForumsRoutingModule } from './users-routing.module';
import { UsersComponent } from './users.component';
import { SharedVariablesService } from 'src/app/campaigns/service/shared_variables.service';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
    declarations: [UsersComponent],
    providers: [SharedVariablesService],
    imports: [
        ForumsRoutingModule,
        SharedModule
    ],
})
export class UsersModule {}
