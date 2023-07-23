import {AfterViewInit, Component, OnInit} from '@angular/core';
import {SwiperConfigInterface} from 'ngx-swiper-wrapper';
import {ActivatedRoute, RouteConfigLoadEnd, RouteConfigLoadStart, Router} from '@angular/router';
import {ProductService} from '../../../services/product.service';
import {Product} from '../../../models/product';
import {environment} from '../../../../environments/environment';
import {LineOrder} from '../../../models/line-order';
import {WishlistService} from '../../../services/wishlist.service';
import {SnotifyService} from 'ng-snotify';
import {ShoppingCartService} from '../../../services/shopping-cart.service';
import {ErrorsNotifService} from '../../../services/errors-notif.service';
import {CompareService} from '../../../services/compare.service';
import {AuthentificationService} from '../../../services/authentification.service';

@Component({
  selector: 'app-detail-product',
  templateUrl: './detail-product.component.html',
  styleUrls: ['./detail-product.component.css']
})
export class DetailProductComponent implements OnInit, AfterViewInit {
  test: any;
  public config: SwiperConfigInterface = {zoom: true};
  public config2: SwiperConfigInterface = {
    loop: true,
    slidesPerView: 3,
    centeredSlides: true,
    spaceBetween: 10,
    mousewheel: true,
    navigation: true,
    slideToClickedSlide: true,
  };
  public config3: SwiperConfigInterface = {
    direction: 'vertical',
    slidesPerView: 'auto',
    freeMode: true,
    scrollbar: {
      el: '.swiper-scrollbar',
    },
    mousewheel: true,
  };
  url: string = environment.urlServeur2;
  produit: Product = new Product();
  numberProduit = 1;
  loggedInAdmin = false;

  constructor(
    private route: ActivatedRoute,
    private produitService: ProductService,
    private notify: SnotifyService,
    private errorsNotifService: ErrorsNotifService,
    private shoppingCartService: ShoppingCartService,
    private compareService: CompareService,
    private wishlistService: WishlistService,
    private authService: AuthentificationService,
    private routerE: Router) {
  }

  addNbProduit() {
    if (this.produit.article.stock > this.numberProduit) {
      this.numberProduit++;
    }
  }

  removeNbProduit() {
    if (0 < this.numberProduit) {
      this.numberProduit--;
    }
  }

  ngOnInit() {
    // Capture the session ID if available
    /* this.route.params.subscribe(value => {
       console.log(value.id);
       this.produitService.getById(value.id).subscribe(value1 => {
         this.product = value1;
       });
     });*/
    this.authService.authAdminStatus.subscribe(next => {
      this.loggedInAdmin = next;
    });
    this.route.data.subscribe((value: { produit: Product }) => {
      this.produit = value.produit;
      console.log(value);
    }, error1 => {
      console.log(error1);
    });
  }

  ngAfterViewInit(): void {
  }

  addToCompare(id) {
    this.compareService.addToCompare(id);
  }

  addToShoppingCart(pro: Product) {
    const LC = new LineOrder();
    if (pro.ligneCommande) {
      LC.quantite = pro.ligneCommande.quantite;
      pro.ligneCommande = null;
    } else {
      LC.quantite = 1;
    }
    LC.produit_id = pro.id;
    LC.produit = pro;
    this.shoppingCartService.addShoppingCart(LC);
  }


  addToWishlist(id) {
    this.wishlistService.addToWishlist(id);
  }

  removeQu(ele: Product) {
    if (!ele.ligneCommande) {
      ele.ligneCommande = new LineOrder();
      ele.ligneCommande.quantite = 1;
    }
    if (ele.ligneCommande.quantite > 1) {
      ele.ligneCommande.quantite--;
    }
  }


  addQu(ele: Product) {
    if (!ele.ligneCommande) {
      ele.ligneCommande = new LineOrder();
      ele.ligneCommande.quantite = 1;
    }
    if (ele.ligneCommande.quantite < ele.article.stock) {
      ele.ligneCommande.quantite++;
    }
  }

}
