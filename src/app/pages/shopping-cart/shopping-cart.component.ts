import {Component, OnInit, ViewChild} from '@angular/core';
import {AppComponent} from '../../app.component';
import {ActivatedRoute, Router} from '@angular/router';
import {LineOrder} from '../../models/line-order';
import {ProductService} from '../../services/product.service';
import {MatPaginator, MatTableDataSource} from '@angular/material';
import {environment} from '../../../environments/environment';
import {ShoppingCartService} from '../../services/shopping-cart.service';
import {AuthentificationService} from '../../services/authentification.service';
import {Order} from '../../models/order';
import {CheckoutService} from '../../services/checkout.service';
import {Article} from '../../models/article';
import {Socket} from 'ngx-socket-io';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {

  displayedColumns: string[] = ['product', 'nom', 'price', 'Quantity', 'subTotal', 'actionsColumn'];
  public dataSource = new MatTableDataSource<LineOrder>([]);
  url: string = environment.urlServeur2;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  login = false;
  order: Order = new Order();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private socket: Socket,
    public appComponent: AppComponent,
    private productService: ProductService,
    private checkoutService: CheckoutService,
    private authenticationService: AuthentificationService,
    private shoppingCartService: ShoppingCartService) {
  }


  ngOnInit() {
    this.socket
      .fromEvent<any>('quantitySetNotification')
      .map(data => data).subscribe(value => {
      let articles: Article[] = [];
      articles = [...JSON.parse(value)];

      articles.forEach(value0 => {
        const tmp = this.dataSource.data.find(value1 => value1.product.article.id === value0.id);
        if (tmp) {
          tmp.product.article.stock = value0.stock;
        }
      });
      this.shoppingCartService.setProductPaginator(this.dataSource.data);

    });
    this.shoppingCartService.productPaginator.subscribe(value => {
      this.dataSource.data = value;
    });
    this.authenticationService.authStatus.subscribe(value => this.login = value);
  }

  deleteAll() {
    this.shoppingCartService.clearShoppingCart();
  }

  delete(LC: LineOrder) {
    this.shoppingCartService.removeItemFromShoppingCart(LC);
  }

  removeQu(ele: LineOrder) {
    if (ele.quantity > 1) {
      ele.quantity--;
      this.shoppingCartService.removeQuantityShoppingCart(ele);
    }
  }


  addQu(ele: LineOrder) {
    if (ele.quantity < ele.product.article.stock) {
      ele.quantity++;
      this.shoppingCartService.addQuantityShoppingCart(ele);
    }
  }

  getTotal(): number {
    this.order.total = this.dataSource.data
      .map(value => (!value.product.discount) ?
        value.product.price * value.quantity :
        (value.product.price - value.product.price * (value.product.discount.percentageValue / 100)) * value.quantity)
      .reduce((previousValue, currentValue) => previousValue + currentValue);
    return this.order.total;
  }

  getTVA(): number {
    return this.dataSource.data
      .map(value => (value.product.vat) ? value.product.vat * value.quantity : 0)
      .reduce((previousValue, currentValue) => previousValue + currentValue);
  }

  calcSubTotal(element: LineOrder) {
    element.subTotal = element.product.price * element.quantity;
    return element.subTotal;
  }

  calcSubTotalWithReduction(element: LineOrder) {
    element.subTotal = (element.product.price - element.product.price *
      (element.product.discount.percentageValue / 100)) * element.quantity;
    return element.subTotal;
  }

  getLineOrder(): LineOrder[] {

    return this.dataSource.data.map(value => {
      const ele = new LineOrder();
      ele.id = value.id;
      ele.quantity = value.quantity;
      ele.subTotal = value.subTotal;
      ele.product_id = value.product_id;
      if (value.product.article.stock <= 0) {
        ele.quantity = 0;
      }
      return ele;
    });
  }

  checkOut() {
    this.order.lineOrders = this.getLineOrder();
    this.checkoutService.setOrder(this.order);
    this.router.navigate(['/main/checkout']);
  }
}
