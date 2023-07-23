import {Component, OnInit} from '@angular/core';
import {City} from '../../../models/city';
import {SnotifyService} from 'ng-snotify';
import {CityService} from '../../../services/city.service';

@Component({
  selector: 'app-city',
  templateUrl: './city.component.html',
  styleUrls: ['./city.component.css']
})
export class CityComponent implements OnInit {
  cities: City[];
  displayedColumns: string[] = ['name', 'actionsColumn'];
  public dataSource: City[];
  public editCache = {};
  public addCity = false;

  constructor(private cityService: CityService, private notify: SnotifyService) {
  }

  ngOnInit() {
    this.cityService.city.subscribe(value => {
      this.cities = value;
      this.dataSource = this.cities;
      this.initEditCache();
    });
  }

  public initEditCache() {
    this.editCache = {};
    this.dataSource.forEach((value, i) => {
      if (!this.editCache[value.id + '']) {
        this.editCache[value.id + ''] = {index: i, edit: false, data: new City(value)};
      }
    });
  }

  startEdit(key: string): void {
    this.editCache[key].edit = true;
  }

  cancelEdit(key: string): void {
    if (key === '-1') {
      this.cityService.setCities(this.dataSource.filter(value1 => value1.id !== -1));
      this.addCity = false;
    } else {
      const index = this.editCache[key].index;
      this.editCache[key].data = new City(this.dataSource[index]);
      this.editCache[key].edit = false;
    }
  }

  saveEdit(key: string): void {
    const index = this.editCache[key].index;
    if (key === '-1') {
      /*this.dataSource[index] = this.editCache[key].data;*/
      this.cityService.save(this.editCache[key].data).subscribe(value => {
        this.dataSource = this.dataSource.filter(value2 => value2.id !== -1);
        this.dataSource.unshift(value.data);
        this.cityService.setCities(this.dataSource);
        this.handleResponse('Success');

      }, error1 => {
        console.log(error1);
        this.handleError('Error');
      });
      this.addCity = false;
    } else {
      if (!this.isEquivalent(this.dataSource[index], this.editCache[key].data)) {
        this.dataSource[index] = this.editCache[key].data;
        this.cityService.update(this.dataSource[index]).subscribe(value => {
          this.handleResponse('Success');
          this.editCache[key].edit = false;
          this.cityService.get(true);
        }, error1 => {
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
            this.cityService.delete(id).subscribe(value => {
              this.dataSource = this.dataSource.filter(value1 => value1.id !== id);
              this.cityService.setCities(this.dataSource);
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
    this.addCity = true;
    this.dataSource = [{id: -1, name: '', api_token: ''}, ...this.dataSource];
    this.initEditCache();
    this.editCache['-1'].edit = true;
    // this.editCache['-1'].data.id = null;
  }

  isEquivalent(a, b) {
    // Create arrays of property names
    const aProps = Object.getOwnPropertyNames(a);
    const bProps = Object.getOwnPropertyNames(b);
    let propName;
    for (let i = 0; i < aProps.length; i++) {
      propName = aProps[i];

      // If values of same property are not equal,
      // objects are not equivalent
      if (a[propName] !== b[propName]) {
        return false;
      }
    }

    // If we made it this far, objects
    // are considered equivalent
    return true;
  }


}
