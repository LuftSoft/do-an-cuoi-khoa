import { NgModule } from '@angular/core';
import { UserLoginComponent } from './user/auth/user-login/user-login.component';
import { UserSignupComponent } from './user/auth/user-signup/user-signup.component';
import { UserInformationComponent } from './user/user-information/user-information.component';
import { SharedModule } from '../shared/shared.module';
import { UserAuthModule } from './user/auth/user-auth.module';
import { PageRoutingModule } from './page-routing.module';
@NgModule({
    declarations: [
    ],
    imports: [
        SharedModule,
        PageRoutingModule,
        UserAuthModule
    ],
    exports: [

    ]
})
export class PageModule { }