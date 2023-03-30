import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

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

  async connect(worldId: string) {
    /**
     * Connect to the live world at url and id. Returns a promise that resolves
     * when the connection is established.
     */
    const url = environment.wsEndpoint + '/api/worlds/' + worldId + '/live';
    if (this.socket) {
      this.socket.close();
    }
    this.socket = new WebSocket(url);

    return new Promise<void>((resolve, reject) => {
      // add listener event for when the server closes the connection due to an error
      this.socket.addEventListener('close', (event: any) => {
        if (event.code >= 4000) {
          reject({
            code: event.code,
            reason: event.reason,
          });
        }
      });
      const connection = new this.sharedb.Connection(this.socket);
      this.worldDoc = connection.get('live_worlds', worldId);
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
