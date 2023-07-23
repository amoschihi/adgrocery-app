import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {DiscountService} from '../discount.service';

@Injectable({
  providedIn: 'root'
})
export class ProductSettingResolverService implements Resolve<boolean> {

  constructor(private reductionService: DiscountService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    return new Observable(subscriber => {
      this.reductionService.get().subscribe(value => {
      });

      subscriber.next(true);
      subscriber.complete();
    });
  }
}
