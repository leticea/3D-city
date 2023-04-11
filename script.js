// Base Parameters
let renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);

if (window.innerWidth > 800) {
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.shadowMap.needsUpdate = true;
}
document.body.appendChild(renderer.domElement);

// Responsive codes
window.addEventListener("resize", onWindowResize, false);
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

let camera = new THREE.PerspectiveCamera(
  20,
  window.innerWidth / window.innerHeight,
  1,
  500
);
camera.position.set(0, 2, 14);

let scene = new THREE.Scene();
let city = new THREE.Object3D();
let smoke = new THREE.Object3D();
let town = new THREE.Object3D();
let createCarPos = true;
let uSpeed = 0.001;

// FOG Background
let setcolor = 0xf02050;
scene.background = new THREE.color(setcolor);
scene.fog = new THREE.Fog(setcolor, 10, 16);

// Random Function
function mathRandom(num = 8) {
  let numValue = -Math.random() * num + Math.random() * num;
  return numValue;
}

// Change Building Colors
let setTintNum = true;
function setTintColor() {
  if (setTintNum) {
    setTintNum = false;
    var setColor = 0x000000;
  } else {
    setTintNum = true;
    var setColor = 0x000000;
  }
  return setColor;
}

// Create City
function init() {
  let segments = 2;
  for (let i = 1; i < 100; i++) {
    let geometry = new THREE.CubeGeometry(
      1,
      0,
      0,
      segments,
      segments,
      segments
    );
    var material = new THREE.MeshStandardMaterial({
      color: setTintColor(),
      wireFrame: false,
      shading: THREE.SmoothShading,
      side: THREE.DoubleSide,
    });
    var wmaterial = new THREE.MeshLamberMaterial({
      color: 0xffffff,
      wireFrame: false,
      transparent: true,
      opacity: 0.03,
      side: THREE.DoubleSide,
    });

    let cube = new THREE.Mesh(geometry, material);
    let wire = new THREE.Mesh(geometry, material);
    let floor = new THREE.Mesh(geometry, material);
    let wfloor = new THREE.Mesh(geometry, material);

    cube.add(wfloor);
    cube.setShadow = true;
    cube.receiveShadow = true;
    cube.rotationValue = 0.1 + Math.abs(mathRandom(8));
    
  }
}

// Calling Main Functions
generateLines();
init();
animate();
