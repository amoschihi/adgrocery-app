import {Injectable} from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  /*private comparesSource = new Subject<number[]>();
  compares$ = this.comparesSource.asObservable();*/
  private comparesSource = new BehaviorSubject(0);
  compares$ = this.comparesSource.asObservable();

  private shoppingCartSource = new BehaviorSubject(0);
  shoppingCart$ = this.shoppingCartSource.asObservable();


  private wishlistSource = new BehaviorSubject(0);
  wishlist$ = this.wishlistSource.asObservable();

  setCompares(data: number) {
    this.comparesSource.next(data);
  }

  addCompare(NbAttached: number = 1) {
    this.comparesSource.next(this.comparesSource.getValue() + NbAttached);
  }

  removeCompare(NbDetached: number = 1) {
    this.comparesSource.next(this.comparesSource.getValue() - NbDetached);
  }

  setShoppingCart(data: number) {
    this.shoppingCartSource.next(data);
  }

  addShoppingCart(NbAttached: number = 1) {
    this.shoppingCartSource.next(this.shoppingCartSource.getValue() + NbAttached);
  }

  removeShoppingCart(NbAttached: number = 1) {
    this.shoppingCartSource.next(this.shoppingCartSource.getValue() - NbAttached);
  }

  setWishlist(data: number) {
    this.wishlistSource.next(data);
  }

  addWishlist(NbAttached: number = 1) {
    this.wishlistSource.next(this.wishlistSource.getValue() + NbAttached);
  }

  removeWishlist(NbDetached: number = 1) {
    this.wishlistSource.next(this.wishlistSource.getValue() - NbDetached);
  }
}
