import {Component, OnInit} from '@angular/core';
import {SousCategorie} from '../../../../models/sous-categorie';
import {Categorie} from '../../../../models/categorie';
import {SnotifyService} from 'ng-snotify';
import {CategorieService} from '../../../../services/categorie.service';
import {SousCategorieService} from '../../../../services/sous-categorie.service';
import {Color} from '../../../../models/color';
import {ColorService} from '../../../../services/color.service';
import {Marque} from '../../../../models/marque';
import {MarqueService} from '../../../../services/marque.service';
import {Image} from '../../../../models/image';
import {ModelErrors} from '../../../../models/model-errors';
import {ErrorsMessagesService} from '../../../../services/errors-messages.service';
import {FormControl, Validators} from '@angular/forms';
import {Matiere} from '../../../../models/matiere';
import {MatiereService} from '../../../../services/matiere.service';
import {Observable} from 'rxjs';
import {ErrorsNotifService} from '../../../../services/errors-notif.service';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {Region} from '../../../../models/region';
import {MatChipInputEvent} from '@angular/material';
import {ReductionService} from '../../../../services/reduction.service';
import {Reduction} from '../../../../models/reduction';
import {Product} from '../../../../models/product';
import {ProductService} from '../../../../services/product.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent extends ModelErrors implements OnInit {

  product: Product = new Product();
  sousCategories: SousCategorie[] = [];
  categories: Categorie[];
  reductions: Reduction[];
  marques: Marque[];
  colors: Color[];
  matieres: Matiere[];
  nbFile = 0;

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  fruits: Region[] = [
    {id: 1, name: 'Lemon', api_token: ''}];

  constructor(private sousCategorieService: SousCategorieService,
              private notify: SnotifyService,
              private errorsNotifService: ErrorsNotifService,
              private categorieService: CategorieService,
              private colorService: ColorService,
              private reductionService: ReductionService,
              private matiereService: MatiereService,
              private productService: ProductService,
              private marqueService: MarqueService,
              /*      public productsComponent: ProductsComponent,*/
              erreursMessagesService: ErrorsMessagesService) {
    super(erreursMessagesService);
  }

  ngOnInit() {
    this.categorieService.categories.subscribe(value => {
      this.categories = value;
    });
    this.reductionService.reductions.subscribe(value => {
      this.reductions = value;
    });
    /* this.sousCategorieService.get().subscribe(cats => {
       this.sousCategories = cats;
     }, error1 => console.log(error1));
 */
    this.colorService.colors.subscribe(value => {
      this.colors = value;
    });

    this.matiereService.matieres.subscribe(value => {
      this.matieres = value;
    });

    this.marqueService.get().subscribe(value => {
      this.marques = value;
    }, error1 => console.log(error1));

    this.name = new FormControl('', [Validators.required]);
    this.prix = new FormControl('', [Validators.required, Validators.pattern('^[0-9]+(\.[0-9]{1,2})?$')]);
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
        observer.error(this.errorsNotifService.handleErreur2('', 'Error'));
      });
    });

    this.errorsNotifService.asyncNotif(successAction);
  }

  changeSousCat(val: any) {
    const cat = this.categories.find(value => value.id === val.value);
    this.sousCategories = cat.sous_categories;
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
