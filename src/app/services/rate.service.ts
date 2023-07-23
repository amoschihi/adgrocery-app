import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {TokenService} from './token.service';
import {Rate} from '../models/rate';

@Injectable({
  providedIn: 'root'
})
export class RateService {


  private url = environment.urlServeur;
  private ratesSource = new BehaviorSubject<Rate[]>(null);
  rates = this.ratesSource.asObservable();

  setRates(data: Rate[]) {
    this.ratesSource.next(data);
  }

  constructor(private http: HttpClient, private tokenService: TokenService) {
  }

  public get(id: number, refresh: boolean = false): Observable<Rate[]> {
    return new Observable(observer => {
      if (!refresh && this.ratesSource.getValue()) {
        observer.next(this.ratesSource.getValue());
        return observer.complete();
      }
      this.http.get<Rate[]>(this.url + '/GATAR/' + id).subscribe(value => {
        this.setRates(value);
        observer.next(this.ratesSource.getValue());
        observer.complete();
      });
    });
  }

  public get2(id: number, v_id: number): Observable<Rate> {
    const params = new HttpParams()
      .set('id', id.toString())
      .set('v_id', v_id.toString());
    return this.http.get<Rate>(this.url + '/GTAR', {params: params});
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(this.url + '/DTAR/' + id);
  }

  save(value: Rate): Observable<any> {
    return this.http.post<any>(this.url + '/STAR', value);
  }

  update(value: Rate): Observable<any> {
    return this.http.put<any>(this.url + '/UTAR', value);
  }
}
