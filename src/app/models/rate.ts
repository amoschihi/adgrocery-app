export class Rate {
  id: number;
  amount: number;
  deliveryType_id: number;
  city_id: number;

  constructor(val: Rate) {
    this.id = val.id;
    this.amount = val.amount;
    this.city_id = val.city_id;
    this.deliveryType_id = val.deliveryType_id;
  }
}
