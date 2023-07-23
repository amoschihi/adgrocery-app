export class City {
  id: number;
  name: string;
  api_token: string;

  constructor(val: City) {
    this.id = val.id;
    this.name = val.name;
  }
}
