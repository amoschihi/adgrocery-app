export class Rate {
  id: number;
  rising: number;
  deliveryType_id: number;
  city_id: number;

  constructor(val: Rate) {
    this.id = val.id;
    this.rising = val.rising;
    this.city_id = val.city_id;
    this.deliveryType_id = val.deliveryType_id;
  }
}
