import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {TokenService} from './token.service';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {Category} from '../models/category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private url = environment.urlServeur;

  private categoriesSource = new BehaviorSubject<Category[]>(null);
  categories = this.categoriesSource.asObservable();

  setCategories(data: Category[]) {
    this.categoriesSource.next(data);
  }

  constructor(private http: HttpClient, private tokenService: TokenService) {
  }

  public get(refresh: boolean = false): Observable<Category[]> {
    return new Observable(observer => {
      if (!refresh && this.categoriesSource.getValue()) {
        observer.next(this.categoriesSource.getValue());
        return observer.complete();
      }
      this.http.get<Category[]>(this.url + '/GACAT').subscribe(value => {
        this.categoriesSource.next(value);
        observer.next(this.categoriesSource.getValue());
        observer.complete();
      });
    });
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(this.url + '/DCAT/' + id);
  }

  save(value: Category): Observable<any> {
    return this.http.post<any>(this.url + '/SCAT', value);
  }

  update(value: Category): Observable<any> {
    return this.http.put<any>(this.url + '/UCAT', value);
  }
}
