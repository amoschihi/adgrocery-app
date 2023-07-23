import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {TokenService} from './token.service';
import {Address} from '../models/address';

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  private url = environment.urlServeur;

  constructor(private http: HttpClient, private tokenService: TokenService) {
  }

  public get(): Observable<Address[]> {
    return this.http.get<Address[]>(this.url + '/GA');
  }

  public getAPer(): Observable<Address> {
    return this.http.get<Address>(this.url + '/GAPer');
  }

  public getAPro(): Observable<Address> {
    return this.http.get<Address>(this.url + '/GAPro');
  }

  update(value: Address): Observable<any> {
    return this.http.put<any>(this.url + '/UA', value);
  }
}
