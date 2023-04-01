import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private socketio: Socket) {}

  connect() {
    this.socketio.connect();
  }

  sendNotification(notification: any) {
    // check for required fields
    if (
      !notification?.receiver ||
      !notification?.rating ||
      !notification?.worldName ||
      !notification?.worldId
    ) {
      console.log(
        'NotificationService: sendNotification: missing required fields'
      );
      return;
    }
    this.socketio.emit('notification', notification);
  }

  getNotifications() {
    return this.socketio.fromEvent('notification');
  }
}
