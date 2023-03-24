import { Component, OnInit } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { ApiService } from '../services/api.service';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

@Component({
  selector: 'app-world-object',
  templateUrl: './world-object.component.html',
  styleUrls: ['./world-object.component.scss'],
})
export class WorldObjectComponent implements OnInit {
  scene!: THREE.Scene;
  camera!: THREE.PerspectiveCamera;
  renderer!: THREE.WebGLRenderer;
  worldId!: string;
  raycaster!: THREE.Raycaster;
  mouse!: THREE.Vector2;
  models!: THREE.Group[];
  ambientLight!: THREE.AmbientLight;
  controls!: OrbitControls;
  loader!: GLTFLoader;

  constructor(private api: ApiService) {}

  loadWorld(): void {
    this.api.getWorld('64176688914a579ebfb79af5').subscribe((data) => {
      console.log(data);
    });
  }

  claimPlot(worldId: string, chunkid: string): void {
    this.api.claimChunk(worldId, chunkid).subscribe((data) => {
      console.log(data);
    });
  }

  uploadModel(worldId: string, chunkId: string, model: File): void {
    this.api.uploadModel(worldId, chunkId, model).subscribe((data) => {
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
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  loadChunks() {
    this.api.getWorld('64176688914a579ebfb79af5').subscribe((data) => {
      let id = (<any>data).world._id;
      let chunks = (<any>data).world.chunks;
      let sidelength = Math.sqrt(chunks.length);
      let chunkSize = (<any>data).world.chunkSize.x;
      const cubeSize = 10;
      console.log(id);
      console.log(chunks);
      console.log(sidelength);
      console.log(chunkSize);

      for (let x = 0; x < sidelength; x++) {
        for (let z = 0; z < sidelength; z++) {
          if ((<any>data).world.chunks[x + z].chunkFile != null) {
            this.loader.load(
              (<any>data).world.chunks[x + z].chunkFile,
              (gltf) => {
                gltf.scene.scale.set(5, 5, 5);
                gltf.scene.position.set(x * cubeSize, 0, z * cubeSize);
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
          } else {
            const geometry = new THREE.BoxGeometry(chunkSize, 1, chunkSize);
            const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
            const cube = new THREE.Mesh(geometry, material);
            cube.position.set(x * (chunkSize + 1), 0, z * (chunkSize + 1));
            let group = new THREE.Group();
            group.add(cube);
            this.scene.add(group);
            this.models.push(group); // add each cube to the array
          }
        }
      }
    });
  }

  ngOnInit() {
    //get a world id
    // load the world with its chunks
    // check if user clicks on a chunk
    // if user clicks on a chunk, claim the chunk
    // if user clicks on a chunk that is already claimed, show the owner of the chunk
    // if user clicks on a chunk that is owned by the user, open a form to submit a new gltf model
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.loader = new GLTFLoader();
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.models = [];
    this.ambientLight = new THREE.AmbientLight(0x404040);
    // add event listeners to the cube
    this.scene.add(this.ambientLight);
    this.camera.position.y = 10;
    this.camera.position.z = 10;
    this.camera.position.x = 10;
    this.loadChunks();

    const onClick = (event: MouseEvent) => {
      // calculate mouse position in normalized device coordinates
      // (-1 to +1) for both components
      console.log('mouseClick');
      this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
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
        break;
      }
    };
    this.renderer.domElement.addEventListener('click', onClick, false);
    window.addEventListener('resize', this.onWindowResize, false);

    const animate = () => {
      this.controls.update();
      this.raycaster.setFromCamera(this.mouse, this.camera);
      this.renderer.clear();
      this.renderer.render(this.scene, this.camera);
      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }
}
