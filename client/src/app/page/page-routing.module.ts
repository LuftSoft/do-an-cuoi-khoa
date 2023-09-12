import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserInformationComponent } from './user/user-information/user-information.component';
import { UserLoginComponent } from './user/auth/user-login/user-login.component';
import { UserSignupComponent } from './user/auth/user-signup/user-signup.component';
import { UserLayoutComponent } from '../theme/user-layout/user-layout.component';
import { AdminLayoutComponent } from '../theme/admin-layout/admin-layout.component';
const routes: Routes = [
    {
        path: 'user', component: UserLayoutComponent,
        children: [
            { path: 'auth', loadChildren: () => import('./user/auth/user-auth.module').then(m => m.UserAuthModule) }
        ]
    },
    {
        path: 'admin', component: AdminLayoutComponent,
        children: []
    },
    { path: '**', redirectTo: '', pathMatch: 'full' }
]
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PageRoutingModule { }