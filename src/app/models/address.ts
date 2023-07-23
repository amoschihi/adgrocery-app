import {City} from './city';
import {Region} from './region';

export class Address {
  id: number;
  LName: string;
  FName: string;
  phone: string;
  address: string;
  info: string;
  type: string;
  profile_id: number;
  city_id: number;
  region_id: number;
  city: City;
  region: Region;


  static getAddressPro(addresses: Address[]) {
    return addresses.find(value1 => value1.type === 'pro');
  }
}
