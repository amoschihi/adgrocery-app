import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ErrorsMessagesService {

  constructor() {
  }

  public getErrorMessageEmail(email) {
    return email.hasError('required') ? 'You must enter a value' :
      email.hasError('email') ? 'Not a valid email' :
        email.hasError('notfound') ? 'jma3' :
          '';
  }

  public getErrorMessagePrice(price) {
    return price.hasError('required') ? 'You must enter a value' :
      price.hasError('pattern') ? 'example : 12.25' :
        '';
  }

  public getErrorMessageStock(price) {
    return price.hasError('required') ? 'You must enter a value' :
      price.hasError('pattern') ? 'Number' :
        '';
  }

  public getErrorMessagePassword(password) {
    return password.hasError('required') ? 'You must enter a value' :
      password.hasError('minlength') ? 'Name must be at least 8 characters long.' : '';
  }

  public getErrorMessageName(name) {
    return name.hasError('required') ? 'You must enter a value' :
      name.hasError('minlength') ? 'Name must be at least 5 characters long.' : '';
  }

  public getErrorMessageConfirm(confirmPassword) {
    return confirmPassword.hasError('required') ? 'You must enter a value' :
      confirmPassword.hasError('confirm') ? 'Two passwords that you enter is inconsistent!' :
        '';
  }

}
