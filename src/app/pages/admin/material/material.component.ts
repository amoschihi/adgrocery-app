import {Component, OnInit} from '@angular/core';
import {MaterialService} from '../../../services/material.service';
import {Material} from '../../../models/material';
import {SnotifyService} from 'ng-snotify';

@Component({
  selector: 'app-material',
  templateUrl: './material.component.html',
  styleUrls: ['./material.component.css']
})
export class MaterialComponent implements OnInit {

  materials: Material[];
  displayedColumns: string[] = ['name', 'actionsColumn'];
  public dataSource: Material[];
  public editCache = {};
  public addMaterial = false;

  constructor(private materialService: MaterialService, private notify: SnotifyService) {
  }

  ngOnInit() {
    this.materialService.materials.subscribe(value => {
      this.materials = value;
      this.dataSource = this.materials;
      this.initEditCache();
    });
  }

  public initEditCache() {
    this.editCache = {};
    this.dataSource.forEach((value, i) => {
      if (!this.editCache[value.id + '']) {
        this.editCache[value.id + ''] = {index: i, edit: false, data: new Material(value)};
      }
    });
  }

  startEdit(key: string): void {
    this.editCache[key].edit = true;
  }

  cancelEdit(key: string): void {
    if (key === '-1') {
      this.materialService.setMaterials(this.dataSource.filter(value1 => value1.id !== -1));
      this.addMaterial = false;
    } else {
      const index = this.editCache[key].index;
      this.editCache[key].data = new Material(this.dataSource[index]);
      this.editCache[key].edit = false;
    }
  }

  saveEdit(key: string): void {
    const index = this.editCache[key].index;
    if (key === '-1') {
      /*this.dataSource[index] = this.editCache[key].data;*/
      this.materialService.save(this.editCache[key].data).subscribe(value => {
        this.dataSource = this.dataSource.filter(value2 => value2.id !== -1);
        this.dataSource.unshift(value.data);
        this.materialService.setMaterials(this.dataSource);
        this.handleResponse('Success');

      }, error1 => {
        console.log(error1);
        this.handleError('Error');
      });
      this.addMaterial = false;
    } else {
      if (!this.isEquivalent(this.dataSource[index], this.editCache[key].data)) {
        this.dataSource[index] = this.editCache[key].data;
        this.materialService.update(this.dataSource[index]).subscribe(value => {
          this.handleResponse('Success');
          this.editCache[key].edit = false;
          this.materialService.get(true);
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
            this.materialService.delete(id).subscribe(value => {
              this.dataSource = this.dataSource.filter(value1 => value1.id !== id);
              this.materialService.setMaterials(this.dataSource);
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
  }

  add() {
    this.addMaterial = true;
    this.dataSource = [{id: -1, name: ''}, ...this.dataSource];
    this.initEditCache();
    this.editCache['-1'].edit = true;
  }

  isEquivalent(a, b) {
    return a.name === b.name;
  }


}
