import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {TokenService} from './token.service';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Repository} from '../models/repository';
import {Brand} from '../models/brand';

@Injectable({
  providedIn: 'root'
})
export class BrandService implements Repository<Brand> {

  private url = environment.urlServeur;
  marques: Brand[] = null;

  constructor(private http: HttpClient, private tokenService: TokenService) {
  }

  public get(refresh: boolean = false): Observable<Brand[]> {
    return new Observable(observer => {
      if (!refresh && this.marques) {
        observer.next(this.marques);
        return observer.complete();
      }
      this.http.get<Brand[]>(this.url + '/GAMAR').subscribe(value => {
        this.marques = value;
        observer.next(this.marques);
        observer.complete();
      });
    });
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(this.url + '/DMAR/' + id);
  }

  save(value: Brand): Observable<any> {
    return this.http.post<any>(this.url + '/SMAR', value);
  }

  update(value: Brand): Observable<any> {
    return this.http.put<any>(this.url + '/UMAR', value);
  }
}
