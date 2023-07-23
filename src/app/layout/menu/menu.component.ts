import {Component, Input, OnInit} from '@angular/core';
import {CategoryService} from '../../services/category.service';
import {Category} from '../../models/category';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  @Input() public loggedIn: boolean;
  categories: Category[];

  constructor(private categoryService: CategoryService) {
  }

  ngOnInit() {
    this.categoryService.get().subscribe(value => {
      this.categories = value;
    }, error1 => console.log(error1));
  }

}
