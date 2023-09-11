import { LoadingService } from './shared/service/loading.service';
import { Component } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { NotifyService } from './shared/service/notifyService';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(
    private notifyService: NotifyService,
    public loaderService: LoadingService,
    private messageService: MessageService,

  ) {

  }
  showProgressBar() {
    const loader = this.loaderService.showProgressBar();
    console.log(loader);
    setTimeout(() => {
      this.loaderService.hideProgressBar(loader);
    }, 1000);
  }
  showToast() {
    this.notifyService.show();
  }
  isLoading() {
    return this.loaderService?.loader?.value?.length > 0;
  }
  title = 'client';
  value: any = '';
  items: MenuItem[] | undefined;

  activeItem: MenuItem | undefined;

  ngOnInit() {
    this.items = [
      { label: 'Home', icon: 'pi pi-fw pi-home' },
      { label: 'Calendar', icon: 'pi pi-fw pi-calendar' },
      { label: 'Edit', icon: 'pi pi-fw pi-pencil' },
      { label: 'Documentation', icon: 'pi pi-fw pi-file' },
      { label: 'Settings', icon: 'pi pi-fw pi-cog' }
    ];

    this.activeItem = this.items[0];
  }

  onActiveItemChange(event: MenuItem) {
    this.activeItem = event;
  }

  activateLast() {
    this.activeItem = (this.items as MenuItem[])[(this.items as MenuItem[]).length - 1];
  }
}
