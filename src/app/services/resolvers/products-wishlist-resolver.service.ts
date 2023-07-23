import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {ProductPaginate} from '../../models/product-paginate';
import {ProductService} from '../product.service';
import {map} from 'rxjs/operators';
import {TokenService} from '../token.service';
import {WishlistService} from '../wishlist.service';

@Injectable({
  providedIn: 'root'
})
export class ProductsWishlistResolverService implements Resolve<ProductPaginate> {

  constructor(private serviceProduct: ProductService,
              private router: Router,
              private tokenService: TokenService,
              private wishlistService: WishlistService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ProductPaginate>
    | Promise<ProductPaginate> | ProductPaginate {
    if (this.tokenService.loggedIn()) {
      return this.wishlistService.get(this.wishlistService.wishListIsModified).pipe(map(value => {
        if (value) {
          this.wishlistService.wishListIsModified = false;
          return value;
        } else {
          this.router.navigate(['/main/home']);
          return null;
        }
      }));
    } else {
      return this.wishlistService.getByListId(
        this.wishlistService.wishListIsModified,
        1,
        12,
        this.wishlistService.getWishlist()
      ).pipe(map(value => {
        if (value) {
          this.wishlistService.wishListIsModified = false;
          return value;
        } else {
          this.router.navigate(['/main/home']);
          return null;
        }
      }));
    }
  }
}
