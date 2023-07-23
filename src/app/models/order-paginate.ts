import {Paginate} from './paginate';
import {Product} from './product';
import {Order} from './order';

export class OrderPaginate extends Paginate {
  filterValue = '';
  sortDir = 'desc';
  sortAct = 'dateC';
  data: Order[];
}
