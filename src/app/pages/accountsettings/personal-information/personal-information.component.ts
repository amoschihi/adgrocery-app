import {Component, OnInit} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {ModelErrors} from '../../../models/model-errors';
import {ErrorsMessagesService} from '../../../services/errors-messages.service';
import {User} from '../../../models/user';
import {ProfileService} from '../../../services/profile.service';
import {Observable} from 'rxjs';
import {ErrorsNotifService} from '../../../services/errors-notif.service';
import {UserServicesService} from '../../../services/user-services.service';
import {Router} from '@angular/router';
import {TokenService} from '../../../services/token.service';
import {AuthentificationService} from '../../../services/authentification.service';

@Component({
  selector: 'app-personal-information',
  templateUrl: './personal-information.component.html',
  styleUrls: ['./personal-information.component.css']
})
export class PersonalInformationComponent extends ModelErrors implements OnInit {
  profile: User = new User();
  oldPassword: string;

  constructor(errorsMessagesService: ErrorsMessagesService,
              private profileService: ProfileService,
              private errorsNotifService: ErrorsNotifService,
              private userService: UserServicesService,
              private tokenService: TokenService,
              private route: Router,
              private authService: AuthentificationService) {
    super(errorsMessagesService);
  }

  ngOnInit() {
    this.email = new FormControl('', [Validators.required, Validators.email]);
    this.password = new FormControl('', [Validators.required]);
    this.password2 = new FormControl('', [Validators.required]);
    this.password_confirmation = new FormControl('', [this.confirmationValidator]);

    this.userService.user.subscribe(value => {
      this.profile = value;
    });
  }

  public save() {
    const successAction = Observable.create(observer => {
      this.profileService.update(this.profile).subscribe(value => {
        observer.next(this.errorsNotifService.handleResponse2('', 'Success'));
        observer.complete();
        // this.errorsNotifService.handleResponse('Success');
      }, error1 => {
        console.log(error1);
        observer.error(this.errorsNotifService.handleError2('', 'Error'));
        // this.errorsNotifService.handleError('Error');
      });
    });

    this.errorsNotifService.asyncNotif(successAction);
  }

  public save2() {
    const successAction = Observable.create(observer => {
      this.profileService.changePassword({
        oldPassword: this.oldPassword,
        password: this.profile.password,
        password_confirmation: this.profile.password_confirmation
      }).subscribe(value => {
        observer.next(this.errorsNotifService.handleResponse2('', 'Success'));
        observer.complete();
        this.userService.logout().subscribe(next => {
          this.tokenService.remove();
          this.authService.changeAuthStatus(false);
          this.route.navigateByUrl('/main/login');
        }, error1 => {
          console.log(error1);
        });
      }, error1 => {
        observer.error(this.errorsNotifService.handleError2('', 'Error'));
      });
    });

    this.errorsNotifService.asyncNotif(successAction);
  }
}
