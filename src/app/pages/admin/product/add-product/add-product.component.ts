import {Component, OnInit} from '@angular/core';
import {SubCategory} from '../../../../models/sub-category';
import {Category} from '../../../../models/category';
import {SnotifyService} from 'ng-snotify';
import {CategoryService} from '../../../../services/category.service';
import {SubCategoryService} from '../../../../services/sub-category.service';
import {Color} from '../../../../models/color';
import {ColorService} from '../../../../services/color.service';
import {Brand} from '../../../../models/brand';
import {BrandService} from '../../../../services/brand.service';
import {Image} from '../../../../models/image';
import {ModelErrors} from '../../../../models/model-errors';
import {ErrorsMessagesService} from '../../../../services/errors-messages.service';
import {FormControl, Validators} from '@angular/forms';
import {Material} from '../../../../models/material';
import {MaterialService} from '../../../../services/material.service';
import {Observable} from 'rxjs';
import {ErrorsNotifService} from '../../../../services/errors-notif.service';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {Region} from '../../../../models/region';
import {MatChipInputEvent} from '@angular/material';
import {DiscountService} from '../../../../services/discount.service';
import {Discount} from '../../../../models/discount';
import {Product} from '../../../../models/product';
import {ProductService} from '../../../../services/product.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent extends ModelErrors implements OnInit {

  product: Product = new Product();
  subCategories: SubCategory[] = [];
  categories: Category[];
  discounts: Discount[];
  brands: Brand[];
  colors: Color[];
  materials: Material[];
  nbFile = 0;

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  fruits: Region[] = [
    {id: 1, name: 'Lemon', api_token: ''}];

  constructor(private subCategoryService: SubCategoryService,
              private notify: SnotifyService,
              private errorsNotifService: ErrorsNotifService,
              private categoryService: CategoryService,
              private colorService: ColorService,
              private discountService: DiscountService,
              private materialService: MaterialService,
              private productService: ProductService,
              private marqueService: BrandService,
              /*      public productsComponent: ProductsComponent,*/
              errorsMessagesService: ErrorsMessagesService) {
    super(errorsMessagesService);
  }

  ngOnInit() {
    this.categoryService.categories.subscribe(value => {
      this.categories = value;
    });
    this.discountService.discounts.subscribe(value => {
      this.discounts = value;
    });
    /* this.subCategoryService.get().subscribe(cats => {
       this.subCategories = cats;
     }, error1 => console.log(error1));
 */
    this.colorService.colors.subscribe(value => {
      this.colors = value;
    });

    this.materialService.materials.subscribe(value => {
      this.materials = value;
    });

    this.marqueService.get().subscribe(value => {
      this.brands = value;
    }, error1 => console.log(error1));

    this.name = new FormControl('', [Validators.required]);
    this.price = new FormControl('', [Validators.required, Validators.pattern('^[0-9]+(\.[0-9]{1,2})?$')]);
    this.stock = new FormControl('', [Validators.required, Validators.pattern('^[0-9]+$')]);
    this.email = new FormControl('', [Validators.required]);
    this.product.article.images = [];
  }

  OnChimages(images: any) {
    /* this.product.article.images = [];*/
    for (const file of images.files) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const Im = new Image();
        Im.name = file.name;
        Im.type = file.type;
        Im.value = reader.result.split(',')[1];
        Im.src = reader.result;
        // console.log(reader.result);
        this.product.article.images.push(Im);
        // this.Product.article.images = [...this.Product.article.images, Im];
        this.nbFile = this.product.article.images.length;
      };
    }
  }

  save(myform: any) {
    const successAction = Observable.create(observer => {
      this.productService.save(this.product).subscribe(value => {
        console.log(value);
        observer.next(this.errorsNotifService.handleResponse2('', 'Success'));
        this.productService.get(true);
        this.product = new Product();
        this.product.article.images = [];
        this.nbFile = 0;
        // myform.reset();
        observer.complete();
      }, error1 => {
        observer.error(this.errorsNotifService.handleError2('', 'Error'));
      });
    });

    this.errorsNotifService.asyncNotif(successAction);
  }

  changeSousCat(val: any) {
    const cat = this.categories.find(value => value.id === val.value);
    this.subCategories = cat.subCategories;
  }


  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.fruits.push({id: 0, api_token: '', name: value.trim()});
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  removeAll() {
    this.product.article.images = [];
    this.nbFile = this.product.article.images.length;
  }

  remove(image: Image): void {
    const index = this.product.article.images.indexOf(image);

    if (index >= 0) {
      this.product.article.images.splice(index, 1);
    }
    this.nbFile = this.product.article.images.length;
  }
}
