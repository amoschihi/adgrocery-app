import {ErrorsMessagesService} from '../services/errors-messages.service';
import {FormControl} from '@angular/forms';

export class ModelErrors {
  fName = null;
  lName = null;
  phone = null;
  address = null;
  infoC = null;
  region = null;
  city = null;
  price = null;
  stock = null;
  email = null;
  password = null;
  password2 = null;
  name = null;
  password_confirmation = null;
  confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return {required: true};
    } else if (control.value !== this.password.value) {
      return {confirm: true, error: true};
    }
  }

  constructor(private errorsMessagesService: ErrorsMessagesService) {
  }

  public getErrorMessageEmail() {
    return this.errorsMessagesService.getErrorMessageEmail(this.email);
  }

  public getErrorMessagePrix() {
    return this.errorsMessagesService.getErrorMessagePrice(this.price);
  }

  public getErrorMessageStock() {
    return this.errorsMessagesService.getErrorMessageStock(this.stock);
  }

  public getErrorMessagePassword() {
    return this.errorsMessagesService.getErrorMessagePassword(this.password);
  }


  public getErrorMessageConfirm() {
    return this.errorsMessagesService.getErrorMessageConfirm(this.password_confirmation);
  }

  public getErrorMessageName() {
    return this.errorsMessagesService.getErrorMessageName(this.name);
  }

  public getErrorMessageFName() {
    return this.errorsMessagesService.getErrorMessageName(this.fName);
  }

  public getErrorMessageLName() {
    return this.errorsMessagesService.getErrorMessageName(this.lName);
  }

  public getErrorMessageAdresse() {
    return this.errorsMessagesService.getErrorMessageName(this.address);
  }

  public getErrorMessageRegion() {
    return this.errorsMessagesService.getErrorMessageName(this.region);
  }

  public getErrorMessageVille() {
    return this.errorsMessagesService.getErrorMessageName(this.city);
  }

  public getErrorMessagePhone() {
    return this.errorsMessagesService.getErrorMessageName(this.phone);
  }

  public getErrorMessageInfoC() {
    return this.errorsMessagesService.getErrorMessageName(this.infoC);
  }
}
