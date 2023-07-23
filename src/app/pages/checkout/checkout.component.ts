import {Component, OnChanges, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Address} from '../../models/address';
import {RegionService} from '../../services/region.service';
import {ActivatedRoute, Router} from '@angular/router';
import {UserServicesService} from '../../services/user-services.service';
import {CityService} from '../../services/city.service';
import {Region} from '../../models/region';
import {City} from '../../models/city';
import {CheckoutService} from '../../services/checkout.service';
import {Order} from '../../models/order';
import {DeliveryType} from '../../models/delivery-type';
import {DeliveryTypeService} from '../../services/delivery-type.service';
import {RateService} from '../../services/rate.service';
import {Rate} from '../../models/rate';
import {Delivery} from '../../models/delivery';
import {Payment} from '../../models/payment';
import {OrderService} from '../../services/order.service';
import {AddressService} from '../../services/address.service';
import {ShoppingCartService} from '../../services/shopping-cart.service';
import {WishlistService} from '../../services/wishlist.service';
import {CompareService} from '../../services/compare.service';
import {Socket} from 'ngx-socket-io';
import {PayPalConfig, PayPalEnvironment, PayPalIntegrationType} from 'ngx-paypal';
import {PaymentTypeEnum} from '../../models/payment-type.enum';
import {StatusEnums} from '../../models/status.enums';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit, OnChanges {
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  address: Address = new Address();
  regions: Region[];
  cities: City[];
  order: Order;
  deliveryType: DeliveryType[];
  deliveryType_id: number;
  rate: Rate;
  paymentType = 0;
  orderValid = false;
  load = false;
  public payPalConfig?: PayPalConfig;

  constructor(private formBuilder: FormBuilder,
              private userService: UserServicesService,
              private checkoutService: CheckoutService,
              private orderService: OrderService,
              private socket: Socket,
              private route: ActivatedRoute,
              private router: Router,
              private addressService: AddressService,
              private deliveryTypeService: DeliveryTypeService,
              private rateService: RateService,
              private regionService: RegionService,
              private wishlistService: WishlistService,
              private compareService: CompareService,
              private shoppingCartService: ShoppingCartService,
              private cityService: CityService) {
  }


  ngOnChanges(): void {

  }

  ngOnInit() {
    this.payPalConfig = new PayPalConfig(PayPalIntegrationType.ClientSideREST, PayPalEnvironment.Sandbox, {
      commit: true,
      client: {
        sandbox: 'AbI4yMNwcUg9bMnX3C6-cGiZiGKHdECsCGDOqt8DczcOQCnpeP1q8b4jRwLIO7FSY_MoK4plfSjhESwT'
      },
      button: {
        label: 'paypal',
      },
      onPaymentComplete: (data, actions) => {
        console.log('OnPaymentComplete O');
      },
      onCancel: (data, actions) => {
        console.log('OnCancel');
      },
      onError: (err) => {
        console.log('OnError');
      },
      transactions: [{
        amount: {
          currency: 'USD',
          total: 0
        }
      }]
    });
    this.checkoutService.order.subscribe(value => this.order = value);

    this.regionService.regions.subscribe(value => {
      this.regions = value;
    });
    this.deliveryTypeService.deliveryType.subscribe(value => {
      this.deliveryType = value;
    });
    this.cityService.city.subscribe(value => {
      this.cities = value;
    });
    this.userService.user.subscribe(value => {
      this.address = value.profile.addresses.find(value1 => value1.type === 'pro');
    });
    this.firstFormGroup = this.formBuilder.group({
      fName: [this.address.FName, Validators.required],
      lName: [this.address.LName, Validators.required],
      phone: [this.address.phone, Validators.required],
      address: [this.address.address, Validators.required],
      info: [this.address.info],
      Region: [this.address.region_id, Validators.required],
      ville: [this.address.city_id, Validators.required],
    });

    /*  this.firstFormGroup = new FormGroup({
      fName: new FormControl(this.address.FName, Validators.required),
      lName: new FormControl(this.address.LName, Validators.required),
      phone: new FormControl(this.address.phone, Validators.required),
      address: new FormControl(this.address.address, Validators.required),
      info: new FormControl(this.address.info),
      Region: new FormControl(this.address.region_id, Validators.required),
      city: new FormControl(this.address.ville_id, Validators.required),
    });*/
    this.secondFormGroup = this.formBuilder.group({
      typeL: ['', Validators.required]
    });
    this.thirdFormGroup = this.formBuilder.group({
      typeP: [this.paymentType, Validators.required]
    });
  }

  paypal() {
    this.payPalConfig = new PayPalConfig(PayPalIntegrationType.ClientSideREST, PayPalEnvironment.Sandbox, {
      commit: true,
      client: {
        sandbox: 'AbI4yMNwcUg9bMnX3C6-cGiZiGKHdECsCGDOqt8DczcOQCnpeP1q8b4jRwLIO7FSY_MoK4plfSjhESwT'
      },
      button: {
        label: 'paypal',
      },
      onPaymentComplete: (data, actions) => {
        console.log('OnPaymentComplete O');
      },
      onCancel: (data, actions) => {
        console.log('OnCancel');
      },
      onError: (err) => {
        console.log('OnError');
      },
      transactions: [{
        amount: {
          currency: 'USD',
          total: 1
        }
      }]
    });
  }

  cash() {
    const order = new Order();
    const delivery = new Delivery();
    delivery.deliveryType_id = this.deliveryType_id;
    const payment = new Payment();
    payment.type = PaymentTypeEnum.cash;
    order.total = this.order.total + this.rate.rising;
    order.status = StatusEnums.new;
    order.lineOrders = this.order.lineOrders;
    order.delivery = delivery;
    order.payment = payment;
    console.log(order, this.rate);
    this.load = true;
    this.addressService.update(this.address).subscribe(value => {
      this.orderService.save(order).subscribe(value2 => {
        this.orderValid = true;
        this.load = false;
        this.shoppingCartService.setProductPaginator([]);
        this.wishlistService.wishListIsModified = true;
        this.compareService.compareIsModified = true;
        this.checkoutService.setOrder(null);
        this.socket.emit('quantitySetNotification', JSON.stringify(value2.articles));
        this.socket.emit('AdminOrderNotification', JSON.stringify(value2.idCmd));
        console.log(value2);
      }, error1 => {
        console.log(error1);
      });
    });
  }


  changeTL(id) {
    console.log(this.address);
    this.deliveryType_id = id;
    this.rateService.get2(id, this.address.city_id).subscribe(value => {
      this.rate = value;
    });
  }

}
