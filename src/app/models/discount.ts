import {Color} from './color';

export class Discount {

  id: number;
  percentageValue: number;
  constructor(val: Discount) {
    this.id = val.id;
    this.percentageValue = val.percentageValue;
  }
}
