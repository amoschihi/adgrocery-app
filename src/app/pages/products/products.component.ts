import {Component, OnInit} from '@angular/core';
import {BreakpointObserver, Breakpoints, BreakpointState} from '@angular/cdk/layout';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {CategoryService} from '../../services/category.service';
import {Category} from '../../models/category';
import {Color} from '../../models/color';
import {ColorService} from '../../services/color.service';
import {ProductService} from '../../services/product.service';
import {Product} from '../../models/product';
import {environment} from '../../../environments/environment';
import {MaterialService} from '../../services/material.service';
import {Material} from '../../models/material';
import {ActivatedRoute, Router} from '@angular/router';
import {MainNavComponent} from '../../layout/main-nav/main-nav.component';
import {SnotifyService} from 'ng-snotify';
import {ErrorsNotifService} from '../../services/errors-notif.service';
import {ProductPaginate} from '../../models/Product-paginate';
import {AppComponent} from '../../app.component';
import {SearchCriteria} from '../../models/search-criteria';
import {LineOrder} from '../../models/line-order';
import {WishlistService} from '../../services/wishlist.service';
import {CompareService} from '../../services/compare.service';
import {ShoppingCartService} from '../../services/shopping-cart.service';
import {AuthentificationService} from '../../services/authentification.service';
import {Article} from '../../models/article';
import {Socket} from 'ngx-socket-io';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  itemsProductsSize = 'items-products-size-1';
  categories: Category[];
  colors: Color[];
  materials: Material[];
  public products: Product[] = [];
  productPaginate: ProductPaginate;
  searchCriteria: SearchCriteria = new SearchCriteria();
  show = 12;
  phone = false;
  tablet = false;
  pc15 = false;
  url: string = environment.urlServeur2;
  loggedInAdmin: boolean;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe([Breakpoints.Handset, Breakpoints.Tablet])
    .pipe(
      map(result => result.matches)
    );

  constructor(private breakpointObserver: BreakpointObserver,
              private categoryService: CategoryService,
              private colorService: ColorService,
              private materialService: MaterialService,
              private productService: ProductService,
              private notify: SnotifyService,
              private errorsNotifService: ErrorsNotifService,
              private shoppingCartService: ShoppingCartService,
              private compareService: CompareService,
              private wishlistService: WishlistService,
              private route: ActivatedRoute,
              private socket: Socket,
              public mainNav: MainNavComponent,
              private authService: AuthentificationService,
              public appComponent: AppComponent,
  ) {
  }

  ngOnInit() {
    this.socket
      .fromEvent<any>('quantitySetNotification')
      .map(data => data).subscribe(value => {
      let articles: Article[] = [];
      articles = [...JSON.parse(value)];
      console.log('testhna');
      // console.log(articles);
      // console.log(this.ProductPaginate);
      articles.forEach(value0 => {
        const tmp = this.productPaginate.data.find(value1 => value1.article.id === value0.id);
        if (tmp) {
          tmp.article.stock = value0.stock;
        }
      });
      this.productService.setProductPaginator(this.productPaginate);
    });
    this.authService.authAdminStatus.subscribe(next => {
      this.loggedInAdmin = next;
    });
    this.breakpointObserver
      .observe('(max-width: 1350px)')
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.itemsProductsSize = 'items-products-size-2';
          this.pc15 = true;
        } else {
          this.pc15 = false;
        }
      });
    this.breakpointObserver
      .observe([Breakpoints.Tablet])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.itemsProductsSize = 'items-products-size-2';
          this.tablet = true;
        } else {
          this.tablet = false;
        }
      });
    this.breakpointObserver
      .observe([Breakpoints.Handset])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.itemsProductsSize = 'items-products-size-3';
          this.phone = true;
        } else {
          this.phone = false;
        }
      });

    this.categoryService.categories.subscribe(value => {
      this.categories = value;
    });

    this.colorService.colors.subscribe(value => {
      this.colors = value;
    });

    this.productService.productPaginator.subscribe(value => {
      this.products = value.data;
      this.productPaginate = value;
    });

    this.materialService.materials.subscribe(value => this.materials = value);

  }

  delete(id: number) {
    this.notify.confirm('Sure to delete?', {
      position: 'rightTop',
      timeout: 0,
      closeOnClick: false,
      pauseOnHover: true,
      buttons: [
        {
          text: 'Yes', action: () => {
            this.productService.delete(id).subscribe(value => {
              this.productService.get(true, this.productPaginate.current_page, this.productPaginate.per_page, this.searchCriteria
              ).subscribe(value1 => {
                this.errorsNotifService.handleResponse('Success');
              });
            }, error1 => {
              this.errorsNotifService.handleError('Error');
              console.log(error1);
            });
          }, bold: false
        },
        {text: 'No', action: () => this.notify.clear()},
      ]
    });
  }

  searchByCategorie_id(category_id) {
    this.appComponent.load = true;
    this.searchCriteria.category_id = category_id;
    this.productService.get(true, 1, this.productPaginate.per_page, this.searchCriteria).subscribe(value => {
      this.appComponent.load = false;
    });
  }

  searchBySousCategorie_id(subCategory_id) {
    this.appComponent.load = true;
    this.searchCriteria.category_id = null;
    this.searchCriteria.subCategory_id = subCategory_id;
    this.productService.get(true, 1, this.productPaginate.per_page, this.searchCriteria).subscribe(value => {
      this.appComponent.load = false;
    });
  }

  chnagePrice(priceFrom, priceTo) {
    this.appComponent.load = true;
    this.searchCriteria.priceTo = priceTo;
    this.searchCriteria.priceFrom = priceFrom;
    this.productService.get(true, 1, this.productPaginate.per_page, this.searchCriteria).subscribe(value => {
      this.appComponent.load = false;
    });
  }

  changeColors(colors) {
    /*console.log(colors);
    console.log(colors.selectedOptions.selected.map(data => data.value));*/
    this.appComponent.load = true;
    this.searchCriteria.colors_id = colors.selectedOptions.selected.map(data => data.value);
    this.productService.get(true, 1, this.productPaginate.per_page, this.searchCriteria).subscribe(value => {
      this.appComponent.load = false;
    });
  }

  changeMaterials(materials) {
    this.appComponent.load = true;
    this.searchCriteria.materials_id = materials.selectedOptions.selected.map(data => data.value);
    this.productService.get(true, 1, this.productPaginate.per_page, this.searchCriteria).subscribe(value => {
      this.appComponent.load = false;
    });
  }

  change(page, perPage = this.productPaginate.per_page) {
    this.appComponent.load = true;
    this.productService.get(true, page, perPage, this.searchCriteria).subscribe(value => {
      this.appComponent.load = false;
    });
  }

  addToCompare(id) {
    this.compareService.addToCompare(id);
  }

  addToShoppingCart(pro: Product) {
    const LC = new LineOrder();
    LC.product_id = pro.id;
    LC.quantity = 1;
    LC.product = pro;
    this.shoppingCartService.addShoppingCart(LC);
  }


  addToWishlist(id) {
    this.wishlistService.addToWishlist(id);
  }
}
