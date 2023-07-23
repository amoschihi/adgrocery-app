import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {InfoSite} from '../../models/info-site';
import {InfoSiteService} from '../info-site.service';
import {DataService} from '../data.service';
import {LineOrder} from '../../models/line-order';
import {TokenService} from '../token.service';
import {WishlistService} from '../wishlist.service';
import {CompareService} from '../compare.service';
import {ShoppingCartService} from '../shopping-cart.service';
import {CategoryService} from '../category.service';
import {MaterialService} from '../material.service';
import {ColorService} from '../color.service';
import {UserServicesService} from '../user-services.service';

@Injectable({
  providedIn: 'root'
})
export class InfoSiteResolverService implements Resolve<InfoSite> {

  constructor(
    private infoSiteService: InfoSiteService,
    private router: Router,
    private dataService: DataService,
    private tokenService: TokenService,
    private wishlistService: WishlistService,
    private compareService: CompareService,
    private userService: UserServicesService,
    private categoryService: CategoryService,
    private materialService: MaterialService,
    private colorService: ColorService,
    private shoppingCartService: ShoppingCartService
  ) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<InfoSite> | Promise<InfoSite> | InfoSite {
    return this.infoSiteService.get().pipe(map(value => {
      if (value) {
        if (!this.tokenService.loggedIn()) {
          const ShoppingCart = localStorage.getItem('ShoppingCart');
          if (!ShoppingCart || ShoppingCart === '[]') {
            localStorage.setItem('ShoppingCart', JSON.stringify([]));
            this.shoppingCartService.setProductPaginator([]);
            this.dataService.setShoppingCart(0);

          } else {
            const arr = JSON.parse(ShoppingCart)as LineOrder[];
            this.shoppingCartService.get2(false, this.shoppingCartService.getShoppingCartId()).subscribe(value1 => {
            });
          }
          const compares = localStorage.getItem('compares');
          if (!compares) {
            localStorage.setItem('compares', JSON.stringify([]));
            this.dataService.setCompares(0);
          } else {
            this.compareService.getByListId(false, 1, 12, this.compareService.getCompare()).subscribe(value1 => {
            });
          }
          const wishlist = localStorage.getItem('wishlist');
          if (!wishlist) {
            localStorage.setItem('wishlist', JSON.stringify([]));
            this.dataService.setWishlist(0);
          } else {
            this.wishlistService.getByListId(false, 1, 12, this.wishlistService.getWishlist()).subscribe(value1 => {
            });
          }
        } else {
          this.wishlistService.get(true).subscribe(Wvalue => {
            this.dataService.setWishlist(Wvalue.total);
          });
          this.compareService.get(true).subscribe(Wvalue => {
            this.dataService.setCompares(Wvalue.total);
          });
          this.shoppingCartService.get(true).subscribe(Wvalue => {
          }, error1 => {

          });
        }
        this.materialService.get().subscribe(value1 => {
        });
        this.colorService.get().subscribe(value1 => {
        });
        this.userService.get().subscribe(value1 => {
        });
        return value;
      } else {
        this.router.navigate(['/Error']);
        return null;
      }
    }));
  }
}
