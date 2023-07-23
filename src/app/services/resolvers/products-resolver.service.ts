import {Injectable} from '@angular/core';
import {ProductService} from '../product.service';
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {map, take} from 'rxjs/operators';
import {ProductPaginate} from '../../models/product-paginate';

@Injectable({
  providedIn: 'root'
})
export class ProductsResolverService implements Resolve<ProductPaginate> {

  constructor(private serviceProduct: ProductService, private router: Router) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ProductPaginate>
    | Promise<ProductPaginate> | ProductPaginate {
    return this.serviceProduct.get(true, 1, 12).pipe(map(value => {
      if (value) {
        return value;
      } else {
        this.router.navigate(['/main/home']);
        return null;
      }
    }));
  }
}
