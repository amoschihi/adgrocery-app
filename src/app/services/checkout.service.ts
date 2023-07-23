import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {environment} from '../../environments/environment';
import {Order} from '../models/order';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  private url = environment.urlServeur;

  private orderSource = new BehaviorSubject<Order>(null);
  order = this.orderSource.asObservable();

  setOrder(data: Order) {
    this.orderSource.next(data);
  }

}
