import {Component, OnInit, ViewChild} from '@angular/core';
import {Product} from '../../models/product';
import {environment} from '../../../environments/environment';
import {ProductPaginate} from '../../models/product-paginate';
import {ActivatedRoute} from '@angular/router';
import {MatPaginator, MatTableDataSource} from '@angular/material';
import {AppComponent} from '../../app.component';
import {LineOrder} from '../../models/line-order';
import {TokenService} from '../../services/token.service';
import {WishlistService} from '../../services/wishlist.service';
import {ShoppingCartService} from '../../services/shopping-cart.service';
import {Socket} from 'ngx-socket-io';
import {Article} from '../../models/article';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {
  displayedColumns: string[] = ['product', 'nom', 'price', 'availability', 'Quantity', 'actionsColumn'];
  public dataSource = new MatTableDataSource<Product>([]);
  productPaginate: ProductPaginate;
  url: string = environment.urlServeur2;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  listQuantity: { [id: string]: number; } = {};

  constructor(
    private route: ActivatedRoute,
    private wishlistService: WishlistService,
    private socket: Socket,
    private shoppingCartService: ShoppingCartService,
    public appComponent: AppComponent,
    private tokenService: TokenService) {
  }


  ngOnInit() {

    this.socket
      .fromEvent<any>('setWishlist/u1')
      .map(data => data).subscribe(value => {
      console.log('u1 : ', value);
    });
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
      this.wishlistService.setProductPaginator(this.productPaginate);

    });
    /* const productPaginate = this.productPaginate;
     this.socket.on('quantitySetNotification', function (msg) {
       let articles: Article[] = [];
       articles = [...JSON.parse(msg)];
       console.log(articles);
       console.log(productPaginate);
       /!* articles.forEach(value => {
          const tmp = this.productPaginate.data.find(value1 => value1.article.id = value.id);
          if (tmp) {
            tmp.article.stock = value.stock;
          }
        });
        this.wishlistService.setproduitPaginator(this.productPaginate);*!/
     });*/
    this.wishlistService.productPaginator.subscribe(value => {
      this.productPaginate = value;
      this.dataSource.data = value.data;
    });
  }

  deleteAll() {
    this.wishlistService.clearWishlist();
    // this.dataSource.data = [];
  }

  delete(id) {
    this.wishlistService.removeItemFromWishlist(id);
  }

  change(paginator) {

    this.appComponent.load = true;
    if (this.tokenService.loggedIn()) {
      this.wishlistService.get(true).subscribe(value => {
        // this.wishlistService.setproduitPaginator(value);
        this.appComponent.load = false;
      });
    } else {
      this.wishlistService.getByListId(
        true,
        paginator.pageIndex + 1,
        paginator.pageSize,
        this.wishlistService.getWishlist()).subscribe(value => {
        // this.wishlistService.setproduitPaginator(value);
        this.appComponent.load = false;
      });
    }
  }

  removeQu(ele: Product) {
    if (!ele.lineOrder) {
      ele.lineOrder = new LineOrder();
      ele.lineOrder.quantity = 1;
    }
    if (ele.lineOrder.quantity > 1) {
      ele.lineOrder.quantity--;
    }
  }


  addQu(ele: Product) {
    if (!ele.lineOrder) {
      ele.lineOrder = new LineOrder();
      ele.lineOrder.quantity = 1;
    }
    if (ele.lineOrder.quantity < ele.article.stock) {
      ele.lineOrder.quantity++;
    }
  }

  addToShoppingCart(pro: Product) {
    const LC = new LineOrder();
    if (pro.lineOrder) {
      LC.quantity = pro.lineOrder.quantity;
      pro.lineOrder = null;
    } else {
      LC.quantity = 1;
    }
    LC.product_id = pro.id;
    LC.product = pro;
    this.shoppingCartService.addShoppingCart(LC);
    pro.lineOrder = new LineOrder();
    pro.lineOrder.quantity = 0;
  }
}
