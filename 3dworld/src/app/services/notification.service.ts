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

  getListener() {
    return this.socketio.fromEvent('notification');
  }
}
