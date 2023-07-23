import {Article} from './article';
import {Categorie} from './categorie';
import {LineOrder} from './line-order';
import {Reduction} from './reduction';

export class Product {
  id: number;
  prix: number;
  tva: number;
  name: string;
  descriptif: string;
  marque_id: number;
  categorie_id: number;
  reduction_id: number;
  sousCategorie_id: number;
  // article: Article = new Article();
  categorie?: Categorie = new Categorie({id: 0, name: '', sexe: ''});
  article?: Article = new Article();
  reduction?: Reduction;
  ligneCommandes?: LineOrder[] = [];
  ligneCommande ?: LineOrder = new LineOrder();
}
