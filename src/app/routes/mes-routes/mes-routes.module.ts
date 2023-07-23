import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from '../../pages/login/login.component';
import {SingupComponent} from '../../pages/singup/singup.component';
import {ProfileComponent} from '../../pages/profile/profile.component';
import {BeforeLoginService} from '../../services/before-login.service';
import {AfterLoginService} from '../../services/after-login.service';
import {RequestResetPasswordComponent} from '../../pages/resetPassword/request-reset-password/request-reset-password.component';
import {ResponseResetPasswordComponent} from '../../pages/resetPassword/response-reset-password/response-reset-password.component';
import {TestComponent} from '../../pages/test/test.component';
import {McBreadcrumbsModule} from 'ngx-breadcrumbs';
import {AccountSettingsComponent} from '../../pages/accountsettings/account-settings/account-settings.component';
import {AdressesComponent} from '../../pages/accountsettings/addresses/adresses.component';
import {AfterLoginAdminService} from '../../services/after-login-admin.service';
import {RegionComponent} from '../../pages/admin/region/region.component';
import {MenuAdminComponent} from '../../pages/admin/menu-admin/menu-admin.component';
import {CityComponent} from '../../pages/admin/city/city.component';
import {DashboardComponent} from '../../pages/accountsettings/dashboard/dashboard.component';
import {PersonalInformationComponent} from '../../pages/accountsettings/personal-information/personal-information.component';
import {ContactComponent} from '../../pages/contact/contact.component';
import {BrandComponent} from '../../pages/admin/brand/brand.component';
import {CategoryComponent} from '../../pages/admin/category/category.component';
import {SubCategoryComponent} from '../../pages/admin/sub-category/sub-category.component';
import {ColorComponent} from '../../pages/admin/color/color.component';
import {HomeComponent} from '../../pages/home/home.component';
import {MaterialComponent} from '../../pages/admin/material/material.component';
import {InfoSiteResolverService} from '../../services/resolvers/info-site-resolver.service';
import {InfoSiteComponent} from '../../pages/admin/info-site/info-site.component';
import {RegionResolverService} from '../../services/resolvers/region-resolver.service';
import {MainComponent} from '../../layout/main/main.component';
import {WishlistComponent} from '../../pages/wishlist/wishlist.component';
import {CompareComponent} from '../../pages/compare/compare.component';
import {ShoppingCartComponent} from '../../pages/shopping-cart/shopping-cart.component';
import {CategoryResolverService} from '../../services/resolvers/category-resolver.service';
import {SubCategoryResolverService} from '../../services/resolvers/sub-category-resolver.service';
import {AccountSettingResolverService} from '../../services/resolvers/account-setting-resolver.service';
import {CityResolverService} from '../../services/resolvers/city-resolver.service';
import {MaterialResolverService} from '../../services/resolvers/material-resolver.service';
import {ColorResolverService} from '../../services/resolvers/color-resolver.service';
import {DiscountComponent} from '../../pages/admin/discount/discount.component';
import {DiscountResolverService} from '../../services/resolvers/discount-resolver.service';
import {CheckoutComponent} from '../../pages/checkout/checkout.component';
import {CheckoutResolverService} from '../../services/resolvers/checkout-resolver.service';
import {DeliveryTypeComponent} from '../../pages/admin/delivery-type/delivery-type.component';
import {DeliveryTypeResolverService} from '../../services/resolvers/delivery-type-resolver.service';
import {RateComponent} from '../../pages/admin/rate/rate.component';
import {RateResolverService} from '../../services/resolvers/rate-resolver.service';
import {OrdersComponent} from '../../pages/admin/orders/orders.component';
import {OrderAdminResolverService} from '../../services/resolvers/order-admin-resolver.service';
import {AddNewsComponent} from '../../pages/admin/news/add-news/add-news.component';
import {NewsComponent} from '../../pages/admin/news/news.component';
import {UpdateNewsComponent} from '../../pages/admin/news/update-news/update-news.component';
import {NewsListComponent} from '../../pages/admin/news/news-list/news-list.component';
import {HomeResolverService} from '../../services/resolvers/home-resolver.service';
import {NewsListResolverService} from '../../services/resolvers/news-list-resolver.service';
import {NewsUpdateResolverService} from '../../services/resolvers/news-update-resolver.service';
import {ErrorComponent} from '../../pages/error/error.component';
import {WhoareweComponent} from '../../pages/whoarewe/whoarewe.component';
import {ProductComponent} from '../../pages/admin/product/product.component';
import {DetailProductComponent} from '../../pages/products/detail-product/detail-product.component';
import {AddProductComponent} from '../../pages/admin/product/add-product/add-product.component';
import {UpdateProductComponent} from '../../pages/admin/product/update-product/update-product.component';
import {ListProductsComponent} from '../../pages/admin/product/list-products/list-products.component';
import {ProductsResolverService} from '../../services/resolvers/products-resolver.service';
import {ProductsWishlistResolverService} from '../../services/resolvers/products-wishlist-resolver.service';
import {ProductsShoppingCartResolverService} from '../../services/resolvers/products-shopping-cart-resolver.service';
import {ProductsCompareResolverService} from '../../services/resolvers/products-compare-resolver.service';
import {ProductResolverService} from '../../services/resolvers/product-resolver.service';
import {ProductsCategoryResolverService} from '../../services/resolvers/products-category-resolver.service';
import {ProductSettingResolverService} from '../../services/resolvers/product-setting-resolver.service';
import {ProductsAdminResolverService} from '../../services/resolvers/products-admin-resolver.service';


