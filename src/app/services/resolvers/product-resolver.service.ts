import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {map} from 'rxjs/operators';
import {ProductService} from '../product.service';
import {Product} from '../../models/product';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductResolverService implements Resolve<Product> {

  constructor(private serviceProduct: ProductService, private router: Router) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Product> | Promise<Product> | Product {
    const id = route.paramMap.get('id');
    return this.serviceProduct.getById(parseFloat(id)).pipe(map(value => {
      if (value) {
        return value;
      } else {
        this.router.navigate(['/main/products']);
        return null;
      }
    }));
  }
}
