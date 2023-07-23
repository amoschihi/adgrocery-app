import {Paginate} from './paginate';
import {Product} from './product';
import {Commande} from './commande';

export class CommandePaginate extends Paginate {
  filterValue = '';
  sortDir = 'desc';
  sortAct = 'dateC';
  data: Commande[];
}
