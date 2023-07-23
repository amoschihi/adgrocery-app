import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {NewsService} from '../news.service';

@Injectable({
  providedIn: 'root'
})
export class NewsListResolverService implements Resolve<boolean> {

  constructor(private newsService: NewsService, private router: Router) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return new Observable(subscriber => {
      this.newsService.getAll('').subscribe(value => {
        subscriber.next(true);
        subscriber.complete();
      }, error1 => {
        this.router.navigate(['/main/admin/news']);
        subscriber.error(false);
      });
    });
  }
}
