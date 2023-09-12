import { Component, OnInit } from '@angular/core';
import { LayoutService } from 'src/app/theme/service/app.layout.service';

@Component({
  selector: 'app-user-signup',
  templateUrl: './user-signup.component.html',
  styles: [`
        :host ::ng-deep .pi-eye,
        :host ::ng-deep .pi-eye-slash {
            transform:scale(1.6);
            margin-right: 1rem;
        }
    `],
  styleUrls: ['./user-signup.component.scss']
})
export class UserSignupComponent implements OnInit {

  public isShowPassWord: boolean = false;
  valCheck: string[] = ['remember'];

  password: string = '';

  constructor(public layoutService: LayoutService) { }
  onSubmit() {

  }
  toggleIsShowPassword() {
    this.isShowPassWord = !this.isShowPassWord;
  }
  ngOnInit(): void {

  }
}
