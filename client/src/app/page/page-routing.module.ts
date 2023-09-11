import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserInformationComponent } from './user/user-information/user-information.component';
import { UserLoginComponent } from './user/auth/user-login/user-login.component';
import { UserSignupComponent } from './user/auth/user-signup/user-signup.component';
const routes: Routes = [
    { path: 'login', component: UserLoginComponent },
    { path: 'signup', component: UserSignupComponent },
    { path: '**', component: UserInformationComponent }
]

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class PageRoutingModule { }