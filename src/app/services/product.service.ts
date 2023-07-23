import {Injectable} from '@angular/core';
import {TokenService} from './token.service';
import {environment} from '../../environments/environment';
import {BehaviorSubject, Observable} from 'rxjs';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Product} from '../models/product';
import {Image} from '../models/image';
import {ProductPaginate} from '../models/product-paginate';
import {SearchCriteria} from '../models/search-criteria';
import {DataService} from './data.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private url = environment.urlServeur;

  productNewArrivale: ProductPaginate;
  productOnSale: ProductPaginate;

  private productPaginatorSource = new BehaviorSubject<ProductPaginate>(null);
  productPaginator = this.productPaginatorSource.asObservable();

  private productPaginatorSourceAdmin = new BehaviorSubject<ProductPaginate>(null);
  productPaginatorAdmin = this.productPaginatorSourceAdmin.asObservable();

  private loadSource = new BehaviorSubject<boolean>(false);
  load = this.loadSource.asObservable();


  setLoad(data: boolean) {
    this.loadSource.next(data);
  }

  setProductPaginatorAdmin(data: ProductPaginate) {
    this.productPaginatorSourceAdmin.next(data);
  }

  setProductPaginator(data: ProductPaginate) {
    this.productPaginatorSource.next(data);
  }

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
    private dataService: DataService,
  ) {
  }


  public getById(id: number): Observable<Product> {
    return this.http.get<Product>(this.url + '/GAPRODBID/' + id);
  }


  public get(
    refresh: boolean = false,
    page = 1,
    perPage = 12,
    searchCriteria: SearchCriteria = new SearchCriteria()
  ): Observable<ProductPaginate> {
    return new Observable(observer => {
      if (!refresh && this.productPaginatorSource.getValue()) {
        observer.next(this.productPaginatorSource.getValue());
        return observer.complete();
      }
      const params = new HttpParams()
        .set('page', page.toString())
        .set('perPage', perPage.toString())
        .set('category_id', searchCriteria.category_id ? searchCriteria.category_id.toString() : '')
        .set('subCategory_id', searchCriteria.subCategory_id ? searchCriteria.subCategory_id.toString() : '')
        .set('priceFrom', searchCriteria.priceFrom ? searchCriteria.priceFrom.toString() : '')
        .set('priceTo', searchCriteria.priceTo ? searchCriteria.priceTo.toString() : '')
        .set('colors_id', searchCriteria.colors_id ? searchCriteria.colors_id.join(', ') : '')
        .set('materials_id', searchCriteria.materials_id ? searchCriteria.materials_id.join(', ') : '')
        .set('brand_id', searchCriteria.brand_id ? searchCriteria.brand_id.toString() : '');
      this.http.get<ProductPaginate>(this.url + '/GAPROD', {params: params}).subscribe(value => {
        this.productPaginatorSource.next(value);
        observer.next(this.productPaginatorSource.getValue());
        observer.complete();
      });
    });
  }

  public getByName(
    name: string,
    refresh: boolean = false,
    page = 1,
    perPage = 12): Observable<ProductPaginate> {
    return new Observable(observer => {
      if (!refresh && this.productPaginatorSourceAdmin.getValue()) {
        observer.next(this.productPaginatorSourceAdmin.getValue());
        return observer.complete();
      }
      const params = new HttpParams()
        .set('page', page.toString())
        .set('perPage', perPage.toString())
        .set('name', name);
      this.http.get<ProductPaginate>(this.url + '/GAPRODBN', {params: params}).subscribe(value => {
        this.productPaginatorSourceAdmin.next(value);
        observer.next(this.productPaginatorSourceAdmin.getValue());
        observer.complete();
      });
    });
  }

  public getNewArrival(
    page = 1,
    perPage = 6, refresh = false, url: string = this.url + '/GAPRODNA?page=' + page): Observable<ProductPaginate> {
    return new Observable(observer => {
      if (!refresh && this.productNewArrivale) {
        observer.next(this.productNewArrivale);
        return observer.complete();
      }
      this.loadSource.next(true);
      this.http.get<ProductPaginate>(url + '&perPage=' + perPage).subscribe(value => {
        this.productNewArrivale = value;
        this.loadSource.next(false);
        observer.next(this.productNewArrivale);
        observer.complete();
      });
    });
  }

  public getOnSale(
    page = 1,
    perPage = 6, refresh = false, url: string = this.url + '/GAPRODOS?page=' + page): Observable<ProductPaginate> {
    return new Observable(observer => {
      if (!refresh && this.productOnSale) {
        observer.next(this.productOnSale);
        return observer.complete();
      }
      this.loadSource.next(true);
      this.http.get<ProductPaginate>(url + '&perPage=' + perPage).subscribe(value => {
        this.productOnSale = value;
        this.loadSource.next(false);
        observer.next(this.productOnSale);
        observer.complete();
      });
    });
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(this.url + '/DPROD/' + id);
  }

  deleteImage(image: Image): Observable<any> {
    return this.http.delete<any>(this.url + '/DIPROD/' + image.id + '/' + image.name);
  }

  save(value: Product): Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    return this.http.post<any>(this.url + '/SPROD', value, {headers: headers});
  }

  update(value: Product): Observable<any> {
    return this.http.put<any>(this.url + '/UPROD', value);
  }

}
