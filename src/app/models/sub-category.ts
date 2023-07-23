export class SubCategory {
  id: number;
  name: string;
  category_id: number;

  constructor(val: SubCategory) {
    this.id = val.id;
    this.name = val.name;
    this.category_id = val.category_id;
  }
}
