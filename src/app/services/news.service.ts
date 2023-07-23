import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {TokenService} from './token.service';
import {BehaviorSubject, Observable} from 'rxjs';
import {NewsPaginate} from '../models/news-paginate';
import {News} from '../models/news';

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  private url = environment.urlServeur;
  private newsSource = new BehaviorSubject<News[]>(null);
  news = this.newsSource.asObservable();
  private newsPaginateSource = new BehaviorSubject<NewsPaginate>(null);
  newsPaginates = this.newsPaginateSource.asObservable();

  setNewsPaginate(data: NewsPaginate) {
    this.newsPaginateSource.next(data);
  }

  addNewsPaginate(data: News) {
    if (this.newsPaginateSource.getValue()) {
      const acts = this.newsPaginateSource.getValue();
      acts.data.push(data);
      this.newsPaginateSource.next(acts);
    }
  }

  removeNewsPaginate(id: number) {
    if (this.newsPaginateSource.getValue()) {
      const acts = this.newsPaginateSource.getValue();
      acts.data = acts.data.filter(value1 => value1.id !== id);
      this.newsPaginateSource.next(acts);
    }
  }

  setActualies(data: News[]) {
    this.newsSource.next(data);
  }

  removeNews(id: number) {
    if (this.newsSource.getValue()) {
      const acts = this.newsSource.getValue().filter(value2 => value2.id !== id);
      this.newsSource.next(acts);
    }
  }

  addNews(data: News) {
    if (this.newsSource.getValue()) {
      const acts = this.newsSource.getValue();
      acts.push(data);
      this.newsSource.next(acts);
    }
  }

  constructor(private http: HttpClient, private tokenService: TokenService) {
  }

  public get(refresh: boolean = false): Observable<News[]> {
    return new Observable(observer => {
      if (!refresh && this.newsSource.getValue()) {
        observer.next(this.newsSource.getValue());
        return observer.complete();
      }
      this.http.get<News[]>(this.url + '/GACT').subscribe(value => {
        this.setActualies(value);
        observer.next(this.newsSource.getValue());
        observer.complete();
      });
    });
  }

  public getAll(filter,
                refresh: boolean = false,
                page = 1,
                perPage = 12
  ): Observable<NewsPaginate> {
    return new Observable(observer => {
      if (!refresh && this.newsPaginateSource.getValue()) {
        observer.next(this.newsPaginateSource.getValue());
        return observer.complete();
      }
      const params = new HttpParams()
        .set('page', page.toString())
        .set('perPage', perPage.toString())
        .set('filter', filter);
      this.http.get<NewsPaginate>(this.url + '/GAACT', {params: params}).subscribe(value => {
        this.setNewsPaginate(value);
        observer.next(this.newsPaginateSource.getValue());
        observer.complete();
      });
    });
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(this.url + '/DACT/' + id);
  }

  save(value: News): Observable<{ data: News }> {
    return this.http.post<{ data: News }>(this.url + '/SACT', value);
  }

  update(value: News): Observable<{ data: News }> {
    return this.http.put<{ data: News }>(this.url + '/UACT', value);
  }
}
