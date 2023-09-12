import { NgModule } from "@angular/core";
import { UserLoginComponent } from "./user-login/user-login.component";
import { UserSignupComponent } from "./user-signup/user-signup.component";
import { UserInformationComponent } from "../user-information/user-information.component";
import { UserForgotPasswordComponent } from './user-forgot-password/user-forgot-password.component';
import { SharedModule } from "src/app/shared/shared.module";
import { UserAuthRoutingModule } from "../user-auth.routing.module";

@NgModule({
    declarations: [
        UserLoginComponent,
        UserSignupComponent,
        UserInformationComponent,
        UserForgotPasswordComponent,
    ],
    imports: [
        SharedModule,
        UserAuthRoutingModule
    ],
    exports: [
    ]
})
export class UserAuthModule { }