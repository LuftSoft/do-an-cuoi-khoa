import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
//shared module
import { SharedModule } from './shared/shared.module';
//prime ng
import { ChartModule } from 'primeng/chart';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminLayoutComponent } from './theme/admin-layout/admin-layout.component';
import { UserLayoutComponent } from './theme/user-layout/user-layout.component';
import { PageModule } from './page/page.module';
import { MessageService } from 'primeng/api';
@NgModule({
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    UserLayoutComponent
  ],
  imports: [
    PageModule,
    ChartModule,
    FormsModule,
    SharedModule,
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
  ],
  providers: [
    MessageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
