import { NgModule } from '@angular/core';
import { UserLoginComponent } from './user/auth/user-login/user-login.component';
import { UserSignupComponent } from './user/auth/user-signup/user-signup.component';
import { UserInformationComponent } from './user/user-information/user-information.component';
import { SharedModule } from '../shared/shared.module';
@NgModule({
    declarations: [
        UserInformationComponent,
        UserLoginComponent,
        UserSignupComponent
    ],
    imports: [
        SharedModule
    ],
    exports: [

    ]
})
export class PageModule { }