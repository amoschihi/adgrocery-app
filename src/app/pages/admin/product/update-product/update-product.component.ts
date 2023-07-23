import {Component, OnInit} from '@angular/core';
import {ModelErrors} from '../../../../models/model-errors';
import {FormControl, Validators} from '@angular/forms';
import {ErrorsMessagesService} from '../../../../services/errors-messages.service';
import {Category} from '../../../../models/category';
import {Product} from '../../../../models/product';
import {Brand} from '../../../../models/brand';
import {SubCategory} from '../../../../models/sub-category';
import {Material} from '../../../../models/material';
import {Color} from '../../../../models/color';
import {ActivatedRoute} from '@angular/router';
import {ColorService} from '../../../../services/color.service';
import {SubCategoryService} from '../../../../services/sub-category.service';
import {MaterialService} from '../../../../services/material.service';
import {CategoryService} from '../../../../services/category.service';
import {ProductService} from '../../../../services/product.service';
import {BrandService} from '../../../../services/brand.service';
import {ErrorsNotifService} from '../../../../services/errors-notif.service';
import {SnotifyService} from 'ng-snotify';
import {Image} from '../../../../models/image';
import {environment} from '../../../../../environments/environment';
import {Observable} from 'rxjs';
import {DiscountService} from '../../../../services/discount.service';
import {Discount} from '../../../../models/discount';

@Component({
  selector: 'app-update-product',
  templateUrl: './update-product.component.html',
  styleUrls: ['./update-product.component.css']
})
export class UpdateProductComponent extends ModelErrors implements OnInit {
  product: Product = new Product();
  subCategories: SubCategory[] = [];
  categories: Category[];
  brands: Brand[];
  colors: Color[];
  discounts: Discount[];
  materials: Material[];
  nbFile = 0;
  url: string = environment.urlServeur2;
  selected = 0;
  colors_id = [];
  materials_id = [];

  constructor(private subCategoryService: SubCategoryService,
              private notify: SnotifyService,
              private categoryService: CategoryService,
              private colorService: ColorService,
              private materialService: MaterialService,
              private discountService: DiscountService,
              private productService: ProductService,
              private brandService: BrandService,
              private errorsNotifService: ErrorsNotifService,
              private route: ActivatedRoute,
              errorsMessagesService: ErrorsMessagesService) {
    super(errorsMessagesService);
  }

  ngOnInit() {
    this.route.data.subscribe((value: { product: Product }) => {
      this.product = value.product;
      this.subCategories = this.product.category.sub_categories;
      this.colors_id = this.product.article.colors.map(value1 => value1.id);
      this.materials_id = this.product.article.materials.map(value1 => value1.id);
      console.log(this.colors_id);
      console.log(this.product);
    }, error1 => {
      console.log(error1);
    });
    this.categoryService.categories.subscribe(value => {
      this.categories = value;
    });
    /* this.subCategoryService.get().subscribe(cats => {
       this.subCategories = cats;
     }, error1 => console.log(error1));
 */
    this.colorService.colors.subscribe(value => {
      this.colors = value;
    });
    this.discountService.discounts.subscribe(value => {
      this.discounts = value;
    });

    this.materialService.materials.subscribe(value => {
      this.materials = value;
    });

    this.brandService.get().subscribe(value => {
      this.brands = value;
    }, error1 => console.log(error1));


    this.name = new FormControl('', [Validators.required]);
    this.price = new FormControl('', [Validators.required, Validators.pattern('^[0-9]+(\.[0-9]{1,2})?$')]);
    this.stock = new FormControl('', [Validators.required, Validators.pattern('^[0-9]+$')]);
    // this.email = new FormControl('', [Validators.required]);
    this.nbFile = this.product.article.images.length;
  }

  save(myForm: any) {
    this.product.article.colors = this.colors_id;
    this.product.article.materials = this.materials_id;
    const successAction = Observable.create(observer => {
      this.productService.update(this.product).subscribe(value => {
        observer.next(this.errorsNotifService.handleResponse2('', 'Success'));
        observer.complete();
        this.productService.get(true);
      }, error1 => {
        console.log(error1);
        observer.error(this.errorsNotifService.handleError2('', 'Error'));
      });
    });

    this.errorsNotifService.asyncNotif(successAction);
  }

  changeSousCat(val: any) {
    const cat = this.categories.find(value => value.id === val.value);
    this.subCategories = cat.sub_categories;
  }

  removeAll() {
    for (const image of this.product.article.images) {
      if (image.id) {
        this.productService.deleteImage(image).subscribe(value => {
          console.log(value);
        }, error1 => {
          console.log(error1);
        });
      }
    }
    this.product.article.images = [];
    this.nbFile = this.product.article.images.length;
  }

  remove(image: Image): void {
    const index = this.product.article.images.indexOf(image);

    if (index >= 0) {
      this.product.article.images.splice(index, 1);
    }
    if (image.id) {
      this.productService.deleteImage(image).subscribe(value => {
        console.log(value);
      }, error1 => {
        console.log(error1);
      });
    }
    this.nbFile = this.product.article.images.length;
  }

  OnChimages(images: any) {
    for (const file of images.files) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const Im = new Image();
        Im.name = file.name;
        Im.type = file.type;
        Im.value = reader.result.split(',')[1];
        Im.src = reader.result;
        console.log(reader.result);
        this.product.article.images.push(Im);
        this.nbFile = this.product.article.images.length;
      };
    }
  }
}
