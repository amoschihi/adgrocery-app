import {Injectable} from '@angular/core';
import {SnotifyService} from 'ng-snotify';

@Injectable({
  providedIn: 'root'
})
export class ErrorsNotifService {

  constructor(private notify: SnotifyService) {
  }

  public asyncNotif(Action) {
    this.notify.async('...', Action, {position: 'rightTop'});
  }

  public handleResponse2(title: string, msg: string) {
    return {
      title: title,
      body: msg,
      config: {
        closeOnClick: true,
        showProgressBar: true,
        timeout: 2000
      }
    };
  }

  public handleError2(title: string, msg: string) {
    return {
      title: title,
      body: msg,
      config: {
        closeOnClick: true,
        timeout: 2000
      }
    };
  }

  public handleResponse(msg: string) {
    this.notify.clear();
    this.notify.success(msg, {position: 'rightTop'});
  }

  public handleError(msg: string) {
    this.notify.clear();
    this.notify.error(msg, {position: 'rightTop'});
    // this.error = error.error.error;
  }
}
