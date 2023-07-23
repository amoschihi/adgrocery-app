import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

    constructor() {
    }

    ngOnInit(): void {
        /*  this.authService.authStatus.subscribe(next => {
              this.loggedIn = next;
          });
          if (!this.loggedIn) {
              this.route.navigateByUrl('/login');
          }*/
    }

}
