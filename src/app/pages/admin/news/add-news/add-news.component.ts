import {Component, OnInit} from '@angular/core';
import {News} from '../../../../models/news';
import {FormControl, Validators} from '@angular/forms';
import {ModelErrors} from '../../../../models/model-errors';
import {ErrorsMessagesService} from '../../../../services/errors-messages.service';
import {Observable} from 'rxjs';
import {Image} from '../../../../models/image';
import {NewsService} from '../../../../services/news.service';
import {ErrorsNotifService} from '../../../../services/errors-notif.service';
import {SnotifyService} from 'ng-snotify';

@Component({
  selector: 'app-add-news',
  templateUrl: './add-news.component.html',
  styleUrls: ['./add-news.component.css']
})
export class AddNewsComponent extends ModelErrors implements OnInit {
  news: News = new News();
  nbFile = 0;

  constructor(private newsService: NewsService,
              private notify: SnotifyService,
              private errorsNotifService: ErrorsNotifService,
              errorsMessagesService: ErrorsMessagesService) {
    super(errorsMessagesService);
  }

  ngOnInit() {
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
      this.newsService.save(this.news).subscribe(value => {
        if (value.data.active) {
          this.newsService.addNews(value.data);
          this.newsService.addNewsPaginate(value.data);
        } else {
          this.newsService.addNewsPaginate(value.data);
        }
        observer.next(this.errorsNotifService.handleResponse2('', 'Success'));
        // this.ProductService.get(true);
        this.news = new News();
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
