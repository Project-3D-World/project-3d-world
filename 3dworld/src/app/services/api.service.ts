import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable, Subscription } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class ApiService {
  endpoint = environment.apiEndpoint;
  constructor(private http: HttpClient) {}

  signIn(profile: string) {
    console.log(profile);
    const profileJson = JSON.parse(profile);
    if (profileJson?.sub) {
      return this.http.post(this.endpoint + '/api/users/signin', {
        sub: profileJson.sub,
      });
    } else {
      return new Observable();
    }
  }

  signUp(profile: string, displayName: string) {
    console.log(profile, displayName);
    const profileJson = JSON.parse(profile);
    if (profileJson?.sub) {
      return this.http.post(this.endpoint + '/api/users/signup', {
        sub: profileJson.sub,
        displayName: displayName,
      });
    } else {
      return new Observable();
    }
  }

  signOut() {
    return this.http.get(this.endpoint + '/api/users/signout');
  }

  //world apis

  //claim a chunk for a user
  claimChunk(worldId: string, chunkId: string) {
    return this.http.patch(this.endpoint + '/api/worlds/' + worldId + '/chunks/' + chunkId, {});
  }

  //get a world by id
  getWorld(worldId: string) {
    return this.http.get(this.endpoint + '/api/worlds/' + worldId);
  }

  //get all worlds
  getAllWorlds() {
    return this.http.get(this.endpoint + '/api/worlds');
  }

  /*
  //create a new world

  createWorld(worldName: string, description: string, rules: string, chunksize: number, numberOfChunks: number) {

    let chunks = [];

    for( let i = 0; i < numberOfChunks; i++)
    {
      for(let j = 0; j < numberOfChunks; j++)
      {
        chunks.push({x: i*chunksize, z: j*chunksize});
      }
    }
  createWorld(
    worldName: string,
    description: string,
    rules: string,
    chunksize: number,
    numberOfChunks: number
  ) {

    return this.http.post(this.endpoint + '/api/worlds', {
      name: worldName,
      chunkSize: { x: chunksize, y: chunksize, z: chunksize},
      description: description ,
      rules: rules,
      chunks: chunks

      chunks: [{ x: numberOfChunks, z: numberOfChunks }],

    });
  }
  */

  //upload a gltf model to a chunk
  //check how to send the file to backend
  uploadModel(worldId: string, chunkId: string, model: File) {
    return this.http.post(
      this.endpoint + '/api/worlds/' + worldId + '/chunks/' + chunkId + '/file',
      model
    );
  }

  getMe() {
    return this.http.get(this.endpoint + '/api/users/me');
  }

  getWorlds() {
    return this.http.get(this.endpoint + '/api/worlds');
  }

  getCommentsForWorld(worldId: string, page: number, limit: number) {
    return this.http.get(
      this.endpoint +
        `/api/comments/worldId=${worldId}&page=${page}&limit=${limit}`
    );
  }

  postComment(
    worldId: string,
    x: number,
    z: number,
    author: string,
    content: string
  ) {
    console.log(worldId, x, z, author, content);
    return this.http.post(this.endpoint + `/api/comments/`, {
      worldId: worldId,
      author: author,
      x: x,
      z: z,
      content: content,
    });
  }
}
