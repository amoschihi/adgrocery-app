import {Injectable} from '@angular/core';
import {catchError, map} from 'rxjs/operators';
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {EMPTY, Observable} from 'rxjs';
import {OrderAdminService} from '../order-admin.service';

@Injectable({
  providedIn: 'root'
})
export class OrderAdminResolverService implements Resolve<boolean> {

  constructor(private orderAdminService: OrderAdminService, private router: Router) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>
    | Promise<boolean> | boolean {
    return this.orderAdminService.getNews().pipe(map(value => {
      if (value) {
        return true;
      } else {
        this.router.navigate(['/main/home']);
        return false;
      }
    }), catchError(err => {
      this.router.navigate(['/main/home']);
      return EMPTY;
    }));
  }
}
