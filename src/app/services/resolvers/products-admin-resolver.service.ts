import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {map} from 'rxjs/operators';
import {ProductService} from '../product.service';

@Injectable({
  providedIn: 'root'
})
export class ProductsAdminResolverService implements Resolve<boolean> {

  constructor(private serviceProduct: ProductService, private router: Router) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>
    | Promise<boolean> | boolean {
    return this.serviceProduct.getByName('').pipe(map(value => {
      if (value) {
        return true;
      } else {
        this.router.navigate(['/main/home']);
        return false;
      }
    }));
  }
}
