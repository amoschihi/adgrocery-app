import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {CategoryService} from '../../services/category.service';
import {Category} from '../../models/category';
import {AuthentificationService} from '../../services/authentification.service';
import {InfoSite} from '../../models/info-site';
import {environment} from '../../../environments/environment';
import {UserServicesService} from '../../services/user-services.service';
import {TokenService} from '../../services/token.service';
import {DataService} from '../../services/data.service';
import {InfoSiteService} from '../../services/info-site.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.css']
})
export class MainNavComponent implements OnInit, AfterViewInit {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe([Breakpoints.Handset, Breakpoints.Tablet])
    .pipe(
      map(result => result.matches)
    );
  isPhone$: Observable<boolean> = this.breakpointObserver.observe([Breakpoints.Handset])
    .pipe(
      map(result => result.matches)
    );
  categories: Category[] = [];
  @Input() infoSite: InfoSite;
  x: number;
  y: number;
  Developedby = environment.Developedby;
  compares = 0;
  wishlist = 0;
  shoppingCart = 0;
  english = true;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private categoryService: CategoryService,
    private authService: AuthentificationService,
    private userService: UserServicesService,
    private tokenService: TokenService,
    private dataService: DataService,
    private infoSiteService: InfoSiteService,
    private translate: TranslateService
  ) {
  }

  public loggedIn: boolean;
  public loggedInAdmin: boolean;
  load = true;

  ngOnInit(): void {
    this.isHandset$.subscribe(value => {
    });
    this.infoSiteService.infoSite.subscribe(value => {
      this.infoSite = value;
    });
    this.categoryService.categories.subscribe(value => {
      this.categories = value;
    });
    this.dataService.shoppingCart$.subscribe(value => {
      this.shoppingCart = value;
    });
    this.dataService.compares$.subscribe(value => {
      this.compares = value;
    });
    this.dataService.wishlist$.subscribe(value => {
      this.wishlist = value;
    });
    this.x = parseFloat(this.infoSite.x);
    this.y = parseFloat(this.infoSite.y);
    this.authService.authStatus.subscribe(next => {
      this.loggedIn = next;
    });
    this.authService.authAdminStatus.subscribe(next => {
      this.loggedInAdmin = next;
    });

  }

  ngAfterViewInit(): void {
  }

  public logout(event: MouseEvent) {
    event.preventDefault();
    this.userService.logout2();
  }

  setEnglish() {
    this.english = true;
    this.translate.use('en');
  }

  setFrench() {
    this.english = false;
    this.translate.use('fr');
  }


}
