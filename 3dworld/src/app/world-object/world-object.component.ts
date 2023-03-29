import { AfterViewInit, Component, Input,} from '@angular/core';

import * as THREE from 'three';
import * as JSZip from 'jszip';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { ApiService } from '../services/api.service';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { lastValueFrom } from 'rxjs';
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
  chunkSizeX!: number;
  chunkSizeZ!: number;
  chunkId!: string;
  worldData!: any;
  comments: any = [];
  user: any;
  commentPage: number = 0;
  commentLimit: number = 10;
  userId: string = '';
  canvas!: HTMLCanvasElement;

  constructor(private api: ApiService) {}

  claimPlot(userInput: boolean): void {
    if(userInput){
      this.api.claimChunk(this.worldId, this.chunkId);
      const chunkIndex = this.worldData.chunks.findIndex((chunk: any) => chunk._id === this.chunkId);
      this.worldData.chunk[chunkIndex].claimed = true;
      this.worldData.chunk[chunkIndex].claimedBy = this.userId;
    }
  }

  getChunkFile(chunkId: string): Promise<any> {
    return lastValueFrom(this.api.getChunkFile(this.worldId, chunkId)).then((data) => {
      console.log(data);
      return data;
    });
  }

  uploadModel(event: any): void {
    this.api
      .uploadModel(this.worldId, this.chunkId, event)
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

  loadSingleChunk(data: any, chunkSize: number, coordX: number, coordZ: number): void {
    const zip = new JSZip();
    const loadingManager = new THREE.LoadingManager();
    const zipURL_to_URL: { [path: string]: string } = {};
    let gltfFile: JSZip.JSZipObject;

    zip.loadAsync(data).then((zip: JSZip) => {
      gltfFile = zip.file(/\.gltf$/i)[0];
      if (!gltfFile) {
        throw new Error('GLTF file not found in zip');
      }
      // extract all the files in the zip as Blobs
      const fileDataPromises: Promise<void>[] = [];
      zip.forEach((relativePath, file) => {
        fileDataPromises.push(
          file.async('arraybuffer')
          .then((data: ArrayBuffer) => {
            const blob = new Blob([data]);
            zipURL_to_URL[relativePath] = URL.createObjectURL(blob);
          })
        );
      });
      return Promise.all(fileDataPromises);
    })
    .then(() => {
      loadingManager.setURLModifier((url: string) => {
        if (url in zipURL_to_URL) {
          return zipURL_to_URL[url];
        }
        return url;
      });
      this.loader = new GLTFLoader(loadingManager);
      return gltfFile.async('arraybuffer'); // extract the GLTF file as a blob
    })
    .then((gltfBlob: ArrayBuffer) => {
      this.loader.parse(gltfBlob, '', (gltf) => {
        this.resizeModel(gltf.scene, chunkSize);
        const dimensions = this.getModelDimensions(gltf.scene);
        const box = new THREE.Box3().setFromObject(gltf.scene, true);
        const center = new THREE.Vector3();
        box.getCenter(center);
        center.negate();
        gltf.scene.position.set(coordX, dimensions.y/2, coordZ);
        gltf.scene.position.add(center);
        // Create a directional light and add it to the scene.
        const heimsphere = new THREE.HemisphereLight(0xffffff, 0x000000, 1);
        const directionlLight = new THREE.DirectionalLight(0xffffff, 1);
        gltf.scene.add(directionlLight);
        gltf.scene.add(heimsphere);
        this.models.push(gltf.scene);
        this.scene.add(gltf.scene);
      });
    });
  }

  private getModelDimensions(model: THREE.Group): THREE.Vector3 {
    const box = new THREE.Box3().setFromObject(model);
    const dimensions = new THREE.Vector3();
    box.getSize(dimensions);
    return dimensions;
  }

  private resizeModel(model: THREE.Group, chunkSize: any): void {
    const dimensions = this.getModelDimensions(model);
    const maxHorizontalDimension = Math.max(dimensions.x, dimensions.z);
    const scale = (chunkSize-1) * 0.9 / maxHorizontalDimension ;
    model.scale.setScalar(scale);
  }

  loadChunks(worldData: any): void {
      let id = worldData.world._id;
      let chunks = worldData.world.chunks;
      this.chunkSizeX = worldData.world.chunkSize.x;
      this.chunkSizeZ = worldData.world.chunkSize.z;

      for (let x = 0; x < chunks.length; x++) {
        const coordX = worldData.world.chunks[x].location.x;
        const coordZ = worldData.world.chunks[x].location.z;
        if (worldData.world.chunks[x].chunkFile != null) {
        this.getChunkFile(worldData.world.chunks[x]._id).then((data) => {
          this.loadSingleChunk(data, this.chunkSizeX, coordX, coordZ);
        });
        } 
        else {
          const geometry = new THREE.BoxGeometry(
            this.chunkSizeX - 1,
            0,
            this.chunkSizeX - 1
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
      let model = intersects[i].object;

      const position = model.getWorldPosition(new THREE.Vector3());
      const numberX = Math.round(position.x/this.chunkSizeX);
      const numberZ = Math.round(position.z/this.chunkSizeZ); 

      this.x = numberX*this.chunkSizeX;
      this.z = numberZ*this.chunkSizeZ;

      const sidelength = Math.sqrt(this.worldData.world.chunks.length);
      const arrayPosition = (this.x/this.chunkSizeX) * sidelength + this.z/this.chunkSizeZ;
      this.chunkId = this.worldData.world.chunks[arrayPosition]._id;
      if(this.worldData.world.chunks[arrayPosition].claimedBy == null)
      {
        document.querySelector('app-chunk-form')?.classList.remove('hidden');
      }
      else
      {
        document.querySelector('app-chunk-form')?.classList.add('hidden');
      }
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
    this.api.getWorld(this.worldId).subscribe((data) => {
      this.worldData = data;
      this.loadChunks(this.worldData);
    });
    
    document
      .getElementById('canvas')
      ?.addEventListener('click', this.onClick.bind(this), false);
    window.addEventListener('resize', this.onWindowResize, false);
    requestAnimationFrame(this.animate.bind(this));
  }
}
