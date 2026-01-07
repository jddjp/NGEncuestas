// shared.module.ts

import { NgModule } from '@angular/core';
import { SharedVariablesService } from '../../campaigns/service/shared_variables.service';

@NgModule({
  providers: [SharedVariablesService],
})
export class SharedModule { }
