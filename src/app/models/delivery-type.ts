import {Rate} from './rate';
import {Region} from './region';

export class DeliveryType {
  id: number;
  name: string;
  info: string;
  tarifs?: Rate[];

  constructor(val: DeliveryType) {
    this.id = val.id;
    this.name = val.name;
    this.info = val.info;
  }
}
