import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MultimediaComponent } from './multimedia.component';

const routes: Routes = [
  { path: '', component: MultimediaComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MultimediaRoutingModule { }
