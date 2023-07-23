import {Injectable} from '@angular/core';
import {Socket} from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class OrderNotificationService {


  constructor(private socket: Socket) {
  }

  sendMessage(msg: string) {
    this.socket.emit('OrderNotification', msg);
  }

  /* getMessage() {
     return this.socket
       .fromEvent('OrderNotification')
       .map(data => data.msg);
   }*/

  getOnCN() {
     this.socket.on('OrderNotification', function (msg) {
      console.log(msg);
    });
  }
}
