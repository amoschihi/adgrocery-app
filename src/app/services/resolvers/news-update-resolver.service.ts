import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {News} from '../../models/news';
import {NewsService} from '../news.service';

@Injectable({
  providedIn: 'root'
})
export class NewsUpdateResolverService implements Resolve<News> {

  constructor(private newsService: NewsService, private router: Router) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<News> | Promise<News> | News {
    const id = route.paramMap.get('id');
    return new Observable(subscriber => {
      this.newsService.newsPaginates.subscribe(value => {
        if (value) {
          const res = value.data.find(value1 => value1.id === parseFloat(id));
          subscriber.next(res);
          subscriber.complete();
        } else {
          this.router.navigate(['/main/admin/news']);
          subscriber.error(null);
        }
      });
    });
  }
}
