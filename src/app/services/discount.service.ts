import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {TokenService} from './token.service';
import {BehaviorSubject, Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Discount} from '../models/discount';

@Injectable({
  providedIn: 'root'
})
export class DiscountService {


  private url = environment.urlServeur;
  private discountsSource = new BehaviorSubject<Discount[]>(null);
  discounts = this.discountsSource.asObservable();

  setDiscounts(data: Discount[]) {
    this.discountsSource.next(data);
  }

  constructor(private http: HttpClient, private tokenService: TokenService) {
  }

  public get(refresh: boolean = false): Observable<Discount[]> {
    return new Observable(observer => {
      if (!refresh && this.discountsSource.getValue()) {
        observer.next(this.discountsSource.getValue());
        return observer.complete();
      }
      this.http.get<Discount[]>(this.url + '/GARED').subscribe(value => {
        this.setDiscounts(value);
        observer.next(this.discountsSource.getValue());
        observer.complete();
      });
    });
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(this.url + '/DRED/' + id);
  }

  save(value: Discount): Observable<any> {
    return this.http.post<any>(this.url + '/SRED', value);
  }

  update(value: Discount): Observable<any> {
    return this.http.put<any>(this.url + '/URED', value);
  }
}
