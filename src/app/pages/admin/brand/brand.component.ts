import {Component, OnInit} from '@angular/core';
import {SnotifyService} from 'ng-snotify';
import {Brand} from '../../../models/brand';
import {BrandService} from '../../../services/brand.service';

@Component({
  selector: 'app-brand',
  templateUrl: './brand.component.html',
  styleUrls: ['./brand.component.css']
})
export class BrandComponent implements OnInit {


  marques: Brand[];
  displayedColumns: string[] = ['name', 'actionsColumn'];
  public dataSourceMarque: Brand[];
  public editCacheMarque = {};
  public addMarque = false;

  constructor(private marqueService: BrandService, private notify: SnotifyService) {
  }

  ngOnInit() {
    this.marqueService.get().subscribe(value => {
      console.log(value);
      this.marques = value;
      this.dataSourceMarque = this.marques;
      this.initEditCache();
    }, error1 => console.log(error1));
  }

  public initEditCache() {
    this.editCacheMarque = {};
    this.dataSourceMarque.forEach((value, i) => {
      if (!this.editCacheMarque[value.id + '']) {
        this.editCacheMarque[value.id + ''] = {index: i, edit: false, data: new Brand(value)};
      }
    });
  }

  startEdit(key: string): void {
    this.editCacheMarque[key].edit = true;
  }

  cancelEdit(key: string): void {
    if (key === '-1') {
      this.dataSourceMarque = this.dataSourceMarque.filter(value1 => value1.id !== -1);
      this.initEditCache();
      this.addMarque = false;
    } else {
      const index = this.editCacheMarque[key].index;
      this.editCacheMarque[key].data = new Brand(this.dataSourceMarque[index]);
      this.editCacheMarque[key].edit = false;
    }
  }

  saveEdit(key: string): void {
    const index = this.editCacheMarque[key].index;
    if (key === '-1') {
      /*this.dataSourceMarque[index] = this.editCacheMarque[key].data;*/
      this.marqueService.save(this.editCacheMarque[key].data).subscribe(value => {

        //  this.dataSourceMarque = [value.data, ...this.dataSourceMarque];
        this.marqueService.get(true).subscribe(value1 => {
          this.dataSourceMarque = this.dataSourceMarque.filter(value2 => value2.id !== -1);
          this.dataSourceMarque = value1;
          this.initEditCache();
          this.handleResponse('Success');
        });
      }, error1 => {
        console.log(error1);
        this.handleError('Error');
      });
      this.addMarque = false;
    } else {
      if (!this.isEquivalent(this.dataSourceMarque[index], this.editCacheMarque[key].data)) {
        this.dataSourceMarque[index] = this.editCacheMarque[key].data;
        this.marqueService.update(this.dataSourceMarque[index]).subscribe(value => {
          this.handleResponse('Success');
          this.editCacheMarque[key].edit = false;
          this.marqueService.get(true);
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
            this.marqueService.delete(id).subscribe(value => {
              this.dataSourceMarque = this.dataSourceMarque.filter(value1 => value1.id !== id);
              this.marqueService.get(true).subscribe(value1 => {
                this.dataSourceMarque = value1;
                this.initEditCache();
                this.handleResponse('Success');
              });
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
    // this.Error = Error.error.error;
  }

  add() {
    this.addMarque = true;
    this.dataSourceMarque = [{id: -1, name: ''}, ...this.dataSourceMarque];
    this.initEditCache();
    this.editCacheMarque['-1'].edit = true;
    // this.editCacheMarque['-1'].data.id = null;
  }

  isEquivalent(a, b) {
    if (a.name === b.name) {
      return true;
    }
    return false;
  }

}
