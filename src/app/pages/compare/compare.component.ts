import {Component, OnInit, ViewChild} from '@angular/core';
import {ProductPaginate} from '../../models/Product-paginate';
import {Product} from '../../models/Product';
import {MatPaginator} from '@angular/material';
import {environment} from '../../../environments/environment';
import {AppComponent} from '../../app.component';
import {ActivatedRoute} from '@angular/router';
import {LineOrder} from '../../models/line-order';
import {CompareService} from '../../services/compare.service';
import {TokenService} from '../../services/token.service';
import {ShoppingCartService} from '../../services/shopping-cart.service';
import {Article} from '../../models/article';
import {Socket} from 'ngx-socket-io';

@Component({
  selector: 'app-compare',
  templateUrl: './compare.component.html',
  styleUrls: ['./compare.component.css']
})
export class CompareComponent implements OnInit {
  displayedColumns: string[] = ['Product', 'nom', 'prix', 'availability', 'actionsColumn'];
  public dataSource: Product[] = [];
  ProductPaginate: ProductPaginate;
  url: string = environment.urlServeur2;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private route: ActivatedRoute,
    public appComponent: AppComponent,
    public tokenService: TokenService,
    private socket: Socket,
    private shoppingCartService: ShoppingCartService,
    private compareService: CompareService
  ) {
  }


  ngOnInit() {
    this.socket
      .fromEvent<any>('quantitySetNotification')
      .map(data => data).subscribe(value => {
      let articles: Article[] = [];
      articles = [...JSON.parse(value)];
      console.log(articles);
      console.log(this.ProductPaginate);
      articles.forEach(value0 => {
        const tmp = this.ProductPaginate.data.find(value1 => value1.article.id === value0.id);
        if (tmp) {
          tmp.article.stock = value0.stock;
        }
      });
      this.compareService.setProductPaginator(this.ProductPaginate);

    });
    this.compareService.productPaginator.subscribe(value => {
      this.ProductPaginate = value;
      this.dataSource = value.data;
    });
  }

  deleteAll() {
    this.compareService.clearCompare();
    // this.dataSource.data = [];
  }

  delete(id) {
    this.compareService.removeItemFromCompare(id);
  }

  change(paginator) {

    this.appComponent.load = true;
    if (this.tokenService.loggedIn()) {
      this.compareService.get(true).subscribe(value => {
        // this.compareService.setProductPaginator(value);
        this.appComponent.load = false;
      });
    } else {
      this.compareService.getByListId(
        true,
        paginator.pageIndex + 1,
        paginator.pageSize,
        this.compareService.getCompare()).subscribe(value => {
        // this.compareService.setProductPaginator(value);
        this.appComponent.load = false;
      });
    }
  }

  selectColor(ele: Product, color) {
    if (!ele.lineOrder) {
      ele.lineOrder = new LineOrder();
    }
    // ele.lineOrder.color = color;
  }

  addToShoppingCart(pro: Product) {
    const LC = new LineOrder();
    LC.quantity = 1;
    LC.product_id = pro.id;
    LC.product = pro;
    this.shoppingCartService.addShoppingCart(LC);
  }
}
