import {Delivery} from './delivery';
import {Payment} from './payment';
import {LineOrder} from './line-order';
import {Profile} from './profile';

export class Order {
  id: number;
  dateC: Date;
  total: number;
  status: string;
  shippned: Date;
  profile_id: number;
  payment_id: number;
  profile?: Profile;
  delivery?: Delivery;
  payment?: Payment;
  edit?: boolean;
  lineOrders?: LineOrder[];
  line_orders?: LineOrder[];
}
