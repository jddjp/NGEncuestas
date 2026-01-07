import { NgModule } from '@angular/core';
import { ProposalsRoutingModule } from './proposals-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProposalsComponent } from './proposals.component';


@NgModule({
  declarations: [ProposalsComponent],
  imports: [
    SharedModule,
    ProposalsRoutingModule,
  ]
})
export class ProposalsModule { }
