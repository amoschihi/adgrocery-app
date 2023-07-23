import {Component, OnInit} from '@angular/core';
import {Order} from '../../../models/order';
import {OrderPaginate} from '../../../models/order-paginate';
import {OrderAdminService} from '../../../services/order-admin.service';
import {AuthentificationService} from '../../../services/authentification.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {

  NewOrderPaginate: OrderPaginate = new OrderPaginate();
  ShippedOrderPaginate: OrderPaginate = new OrderPaginate();
  DeliveredOrderPaginate: OrderPaginate = new OrderPaginate();
  ClosedOrderPaginate: OrderPaginate = new OrderPaginate();
  order: Order;
  load = false;
  public editCache = {};
  loggedInAdmin: boolean;

  constructor(
      private orderAdminService: OrderAdminService, private authService: AuthentificationService) {
  }

  ngOnInit() {
    this.orderAdminService.load.subscribe(value => this.load = value);
    this.orderAdminService.ordersDelivered.subscribe(value => {
      this.DeliveredOrderPaginate = value;
    });
    this.orderAdminService.orderNews.subscribe(value => {
      this.NewOrderPaginate = value;
    });
    this.orderAdminService.ordersShipped.subscribe(value => {
      this.ShippedOrderPaginate = value;
    });
    this.orderAdminService.ordersClosed.subscribe(value => {
      this.ClosedOrderPaginate = value;
    });
    this.authService.authAdminStatus.subscribe(next => {
      this.loggedInAdmin = next;
    });
  }

  slectTab(value) {
    switch (value) {
      case 0:
        this.orderAdminService.getNews().subscribe(value2 => {
        });
        break;
      case 1:
        this.orderAdminService.getShipped().subscribe(value2 => {
        });
        break;
      case 2:
        this.orderAdminService.getDelivered().subscribe(value2 => {
        });
        break;
      case 3:
        this.orderAdminService.getClosed().subscribe(value2 => {
        });
        break;
    }
  }

}
