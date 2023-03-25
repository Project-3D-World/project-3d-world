import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LiveWorldService {
  static Reaction = {
    upvote: 'upvote',
    downvote: 'downvote'
  }
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
      this.worldDoc = null;
    }
  }

  getWorldData() {
    if (!this.worldDoc) {
      return null;
    }
    return this.worldDoc.data;
  }

  addReaction(chunkId: string, reaction: any) {
    if (reaction !== 'upvote' && reaction !== 'downvote') {
      return;
    }
    const chunkIndex = this.worldDoc.data.chunks.findIndex((chunk: any) => chunk._id === chunkId);
    if (chunkIndex === -1) {
      return;
    }
    this.submitOp({ p: ['chunks', chunkIndex, reaction], oi: 1 });
  }

  private submitOp(op: any) {
    if (this.worldDoc) {
      this.worldDoc.submitOp(op);
    } else {
      this.opQueue.push(op);
    }
  }

  onWorldChange(callback: any) {
    if (!this.worldDoc) {
      return;
    }
    this.worldDoc.on('op', (op: any, source: any) => {
      callback(op);
    });
  }

}
