import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {User} from '../models/user';
import {BehaviorSubject, Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {TokenService} from './token.service';
import {DataService} from './data.service';
import {CompareService} from './compare.service';
import {WishlistService} from './wishlist.service';
import {AuthentificationService} from './authentification.service';
import {Router} from '@angular/router';
import {ShoppingCartService} from './shopping-cart.service';
import {OrderAdminService} from './order-admin.service';

@Injectable({
  providedIn: 'root'
})
export class UserServicesService {
  private url = environment.urlServeur;

  constructor(private http: HttpClient,
              private wishlistService: WishlistService,
              private shoppingCartService: ShoppingCartService,
              private dataService: DataService,
              private compareService: CompareService,
              private orderAdminService: OrderAdminService,
              private route: Router,
              private authService: AuthentificationService,
              private tokenService: TokenService) {
  }

  private userSource = new BehaviorSubject<User>(null);
  user = this.userSource.asObservable();

  setUserSource(data: User) {
    this.userSource.next(data);
  }

  public get(refresh = false): Observable<User> {
    return new Observable(observer => {
      if (!refresh && this.userSource.getValue()) {
        observer.next(this.userSource.getValue());
        return observer.complete();
      }
      this.http.get<User>(this.url + '/me').subscribe(value => {
        this.setUserSource(value);
        observer.next(this.userSource.getValue());
        observer.complete();
      });
    });
  }

  public login(myUser: User): Observable<Object> {
    return this.http.post(this.url + '/login', myUser);
  }

  public loginWithGoogle(token: string): Observable<Object> {
    return this.http.post(this.url + '/loginWithGoogle', {token: token});
  }

  public loginWithFacebook(token: string): Observable<Object> {
    return this.http.post(this.url + '/loginWithFacebook', {token: token});
  }

  public logout(): Observable<Object> {
    return this.http.post(this.url + '/logout', null);
  }

  public signup(myuser: User): Observable<Object> {
    return this.http.post(this.url + '/signup', myuser);
  }

  public sendRestPasswordLink(myuser: User) {
    return this.http.post(this.url + '/sendRestPasswordLink', myuser);
    /* const req = new HttpRequest('post', this.url + '/sendRestPasswordLink', {reportProgress: true, email: myuser.email});
     return this.http.request(req);*/
  }

  public changePassword(user: User) {
    return this.http.post(this.url + '/resetPassword', user);
  }

  public handleResponse(data, url) {
    this.tokenService.handle(data);
    this.authService.changeAuthStatus(true);
    this.shoppingCartService.syncFromLocaleToDatabase();
    this.wishlistService.syncFromLocaleToDatabase().subscribe(() => {
      this.wishlistService.get(true).subscribe();
    });
    this.compareService.syncFromLocaleToDatabase().subscribe(() => {
      this.compareService.get(true).subscribe();
    });
    this.route.navigateByUrl(url).then(() => console.log(`navigated to ${url}`));
  }

  public logout2() {
    this.logout().subscribe(() => {
      this.tokenService.remove();
      this.tokenService.delRole();
      this.authService.changeAuthStatus(false);
      this.route.navigateByUrl('/').then(() => console.log('navigated to /'));
      this.wishlistService.setProductPaginator(null);
      this.compareService.setProductPaginator(null);
      this.shoppingCartService.setProductPaginator([]);
      this.dataService.setWishlist(0);
      this.dataService.setShoppingCart(0);
      this.dataService.setCompares(0);
      this.setUserSource(null);
      this.orderAdminService.setOrderDelivered(null);
      this.orderAdminService.setOrderShipped(null);
      this.orderAdminService.setOrderNews(null);
      this.orderAdminService.setOrderClosed(null);
    }, error1 => {
      if (error1.error.message === 'Unauthenticated  :(.') {
        this.tokenService.remove();
        this.authService.changeAuthStatus(false);
        this.route.navigateByUrl('/').then(() => console.log(`navigated to /`));
      }
    });
  }
}
