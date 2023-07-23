import {Component, Input, OnInit} from '@angular/core';
import {Address} from '../../../../models/address';
import {Order} from '../../../../models/order';
import {ErrorsNotifService} from '../../../../services/errors-notif.service';
import {SnotifyService} from 'ng-snotify';
import {Observable} from 'rxjs';
import {OrderAdminService} from '../../../../services/order-admin.service';
import {OrderPaginate} from '../../../../models/order-paginate';
import {Sort} from '@angular/material';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {environment} from '../../../../../environments/environment';
import {AuthentificationService} from '../../../../services/authentification.service';
import {Socket} from 'ngx-socket-io';

@Component({
  selector: 'app-new-orders',
  templateUrl: './new-orders.component.html',
  styleUrls: ['./new-orders.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class NewOrdersComponent implements OnInit {

  displayedColumns: string[] = ['Client', 'Date', 'Status', 'PaymentType', 'DeliveryType', 'Total', 'actionsColumn'];

  orders = [];
  orderPaginate: OrderPaginate = new OrderPaginate();
  order: Order;
  public editCache = {};
  rows = [];
  url: string = environment.urlServeur2;
  expandedElement: any;
  @Input() loggedInAdmin: boolean;
  isExpansionDetailRow = (i: number, row: Object) => row.hasOwnProperty('detailRow');


  constructor(
    private notify: SnotifyService,
    private socket: Socket,
    private errorsNotifService: ErrorsNotifService,
    private authenticationService: AuthentificationService,
    private orderAdminService: OrderAdminService) {
  }

  ngOnInit() {
    this.orderAdminService.orderNews.subscribe(value => {
      this.orders = [];
      value.data.forEach(element => this.orders.push(element, {detailRow: true, element}));
      console.log(this.orders);
      value.filterValue = this.orderPaginate.filterValue;
      value.sortDir = this.orderPaginate.sortDir;
      value.sortAct = this.orderPaginate.sortAct;
      this.orderPaginate = value;
    });

    this.authenticationService.authAdminStatus.subscribe(value => {
      if (value) {
        this.socket
          .fromEvent<any>('AdminOrderNotification')
          .map(data => data).subscribe(value2 => {
          this.orderAdminService.getById(value2).subscribe(value1 => {
            this.orderPaginate.data.unshift(value1);
            this.orderAdminService.setOrderNews(this.orderPaginate);
          });
        });
      }
    });
  }

  getFLName(ele: Address[]) {
    const add = ele.find(value => value.type === 'pro');
    return add.LName + ' ' + add.FName;
  }

  change(paginator) {


    this.orderAdminService.getNews(
      this.orderPaginate.filterValue,
      this.orderPaginate.sortDir,
      this.orderPaginate.sortAct,
      true,
      paginator.pageIndex + 1,
      paginator.pageSize).subscribe(value => {

    });

  }

  applyFilter(filterValue: string) {
    this.orderPaginate.filterValue = filterValue;

    this.orderAdminService.getNews(
      this.orderPaginate.filterValue,
      this.orderPaginate.sortDir,
      this.orderPaginate.sortAct,
      true,
      1).subscribe(value => {

    });
  }

  sortData(sort: Sort) {
    this.orderPaginate.sortDir = sort.direction;
    this.orderPaginate.sortAct = sort.active;
    if (sort.direction) {

      this.orderAdminService.getNews(
        this.orderPaginate.filterValue,
        this.orderPaginate.sortDir,
        this.orderPaginate.sortAct,
        true,
        1).subscribe(value => {

      });
    }

  }

  startEdit(element: Order) {
    this.editCache[element.id + ''] = new Order();
    this.editCache[element.id + ''].statut = element.status;
    element.edit = true;
  }

  saveEdit(element: Order) {
    if (this.editCache[element.id + ''].statut === element.status) {
      element.edit = false;
      return 0;
    }
    const successAction = Observable.create(observer => {
      this.orderAdminService.update(element).subscribe(value => {
        element.edit = false;
        observer.next(this.errorsNotifService.handleResponse2('', 'Success'));
        this.orderPaginate.data = this.orderPaginate.data.filter(value1 => element.id !== value1.id);
        this.orderPaginate.total--;
        this.orderAdminService.setOrderNews(this.orderPaginate);
        this.orderAdminService.changeStatus(element);
        observer.complete();
      }, error1 => {
        observer.error(this.errorsNotifService.handleError2('', 'Error'));
      });
    });

    this.errorsNotifService.asyncNotif(successAction);
  }

  cancelEdit(element: Order) {
    element.status = this.editCache[element.id + ''].statut;
    element.edit = false;
  }

  delete(id) {
    this.notify.confirm('Sure to delete?', {
      position: 'rightTop',
      timeout: 0,
      closeOnClick: false,
      pauseOnHover: true,
      buttons: [
        {
          text: 'Yes', action: () => {
            this.orderAdminService.delete(id).subscribe(value => {
              this.orderPaginate.data = this.orderPaginate.data.filter(value1 => id !== value1.id);
              this.orderPaginate.total--;
              this.orderAdminService.setOrderNews(this.orderPaginate);
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

  getAddressPro(address: Address[]): Address {
    return Address.getAddressPro(address);
  }
}
