import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageRoutingModule } from './page/page-routing.module';

const routes: Routes = [];

@NgModule({
  imports: [
    PageRoutingModule
  ],
  exports: [
    PageRoutingModule
  ]
})
export class AppRoutingModule { }
