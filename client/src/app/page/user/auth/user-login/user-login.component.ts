import { Component, OnInit } from '@angular/core';
import { NotifyService } from 'src/app/shared/service/notifyService';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent implements OnInit {

  constructor(
    private notify: NotifyService
  ) {

  }

  ngOnInit() {
  }

  showToast() {
    this.notify.show();
  }

}
