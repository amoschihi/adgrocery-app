import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {CategoryService} from '../category.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryResolverService implements Resolve<boolean> {

  constructor(private categoryService: CategoryService, private router: Router) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>
    | Promise<boolean> | boolean {
    return this.categoryService.get().pipe(map(value => {
      if (value) {
        return true;
      } else {
        this.router.navigate(['/Error']);
        return false;
      }
    }));
  }
}
