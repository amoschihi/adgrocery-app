import {AfterViewInit, Component, OnInit} from '@angular/core';
import {NavigationEnd, NavigationStart, RouteConfigLoadEnd, RouteConfigLoadStart, Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {Socket} from 'ngx-socket-io';
import {AuthentificationService} from './services/authentification.service';
import {SnotifyService} from 'ng-snotify';
import {OrderAdminService} from './services/order-admin.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'app';
  ble: Boolean = true;
  public load = true;

  constructor(private route: Router,
              private socket: Socket,
              private notify: SnotifyService,
              private authenticationService: AuthentificationService,
              private orderAdminService: OrderAdminService,
              private translate: TranslateService) {
    translate.setDefaultLang('en');

  }

  ngOnInit(): void {
    this.authenticationService.authAdminStatus.subscribe(value => {
      if (value) {
        this.socket
          .fromEvent<any>('AdminOrderNotification')
          .map(data => data).subscribe(value2 => {
          this.notify.info('New order has been placed', '', {position: 'rightTop', timeout: 0});
        });
      }
    });
  }

  private handleResponse(msg: string) {
    this.notify.clear();
    this.notify.success(msg, {position: 'rightTop'});
  }

  ngAfterViewInit(): void {

    this.route.events.subscribe(event => {

        if (event instanceof RouteConfigLoadStart) {
        }
        if (event instanceof NavigationStart) {
          this.load = true;
        }
        if (event instanceof NavigationEnd) {
          this.load = false;
        }
        if (event instanceof RouteConfigLoadEnd) {
        }
      }
    );
  }
}
