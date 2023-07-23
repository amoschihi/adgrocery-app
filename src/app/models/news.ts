import {Image} from './image';

export class News {
  id: number;
  title: string;
  subTitle: string;
  active: boolean;
  image?: Image;
}
