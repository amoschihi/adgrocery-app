import {Injectable} from '@angular/core';
import {TokenService} from './token.service';
import {environment} from '../../environments/environment';
import {BehaviorSubject, Observable} from 'rxjs';
import {Repository} from '../models/repository';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Product} from '../models/product';
import {headersToString} from 'selenium-webdriver/http';
import {InfoSite} from '../models/info-site';
import {Image} from '../models/image';
import {ProductPaginate} from '../models/product-paginate';
import {CritereRecherche} from '../models/critere-recherche';
import {DataService} from './data.service';
import {LineOrder} from '../models/line-order';

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
    critereRecherche: CritereRecherche = new CritereRecherche()
  ): Observable<ProductPaginate> {
    return new Observable(observer => {
      if (!refresh && this.productPaginatorSource.getValue()) {
        observer.next(this.productPaginatorSource.getValue());
        return observer.complete();
      }
      const params = new HttpParams()
        .set('page', page.toString())
        .set('perPage', perPage.toString())
        .set('categorie_id', critereRecherche.categorie_id ? critereRecherche.categorie_id.toString() : '')
        .set('sousCategorie_id', critereRecherche.sousCategorie_id ? critereRecherche.sousCategorie_id.toString() : '')
        .set('prixFrom', critereRecherche.prixFrom ? critereRecherche.prixFrom.toString() : '')
        .set('prixTo', critereRecherche.prixTo ? critereRecherche.prixTo.toString() : '')
        .set('colors_id', critereRecherche.colors_id ? critereRecherche.colors_id.join(', ') : '')
        .set('matieres_id', critereRecherche.matieres_id ? critereRecherche.matieres_id.join(', ') : '')
        .set('marque_id', critereRecherche.marque_id ? critereRecherche.marque_id.toString() : '');
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

  public getNewArrivale(
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
