import {Injectable} from '@angular/core';
import {ProductService} from '../product.service';
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {ProductPaginate} from '../../models/product-paginate';
import {map} from 'rxjs/operators';
import {CritereRecherche} from '../../models/critere-recherche';

@Injectable({
  providedIn: 'root'
})
export class ProductsCategoryResolverService implements Resolve<ProductPaginate> {

  constructor(private serviceProduit: ProductService, private router: Router) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ProductPaginate>
    | Promise<ProductPaginate> | ProductPaginate {
    const id = route.paramMap.get('id');
    const cri = new CritereRecherche();
    cri.categorie_id = parseFloat(id);
    return this.serviceProduit.get(true, 1, 12, cri).pipe(map(value => {
      if (value) {
        return value;
      } else {
        this.router.navigate(['/main/home']);
        return null;
      }
    }));
  }
}
