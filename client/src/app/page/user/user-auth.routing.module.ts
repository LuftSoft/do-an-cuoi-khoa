import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { UserLoginComponent } from "./auth/user-login/user-login.component";
import { UserSignupComponent } from "./auth/user-signup/user-signup.component";
import { UserInformationComponent } from "./user-information/user-information.component";

const routes: Routes = [
    { path: 'login', component: UserLoginComponent },
    { path: 'signup', component: UserSignupComponent },
    { path: '**', redirectTo: '', pathMatch: 'full' }
]
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UserAuthRoutingModule { }