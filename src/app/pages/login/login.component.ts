import {Component, OnInit} from '@angular/core';
import {User} from '../../models/user';
import {UserServicesService} from '../../services/user-services.service';
import {TokenService} from '../../services/token.service';
import {FormControl} from '@angular/forms';
import {ErrorsMessagesService} from '../../services/errors-messages.service';
import {ModelErrors} from '../../models/model-errors';
import {SnotifyService} from 'ng-snotify';
import {AuthService, FacebookLoginProvider, GoogleLoginProvider} from 'angular5-social-login';
import {AppComponent} from '../../app.component';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent extends ModelErrors implements OnInit {
  hide = true;

  reCaptchaKey = environment.reCaptchaKey;

  constructor(
    private userService: UserServicesService,
    private tokenService: TokenService,
    errorsMessagesService: ErrorsMessagesService,
    private notify: SnotifyService,
    private socialAuthService: AuthService,
    public appComponent: AppComponent) {
    super(errorsMessagesService);
  }

  public myUser: User = new User();

  submitted = false;

  error = false;
  emailNotFound = (control: FormControl): { [s: string]: boolean } => {
    if (this.error) {
      return {notfound: true, error: true};
    }
  }

  onSubmit(captchaResponse: string) {
    this.appComponent.load = true;
    this.myUser.captcha = captchaResponse;
    console.log(this.myUser);
    this.userService.login(this.myUser).subscribe(data => {
      this.appComponent.load = false;
      this.userService.handleResponse(data, '/main/accountSettingsComponent');
    }, error => {
      this.appComponent.load = false;
      this.error = true;
      this.email.setErrors({'incorrect': true});
    });
  }


  private handleError(error) {
    this.error = error.error.error;
  }

  ngOnInit() {
    this.email = new FormControl('', [this.emailNotFound]);
  }

  public signinWithGoogle() {
    const socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;

    this.socialAuthService.signIn(socialPlatformProvider).then(
      (userData) => {
        /*this.sendToRestApiMethod(userData.idToken);*/
        this.appComponent.load = true;
        this.userService.loginWithGoogle(userData.idToken).subscribe(value => {
          this.userService.handleResponse(value, '/main/accountSettingsComponent');
          this.appComponent.load = false;
        }, error1 => {
          this.appComponent.load = false;
        });
      }
    );
  }

  public facebookLogin() {
    const socialPlatformProvider = FacebookLoginProvider.PROVIDER_ID;
    this.socialAuthService.signIn(socialPlatformProvider).then(
      (userData) => {
        this.appComponent.load = true;
        this.userService.loginWithFacebook(userData.token).subscribe(value => {
          this.userService.handleResponse(value, '/main/accountSettingsComponent');
          this.appComponent.load = false;
        }, error1 => {
          this.appComponent.load = false;
        });
      }
    );
  }
}
