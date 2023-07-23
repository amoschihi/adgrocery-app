import {Address} from './address';

export class Profile {
  id: number;
  sex: string;
  dateN: Date = new Date();
  src: string;
  type: string;
  addresses: Address[];
}
