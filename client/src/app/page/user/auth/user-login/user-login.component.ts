import { Component } from '@angular/core';
import { LayoutService } from 'src/app/theme/service/app.layout.service';

@Component({
  selector: 'app-login',
  templateUrl: './user-login.component.html',
  styles: [`
        :host ::ng-deep .pi-eye,
        :host ::ng-deep .pi-eye-slash {
            transform:scale(1.6);
            margin-right: 1rem;
        }
    `],
  styleUrls: ['./user-login.component.scss']
})
export class UserLoginComponent {
  public isShowPassWord: boolean = false;
  valCheck: string[] = ['remember'];

  password: string = '';

  constructor(public layoutService: LayoutService) { }
  onSubmit() {

  }
  toggleIsShowPassword() {
    this.isShowPassWord = !this.isShowPassWord;
  }
}
