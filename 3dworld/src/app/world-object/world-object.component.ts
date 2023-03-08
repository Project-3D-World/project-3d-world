import { Component, OnInit } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

@Component({
  selector: 'app-world-object',
  templateUrl: './world-object.component.html',
  styleUrls: ['./world-object.component.scss']
})
export class WorldObjectComponent implements OnInit {
  scene!: THREE.Scene;
  camera!: THREE.PerspectiveCamera;
  renderer!: THREE.WebGLRenderer;

  ngOnInit() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
    const controls = new OrbitControls(camera, renderer.domElement);
    const geometry = new THREE.BoxGeometry( 0.7, 0.01, 0.7 );
    const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    
    const gridSize = 10;
    const cubeSize = 1;
    // add event listeners to the cube
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const cubes: THREE.Mesh[] = []; // create an array to store the cubes

    for (let x = 0; x < gridSize; x++) {
      for (let z = 0; z < gridSize; z++) {
        const cube = new THREE.Mesh(
          geometry,
          material
        );
        cube.position.set(x * cubeSize, 0, z * cubeSize);
        scene.add(cube);
        cubes.push(cube); // add each cube to the array
      }
    }
    
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    camera.position.y = 5;
    camera.position.z = 10;

    // add a click listener to the renderer's dom element
    renderer.domElement.addEventListener('click', onClick, false);

    function onClick(event: MouseEvent) {
      // calculate mouse position in normalized device coordinates
      // (-1 to +1) for both components
      mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
      mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

      // update the picking ray with the camera and mouse position
      raycaster.setFromCamera( mouse, camera );

      // calculate objects intersecting the picking ray
      const intersects = raycaster.intersectObjects( cubes );

      for ( let i = 0; i < intersects.length; i++ ) {
        // perform the desired action on the clicked cube(s)
        // print out the cube's position
        console.log(intersects[i].object.position);
      }
    }

    function animate() {
      requestAnimationFrame(animate);
      controls.update(); // update controls based on user input
      renderer.render(scene, camera);
    }
    
    animate();
    
  } 
}






