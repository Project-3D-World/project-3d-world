import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private socketio: Socket) {}

  connectToNotifications() {
    this.socketio.connect();
    return this.socketio.fromEvent('notification');
  }
}
