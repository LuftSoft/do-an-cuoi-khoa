import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
//shared module
import { SharedModule } from './shared/shared.module';
//prime ng
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ChartModule } from 'primeng/chart';
import { PageModule } from './page/page.module';
import { AdminLayoutComponent } from './theme/admin-layout/admin-layout.component';
import { AppFooterComponent } from './theme/layout-component/app.footer.component';
import { AppMenuComponent } from './theme/layout-component/app.menu.component';
import { AppMenuitemComponent } from './theme/layout-component/app.menuitem.component';
import { AppSidebarComponent } from './theme/layout-component/app.sidebar.component';
import { AppTopBarComponent } from './theme/layout-component/app.topbar.component';
import { AppLayoutComponent } from './theme/layout/app.layout.component';
import { UserLayoutComponent } from './theme/user-layout/user-layout.component';
import { AppConfigModule } from './theme/config/config.module';
@NgModule({
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    UserLayoutComponent,
    AppMenuitemComponent,
    AppTopBarComponent,
    AppFooterComponent,
    AppMenuComponent,
    AppSidebarComponent,
    AppLayoutComponent,
  ],
  imports: [
    PageModule,
    ChartModule,
    FormsModule,
    SharedModule,
    BrowserModule,
    AppConfigModule,
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
