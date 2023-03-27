import { HttpClient, HttpHeaders } from '@angular/common/http';
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
    const profileJson = JSON.parse(profile);
    if (profileJson?.sub) {
      return this.http.post(
        this.endpoint + '/api/users/signin',
        {
          sub: profileJson.sub,
        },
        { withCredentials: true }
      );
    } else {
      return new Observable((observer) => {
        observer.error(new Error('Something went wrong!'));
      });
    }
  }

  signUp(profile: string, displayName: string) {
    const profileJson = JSON.parse(profile);
    if (profileJson?.sub) {
      return this.http.post(
        this.endpoint + '/api/users/signup',
        {
          sub: profileJson.sub,
          displayName: displayName,
        },
        { withCredentials: true }
      );
    } else {
      return new Observable((observer) => {
        observer.error(new Error('Something went wrong!'));
      });
    }
  }

  signOut() {
    return this.http.get(this.endpoint + '/api/users/signout', {
      withCredentials: true,
    });
  }

  getMe() {
    return this.http.get(this.endpoint + '/api/users/me', {
      withCredentials: true,
    });
  }

  //postComment
  postComment(
    worldId: string,
    x: number,
    z: number,
    author: string,
    content: string
  ) {
    return this.http.post(
      this.endpoint + `/api/comments/`,
      {
        worldId: worldId,
        author: author,
        x: x,
        z: z,
        content: content,
      },
      { withCredentials: true }
    );
  }

  getComments(
    worldId: string,
    x: number,
    z: number,
    page: number,
    limit: number
  ) {
    return this.http.get(
      this.endpoint +
        `/api/comments/worldId=${worldId}&x=${x}&z=${z}&page=${page}&limit=${limit}`,
      { withCredentials: true }
    );
  }

  deleteComment(id: string) {
    return this.http.delete(this.endpoint + `/api/comments/${id}`, {
      withCredentials: true,
    });
  }
  //world apis

  //claim a chunk for a user
  claimChunk(worldId: string, chunkId: string) {
    return this.http.patch(
      this.endpoint + '/api/worlds/' + worldId + '/chunks/' + chunkId,
      {},
      { withCredentials: true }
    );
  }

  //get a world by id
  getWorld(worldId: string) {
    return this.http.get<JSON>(this.endpoint + '/api/worlds/' + worldId, {
      withCredentials: true,
    });
  }

  //get all worlds
  getAllWorlds() {
    return this.http.get<JSON>(this.endpoint + '/api/worlds', {
      withCredentials: true,
    });
  }

  //create a new world
  createWorld(
    worldName: string,
    description: string,
    rules: string,
    chunksize: number,
    numberOfChunks: number
  ) {
    let chunks = [];

    for (let i = 0; i < numberOfChunks; i++) {
      for (let j = 0; j < numberOfChunks; j++) {
        chunks.push({ x: i * chunksize, z: j * chunksize });
      }
    }

    return this.http.post(
      this.endpoint + '/api/worlds',
      {
        name: worldName,
        chunkSize: { x: chunksize, y: chunksize, z: chunksize },
        description: description,
        rules: rules,

        chunks: chunks,
      },
      { withCredentials: true }
    );
  }

  //upload a gltf model to a chunk
  //check how to send the file to backend
  uploadModel(worldId: string, chunkId: string, model: File) {
    const headers = new HttpHeaders({
      "Accept-Encoding" : "gzip, deflate, br",
    });
    let formData = new FormData();
    formData.append('chunkFile', model);
    return this.http.post(
      this.endpoint + '/api/worlds/' + worldId + '/chunks/' + chunkId + '/file',
      formData,
      { withCredentials: true, headers: headers }, 
    );
  }
}
