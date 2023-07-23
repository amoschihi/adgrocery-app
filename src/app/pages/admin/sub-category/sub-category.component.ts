import {Component, OnInit} from '@angular/core';
import {SnotifyService} from 'ng-snotify';
import {SubCategory} from '../../../models/sub-category';
import {SubCategoryService} from '../../../services/sub-category.service';
import {Category} from '../../../models/category';
import {CategoryService} from '../../../services/category.service';

@Component({
  selector: 'app-sous-category',
  templateUrl: './sub-category.component.html',
  styleUrls: ['./sub-category.component.css']
})
export class SubCategoryComponent implements OnInit {

  subCategories: SubCategory[];
  categories: Category[];
  displayedColumns: string[] = ['name', 'category_id', 'actionsColumn'];
  public dataSource: SubCategory[];
  public editCache = {};
  public addSubCategory = false;

  constructor(private subCategoryService: SubCategoryService,
              private notify: SnotifyService, private categorieService: CategoryService) {
  }

  ngOnInit() {
    this.subCategoryService.subCategories.subscribe(value => {
      this.subCategories = value;
      this.dataSource = this.subCategories;
      this.initEditCache();
      this.categorieService.get(true).subscribe(value1 => {
      });
    });
    this.categorieService.categories.subscribe(value => {
      this.categories = value;
    });
  }

  public initEditCache() {
    this.editCache = {};
    this.dataSource.forEach((value, i) => {
      if (!this.editCache[value.id + '']) {
        this.editCache[value.id + ''] = {index: i, edit: false, data: new SubCategory(value)};
      }
    });
  }

  startEdit(key: string): void {
    this.editCache[key].edit = true;
  }

  cancelEdit(key: string): void {
    if (key === '-1') {
      this.dataSource = this.dataSource.filter(value1 => value1.id !== -1);
      this.initEditCache();
      this.addSubCategory = false;
    } else {
      const index = this.editCache[key].index;
      this.editCache[key].data = new SubCategory(this.dataSource[index]);
      this.editCache[key].edit = false;
    }
  }

  saveEdit(key: string): void {
    const index = this.editCache[key].index;
    if (key === '-1') {
      /*this.dataSource[index] = this.editCache[key].data;*/
      this.subCategoryService.save(this.editCache[key].data).subscribe(value => {
        // this.dataSource = [value.data, ...this.dataSource];
        this.dataSource = this.dataSource.filter(value2 => value2.id !== -1);
        this.dataSource.unshift(value.data);
        this.subCategoryService.setSousCategories(this.dataSource);
        this.handleResponse('Success');
      }, error1 => {
        console.log(error1);
        this.handleError('Error');
      });
      this.addSubCategory = false;
    } else {
      if (!this.isEquivalent(this.dataSource[index], this.editCache[key].data)) {
        this.dataSource[index] = this.editCache[key].data;
        this.subCategoryService.update(this.dataSource[index]).subscribe(value => {
          this.handleResponse('Success');
          this.editCache[key].edit = false;
          this.subCategoryService.get(true);

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
            this.subCategoryService.delete(id).subscribe(value => {
              this.handleResponse('Success');
              this.dataSource = this.dataSource.filter(value1 => value1.id !== id);
              this.subCategoryService.setSousCategories(this.dataSource);
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
    this.categorieService.get(true);
    this.notify.success(msg, {position: 'rightTop'});
  }

  private handleError(msg: string) {
    this.notify.clear();
    this.notify.error(msg, {position: 'rightTop'});
    // this.error = error.error.error;
  }

  add() {
    this.addSubCategory = true;
    this.dataSource = [{id: -1, name: '', category_id: 0}, ...this.dataSource];
    this.initEditCache();
    this.editCache['-1'].edit = true;
    // this.editCache['-1'].data.id = null;
  }

  isEquivalent(a, b) {
    return a.name === b.name && a.category_id === b.category_id;
  }


}
