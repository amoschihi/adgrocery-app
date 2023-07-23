import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {RegionService} from '../region.service';
import {UserServicesService} from '../user-services.service';
import {CityService} from '../city.service';
import {DeliveryTypeService} from '../delivery-type.service';
import {CheckoutService} from '../checkout.service';
import {map, take} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CheckoutResolverService implements Resolve<boolean> {

  constructor(private userService: UserServicesService,
              private router: Router,
              private regionService: RegionService,
              private checkoutService: CheckoutService,
              private deliveryTypeService: DeliveryTypeService,
              private cityService: CityService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    /* return new Observable(subscriber => {
       this.deliveryTypeService.get().subscribe(value => {
       });
       this.regionService.get().subscribe(value => {
       });
       this.cityService.get().subscribe(value => {
       });
       this.checkoutService.commande.subscribe(value0 => {
         if (value0) {
           subscriber.next(true);
         } else {
           subscriber.next(false);
         }
         this.userService.get().subscribe(value => {
           subscriber.complete();
         });
       });
     });*/
    return this.checkoutService.order.pipe(take(1),
      map(value0 => {
        if (value0) {
          this.deliveryTypeService.get().subscribe(value => {
          });
          this.regionService.get().subscribe(value => {
          });
          this.cityService.get().subscribe(value => {
          });

          // return true;
        } else { // id not found
          this.router.navigate(['/']);
          return null;
        }
      })
    );
  }
}
