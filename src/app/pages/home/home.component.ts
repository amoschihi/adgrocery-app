import {Component, OnInit} from '@angular/core';
import {SwiperConfigInterface} from 'ngx-swiper-wrapper';
import {NewsService} from '../../services/news.service';
import {News} from '../../models/news';
import {environment} from '../../../environments/environment';
import {ProductService} from '../../services/product.service';
import {Socket} from 'ngx-socket-io';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public config: SwiperConfigInterface = {
    slidesPerView: 1,
    freeMode: true,
    loop: true,
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
      stopOnLastSlide: false
    },
    speed: 300,
    navigation: true,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    effect: 'fade',
  };

  index;
  actualies: News[];
  url: string = environment.urlServeur2;

  constructor(private newsService: NewsService,
              private socket: Socket,
              private productService: ProductService
  ) {
  }

  ngOnInit() {
    this.socket.emit('quantitySetNotification', JSON.stringify([]));
    this.socket.emit('setWishlist', JSON.stringify([]));

    this.newsService.news.subscribe(value => {
      this.actualies = value;
    });
  }


}
