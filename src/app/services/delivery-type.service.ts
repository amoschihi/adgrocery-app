import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {TokenService} from './token.service';
import {DeliveryType} from '../models/delivery-type';

@Injectable({
  providedIn: 'root'
})
export class DeliveryTypeService {


  private url = environment.urlServeur;
  private deliveryTypeSource = new BehaviorSubject<DeliveryType[]>(null);
  deliveryType = this.deliveryTypeSource.asObservable();

  setDeliveryTypes(data: DeliveryType[]) {
    this.deliveryTypeSource.next(data);
  }

  constructor(private http: HttpClient, private tokenService: TokenService) {
  }

  public get(refresh: boolean = false): Observable<DeliveryType[]> {
    return new Observable(observer => {
      if (!refresh && this.deliveryTypeSource.getValue()) {
        observer.next(this.deliveryTypeSource.getValue());
        return observer.complete();
      }
      this.http.get<DeliveryType[]>(this.url + '/GATL').subscribe(value => {
        this.setDeliveryTypes(value);
        observer.next(this.deliveryTypeSource.getValue());
        observer.complete();
      });
    });
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(this.url + '/DTL/' + id);
  }

  save(value: DeliveryType): Observable<any> {
    return this.http.post<any>(this.url + '/STL', value);
  }

  update(value: DeliveryType): Observable<any> {
    return this.http.put<any>(this.url + '/UTL', value);
  }
}
