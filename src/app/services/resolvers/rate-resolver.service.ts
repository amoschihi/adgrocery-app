import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {DeliveryTypeService} from '../delivery-type.service';
import {map} from 'rxjs/operators';
import {RateService} from '../rate.service';
import {CityService} from '../city.service';

@Injectable({
  providedIn: 'root'
})
export class RateResolverService implements Resolve<number> {

  constructor(private typeLivraisonService: DeliveryTypeService,
              private tarifService: RateService,
              private villeService: CityService,
              private router: Router) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<number> | Promise<number> | number {
    return this.typeLivraisonService.get().pipe(map(value => {
      if (value.length) {
        this.villeService.get().subscribe(value3 => {
        });
        this.tarifService.get(value[0].id, true).subscribe(value1 => {
        });
        return value[0].id;
      } else {
        this.router.navigate(['/main/admin/typeLivraison2']);
        return null;
      }
    }));
  }
}
