import {Component, OnInit} from '@angular/core';
import {SnotifyService} from 'ng-snotify';
import {DeliveryType} from '../../../models/delivery-type';
import {DeliveryTypeService} from '../../../services/delivery-type.service';

@Component({
  selector: 'app-delivery-type',
  templateUrl: './delivery-type.component.html',
  styleUrls: ['./delivery-type.component.css']
})
export class DeliveryTypeComponent implements OnInit {


  deliveryTypes: DeliveryType[];
  displayedColumns: string[] = ['name', 'info', 'actionsColumn'];
  public dataSource: DeliveryType[];
  public editCache = {};
  public addDeliveryType = false;

  constructor(private deliveryTypeService: DeliveryTypeService, private notify: SnotifyService) {
  }

  ngOnInit() {
    this.deliveryTypeService.deliveryType.subscribe(value => {
      this.deliveryTypes = value;
      this.dataSource = this.deliveryTypes;
      this.initEditCache();
    });
  }

  public initEditCache() {
    this.editCache = {};
    this.dataSource.forEach((value, i) => {
      if (!this.editCache[value.id + '']) {
        this.editCache[value.id + ''] = {index: i, edit: false, data: new DeliveryType(value)};
      }
    });
  }

  startEdit(key: string): void {
    this.editCache[key].edit = true;
  }

  cancelEdit(key: string): void {
    if (key === '-1') {
      this.deliveryTypeService.setDeliveryTypes(this.dataSource.filter(value1 => value1.id !== -1));
      this.addDeliveryType = false;
    } else {
      const index = this.editCache[key].index;
      this.editCache[key].data = new DeliveryType(this.dataSource[index]);
      this.editCache[key].edit = false;
    }
  }

  saveEdit(key: string): void {
    const index = this.editCache[key].index;
    if (key === '-1') {
      this.deliveryTypeService.save(this.editCache[key].data).subscribe(value => {
        this.dataSource = this.dataSource.filter(value2 => value2.id !== -1);
        this.dataSource.unshift(value.data);
        this.deliveryTypeService.setDeliveryTypes(this.dataSource);
        this.handleResponse('Success');
      }, error1 => {
        console.log(error1);
        this.handleError('Error');
      });
      this.addDeliveryType = false;
    } else {
      if (!this.isEquivalent(this.dataSource[index], this.editCache[key].data)) {
        this.dataSource[index] = this.editCache[key].data;
        this.deliveryTypeService.update(this.dataSource[index]).subscribe(value => {
          this.handleResponse('Success');
          this.editCache[key].edit = false;
          this.deliveryTypeService.setDeliveryTypes(this.dataSource);
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
            this.deliveryTypeService.delete(id).subscribe(value => {
              this.dataSource = this.dataSource.filter(value1 => value1.id !== id);
              this.deliveryTypeService.setDeliveryTypes(this.dataSource);
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
    this.addDeliveryType = true;
    this.dataSource = [{id: -1, name: '', info: ''}, ...this.dataSource];
    this.initEditCache();
    this.editCache['-1'].edit = true;
    // this.editCache['-1'].data.id = null;
  }

  isEquivalent(a, b) {
    return a.name === b.name && a.info === b.info;
  }

}
