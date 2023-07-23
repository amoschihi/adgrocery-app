import {Injectable} from '@angular/core';
import {Material} from '../models/material';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {TokenService} from './token.service';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MaterialService {

  private url = environment.urlServeur;
  private materialsSource = new BehaviorSubject<Material[]>(null);
  materials = this.materialsSource.asObservable();

  setMaterials(data: Material[]) {
    this.materialsSource.next(data);
  }

  constructor(private http: HttpClient, private tokenService: TokenService) {
  }

  public get(refresh: boolean = false): Observable<Material[]> {
    return new Observable(observer => {
      if (!refresh && this.materialsSource.getValue()) {
        observer.next(this.materialsSource.getValue());
        return observer.complete();
      }
      this.http.get<Material[]>(this.url + '/GAMAT').subscribe(value => {
        this.setMaterials(value);
        observer.next(this.materialsSource.getValue());
        observer.complete();
      });
    });
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(this.url + '/DMAT/' + id);
  }

  save(value: Material): Observable<any> {
    return this.http.post<any>(this.url + '/SMAT', value);
  }

  update(value: Material): Observable<any> {
    return this.http.put<any>(this.url + '/UMAT', value);
  }
}
