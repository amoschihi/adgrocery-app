import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {TokenService} from './token.service';
import {BehaviorSubject, Observable} from 'rxjs';
import {OrderPaginate} from '../models/order-paginate';
import {Order} from '../models/order';

@Injectable({
  providedIn: 'root'
})
export class OrderAdminService {


  private url = environment.urlServeur;


  private ordersNewsSource = new BehaviorSubject<OrderPaginate>(null);
  orderNews = this.ordersNewsSource.asObservable();

  private ordersShippedSource = new BehaviorSubject<OrderPaginate>(null);
  ordersShipped = this.ordersShippedSource.asObservable();

  private ordersDeliveredSource = new BehaviorSubject<OrderPaginate>(null);
  ordersDelivered = this.ordersDeliveredSource.asObservable();

  private ordersClosedSource = new BehaviorSubject<OrderPaginate>(null);
  ordersClosed = this.ordersClosedSource.asObservable();

  private loadSource = new BehaviorSubject<boolean>(false);
  load = this.loadSource.asObservable();


  setLoad(data: boolean) {
    this.loadSource.next(data);
  }

  setOrderClosed(data: OrderPaginate) {
    this.ordersClosedSource.next(data);
  }

  setOrderDelivered(data: OrderPaginate) {
    this.ordersDeliveredSource.next(data);
  }

  setOrderShipped(data: OrderPaginate) {
    this.ordersShippedSource.next(data);
  }

  setOrderNews(data: OrderPaginate) {
    this.ordersNewsSource.next(data);
  }

  constructor(private http: HttpClient, private tokenService: TokenService) {
  }


  public getNews(filter = '',
                 sort = 'asc',
                 sortAct = 'dateC',
                 refresh: boolean = false,
                 page = (this.ordersNewsSource.getValue()) ? this.ordersNewsSource.getValue().current_page : 1,
                 perPage = (this.ordersNewsSource.getValue()) ? this.ordersNewsSource.getValue().per_page : 12
  ): Observable<OrderPaginate> {
    return new Observable(observer => {
      if (!refresh && this.ordersNewsSource.getValue()) {
        observer.next(this.ordersNewsSource.getValue());
        return observer.complete();
      }
      this.setLoad(true);
      const params = new HttpParams()
        .set('page', page.toString())
        .set('perPage', perPage.toString())
        .set('status', 'new')
        .set('filter', filter)
        .set('sortAct', sortAct)
        .set('sort', sort);
      let ch = 'GACMDA';
      if (!this.tokenService.isValidAdmin()) {
        ch = 'GACMD';
      }
      this.http.get<OrderPaginate>(this.url + '/' + ch, {params: params}).subscribe(value => {
        this.ordersNewsSource.next(value);
        this.setLoad(false);
        observer.next(this.ordersNewsSource.getValue());
        observer.complete();
      });
    });
  }

  public getShipped(filter = '',
                    sort = 'asc',
                    sortAct = 'dateC',
                    refresh: boolean = false,
                    page = (this.ordersShippedSource.getValue()) ? this.ordersShippedSource.getValue().current_page : 1,
                    perPage = (this.ordersShippedSource.getValue()) ? this.ordersShippedSource.getValue().per_page : 12
  ): Observable<OrderPaginate> {
    return new Observable(observer => {
      if (!refresh && this.ordersShippedSource.getValue()) {
        observer.next(this.ordersShippedSource.getValue());
        return observer.complete();
      }
      this.setLoad(true);

      const params = new HttpParams()
        .set('page', page.toString())
        .set('perPage', perPage.toString())
        .set('status', 'shipped')
        .set('filter', filter)
        .set('sortAct', sortAct)
        .set('sort', sort);
      let ch = 'GACMDA';
      if (!this.tokenService.isValidAdmin()) {
        ch = 'GACMD';
      }
      this.http.get<OrderPaginate>(this.url + '/' + ch, {params: params}).subscribe(value => {
        this.ordersShippedSource.next(value);
        this.setLoad(false);
        observer.next(this.ordersShippedSource.getValue());
        observer.complete();
      });
    });
  }

  public getDelivered(filter = '',
                      sort = 'asc',
                      sortAct = 'dateC',
                      refresh: boolean = false,
                      page = (this.ordersDeliveredSource.getValue()) ? this.ordersDeliveredSource.getValue().current_page : 1,
                      perPage = (this.ordersDeliveredSource.getValue()) ? this.ordersDeliveredSource.getValue().per_page : 12
  ): Observable<OrderPaginate> {
    return new Observable(observer => {
      if (!refresh && this.ordersDeliveredSource.getValue()) {
        observer.next(this.ordersDeliveredSource.getValue());
        return observer.complete();
      }
      this.setLoad(true);

      const params = new HttpParams()
        .set('page', page.toString())
        .set('perPage', perPage.toString())
        .set('status', 'delivered')
        .set('filter', filter)
        .set('sortAct', sortAct)
        .set('sort', sort);
      let ch = 'GACMDA';
      if (!this.tokenService.isValidAdmin()) {
        ch = 'GACMD';
      }
      this.http.get<OrderPaginate>(this.url + '/' + ch, {params: params}).subscribe(value => {
        this.ordersDeliveredSource.next(value);
        this.setLoad(false);
        observer.next(this.ordersDeliveredSource.getValue());
        observer.complete();
      });
    });
  }

  public getClosed(filter = '',
                   sort = 'asc',
                   sortAct = 'dateC',
                   refresh: boolean = false,
                   page = (this.ordersClosedSource.getValue()) ? this.ordersClosedSource.getValue().current_page : 1,
                   perPage = (this.ordersClosedSource.getValue()) ? this.ordersClosedSource.getValue().per_page : 12
  ): Observable<OrderPaginate> {
    return new Observable(observer => {
      if (!refresh && this.ordersClosedSource.getValue()) {
        observer.next(this.ordersClosedSource.getValue());
        return observer.complete();
      }
      this.setLoad(true);

      const params = new HttpParams()
        .set('page', page.toString())
        .set('perPage', perPage.toString())
        .set('status', 'closed')
        .set('filter', filter)
        .set('sortAct', sortAct)
        .set('sort', sort);
      this.http.get<OrderPaginate>(this.url + '/GACMDA', {params: params}).subscribe(value => {
        this.ordersClosedSource.next(value);
        this.setLoad(false);
        observer.next(this.ordersClosedSource.getValue());
        observer.complete();
      });
    });
  }


  update(value: Order): Observable<any> {
    return this.http.put<any>(this.url + '/UCMDA', value);
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(this.url + '/DCMDA/' + id);
  }

  getById(id: number): Observable<any> {
    return this.http.get<any>(this.url + '/GCMDA/' + id);
  }


  changeStatus(element: Order) {
    switch (element.status) {
      case 'new': {
        const tmp = this.ordersNewsSource.getValue();
        tmp.data.unshift(element);
        tmp.total++;
        this.setOrderNews(tmp);
        return;
      }
      case 'shipped': {
        const tmp = this.ordersShippedSource.getValue();
        tmp.total++;
        tmp.data.unshift(element);
        this.setOrderShipped(tmp);
        return;
      }
      case 'delivered': {
        const tmp = this.ordersDeliveredSource.getValue();
        tmp.total++;
        tmp.data.unshift(element);
        this.setOrderDelivered(tmp);
        return;
      }
      case 'closed': {
        const tmp = this.ordersClosedSource.getValue();
        tmp.total++;
        tmp.data.unshift(element);
        this.setOrderClosed(tmp);
        return;
      }
    }
  }
}
