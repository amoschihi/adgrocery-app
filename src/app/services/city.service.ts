import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {TokenService} from './token.service';
import {City} from '../models/city';

@Injectable({
  providedIn: 'root'
})
export class CityService {

  private url = environment.urlServeur;
  private citySource = new BehaviorSubject<City[]>(null);
  city = this.citySource.asObservable();

  setCities(data: City[]) {
    this.citySource.next(data);
  }

  constructor(private http: HttpClient, private tokenService: TokenService) {
  }

  public get(refresh: boolean = false): Observable<City[]> {
    return new Observable(observer => {
      if (!refresh && this.citySource.getValue()) {
        observer.next(this.citySource.getValue());
        return observer.complete();
      }
      this.http.get<City[]>(this.url + '/GAV').subscribe(value => {
        this.setCities(value);
        observer.next(this.citySource.getValue());
        observer.complete();
      });
    });
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(this.url + '/DV/' + id);
  }

  save(value: City): Observable<any> {
    return this.http.post<any>(this.url + '/SV', value);
  }

  update(value: City): Observable<any> {
    return this.http.put<any>(this.url + '/UV', value);
  }
}
