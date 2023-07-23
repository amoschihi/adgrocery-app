import {Component, OnInit} from '@angular/core';
import {SnotifyService} from 'ng-snotify';
import {Discount} from '../../../models/discount';
import {DiscountService} from '../../../services/discount.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-discount',
  templateUrl: './discount.component.html',
  styleUrls: ['./discount.component.css']
})
export class DiscountComponent implements OnInit {

  discounts: Discount[];
  displayedColumns: string[] = ['percentageValue', 'actionsColumn'];
  public dataSource: Discount[];
  public editCache = {};
  public addDiscount = false;

  constructor(private reductionService: DiscountService, private notify: SnotifyService, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.reductionService.discounts.subscribe(value => {
      this.discounts = value;
      this.dataSource = this.discounts;
      this.initEditCache();
    });
  }

  public initEditCache() {
    this.editCache = {};
    this.dataSource.forEach((value, i) => {
      if (!this.editCache[value.id + '']) {
        this.editCache[value.id + ''] = {index: i, edit: false, data: new Discount(value)};
      }
    });
  }

  startEdit(key: string): void {
    this.editCache[key].edit = true;
  }

  cancelEdit(key: string): void {
    if (key === '-1') {
      this.reductionService.setDiscounts(this.dataSource.filter(value1 => value1.id !== -1));
      this.addDiscount = false;
    } else {
      const index = this.editCache[key].index;
      this.editCache[key].data = new Discount(this.dataSource[index]);
      this.editCache[key].edit = false;
    }
  }

  saveEdit(key: string): void {
    const index = this.editCache[key].index;
    if (key === '-1') {
      this.reductionService.save(this.editCache[key].data).subscribe(value => {
        this.dataSource = this.dataSource.filter(value2 => value2.id !== -1);
        this.dataSource.unshift(value.data);
        this.reductionService.setDiscounts(this.dataSource);
        this.handleResponse('Success');
      }, error1 => {
        console.log(error1);
        this.handleError('Error');
      });
      this.addDiscount = false;
    } else {
      if (!this.isEquivalent(this.dataSource[index], this.editCache[key].data)) {
        this.dataSource[index] = this.editCache[key].data;
        this.reductionService.update(this.dataSource[index]).subscribe(value => {
          this.handleResponse('Success');
          this.editCache[key].edit = false;
          this.reductionService.get(true);
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
            this.reductionService.delete(id).subscribe(value => {
              this.dataSource = this.dataSource.filter(value1 => value1.id !== id);
              this.reductionService.setDiscounts(this.dataSource);
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
    this.addDiscount = true;
    this.dataSource = [{id: -1, percentageValue: 0}, ...this.dataSource];
    this.initEditCache();
    this.editCache['-1'].edit = true;
    // this.editCache['-1'].data.id = null;
  }

  isEquivalent(a, b) {
    return a.valeurPourcentage === b.valeurPourcentage;
  }

}
