import {DeliveryType} from './delivery-type';

export class Delivery {
  id: number;
  deliveryType_id: number;
  order_id: number;
  delivery_type ?: DeliveryType;
}
