import {Component, OnInit} from '@angular/core';
import {ModelErrors} from '../../../../models/model-errors';
import {FormControl, Validators} from '@angular/forms';
import {ErrorsMessagesService} from '../../../../services/errors-messages.service';
import {Categorie} from '../../../../models/categorie';
import {Product} from '../../../../models/Product';
import {Marque} from '../../../../models/marque';
import {SousCategorie} from '../../../../models/sous-categorie';
import {Matiere} from '../../../../models/matiere';
import {Color} from '../../../../models/color';
import {ActivatedRoute} from '@angular/router';
import {ColorService} from '../../../../services/color.service';
import {SousCategorieService} from '../../../../services/sous-categorie.service';
import {MatiereService} from '../../../../services/matiere.service';
import {CategorieService} from '../../../../services/categorie.service';
import {ProductService} from '../../../../services/Product.service';
import {MarqueService} from '../../../../services/marque.service';
import {ErrorsNotifService} from '../../../../services/errors-notif.service';
import {SnotifyService} from 'ng-snotify';
import {Image} from '../../../../models/image';
import {environment} from '../../../../../environments/environment';
import {Observable} from 'rxjs';
import {ReductionService} from '../../../../services/reduction.service';
import {Reduction} from '../../../../models/reduction';

@Component({
  selector: 'app-update-product',
  templateUrl: './update-product.component.html',
  styleUrls: ['./update-product.component.css']
})
export class UpdateProductComponent extends ModelErrors implements OnInit {
  Product: Product = new Product();
  sousCategories: SousCategorie[] = [];
  categories: Categorie[];
  marques: Marque[];
  colors: Color[];
  reductions: Reduction[];
  matieres: Matiere[];
  nbFile = 0;
  url: string = environment.urlServeur2;
  selected = 0;
  colors_id = [];
  matieres_id = [];

  constructor(private sousCategorieService: SousCategorieService,
              private notify: SnotifyService,
              private categorieService: CategorieService,
              private colorService: ColorService,
              private matiereService: MatiereService,
              private reductionService: ReductionService,
              private productService: ProductService,
              private marqueService: MarqueService,
              private errorsNotifService: ErrorsNotifService,
              private route: ActivatedRoute,
              erreursMessagesService: ErrorsMessagesService) {
    super(erreursMessagesService);
  }

  ngOnInit() {
    this.route.data.subscribe((value: { Product: Product }) => {
      this.Product = value.Product;
      this.sousCategories = this.Product.categorie.sous_categories;
      this.colors_id = this.Product.article.colors.map(value1 => value1.id);
      this.matieres_id = this.Product.article.matieres.map(value1 => value1.id);
      console.log(this.colors_id);
      console.log(this.Product);
    }, error1 => {
      console.log(error1);
    });
    this.categorieService.categories.subscribe(value => {
      this.categories = value;
    });
    /* this.sousCategorieService.get().subscribe(cats => {
       this.sousCategories = cats;
     }, error1 => console.log(error1));
 */
    this.colorService.colors.subscribe(value => {
      this.colors = value;
    });
    this.reductionService.reductions.subscribe(value => {
      this.reductions = value;
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
    // this.email = new FormControl('', [Validators.required]);
    this.nbFile = this.Product.article.images.length;
  }

  save(myform: any) {
    this.Product.article.colors = this.colors_id;
    this.Product.article.matieres = this.matieres_id;
    const successAction = Observable.create(observer => {
      this.productService.update(this.Product).subscribe(value => {
        observer.next(this.errorsNotifService.handleResponse2('', 'Success'));
        observer.complete();
        this.productService.get(true);
      }, error1 => {
        console.log(error1);
        observer.error(this.errorsNotifService.handleErreur2('', 'Error'));
      });
    });

    this.errorsNotifService.asyncNotif(successAction);
  }

  changeSousCat(val: any) {
    const cat = this.categories.find(value => value.id === val.value);
    this.sousCategories = cat.sous_categories;
  }

  removeAll() {
    for (const image of this.Product.article.images) {
      if (image.id) {
        this.productService.deleteImage(image).subscribe(value => {
          console.log(value);
        }, error1 => {
          console.log(error1);
        });
      }
    }
    this.Product.article.images = [];
    this.nbFile = this.Product.article.images.length;
  }

  remove(image: Image): void {
    const index = this.Product.article.images.indexOf(image);

    if (index >= 0) {
      this.Product.article.images.splice(index, 1);
    }
    if (image.id) {
      this.productService.deleteImage(image).subscribe(value => {
        console.log(value);
      }, error1 => {
        console.log(error1);
      });
    }
    this.nbFile = this.Product.article.images.length;
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
        this.Product.article.images.push(Im);
        this.nbFile = this.Product.article.images.length;
      };
    }
  }
}
