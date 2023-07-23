import {Component, OnInit} from '@angular/core';
import {NewsService} from '../../../../services/news.service';
import {Observable} from 'rxjs';
import {News} from '../../../../models/news';
import {SnotifyService} from 'ng-snotify';
import {Image} from '../../../../models/image';
import {ErrorsNotifService} from '../../../../services/errors-notif.service';
import {ErrorsMessagesService} from '../../../../services/errors-messages.service';
import {FormControl, Validators} from '@angular/forms';
import {ModelErrors} from '../../../../models/model-errors';
import {ActivatedRoute, Router} from '@angular/router';
import {environment} from '../../../../../environments/environment';

@Component({
  selector: 'app-update-news',
  templateUrl: './update-news.component.html',
  styleUrls: ['./update-news.component.css']
})
export class UpdateNewsComponent extends ModelErrors implements OnInit {
  news: News = new News();
  nbFile = 0;
  url: string = environment.urlServeur2;

  constructor(private newsService: NewsService,
              private notify: SnotifyService,
              private errorsNotifService: ErrorsNotifService,
              private route: ActivatedRoute,
              errorsMessagesService: ErrorsMessagesService) {
    super(errorsMessagesService);
  }

  ngOnInit() {
    this.route.data.subscribe((value: { news: News }) => {
      this.news = value.news;
    }, error1 => {
      console.log(error1);
    });
    this.name = new FormControl('', [Validators.required]);

  }

  OnChimages(images: any) {
    console.log(images.files[0]);
    const file = images.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const Im = new Image();
      Im.name = file.name;
      Im.type = file.type;
      Im.value = reader.result.split(',')[1];
      Im.src = reader.result;
      this.news.image = Im;
    };

  }

  save(myform: any) {
    const successAction = Observable.create(observer => {
      this.newsService.update(this.news).subscribe(value => {
        console.log(value);
        if (value.data.active) {
          this.newsService.removeNewsPaginate(value.data.id);
          this.newsService.removeNews(value.data.id);
          this.newsService.addNews(value.data);
          this.newsService.addNewsPaginate(value.data);
        } else {
          this.newsService.removeNewsPaginate(value.data.id);
          this.newsService.addNewsPaginate(value.data);
        }
        observer.next(this.errorsNotifService.handleResponse2('', 'Success'));
        this.nbFile = 0;
        // myform.reset();
        observer.complete();
      }, error1 => {
        console.log(error1);
        observer.error(this.errorsNotifService.handleError2('', 'Error'));
      });
    });

    this.errorsNotifService.asyncNotif(successAction);
  }

  remove(): void {
    this.news.image = null;
  }
}
