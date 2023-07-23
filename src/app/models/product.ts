import {Article} from './article';
import {Category} from './category';
import {LineOrder} from './line-order';
import {Discount} from './discount';

export class Product {
  id: number;
  price: number;
  vat: number;
  name: string;
  description: string;
  brand_id: number;
  category_id: number;
  discount_id: number;
  subCategory_id: number;
  // article: Article = new Article();
  category?: Category = new Category({id: 0, name: '', sex: ''});
  article?: Article = new Article();
  discount?: Discount;
  lineOrders?: LineOrder[] = [];
  lineOrder ?: LineOrder = new LineOrder();
}
