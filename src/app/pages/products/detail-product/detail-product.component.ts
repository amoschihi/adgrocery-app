import {AfterViewInit, Component, OnInit} from '@angular/core';
import {SwiperConfigInterface} from 'ngx-swiper-wrapper';
import {ActivatedRoute, Router} from '@angular/router';
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
  product: Product = new Product();
  numberProduit = 1;
  loggedInAdmin = false;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private notify: SnotifyService,
    private errorsNotifService: ErrorsNotifService,
    private shoppingCartService: ShoppingCartService,
    private compareService: CompareService,
    private wishlistService: WishlistService,
    private authService: AuthentificationService,
    private routerE: Router) {
  }

  addNbProduit() {
    if (this.product.article.stock > this.numberProduit) {
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
       this.productService.getById(value.id).subscribe(value1 => {
         this.product = value1;
       });
     });*/
    this.authService.authAdminStatus.subscribe(next => {
      this.loggedInAdmin = next;
    });
    this.route.data.subscribe((value: { product: Product }) => {
      this.product = value.product;
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
    if (pro.lineOrder) {
      LC.quantity = pro.lineOrder.quantity;
      pro.lineOrder = null;
    } else {
      LC.quantity = 1;
    }
    LC.product_id = pro.id;
    LC.product = pro;
    this.shoppingCartService.addShoppingCart(LC);
  }


  addToWishlist(id) {
    this.wishlistService.addToWishlist(id);
  }

  removeQu(ele: Product) {
    if (!ele.lineOrder) {
      ele.lineOrder = new LineOrder();
      ele.lineOrder.quantity = 1;
    }
    if (ele.lineOrder.quantity > 1) {
      ele.lineOrder.quantity--;
    }
  }


  addQu(ele: Product) {
    if (!ele.lineOrder) {
      ele.lineOrder = new LineOrder();
      ele.lineOrder.quantity = 1;
    }
    if (ele.lineOrder.quantity < ele.article.stock) {
      ele.lineOrder.quantity++;
    }
  }

}
