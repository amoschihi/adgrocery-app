import {Component, OnInit} from '@angular/core';
import {News} from '../../../../models/news';
import {NewsPaginate} from '../../../../models/news-paginate';
import {NewsService} from '../../../../services/news.service';
import {AppComponent} from '../../../../app.component';
import {SnotifyService} from 'ng-snotify';
import {TokenService} from '../../../../services/token.service';
import {ErrorsNotifService} from '../../../../services/errors-notif.service';
import {environment} from '../../../../../environments/environment';

@Component({
  selector: 'app-list-news',
  templateUrl: './news-list.component.html',
  styleUrls: ['./news-list.component.css']
})
export class NewsListComponent implements OnInit {

  displayedColumns: string[] = ['image', 'Title', 'Subtitle', 'active', 'actionsColumn'];
  news: News[] = [];
  newsPaginate: NewsPaginate = new NewsPaginate();
  url: string = environment.urlServeur2;

  constructor(
    private newsService: NewsService,
    private notify: SnotifyService,
    private errorsNotifService: ErrorsNotifService,
    public appComponent: AppComponent,
    private tokenService: TokenService
  ) {
  }

  ngOnInit() {
    this.newsService.newsPaginates.subscribe(value => {
      this.news = value.data;
      this.newsPaginate = value;
    });
  }

  delete(id: number) {
    console.log(id);
    this.notify.confirm('Sure to delete?', {
      position: 'rightTop',
      timeout: 0,
      closeOnClick: false,
      pauseOnHover: true,
      buttons: [
        {
          text: 'Yes', action: () => {
            this.newsService.delete(id).subscribe(value => {
              console.log(value);
              this.newsService.removeNewsPaginate(id);
              this.newsService.removeNews(id);
              this.errorsNotifService.handleResponse('Success');
            }, error1 => {
              this.errorsNotifService.handleError('Error');
              console.log(error1);
            });
          }, bold: false
        },
        {text: 'No', action: () => this.notify.clear()},
      ]
    });
  }

  change(paginator) {

    this.appComponent.load = true;
    this.newsService.getAll('', true, paginator.pageIndex + 1, paginator.pageSize).subscribe(value => {
      this.appComponent.load = false;
    });

  }

  search(data) {
    this.newsService.getAll(data, true).subscribe(value => {
    });
  }
}
