import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Helper } from '../util/Helper';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  loader: BehaviorSubject<any> = new BehaviorSubject([]);
  constructor() { }
  showProgressBar() {
    let loaderList = this.loader.value;
    const uniqueId = Helper.getUniqueId(4);
    loaderList.push(uniqueId);
    this.loader.next(loaderList);
    return uniqueId;
  }
  hideProgressBar(id: any) {
    let loaderList = this.loader.value;
    loaderList = loaderList.filter((loadId: string) => loadId !== id);
    this.loader.next(loaderList);
  }
}
