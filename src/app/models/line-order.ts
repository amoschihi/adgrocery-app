import {Product} from './product';

export class LineOrder {
  id: any;
  quantity: number;
  subTotal: number;
  order_id: number;
  product_id: number;
  product?: Product;

  copy(): LineOrder {
    const ele = new LineOrder();
    ele.id = this.id;
    ele.quantity = this.quantity;
    ele.subTotal = this.subTotal;
    ele.product_id = this.product_id;
    return ele;
  }

  getNewInstanceLineOrder() {
    const LC = new LineOrder();
    LC.product_id = this.product_id;
    LC.id = this.id;
    LC.quantity = this.quantity;
    return LC;
  }
}
