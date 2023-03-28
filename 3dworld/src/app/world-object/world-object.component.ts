import { AfterViewInit, Component, Input, OnDestroy } from '@angular/core';

import * as THREE from 'three';
import * as JSZip from 'jszip';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { ApiService } from '../services/api.service';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
@Component({
  selector: 'app-world-object',
  templateUrl: './world-object.component.html',
  styleUrls: ['./world-object.component.scss'],
})
export class WorldObjectComponent implements AfterViewInit {
  @Input() worldId!: string;
  scene!: THREE.Scene;
  camera!: THREE.PerspectiveCamera;
  renderer!: THREE.WebGLRenderer;
  raycaster!: THREE.Raycaster;
  mouse!: THREE.Vector2;
  models!: THREE.Group[];
  ambientLight!: THREE.AmbientLight;
  controls!: OrbitControls;
  loader!: GLTFLoader;
  x!: number;
  z!: number;
  chunkId!: string;
  comments: any = [];
  user: any;
  commentPage: number = 0;
  commentLimit: number = 10;
  userId: string = '';

  offsetLeft!: number;
  offsetTop!: number;
  width!: number;
  height!: number;
  canvas!: HTMLCanvasElement;

  constructor(private api: ApiService) {}

  claimPlot(userInput: boolean): void {
    if(userInput){
    this.api.claimChunk(this.worldId, this.chunkId).subscribe((data) => {
      console.log(data);
    });
    }
  }

  async getChunkFile(chunkId: string): Promise<any> {
    const data = await this.api.getChunkFile(this.worldId, chunkId).toPromise();
    console.log(data);
    return data;
  }

  uploadModel(event: any): void {
    console.log(event);
    this.api
      .uploadModel(this.worldId, this.chunkId, event)
      .subscribe((data) => {
        console.log(data);
      });
  }

  createWorld(): void {
    this.api
      .createWorld('world', 'world description', 'world rules', 5, 4)
      .subscribe((data) => {
        console.log(data);
      });
  }

