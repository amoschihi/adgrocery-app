import {Component, OnInit} from '@angular/core';
import {LineOrder} from '../../../models/line-order';
import {environment} from '../../../../environments/environment';
import {WishlistService} from '../../../services/wishlist.service';
import {ShoppingCartService} from '../../../services/shopping-cart.service';
import {CompareService} from '../../../services/compare.service';
import {ScreenService} from '../../../services/screen.service';
import {ProductService} from '../../../services/product.service';
import {ProductPaginate} from '../../../models/product-paginate';
import {Product} from '../../../models/product';

@Component({
  selector: 'app-new-arrivales',
  templateUrl: './new-arrivales.component.html',
  styleUrls: ['./new-arrivales.component.css']
})
export class NewArrivalesComponent implements OnInit {

  productPaginate: ProductPaginate = new ProductPaginate();
  products: Product[];
  url: string = environment.urlServeur2;
  load = false;

  constructor(private productService: ProductService,
              private shoppingCartService: ShoppingCartService,
              private screenService: ScreenService,
              private compareService: CompareService,
              private wishlistService: WishlistService) {
  }

  ngOnInit() {
    this.screenService.isLargPc.subscribe(value => {
      if (value) {
        this.productPaginate.per_page = 6;
        if (this.products.length < 6 && this.productPaginate.total >= 6) {
          this.productService.getNewArrivale(1, this.productPaginate.per_page, true).subscribe(value1 => {
            this.products = value1.data;
            this.productPaginate = value1;
          });
        }
      }
    });
    this.screenService.isSmallPc.subscribe(value => {
      if (value) {
        this.productPaginate.per_page = 5;
        if (this.products.length > 5) {
          this.products = this.products.splice(0, 5);
        }
        if (this.products.length < 5 && this.productPaginate.total >= 5) {
          this.productService.getNewArrivale(1, this.productPaginate.per_page, true).subscribe(value1 => {
            this.products = value1.data;
            this.productPaginate = value1;
          });
        }
      }
    });
    this.screenService.isPhone.subscribe(value => {
      if (value) {
        this.productPaginate.per_page = 1;
        if (this.products.length > 1) {
          this.products = this.products.splice(0, 1);
        }
      }
    });
    this.screenService.isSmallTablet.subscribe(value => {
      if (value) {
        this.productPaginate.per_page = 2;
        if (this.products.length > 2) {
          this.products = this.products.splice(0, 4);
        }
        if (this.products.length < 2 && this.productPaginate.total >= 2) {
          this.productService.getNewArrivale(1, this.productPaginate.per_page, true).subscribe(value1 => {
            this.products = value1.data;
            this.productPaginate = value1;
          });
        }
      }
    });
    this.screenService.isTablet.subscribe(value => {
      if (value) {
        this.productPaginate.per_page = 4;
        if (this.products.length > 4) {
          this.products = this.products.splice(0, 4);
        }
        if (this.products.length < 4 && this.productPaginate.total >= 4) {
          this.productService.getNewArrivale(1, this.productPaginate.per_page, true).subscribe(value1 => {
            this.products = value1.data;
            this.productPaginate = value1;
          });
        }
      }
    });
    this.productService.load.subscribe(value => {
      this.load = value;
    });
    this.productService.getNewArrivale(1, this.productPaginate.per_page).subscribe(value => {
      this.products = value.data;
      this.productPaginate = value;
    });
  }

  addToCompare(id) {
    this.compareService.addToCompare(id);
  }

  addToShoppingCart(pro: Product) {
    const LC = new LineOrder();
    LC.product_id = pro.id;
    LC.quantite = 1;
    LC.product = pro;
    this.shoppingCartService.addShoppingCart(LC);
  }


  addToWishlist(id) {
    this.wishlistService.addToWishlist(id);
  }

  prev() {
    this.productService.getNewArrivale(1, this.productPaginate.per_page, true, this.productPaginate.prev_page_url).subscribe(value => {
      this.products = value.data;
      this.productPaginate = value;

    });
  }

  next() {
    this.productService.getNewArrivale(1, this.productPaginate.per_page, true, this.productPaginate.next_page_url).subscribe(value => {
      this.products = value.data;
      this.productPaginate = value;
    });
  }
}
