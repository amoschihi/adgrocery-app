import {Component, OnInit} from '@angular/core';
import {AddressService} from '../../../../services/address.service';
import {FormControl, Validators} from '@angular/forms';
import {Address} from '../../../../models/address';
import {Router} from '@angular/router';
import {Region} from '../../../../models/region';
import {CityService} from '../../../../services/city.service';
import {TokenService} from '../../../../services/token.service';
import {ErrorsMessagesService} from '../../../../services/errors-messages.service';
import {ErrorsNotifService} from '../../../../services/errors-notif.service';
import {City} from '../../../../models/city';
import {RegionService} from '../../../../services/region.service';
import {UserServicesService} from '../../../../services/user-services.service';
import {ModelErrors} from '../../../../models/model-errors';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-shipping',
  templateUrl: './shipping.component.html',
  styleUrls: ['./shipping.component.css']
})
export class ShippingComponent extends ModelErrors implements OnInit {

  addressPro: Address = new Address();
  regions: Region[];
  cities: City[];
  test = 1;

  constructor(private userService: UserServicesService,
              private tokenService: TokenService,
              private route: Router,
              private regionService: RegionService,
              private cityService: CityService,
              errorsMessagesService: ErrorsMessagesService,
              private addressService: AddressService,
              private errorsNotifService: ErrorsNotifService) {
    super(errorsMessagesService);
  }

  ngOnInit() {
    this.lName = new FormControl('', [Validators.required]);
    this.fName = new FormControl('', [Validators.required]);
    this.phone = new FormControl('', [Validators.required]);
    this.address = new FormControl('', [Validators.required]);
    this.city = new FormControl('', [Validators.required]);
    this.region = new FormControl('', [Validators.required]);

    this.regionService.regions.subscribe(value => {
      this.regions = value;
    });
    this.cityService.city.subscribe(value => {
      this.cities = value;
    });
    this.userService.user.subscribe(value => {
      this.addressPro = value.profile.addresses.find(value1 => value1.type === 'pro');
    });
  }

  public save() {
    const successAction = Observable.create(observer => {
      this.addressService.update(this.addressPro).subscribe(value => {
        observer.next(this.errorsNotifService.handleResponse2('', 'Success'));
        observer.complete();
        // this.errorsNotifService.handleResponse('Success');
      }, error1 => {
        observer.error(this.errorsNotifService.handleError2('', 'Error'));
        // this.errorsNotifService.handleError('Error');
      });
    });

    this.errorsNotifService.asyncNotif(successAction);

  }


}
