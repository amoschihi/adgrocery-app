import {Image} from './image';
import {Color} from './color';
import {Material} from './material';

export class Article {
  id: number;
  colors: Color[] = [];
  materials: Material[] = [];
  size: number;
  stock: number;
  product_id: number;
  images: Image[];
  avatar: string | any;
}
