import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {DataService} from './data.service';
import {HttpClient, HttpParams} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {TokenService} from './token.service';
import {Product} from '../models/product';
import {LineOrder} from '../models/line-order';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {


  private url = environment.urlServeur;

  private productPaginatorSource = new BehaviorSubject<LineOrder[]>(null);
  private _ShoppingCartIsModified: boolean;

  productPaginator = this.productPaginatorSource.asObservable();

  constructor(private http: HttpClient,
              private tokenService: TokenService,
              private dataService: DataService) {
  }

  setProductPaginator(data: LineOrder[]) {
    if (data && data.length === 0) {
      this.dataService.setShoppingCart(0);
    }
    this.productPaginatorSource.next(data);
  }

  public get2(refresh: boolean = false, id: number[]): Observable<LineOrder[]> {
    return new Observable(observer => {
      if (!refresh && this.productPaginatorSource.getValue()) {
        observer.next(this.productPaginatorSource.getValue());
        return observer.complete();
      }
      const params = new HttpParams()
        .set('id', id.join(', '));
      this.http.get<Product[]>(this.url + '/GAPRODBLIDWP', {params: params}).subscribe(value => {
        const LCs = this.getShoppingCart();
        this.dataService.setShoppingCart(0);
        LCs.forEach(value1 => {
          this.dataService.addShoppingCart(value1.quantity);
          value1.product = value.find(value2 => value2.id === value1.product_id);
        });
        console.log(LCs);
        this.productPaginatorSource.next(LCs);
        observer.next(this.productPaginatorSource.getValue());
        observer.complete();
      });
    });
  }

  public get(refresh: boolean = false): Observable<LineOrder[]> {
    return new Observable(observer => {
      if (!refresh && this.productPaginatorSource.getValue()) {
        observer.next(this.productPaginatorSource.getValue());
        return observer.complete();
      }
      this.http.get<LineOrder[]>(this.url + '/GAPSC').subscribe(value => {

        this.productPaginatorSource.next(value);
        this.dataService.setShoppingCart(0);
        value.forEach(value1 => {
          this.dataService.addShoppingCart(value1.quantity);
        });
        observer.next(this.productPaginatorSource.getValue());
        observer.complete();
      }, error1 => {
      });
    });
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(this.url + '/DPSC/' + id);
  }

  deleteAll(): Observable<any> {
    return this.http.delete<any>(this.url + '/DAPSC');
  }

  save(LC: LineOrder): Observable<any> {
    return this.http.post<any>(this.url + '/SPSC', LC);
  }

  update(id: number, quantity: number): Observable<any> {
    return this.http.put<any>(this.url + '/UPSC', {id: id, quantity: quantity});
  }

  addShoppingCart(LC: LineOrder) {
    if (this.tokenService.loggedIn()) {
      this.addShoppingCartAfterLogin(LC);
    } else {
      this.addShoppingCartBeforeLogin(LC);
    }
  }

  addQuantityShoppingCart(LC: LineOrder) {
    if (this.tokenService.loggedIn()) {
      this.addQuantityShoppingCartAfterLogin(LC);
    } else {
      this.addQuantityShoppingCartBeforeLogin(LC);
    }
  }

  addQuantityShoppingCartAfterLogin(FLC: LineOrder) {
    this.update(FLC.id, FLC.quantity).subscribe(value => {
      this.dataService.addShoppingCart();
    });
  }

  addQuantityShoppingCartBeforeLogin(LC: LineOrder) {
    this.dataService.addShoppingCart();
    this.changeQuantityFromLocalStorage(LC);
  }

  removeQuantityShoppingCart(LC: LineOrder) {
    if (this.tokenService.loggedIn()) {
      this.removeQuantityShoppingCartAfterLogin(LC);
    } else {
      this.removeQuantityShoppingCartBeforeLogin(LC);
    }
  }

  removeQuantityShoppingCartAfterLogin(FLC: LineOrder) {
    this.update(FLC.id, FLC.quantity).subscribe(value => {
      this.dataService.removeShoppingCart();
    });
  }

  removeQuantityShoppingCartBeforeLogin(LC: LineOrder) {
    this.dataService.removeShoppingCart();
    this.changeQuantityFromLocalStorage(LC);
  }

  syncFromLocaleToDatabase() {
    const LCs = this.productPaginatorSource.getValue();
    this.get(true).subscribe(value => {
      LCs.forEach(value1 => {
        this.addShoppingCartAfterLogin(value1);
      });
      localStorage.setItem('ShoppingCart', JSON.stringify([]));
    });
  }

  addShoppingCartAfterLogin(LC: LineOrder) {
    const FLC = this.existShoppingCart(LC.product_id);
    if (!FLC) {
      this.save(LC).subscribe(value => {
        this.dataService.addShoppingCart(LC.quantity);
        const tmp = this.productPaginatorSource.getValue();
        tmp.push(LC);
        this.productPaginatorSource.next(tmp);
        this.ShoppingCartIsModified = true;
      }, error1 => {
        console.log(error1);
      });
    } else {

      if (FLC.quantity + LC.quantity <= LC.product.article.stock) {
        this.update(FLC.id, FLC.quantity + LC.quantity).subscribe(value => {
          FLC.quantity = FLC.quantity + LC.quantity;
          this.productPaginatorSource.next(this.productPaginatorSource.getValue());
          this.dataService.addShoppingCart(LC.quantity);
        }, error1 => console.log(error1));
      }
    }
  }

  totalQuantityOfSameProduct(id: number): number {
    return this.productPaginatorSource.getValue().filter(value => value.product_id === id)
      .map(value => value.quantity)
      .reduce((previousValue, currentValue) => previousValue + currentValue);
  }

  addShoppingCartBeforeLogin(LC: LineOrder) {
    const arr = this.getShoppingCart();
    console.log(this.productPaginatorSource.getValue());
    const FLC = this.existShoppingCart(LC.product_id);
    if (!FLC) {
      const tmp = this.productPaginatorSource.getValue();
      tmp.push(LC);
      this.productPaginatorSource.next(tmp);
      arr.push(LC.getNewInstanceLineOrder());
      this.dataService.addShoppingCart(LC.quantity);
      localStorage.setItem('ShoppingCart', JSON.stringify(arr));
    } else {
      if (FLC.quantity + LC.quantity <= LC.product.article.stock) {
        FLC.quantity = FLC.quantity + LC.quantity;
        this.productPaginatorSource.next(this.productPaginatorSource.getValue());
        this.dataService.addShoppingCart(LC.quantity);
        this.changeQuantityFromLocalStorage(FLC);
      }
    }
  }


  exist(id: number, arr: Array<number>): boolean {
    const res = arr.find(value => value === id);
    return !!res;
  }

  changeQuantityFromLocalStorage(LC: LineOrder) {
    const arr = this.getShoppingCart();
    const FLC = arr.find(value => value.product_id === LC.product_id);
    FLC.quantity = LC.quantity;
    localStorage.setItem('ShoppingCart', JSON.stringify(arr));
  }


  existShoppingCart(id: number): LineOrder {
    const res = this.productPaginatorSource.getValue().find(value => value.product_id === id);
    return res ? res : null;
  }


  getShoppingCart(): LineOrder[] {
    const ShoppingCart = localStorage.getItem('ShoppingCart');
    return JSON.parse(ShoppingCart)as LineOrder[];
  }

  getShoppingCartId(): number[] {
    const LCs = this.getShoppingCart();
    return LCs.map(value => value.product_id);
  }

  clearShoppingCartAfterLogin() {
    this.deleteAll().subscribe(value => {
      this.productPaginatorSource.next([]);
      this.dataService.setShoppingCart(0);

    });
  }

  clearShoppingCartBeforeLogin() {
    localStorage.setItem('ShoppingCart', JSON.stringify([]));
    this.productPaginatorSource.next([]);
    this.dataService.setShoppingCart(0);
  }

  clearShoppingCart() {
    if (this.tokenService.loggedIn()) {
      this.clearShoppingCartAfterLogin();
    } else {
      this.clearShoppingCartBeforeLogin();
    }
  }

  removeItemFromShoppingCartAfterLogin(LC: LineOrder) {
    this.delete(LC.id).subscribe(value => {
      this.productPaginatorSource.next(this.productPaginatorSource.getValue().filter(value2 => value2.id !== LC.id));
      this.dataService.removeShoppingCart(LC.quantity);
    });
  }


  removeItemFromShoppingCartBeforeLogin(LC: LineOrder) {
    let arr = this.getShoppingCart();
    arr = arr.filter(value => value.product_id !== LC.product_id);
    localStorage.setItem('ShoppingCart', JSON.stringify(arr));
    this.productPaginatorSource.next(this.productPaginatorSource.getValue().filter(value => value.product_id !== LC.product_id));
    this.dataService.removeShoppingCart(LC.quantity);
  }

  removeItemFromShoppingCart(LC: LineOrder) {
    if (this.tokenService.loggedIn()) {
      this.removeItemFromShoppingCartAfterLogin(LC);
    } else {
      this.removeItemFromShoppingCartBeforeLogin(LC);
    }
  }


  get ShoppingCartIsModified(): boolean {
    return this._ShoppingCartIsModified;
  }

  set ShoppingCartIsModified(value: boolean) {
    this._ShoppingCartIsModified = value;
  }

}
