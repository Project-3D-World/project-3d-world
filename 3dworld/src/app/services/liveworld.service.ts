import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LiveWorldService {
  private sharedb;
  private worldDoc: any;
  private socket: any;
  private opQueue: any[] = [];
  
  constructor() { 
    this.sharedb = require('sharedb/lib/client');
  }

  async connect(url: string, worldId: string) {
    if (this.socket) {
      this.socket.close();
    }
    this.socket = new WebSocket(url);
    const connection = new this.sharedb.Connection(this.socket);
    this.worldDoc = connection.get('worlds', worldId);
    
    return new Promise<void>((resolve, reject) => {
      this.worldDoc.subscribe((err: any) => {
        if (err) {
          reject(err);
        } else {
          this.opQueue.forEach(op => {
            this.worldDoc.submitOp(op);
          });
          this.opQueue = [];
          resolve();
        }
      });
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
    }
  }

  getWorldData() {
    return this.worldDoc.data;
  }

  submitOp(op: any) {
    if (this.worldDoc) {
      this.worldDoc.submitOp(op);
    } else {
      this.opQueue.push(op);
    }
  }

  onWorldChange(callback: any) {
    this.worldDoc.on('op', (op: any, source: any) => {
      if (!source) {
        callback(op);
      }
    });
  }

}
