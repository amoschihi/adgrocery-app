import {Livraison} from './livraison';
import {Paiement} from './paiement';
import {LineOrder} from './line-order';
import {Profile} from './profile';

export class Commande {
  id: number;
  dateC: Date;
  total: number;
  statut: string;
  shippned: Date;
  profile_id: number;
  paiement_id: number;
  profile?: Profile;
  livraison?: Livraison;
  paiement?: Paiement;
  edit?: boolean;
  ligneCommandes?: LineOrder[];
  ligne_commandes?: LineOrder[];
}
