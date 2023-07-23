import {Component, OnInit} from '@angular/core';
import {SnotifyService} from 'ng-snotify';
import {ErrorsNotifService} from '../../../../services/errors-notif.service';
import {ProductPaginate} from '../../../../models/product-paginate';
import {Product} from '../../../../models/product';
import {TokenService} from '../../../../services/token.service';
import {AppComponent} from '../../../../app.component';
import {environment} from '../../../../../environments/environment';
import {Article} from '../../../../models/article';
import {Socket} from 'ngx-socket-io';
import {ProductService} from '../../../../services/product.service';

@Component({
  selector: 'app-list-products',
  templateUrl: './list-products.component.html',
  styleUrls: ['./list-products.component.css']
})
export class ListProductsComponent implements OnInit {
  displayedColumns: string[] = ['product', 'nom', 'price', 'quantity', 'actionsColumn'];
  products: Product[] = [];
  productPaginate: ProductPaginate = new ProductPaginate();
  url: string = environment.urlServeur2;

  constructor(
    private serviceProduct: ProductService,
    private notify: SnotifyService,
    private socket: Socket,
    private errorsNotifService: ErrorsNotifService,
    public appComponent: AppComponent,
    private tokenService: TokenService
  ) {
  }

  ngOnInit() {
    this.socket
      .fromEvent<any>('quantitySetNotification')
      .map(data => data).subscribe(value => {
      let articles: Article[] = [];
      articles = [...JSON.parse(value)];
      console.log(articles);
      console.log(this.productPaginate);
      articles.forEach(value0 => {
        const tmp = this.productPaginate.data.find(value1 => value1.article.id === value0.id);
        if (tmp) {
          tmp.article.stock = value0.stock;
        }
      });
      this.serviceProduct.setProductPaginatorAdmin(this.productPaginate);

    });
    this.serviceProduct.productPaginatorAdmin.subscribe(value => {
      this.products = value.data;
      this.productPaginate = value;
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
            this.serviceProduct.delete(id).subscribe(value => {
              console.log(value);
              this.serviceProduct.getByName('', true).subscribe(value2 => {
                this.errorsNotifService.handleResponse('Success');
              });
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
    this.serviceProduct.getByName('', true, paginator.pageIndex + 1, paginator.pageSize).subscribe(value => {
      this.appComponent.load = false;
    });

  }

  search(data) {
    this.serviceProduct.getByName(data, true).subscribe(value => {
    });
  }
}
