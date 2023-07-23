import {SubCategory} from './sub-category';

export class Category {
  id: number;
  name: string;
  sex: string;
  sub_categories ?: SubCategory[];

  constructor(val: Category) {
    this.id = val.id;
    this.name = val.name;
    this.sex = val.sex;
  }
}
