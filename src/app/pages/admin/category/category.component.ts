import {Component, OnInit} from '@angular/core';
import {SnotifyService} from 'ng-snotify';
import {Category} from '../../../models/category';
import {CategoryService} from '../../../services/category.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {


  categorys: Category[];
  displayedColumns: string[] = ['name', 'sex', 'actionsColumn'];
  public dataSourceCategory: Category[];
  public editCacheCategory = {};
  public addCategory = false;

  constructor(private categoryService: CategoryService, private notify: SnotifyService) {
  }

  ngOnInit() {
    this.categoryService.categories.subscribe(value => {
      this.categorys = value;
      this.dataSourceCategory = value;
      this.initEditCache();
    });
  }

  public initEditCache() {
    this.editCacheCategory = {};
    this.dataSourceCategory.forEach((value, i) => {
      if (!this.editCacheCategory[value.id + '']) {
        this.editCacheCategory[value.id + ''] = {index: i, edit: false, data: new Category(value)};
      }
    });
  }

  startEdit(key: string): void {
    this.editCacheCategory[key].edit = true;
  }

  cancelEdit(key: string): void {
    if (key === '-1') {
      this.categoryService.setCategories(this.dataSourceCategory.filter(value1 => value1.id !== -1));
      this.addCategory = false;
    } else {
      const index = this.editCacheCategory[key].index;
      this.editCacheCategory[key].data = new Category(this.dataSourceCategory[index]);
      this.editCacheCategory[key].edit = false;
    }
  }

  saveEdit(key: string): void {
    const index = this.editCacheCategory[key].index;
    if (key === '-1') {
      /*this.dataSourceCategory[index] = this.editCacheCategory[key].data;*/
      this.categoryService.save(this.editCacheCategory[key].data).subscribe(value => {
        // this.dataSourceCategory = [value.data, ...this.dataSourceCategory];
        this.dataSourceCategory = this.dataSourceCategory.filter(value2 => value2.id !== -1);
        this.dataSourceCategory.unshift(value.data);
        this.categoryService.setCategories(this.dataSourceCategory);
        this.handleResponse('Success');
      }, error1 => {
        this.handleError('Error');
      });
      this.addCategory = false;
    } else {
      if (!this.isEquivalent(this.dataSourceCategory[index], this.editCacheCategory[key].data)) {
        this.dataSourceCategory[index] = this.editCacheCategory[key].data;
        this.categoryService.update(this.dataSourceCategory[index]).subscribe(value => {
          this.handleResponse('Success');
          this.editCacheCategory[key].edit = false;
          this.categoryService.get(true);
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
            this.categoryService.delete(id).subscribe(value => {
              this.dataSourceCategory = this.dataSourceCategory.filter(value1 => value1.id !== id);
              this.categoryService.setCategories(this.dataSourceCategory);
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
    this.addCategory = true;
    this.dataSourceCategory = [{id: -1, name: '', sex: ''}, ...this.dataSourceCategory];
    this.initEditCache();
    this.editCacheCategory['-1'].edit = true;
    // this.editCacheCategory['-1'].data.id = null;
  }

  isEquivalent(a, b) {
    if (a.name === b.name && a.sexe === b.sexe) {
      return true;
    }
    return false;
  }

}
