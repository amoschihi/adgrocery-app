import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialModuleModule} from './material-module/material-module.module';
import {MainNavComponent} from './layout/main-nav/main-nav.component';
import {LayoutModule} from '@angular/cdk/layout';
import {MenuComponent} from './layout/menu/menu.component';
import {MenuAccountComponent} from './layout/menu-account/menu-account.component';
import {LoginComponent} from './pages/login/login.component';
import {MesRoutesModule} from './routes/mes-routes/mes-routes.module';
import {SingupComponent} from './pages/singup/singup.component';
import {ProfileComponent} from './pages/profile/profile.component';
import {BreadcrumbComponent} from './layout/breadcrumb/breadcrumb.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
import {UserServicesService} from './services/user-services.service';
import {TokenService} from './services/token.service';
import {BeforeLoginService} from './services/before-login.service';
import {AfterLoginService} from './services/after-login.service';
import {RequestResetPasswordComponent} from './pages/resetPassword/request-reset-password/request-reset-password.component';
import {ResponseResetPasswordComponent} from './pages/resetPassword/response-reset-password/response-reset-password.component';
import {SnotifyModule, SnotifyService, ToastDefaults} from 'ng-snotify';
import {TestComponent} from './pages/test/test.component';
import {ErrorsMessagesService} from './services/errors-messages.service';
import {FooterComponent} from './layout/footer/footer.component';
import {AgmCoreModule} from '@agm/core';
import {AccountSettingsComponent} from './pages/accountsettings/account-settings/account-settings.component';
import {AdressesComponent} from './pages/accountsettings/addresses/adresses.component';
import {PersonalInformationComponent} from './pages/accountsettings/personal-information/personal-information.component';
import {CommandsComponent} from './pages/accountsettings/commands/commands.component';
import {BillingComponent} from './pages/accountsettings/addresses/billing/billing.component';
import {ShippingComponent} from './pages/accountsettings/addresses/shipping/shipping.component';
import {RegionComponent} from './pages/admin/region/region.component';
import {MenuAdminComponent} from './pages/admin/menu-admin/menu-admin.component';
import {CityComponent} from './pages/admin/city/city.component';
import {DashboardComponent} from './pages/accountsettings/dashboard/dashboard.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import {ContactComponent} from './pages/contact/contact.component';
import {BrandComponent} from './pages/admin/brand/brand.component';
import {CategoryComponent} from './pages/admin/category/category.component';
import {SubCategoryComponent} from './pages/admin/sub-category/sub-category.component';
import {ColorComponent} from './pages/admin/color/color.component';
import {HomeComponent} from './pages/home/home.component';
import {SlickCarouselModule} from './libs/slick-carousel/slick-carousel/slick-carousel.module';
import {ScrollbarModule} from 'ngx-scrollbar';
import {NgxPaginationModule} from 'ngx-pagination';
import {MaterialComponent} from './pages/admin/material/material.component';
import {SwiperModule} from 'ngx-swiper-wrapper';
import {AddressService} from './services/address.service';
import {CategoryService} from './services/category.service';
import {SubCategoryService} from './services/sub-category.service';
import {ColorService} from './services/color.service';
import {ContactService} from './services/contact.service';
import {BrandService} from './services/brand.service';
import {MaterialService} from './services/material.service';
import {ProfileService} from './services/profile.service';
import {RegionService} from './services/region.service';
import {CityService} from './services/city.service';
import {InfoSiteComponent} from './pages/admin/info-site/info-site.component';
import {InfoSiteService} from './services/info-site.service';
import {RegionResolverService} from './services/resolvers/region-resolver.service';
import {RecaptchaModule} from 'ng-recaptcha';
import {MainComponent} from './layout/main/main.component';
import {AuthentificationService} from './services/authentification.service';
import {AuthServiceConfig, FacebookLoginProvider, GoogleLoginProvider, SocialLoginModule} from 'angular5-social-login';
import {environment} from '../environments/environment';
import {DataService} from './services/data.service';
import {WishlistComponent} from './pages/wishlist/wishlist.component';
import {CompareComponent} from './pages/compare/compare.component';
import {ShoppingCartComponent} from './pages/shopping-cart/shopping-cart.component';
import {ErrorComponent} from './pages/error/error.component';
import {DiscountComponent} from './pages/admin/discount/discount.component';
import {NgxPayPalModule} from 'ngx-paypal';
import {CheckoutComponent} from './pages/checkout/checkout.component';
import {DeliveryTypeComponent} from './pages/admin/delivery-type/delivery-type.component';
import {RateComponent} from './pages/admin/rate/rate.component';
import {AuthenticationInterceptorService} from './services/authentication-interceptor.service';
import {OrdersComponent} from './pages/admin/orders/orders.component';
import {NewOrdersComponent} from './pages/admin/orders/new-orders/new-orders.component';
import {ShippedOrdersComponent} from './pages/admin/orders/shipped-orders/shipped-orders.component';
import {DeliveredOrdersComponent} from './pages/admin/orders/delivered-orders/delivered-orders.component';
import {ClosedOrdersComponent} from './pages/admin/orders/closed-orders/closed-orders.component';
import {NewsComponent} from './pages/admin/news/news.component';
import {AddNewsComponent} from './pages/admin/news/add-news/add-news.component';
import {UpdateNewsComponent} from './pages/admin/news/update-news/update-news.component';
import {NewsListComponent} from './pages/admin/news/news-list/news-list.component';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {WhoareweComponent} from './pages/whoarewe/whoarewe.component';
import {NewArrivalsComponent} from './pages/products/new-arrivals/new-arrivals.component';
import {OnSaleComponent} from './pages/Products/on-sale/on-sale.component';
import {SocketIoConfig, SocketIoModule} from 'ngx-socket-io';
import {ProductComponent} from './pages/admin/product/product.component';
import {AddProductComponent} from './pages/admin/product/add-product/add-product.component';
import {UpdateProductComponent} from './pages/admin/product/update-product/update-product.component';
import {ProductsComponent} from './pages/products/products.component';
import {DetailProductComponent} from './pages/products/detail-product/detail-product.component';
import {ListProductsComponent} from './pages/admin/product/list-products/list-products.component';
import {ProductService} from './services/product.service';
import {ProductsResolverService} from './services/resolvers/products-resolver.service';

