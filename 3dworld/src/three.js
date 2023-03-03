import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );

const gridSize = 10;
const cubeSize = 1;

for (let x = 0; x < gridSize; x++) {
  for (let z = 0; z < gridSize; z++) {
    const cube = new THREE.Mesh(
      geometry,
      material
    );
    cube.position.set(x * cubeSize, 0, z * cubeSize);
    scene.add(cube);
  }
}

camera.position.y = 5;
camera.position.z = 10;

renderer.render( scene, camera );
