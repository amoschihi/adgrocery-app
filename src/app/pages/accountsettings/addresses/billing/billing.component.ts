import {Component, OnInit} from '@angular/core';
import {ModelErrors} from '../../../../models/model-errors';
import {Router} from '@angular/router';
import {UserServicesService} from '../../../../services/user-services.service';
import {TokenService} from '../../../../services/token.service';
import {ErrorsMessagesService} from '../../../../services/errors-messages.service';
import {FormControl, Validators} from '@angular/forms';
import {RegionService} from '../../../../services/region.service';
import {Region} from '../../../../models/region';
import {City} from '../../../../models/city';
import {CityService} from '../../../../services/city.service';
import {Address} from '../../../../models/address';
import {AddressService} from '../../../../services/address.service';
import {ErrorsNotifService} from '../../../../services/errors-notif.service';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.css']
})
export class BillingComponent extends ModelErrors implements OnInit {

  addressePer: Address = new Address();
  regions: Region[];
  cities: City[];
  test = 1;

  constructor(private userService: UserServicesService,
              private tokenService: TokenService,
              private route: Router,
              private regionService: RegionService,
              private villeService: CityService,
              private adresseService: AddressService,
              private errorsNotifService: ErrorsNotifService,
              errorsMessagesService: ErrorsMessagesService) {
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
    this.villeService.city.subscribe(value => this.cities = value);

    this.userService.user.subscribe(value => {
      this.addressePer = value.profile.addresses.find(value1 => value1.type === 'per');
    });
  }

  public save() {
    const successAction = Observable.create(observer => {
      this.adresseService.update(this.addressePer).subscribe(() => {
        observer.next(this.errorsNotifService.handleResponse2('', 'Success'));
        observer.complete();
      }, () => {
        observer.error(this.errorsNotifService.handleError2('', 'Error'));
      });
    });

    this.errorsNotifService.asyncNotif(successAction);
  }


}
