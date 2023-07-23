import {Component, Input, OnInit} from '@angular/core';
import {User} from '../../../models/user';
import {RegionService} from '../../../services/region.service';
import {CityService} from '../../../services/city.service';

@Component({
  selector: 'app-addresses',
  templateUrl: './adresses.component.html',
  styleUrls: ['./adresses.component.css']
})
export class AdressesComponent implements OnInit {
  @Input() user: User;


  constructor(private regionService: RegionService,
              private villeService: CityService) {
  }

  ngOnInit() {
    this.regionService.get().subscribe(value1 => {
    });
    this.villeService.get().subscribe(value1 => {
    });
  }

}
