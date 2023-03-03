
import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 5, 10);
scene.add(camera);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


const gridSize = 10;
const cubeSize = 1;

for (let x = 0; x < gridSize; x++) {
  for (let z = 0; z < gridSize; z++) {
    const cube = new THREE.Mesh(
      new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize),
      new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    );
    cube.position.set(x * cubeSize, 0, z * cubeSize);
    scene.add(cube);
  }
}

const loader = new THREE.GLTFLoader();
loader.load('path/to/your/model.glb', (gltf) => {
  const model = gltf.scene;
  model.position.set(0, 0.5, 0);
  scene.add(model);
});