const appRoutes: Routes = [
  {
    path: '',
    redirectTo: 'main',
    pathMatch: 'full'
  }, {
    path: 'Error',
    component: ErrorComponent,
    data: {breadcrumbs: ''},
  }, {
    path: 'main',
    component: MainComponent,
    data: {breadcrumbs: 'Home'},
    resolve: {
      infoSite: InfoSiteResolverService
    },
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      }, {
        path: 'whoarewe',
        component: WhoareweComponent,
        data: {breadcrumbs: 'Who are we'}
      }, {
        path: 'home',
        component: HomeComponent,
        data: {breadcrumbs: ''},
        resolve: {
          valid: HomeResolverService
        }
      }, {
        path: 'checkout',
        component: CheckoutComponent,
        canActivate: [AfterLoginService],
        data: {breadcrumbs: 'Checkout'},
        resolve: {
          valid: CheckoutResolverService
        }
      }, {
        path: 'products',
        component: ProductComponent,
        data: {breadcrumbs: 'All Products'},
        resolve: {
          productPaginate: ProductsResolverService
        }
      }, {
        path: 'wishlist',
        component: WishlistComponent,
        data: {breadcrumbs: 'Wishlist'},
        resolve: {
          productPaginate: ProductsWishlistResolverService
        }
      }, {
        path: 'ShoppingCart',
        component: ShoppingCartComponent,
        data: {breadcrumbs: 'Shopping Cart'},
        resolve: {
          products: ProductsShoppingCartResolverService
        }
      }, {
        path: 'compare',
        component: CompareComponent,
        data: {breadcrumbs: 'Compare'},
        resolve: {
          productPaginate: ProductsCompareResolverService
        }
      }, {
        path: 'products/:id',
        component: DetailProductComponent,
        data: {breadcrumbs: 'Product'},
        resolve: {
          product: ProductResolverService
        }
      }, {
        path: 'productsCat/:id',
        component: ProductComponent,
        data: {breadcrumbs: 'Products'},
        resolve: {
          productPaginate: ProductsCategoryResolverService
        }
      }, {
        path: 'login',
        component: LoginComponent,
        canActivate: [BeforeLoginService],
        data: {breadcrumbs: 'Sign In'},
        children: [
          {
            path: 'test',
            component: TestComponent,
            data: {breadcrumbs: 'Test'},
          }]
      },
      {
        path: 'admin',
        component: MenuAdminComponent,
        canActivate: [AfterLoginAdminService],
        canActivateChild: [AfterLoginAdminService],
        data: {breadcrumbs: 'Administrator Space'},
        children: [
          {
            path: 'infoSite',
            component: InfoSiteComponent,
            data: {breadcrumbs: 'Site Information'},
            resolve: {
              infoSite: InfoSiteResolverService
            }
          }, {
            path: 'deliveryType2',
            redirectTo: 'deliveryType',
            pathMatch: 'full'
          }, {
            path: 'deliveryType',
            component: DeliveryTypeComponent,
            data: {breadcrumbs: 'Delivery Method'},
            resolve: {
              valid: DeliveryTypeResolverService,
            }
          }, {
            path: 'rate',
            component: RateComponent,
            data: {breadcrumbs: 'Rate'},
            resolve: {
              deliveryType_id: RateResolverService,
            }
          }, {
            path: 'orders',
            component: OrdersComponent,
            data: {breadcrumbs: 'Orders'},
            resolve: {
              deliveryType_id: OrderAdminResolverService,
            }
          }, {
            path: 'color',
            component: ColorComponent,
            data: {breadcrumbs: 'Colors'},
            resolve: {
              valid: ColorResolverService,
            }
          }, {
            path: 'discount',
            component: DiscountComponent,
            data: {breadcrumbs: 'Discounts'},
            resolve: {
              valid: DiscountResolverService,
            }
          }, {
            path: 'material',
            component: MaterialComponent,
            data: {breadcrumbs: 'Materials'},
            resolve: {
              valid: MaterialResolverService,
            }
          }, {
            path: 'region',
            component: RegionComponent,
            data: {breadcrumbs: 'Regions'},
            resolve: {
              valid: RegionResolverService,
            }
          }, {
            path: 'city',
            component: CityComponent,
            data: {breadcrumbs: 'Cities'},
            resolve: {
              valid: CityResolverService,
            }
          }, {
            path: 'brand',
            component: BrandComponent,
            data: {breadcrumbs: 'Brand List'},
          }, {
            path: 'category',
            component: CategoryComponent,
            data: {breadcrumbs: 'Category List'},
            resolve: {
              valid: CategoryResolverService,
            }
          }, {
            path: 'subCategory',
            component: SubCategoryComponent,
            data: {breadcrumbs: 'Subcategory List'},
            resolve: {
              valid: SubCategoryResolverService,
            }
          }, {
            path: '',
            redirectTo: 'product',
            pathMatch: 'full'
          }, {
            path: 'product',
            component: ProductComponent,
            data: {breadcrumbs: 'Product'},
            resolve: {
              valid: ProductSettingResolverService
            },
            children: [
              {
                path: '',
                redirectTo: 'addProduct',
                pathMatch: 'full'
              }, {
                path: 'addProduct',
                component: AddProductComponent,
                data: {breadcrumbs: 'Add Product'},
              }, {
                path: 'updateProduct/:id',
                component: UpdateProductComponent,
                data: {breadcrumbs: 'Update Product'},
                resolve: {
                  product: ProductResolverService
                }
              }, {
                path: 'listProducts',
                component: ListProductsComponent,
                data: {breadcrumbs: 'All Products'},
                resolve: {
                  product: ProductsAdminResolverService
                }
              },
            ],
          }, {
            path: 'news',
            component: NewsComponent,
            data: {breadcrumbs: 'news'},
            children: [
              {
                path: '',
                redirectTo: 'addNews',
                pathMatch: 'full'
              }, {
                path: 'addNews',
                component: AddNewsComponent,
                data: {breadcrumbs: 'Add News'},
              }, {
                path: 'updateNews/:id',
                component: UpdateNewsComponent,
                data: {breadcrumbs: 'Update News'},
                resolve: {
                  news: NewsUpdateResolverService
                }
              }, {
                path: 'newsList',
                component: NewsListComponent,
                data: {breadcrumbs: 'News List'},
                resolve: {
                  valid: NewsListResolverService
                }
              },
            ],
          },
        ]
      },
      {
        path: 'signup',
        component: SingupComponent,
        canActivate: [BeforeLoginService],
        data: {breadcrumbs: 'signup'}
      }, {
        path: 'contact',
        component: ContactComponent,
        data: {breadcrumbs: 'contact'}
      },
      {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [AfterLoginService],
        data: {breadcrumbs: 'Profile'}
      },
      {
        path: 'requestResetPassword',
        component: RequestResetPasswordComponent,
        canActivate: [BeforeLoginService],
        data: {breadcrumbs: 'Send'}
      },
      {
        path: 'responseResetPassword',
        component: ResponseResetPasswordComponent,
        canActivate: [BeforeLoginService],
        data: {breadcrumbs: 'Changepassword'}
      },
      {
        path: 'accountSettingsComponent',
        component: AccountSettingsComponent,
        canActivate: [AfterLoginService],
        canActivateChild: [AfterLoginService],
        data: {breadcrumbs: 'accountSettings'},
        resolve: {valid: AccountSettingResolverService},
        children: [

          {
            path: '',
            redirectTo: 'dashboard',
            pathMatch: 'full'
          }, {
            path: 'orders',
            component: OrdersComponent,
            data: {breadcrumbs: 'Orders List'},
            resolve: {
              deliveryType_id: OrderAdminResolverService,
            }
          }, {
            path: 'addresses',
            component: AdressesComponent,
            data: {breadcrumbs: 'addresses'},
          }, {
            path: 'dashboard',
            component: DashboardComponent,
            data: {breadcrumbs: 'accountDashboard'},
          },
          {
            path: 'infoP',
            component: PersonalInformationComponent,
            data: {breadcrumbs: 'AccountInformation'},
          }
        ]
      },
    ]
  },
];

@NgModule({
  imports: [
    CommonModule, RouterModule.forRoot(
      appRoutes,
      {enableTracing: true} // <-- debugging purposes only
    ),
    McBreadcrumbsModule.forRoot()
  ],
  exports: [RouterModule, McBreadcrumbsModule],
  declarations: []
})
export class MesRoutesModule {
}
