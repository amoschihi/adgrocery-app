import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {map} from 'rxjs/operators';
import {ShoppingCartService} from '../shopping-cart.service';
import {LineOrder} from '../../models/line-order';
import {TokenService} from '../token.service';

@Injectable({
  providedIn: 'root'
})
export class ProductsShoppingCartResolverService implements Resolve<LineOrder[]> {

  constructor(private shoppingCartService: ShoppingCartService, private router: Router, private tokenService: TokenService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<LineOrder[]>
    | Promise<LineOrder[]> | LineOrder[] {
    if (this.tokenService.loggedIn()) {
      return this.shoppingCartService.get(
        this.shoppingCartService.ShoppingCartIsModified
      ).pipe(map(value => {
        if (value) {
          return value;
        } else {
          this.router.navigate(['/main/home']);
          return null;
        }
      }));
    } else {
      return this.shoppingCartService.get2(
        this.shoppingCartService.ShoppingCartIsModified,
        this.shoppingCartService.getShoppingCartId()
      ).pipe(map(value => {
        if (value) {
          return value;
        } else {
          this.router.navigate(['/main/home']);
          return null;
        }
      }));
    }
  }
}
