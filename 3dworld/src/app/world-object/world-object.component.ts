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

  constructor(private api: ApiService) {

  }

  loadWorld(): void {
    this.api.getAllWorlds().subscribe((data) => {
      console.log(data);
    });
  }

  claimPlot(worldId : string, chunkid: string): void {
    this.api.claimChunk(worldId, chunkid).subscribe((data) => {
      console.log(data);
    });
  }

  uploadModel(worldId: string, chunkId: string, model: File): void {
    this.api.uploadModel(worldId, chunkId, model).subscribe((data) => {
      console.log(data);
    });
  }


  ngOnInit() {
    //get a world id 
    // load the world with its chunks
    // check if user clicks on a chunk
    // if user clicks on a chunk, claim the chunk
    // if user clicks on a chunk that is already claimed, show the owner of the chunk
    // if user clicks on a chunk that is owned by the user, open a form to submit a new gltf model
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    const controls = new OrbitControls(camera, renderer.domElement);
    const geometry = new THREE.BoxGeometry(2, 1, 2);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const loader = new GLTFLoader();
    const api = this.api;
    const gridSize = 3;
    const cubeSize = 10;
    // add event listeners to the cube
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const models:THREE.Group[] = [];

    for (let x = 0; x < gridSize; x++) {
      for (let z = 0; z < gridSize; z++) {
        //const cube = new THREE.Mesh(geometry, material);
        //cube.position.set(x * cubeSize, 0, z * cubeSize);
        loader.load(
          'assets/shiba/scene.gltf',
          function (gltf) {
            gltf.scene.scale.set(5, 5, 5);
            gltf.scene.position.set(x * cubeSize, 0, z*cubeSize);
            models.push(gltf.scene);
            scene.add(gltf.scene);
          },
          function ( xhr ) {
            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
          },
          function (error) {
            console.error(error);
          }
        );
        //scene.add(cube);
        //cubes.push(); // add each cube to the array
      }
    }

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    camera.position.y = 10;
    camera.position.z = 10;
    camera.position.x = 10;
    // add a click listener to the renderer's dom element
    renderer.domElement.addEventListener('click', onClick, false);

    window.addEventListener( 'resize', onWindowResize, false );

    function onWindowResize(){

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

    }
    
    function onClick(event: MouseEvent) {
      // calculate mouse position in normalized device coordinates
      // (-1 to +1) for both components
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      // update the picking ray with the camera and mouse position
      raycaster.setFromCamera(mouse, camera);

      // calculate objects intersecting the picking ray
      const intersects = raycaster.intersectObjects(models, true);

      for (let i = 0; i < intersects.length; i++) {
        // perform the desired action on the clicked cube(s)
        //claim the cube by sending an api request to the server
        const model = intersects[i].object as THREE.Mesh;
        console.log(model);
        break;
      }
    }

    function animate() {
      controls.update();
      raycaster.setFromCamera(mouse, camera);
      renderer.clear();
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }
    
    requestAnimationFrame(animate);
    
  }
}