export function getInfoSite(infoSiteService: InfoSiteService) {
  return () => infoSiteService.getInfoSite();
}

const configSocketIo: SocketIoConfig = {url: environment.urlServeur3, options: {}};

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

export function getAuthServiceConfigs() {
  return new AuthServiceConfig([{
    id: FacebookLoginProvider.PROVIDER_ID,
    provider: new FacebookLoginProvider(environment.FacebookClientId)
  }, {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider(environment.GoogleClientId)
  }]);
}

@NgModule({
  declarations: [
    AppComponent,
    MainNavComponent,
    MenuComponent,
    MenuAccountComponent,
    LoginComponent,
    SingupComponent,
    ProfileComponent,
    BreadcrumbComponent,
    RequestResetPasswordComponent,
    ResponseResetPasswordComponent,
    TestComponent,
    FooterComponent,
    AccountSettingsComponent,
    AdressesComponent,
    PersonalInformationComponent,
    CommandsComponent,
    BillingComponent,
    ShippingComponent,
    RegionComponent,
    MenuAdminComponent,
    CityComponent,
    DashboardComponent,
    ContactComponent,
    BrandComponent,
    CategoryComponent,
    SubCategoryComponent,
    ProductComponent,
    AddProductComponent,
    UpdateProductComponent,
    ColorComponent,
    HomeComponent,
    ProductsComponent,
    MaterialComponent,
    DetailProductComponent,
    InfoSiteComponent,
    MainComponent,
    WishlistComponent,
    CompareComponent,
    ShoppingCartComponent,
    ErrorComponent,
    DiscountComponent,
    CheckoutComponent,
    DeliveryTypeComponent,
    RateComponent,
    ListProductsComponent,
    OrdersComponent,
    NewOrdersComponent,
    ShippedOrdersComponent,
    DeliveredOrdersComponent,
    ClosedOrdersComponent,
    NewsComponent,
    AddNewsComponent,
    UpdateNewsComponent,
    NewsListComponent,
    WhoareweComponent,
    NewArrivalsComponent,
    OnSaleComponent
  ],
  imports: [
    NgxPayPalModule,
    BrowserModule,
    BrowserAnimationsModule,
    LayoutModule,
    MaterialModuleModule,
    MesRoutesModule,
    FormsModule,
    HttpClientModule,
    SnotifyModule,
    ReactiveFormsModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCjBJRd2iKHJnqhotJX4l37K5zW8aEqlcA'
    }),
    FlexLayoutModule,
    SlickCarouselModule,
    ScrollbarModule,
    NgxPaginationModule,
    SwiperModule,
    RecaptchaModule.forRoot(),
    SocialLoginModule,
    SocketIoModule.forRoot(configSocketIo),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
  ],
  providers: [
    UserServicesService,
    AddressService,
    CategoryService,
    SubCategoryService,
    ColorService,
    ContactService,
    BrandService,
    MaterialService,
    ProductService,
    ProfileService,
    RegionService,
    CityService,
    TokenService,
    AuthentificationService,
    BeforeLoginService,
    AfterLoginService,
    {provide: 'SnotifyToastConfig', useValue: ToastDefaults},
    SnotifyService,
    ErrorsMessagesService,
    ProductsResolverService,
    InfoSiteService,
    RegionResolverService,
    {provide: HTTP_INTERCEPTORS, useClass: AuthenticationInterceptorService, multi: true},
    {
      provide: AuthServiceConfig,
      useFactory: getAuthServiceConfigs
    },
    DataService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