  onWindowResize() {
    this.canvas.width = window.innerWidth * 0.8;
    this.canvas.height = window.innerHeight * 0.8;
    this.camera.aspect = this.canvas.width / this.canvas.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.canvas.width, this.canvas.height);
  }

  loadChunks() {
    this.api.getWorld(this.worldId).subscribe((data) => {
      let id = (<any>data).world._id;
      let chunks = (<any>data).world.chunks;
      let sidelength = Math.sqrt(chunks.length);
      let chunkSize = (<any>data).world.chunkSize.x;
      console.log(id);
      console.log(chunks);
      console.log(sidelength);
      console.log(chunkSize);

      for (let x = 0; x < sidelength * sidelength; x++) {
        const coordX = (<any>data).world.chunks[x].location.x;
        const coordZ = (<any>data).world.chunks[x].location.z;
        if ((<any>data).world.chunks[x].chunkFile != null) {
          /*
          this.loader.load(
            (<any>data).world.chunks[x].chunkFile.toString(),
            (gltf) => {
              gltf.scene.scale.set(5, 5, 5);
              gltf.scene.position.set(coordX, 0, coordZ);
              this.models.push(gltf.scene);
              this.scene.add(gltf.scene);
            },
            function (xhr) {
              console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
            },
            function (error) {
              console.error(error);
            }
          );
          */

        this.getChunkFile((<any>data).world.chunks[x]._id).then((data) => {
          console.log(data);
          const blob = data;
          console.log(blob);

          const zip = new JSZip();
          const loadingManager = new THREE.LoadingManager();
          zip.loadAsync(blob).then((zip) => {
            const gltfFile = zip.file(/\.gltf$/i)[0];
            if (!gltfFile) {
              throw new Error('GLTF file not found in zip');
            }
            /*
            loadingManager.setURLModifier(async (url: string) => {
              const file = zip.file(url);
              if (file) {
                const fileData = await file.async('arraybuffer');
                return URL.createObjectURL(new Blob([fileData]));
              }
              return url;
            });
            */
            loadingManager.setURLModifier((url: string) => {
              return new Promise<string>(async resolve => {
                const file = zip.file(url);
                if (file) {
                  const fileData = await file.async('arraybuffer');
                  resolve(URL.createObjectURL(new Blob([fileData])));
                } else {
                  resolve(url);
                }
              });
            });

            return gltfFile.async('arraybuffer'); // extract the GLTF file as a blob
          }).then((gltfBlob) => {
            console.log("GLTF BLOB", gltfBlob)
            this.loader.parse(gltfBlob, '', (gltf) => {
              console.log("GLTF LOADED SUCCESSFULLY", gltf)
              gltf.scene.scale.set(5, 5, 5);
              gltf.scene.position.set(coordX, 0, coordZ);
              this.models.push(gltf.scene);
              this.scene.add(gltf.scene);
            });

            /*this.loader.load(url,
              gltf => {
                console.log("GLTF LOADED SUCCESSFULLY", gltf)
                gltf.scene.scale.set(5, 5, 5);
                gltf.scene.position.set(coordX, 0, coordZ);
                this.models.push(gltf.scene);
                this.scene.add(gltf.scene);
              },
              function (xhr) {
                console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
              },
              function (error) {
                console.error(error);
              }
            );*/
          });
        });
         
         /*this.loader.loadAsync((<any>data).world.chunks[x].chunkFile.toString()).then((gltf) => {
          gltf.scene.scale.set(5, 5, 5);
          gltf.scene.position.set(coordX, 0, coordZ);
          this.models.push(gltf.scene);
          this.scene.add(gltf.scene);
        });
        */

        } else {
          console.log((<any>data).world.chunks[x]._id);
          const geometry = new THREE.BoxGeometry(
            chunkSize - 1,
            1,
            chunkSize - 1
          );
          const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
          const cube = new THREE.Mesh(geometry, material);
          cube.position.set(coordX, 0, coordZ);
          let group = new THREE.Group();
          group.add(cube);
          this.scene.add(group);
          this.models.push(group); // add each cube to the array
        }
      }
    });
  }

  deleteComment(event: string) {
    this.api.deleteComment(event).subscribe();
    this.getComments(0, this.commentLimit);
  }
  newComment(event: string) {
    this.api
      .postComment(this.worldId, this.x, this.z, this.user.userId, event)
      .subscribe();
    this.getComments(0, 10);
    this.commentPage = 0;
  }

  getComments(page: number, limit: number) {
    this.commentPage = page;
    this.api.getComments(this.worldId, this.x, this.z, page, limit).subscribe({
      next: (value) => {
        this.comments = value;
      },
      error: (err) => {
        console.error(err);
      },
      complete: () => {
        console.log('attempted get comments');
      },
    });
  }

  public onClick(event: MouseEvent): void {
    const canvasBounds = this.canvas.getBoundingClientRect();
    // calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components
    this.mouse.x =
      ((event.clientX - canvasBounds.left) / this.canvas.width) * 2 - 1;
    this.mouse.y =
      -((event.clientY - canvasBounds.top) / this.canvas.height) * 2 + 1;
    // update the picking ray with the camera and mouse position
    this.raycaster.setFromCamera(this.mouse, this.camera);
    // calculate objects intersecting the picking ray
    const intersects = this.raycaster.intersectObjects(this.models, true);

    for (let i = 0; i < intersects.length; i++) {
      // perform the desired action on the clicked cube(s)
      //claim the cube by sending an api request to the server
      const model = intersects[i].object;

      console.log(model);
      console.log(model.getWorldPosition(new THREE.Vector3()));
      const position = model.getWorldPosition(new THREE.Vector3());
      this.x = position.x;
      this.z = position.z;
      let claimed = false;

      this.api.getWorld(this.worldId).subscribe((data) => {
        const chunkSize = (<any>data).world.chunkSize.x;
        const sidelength = Math.sqrt((<any>data).world.chunks.length);
        const arrayPosition =
          (this.x / chunkSize) * sidelength + this.z / chunkSize;
        this.chunkId = (<any>data).world.chunks[arrayPosition]._id;
        if((<any>data).world.chunks[arrayPosition].claimedBy != null){
          claimed = true;
        }
        //claim section
        if(!claimed)
        {
          document.querySelector('app-chunk-form')?.classList.remove('hidden');
        }
        else
        {
          document.querySelector('app-chunk-form')?.classList.add('hidden');
        }
      });
      // comment section

      this.getComments(0, 10);
      document.querySelector('app-commentform')?.classList.remove('hidden');
      document
        .querySelector('.comment-containers-container')
        ?.classList.remove('hidden');
      //upload section
      document.querySelector('app-upload-form')?.classList.remove('hidden');


      break;
    }
  }

  public animate(): void {
    this.controls.update();
    this.raycaster.setFromCamera(this.mouse, this.camera);
    this.renderer.setSize(this.canvas.width, this.canvas.height);
    this.renderer.clear();
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.animate.bind(this));
  }

  ngAfterViewInit() {
    //get a world id
    this.canvas = document.getElementById('canvas') as HTMLCanvasElement;
    this.canvas.width = window.innerWidth * 0.8;
    this.canvas.height = window.innerHeight * 0.8;

    this.api.getMe().subscribe((data) => {
      this.user = data;
      this.userId = this.user.userId;
    });

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,

      this.canvas.width / this.canvas.height,
      0.1,
      1000
    );
    this.renderer = new THREE.WebGLRenderer({
      canvas: document.getElementById('canvas') as HTMLCanvasElement,
    });

    this.renderer.setSize(this.canvas.width, this.canvas.height);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.loader = new GLTFLoader();
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.models = [];
    this.ambientLight = new THREE.AmbientLight(0x404040);
    this.scene.add(this.ambientLight);
    this.camera.position.y = 10;
    this.camera.position.z = 10;
    this.camera.position.x = 10;
    this.loadChunks();
    document
      .getElementById('canvas')
      ?.addEventListener('click', this.onClick.bind(this), false);
    window.addEventListener('resize', this.onWindowResize, false);
    requestAnimationFrame(this.animate.bind(this));
  }
}
