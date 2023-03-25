import { Injectable } from '@angular/core';

/**
 * Example world data:
 * {
 *  chunks: [
 *   {
 *     _id: 'chunkid',
 *     upvotes: 0,
 *     downvotes: 0,
 *     chunkFile: 'fileid',
 *     claimedBy: 'userid'
 *   },
 *   ...
 *  ]
 * }
 */

@Injectable({
  providedIn: 'root',
})
export class LiveWorldService {
  static Reaction = {
    upvote: 'upvote',
    downvote: 'downvote',
  };
  private sharedb;
  private worldDoc: any;
  private socket: any;
  private opQueue: any[] = [];

  constructor() {
    this.sharedb = require('sharedb/lib/client');
  }

  async connect(url: string, worldId: string) {
    /**
     * Connect to the live world at url and id. Returns a promise that resolves
     * when the connection is established.
     */
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
          this.opQueue.forEach((op) => {
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
    /**
     * Returns the current world data. Returns null if the world is not connected.
     */
    if (!this.worldDoc) {
      return null;
    }
    return this.worldDoc.data;
  }

  addReaction(chunkId: string, reaction: any) {
    /**
     * Adds a reaction to the chunk with the given id. The reaction must be one of
     * the values in LiveWorldService.Reaction.
     */
    if (reaction !== 'upvote' && reaction !== 'downvote') {
      return;
    }
    const chunkIndex = this.worldDoc.data.chunks.findIndex(
      (chunk: any) => chunk._id === chunkId
    );
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
    /**
     * Registers a callback that is called whenever the world data changes.
     * The callback is passed the `op` that was applied to the world.
     * ie: callback({ p: ['chunks', 0, 'upvotes'], oi: 1 })
     */
    if (!this.worldDoc) {
      return;
    }
    this.worldDoc.on('op', (op: any, source: any) => {
      callback(op);
    });
  }
}
