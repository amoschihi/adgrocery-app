import {Injectable} from '@angular/core';
import {Repository} from '../models/repository';
import {environment} from '../../environments/environment';
import {TokenService} from './token.service';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {SubCategory} from '../models/sub-category';

@Injectable({
  providedIn: 'root'
})
export class SubCategoryService implements Repository<SubCategory> {

  private url = environment.urlServeur;


  private subCategoriesSource = new BehaviorSubject<SubCategory[]>(null);
  subCategories = this.subCategoriesSource.asObservable();

  setSousCategories(data: SubCategory[]) {
    this.subCategoriesSource.next(data);
  }

  constructor(private http: HttpClient, private tokenService: TokenService) {
  }

  public get(refresh: boolean = false): Observable<SubCategory[]> {
    return new Observable(observer => {
      if (!refresh && this.subCategoriesSource.getValue()) {
        observer.next(this.subCategoriesSource.getValue());
        return observer.complete();
      }
      this.http.get<SubCategory[]>(this.url + '/GASCAT').subscribe(value => {
        this.subCategoriesSource.next(value);
        observer.next(this.subCategoriesSource.getValue());
        observer.complete();
      });
    });
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(this.url + '/DSCAT/' + id);
  }

  save(value: SubCategory): Observable<any> {
    return this.http.post<any>(this.url + '/SSCAT', value);
  }

  update(value: SubCategory): Observable<any> {
    return this.http.put<any>(this.url + '/USCAT', value);
  }
}
