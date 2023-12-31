import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {ProductPaginate} from '../models/product-paginate';
import {BehaviorSubject, Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {TokenService} from './token.service';
import {DataService} from './data.service';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private url = environment.urlServeur;
  private _wishListIsModified: boolean;
  private productPaginatorSource = new BehaviorSubject<ProductPaginate>(null);


  productPaginator = this.productPaginatorSource.asObservable();

  setProductPaginator(data: ProductPaginate) {
    this.productPaginatorSource.next(data);
  }

  constructor(private http: HttpClient,
              private tokenService: TokenService,
              private dataService: DataService) {
  }


  public getByListId(
    refresh: boolean = false,
    page = 1,
    perPage = 12,
    id: number[]): Observable<ProductPaginate> {
    return new Observable(observer => {
      if (!refresh && this.productPaginatorSource.getValue()) {
        observer.next(this.productPaginatorSource.getValue());
        return observer.complete();
      }
      const params = new HttpParams()
        .set('page', page.toString())
        .set('perPage', perPage.toString())
        .set('id', id.join(', '));
      this.http.get<ProductPaginate>(this.url + '/GAPRODBLID', {params: params}).subscribe(value => {
        this.dataService.setWishlist(value.total);
        this.productPaginatorSource.next(value);
        observer.next(this.productPaginatorSource.getValue());
        observer.complete();
      });
    });
  }

  public get(
    refresh: boolean = false,
    page = 1,
    perPage = 12): Observable<ProductPaginate> {
    return new Observable(observer => {
      if (!refresh && this.productPaginatorSource.getValue()) {
        observer.next(this.productPaginatorSource.getValue());
        return observer.complete();
      }
      const params = new HttpParams()
        .set('page', page.toString())
        .set('perPage', perPage.toString());
      this.http.get<ProductPaginate>(this.url + '/GAPWL', {params: params}).subscribe(value => {
        this.dataService.setWishlist(value.total);
        this.productPaginatorSource.next(value);
        observer.next(this.productPaginatorSource.getValue());
        observer.complete();
      });
    });
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(this.url + '/DPWL/' + id);
  }

  deleteAll(): Observable<any> {
    return this.http.delete<any>(this.url + '/DAPWL');
  }

  save(ids: number[]): Observable<any> {
    return this.http.post<any>(this.url + '/SPWL', {ids: ids});
  }

  save2(id: number): Observable<any> {
    return this.http.post<any>(this.url + '/SPUWL', {id: id});
  }


  get wishListIsModified(): boolean {
    return this._wishListIsModified;
  }

  set wishListIsModified(value: boolean) {
    this._wishListIsModified = value;
  }

  getWishlist(): number[] {
    const wishlist = localStorage.getItem('wishlist');
    return JSON.parse(wishlist)as number[];
  }

  syncFromLocaleToDatabase(): Observable<number> {
    const ids = this.getWishlist();
    return new Observable<number>(subscriber => {
      if (!ids || !ids.length) {
        subscriber.next(0);
        return subscriber.complete();
      }
      this.save(ids).subscribe(value => {
        localStorage.setItem('wishlist', JSON.stringify([]));
        subscriber.next(value.attached.length);
        subscriber.complete();
      }, error1 => {
        localStorage.setItem('wishlist', JSON.stringify([]));
        subscriber.next(0);
        subscriber.complete();
        console.log(error1);
      });
    });

  }

  addToWishlistAfterLogin(id: number) {
    this.save2(id).subscribe(value => {
      console.log(value);
      this.dataService.addWishlist(value.attached.length);
      this.dataService.removeWishlist(value.detached.length);
      this.wishListIsModified = true;
    }, error1 => {
      console.log(error1);
    });
  }

  addToWishlistBeforeLogin(id: number) {
    const arr = this.getWishlist();
    const res = arr.find(value => value === id);
    if (!res) {
      arr.push(id);
      this.dataService.addWishlist();
      localStorage.setItem('wishlist', JSON.stringify(arr));
      this.wishListIsModified = true;
    }
  }

  removeItemFromWishlistAfterLogin(id: number) {
    this.delete(id).subscribe(() => {
      this.dataService.removeWishlist();
      const PP = this.productPaginatorSource.getValue();
      PP.data = PP.data.filter(value2 => value2.id !== id);
      this.productPaginatorSource.next(PP);
    });
  }

  removeItemFromWishlistBeforeLogin(id: number) {
    let arr = this.getWishlist();
    arr = arr.filter(value => value !== id);
    localStorage.setItem('wishlist', JSON.stringify(arr));
    const PP = this.productPaginatorSource.getValue();
    PP.data = PP.data.filter(value2 => value2.id !== id);
    this.productPaginatorSource.next(PP);
    this.dataService.removeWishlist();
  }


  clearWishlistAfterLogin() {
    this.deleteAll().subscribe(() => {
      this.dataService.setWishlist(0);
      const PP = this.productPaginatorSource.getValue();
      PP.data = [];
      this.productPaginatorSource.next(PP);
    });
  }

  clearWishlistBeforeLogin() {
    localStorage.setItem('wishlist', JSON.stringify([]));
    const PP = this.productPaginatorSource.getValue();
    PP.data = [];
    this.productPaginatorSource.next(PP);
    this.dataService.setWishlist(0);
  }

  clearWishlist() {
    if (this.tokenService.loggedIn()) {
      this.clearWishlistAfterLogin();
    } else {
      this.clearWishlistBeforeLogin();
    }
  }

  addToWishlist(id) {
    if (this.tokenService.loggedIn()) {
      this.addToWishlistAfterLogin(id);
    } else {
      this.addToWishlistBeforeLogin(id);
    }
  }

  removeItemFromWishlist(id) {
    if (this.tokenService.loggedIn()) {
      this.removeItemFromWishlistAfterLogin(id);
    } else {
      this.removeItemFromWishlistBeforeLogin(id);
    }
  }

}
