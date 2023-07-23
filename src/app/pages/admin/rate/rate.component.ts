import {Component, OnInit} from '@angular/core';
import {DeliveryTypeService} from '../../../services/delivery-type.service';
import {DeliveryType} from '../../../models/delivery-type';
import {SnotifyService} from 'ng-snotify';
import {Rate} from '../../../models/rate';
import {RateService} from '../../../services/rate.service';
import {ActivatedRoute} from '@angular/router';
import {CityService} from '../../../services/city.service';
import {City} from '../../../models/city';

@Component({
  selector: 'app-rate',
  templateUrl: './rate.component.html',
  styleUrls: ['./rate.component.css']
})
export class RateComponent implements OnInit {


  rates: Rate[];
  displayedColumns: string[] = ['name', 'ville', 'actionsColumn'];
  public dataSource: Rate[];
  public cities: City[];
  public deliveryTypes: DeliveryType[];
  public editCache = {};
  public addRate = false;
  deliveryType_id = 0;

  constructor(
    private route: ActivatedRoute,
    private rateService: RateService,
    private cityService: CityService,
    private deliveryTypeService: DeliveryTypeService,
    private notify: SnotifyService) {
  }

  ngOnInit() {
    this.route.data.subscribe((value: { deliveryType_id: number }) => {
      this.deliveryType_id = value.deliveryType_id;
    }, error1 => {
      console.log(error1);
    });

    this.rateService.rates.subscribe(value => {

      this.rates = value ? value : [];
      this.dataSource = value ? value : [];
      this.initEditCache();
    });
    this.cityService.city.subscribe(value => {
      this.cities = value;
    });
    this.deliveryTypeService.deliveryType.subscribe(value => {
      this.deliveryTypes = value;
    });
  }

  onChangeTypeLivraison_id(id) {
    this.deliveryType_id = id;
    this.rateService.get(this.deliveryType_id, true).subscribe(value => {
      this.rates = value ? value : [];
      this.dataSource = value ? value : [];
      this.initEditCache();
    });
  }

  public initEditCache() {
    this.editCache = {};
    this.dataSource.forEach((value, i) => {
      if (!this.editCache[value.id + '']) {
        this.editCache[value.id + ''] = {index: i, edit: false, data: new Rate(value)};
      }
    });
  }

  startEdit(key: string): void {
    this.editCache[key].edit = true;
  }

  cancelEdit(key: string): void {
    if (key === '-1') {
      this.rateService.setRates(this.dataSource.filter(value1 => value1.id !== -1));
      this.addRate = false;
    } else {
      const index = this.editCache[key].index;
      this.editCache[key].data = new Rate(this.dataSource[index]);
      this.editCache[key].edit = false;
    }
  }

  saveEdit(key: string): void {
    const index = this.editCache[key].index;
    if (key === '-1') {
      this.rateService.save(this.editCache[key].data).subscribe(value => {
        this.dataSource = this.dataSource.filter(value2 => value2.id !== -1);
        this.dataSource.unshift(value.data);
        this.rateService.setRates(this.dataSource);
        this.handleResponse('Success');
      }, error1 => {
        console.log(error1);
        this.handleError('Error');
      });
      this.addRate = false;
    } else {
      if (!this.isEquivalent(this.dataSource[index], this.editCache[key].data)) {
        this.dataSource[index] = this.editCache[key].data;
        this.rateService.update(this.dataSource[index]).subscribe(value => {
          this.handleResponse('Success');
          this.editCache[key].edit = false;
          this.rateService.setRates(this.dataSource);
        }, error1 => {
          console.log(error1);
          this.handleError('Error');
        });
      } else {
        this.cancelEdit(key);
      }
    }
  }

  delete(id: number) {
    this.notify.confirm('Sure to delete?', {
      position: 'rightTop',
      timeout: 0,
      closeOnClick: false,
      pauseOnHover: true,
      buttons: [
        {
          text: 'Yes', action: () => {
            this.rateService.delete(id).subscribe(value => {
              this.dataSource = this.dataSource.filter(value1 => value1.id !== id);
              this.rateService.setRates(this.dataSource);
              this.handleResponse('Success');
            }, error1 => {
              this.handleError('Error');
              console.log(error1);
            });
          }, bold: false
        },
        {text: 'No', action: () => this.notify.clear()},
      ]
    });
  }

  private handleResponse(msg: string) {
    this.notify.clear();
    this.notify.success(msg, {position: 'rightTop'});
  }

  private handleError(msg: string) {
    this.notify.clear();
    this.notify.error(msg, {position: 'rightTop'});
    // this.error = error.error.error;
  }

  add() {
    this.addRate = true;
    this.dataSource = [{id: -1, rising: 0, deliveryType_id: this.deliveryType_id, city_id: 0}, ...this.dataSource];
    this.initEditCache();
    this.editCache['-1'].edit = true;
    // this.editCache['-1'].data.id = null;
  }

  isEquivalent(a, b) {
    return a.montant === b.montant && a.ville_id === b.ville_id;
  }

}
