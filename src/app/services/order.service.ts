import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {TokenService} from './token.service';
import {environment} from '../../environments/environment';
import {Order} from '../models/order';
import {Article} from '../models/article';

@Injectable({
  providedIn: 'root'
})
export class OrderService {


  private url = environment.urlServeur;
  private ordersSource = new BehaviorSubject<Order[]>(null);
  orders = this.ordersSource.asObservable();

  setOrders(data: Order[]) {
    this.ordersSource.next(data);
  }

  constructor(private http: HttpClient, private tokenService: TokenService) {
  }

  public get(refresh: boolean = false): Observable<Order[]> {
    return new Observable(observer => {
      if (!refresh && this.ordersSource.getValue()) {
        observer.next(this.ordersSource.getValue());
        return observer.complete();
      }
      this.http.get<Order[]>(this.url + '/GACMD').subscribe(value => {
        this.setOrders(value);
        observer.next(this.ordersSource.getValue());
        observer.complete();
      });
    });
  }

  save(value: Order): Observable<{ articles: Article[], idCmd: number }> {
    return this.http.post<any>(this.url + '/SCMD', value);
  }
}
