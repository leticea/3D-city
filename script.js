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
    floor.scale.y = 0.05;
    cube.scale.y = 0.1 + Math.abs(mathRandom(8));

    var cubeWidth = 0.9;
    cube.scale.x = cube.scale.z = cubeWidth + mathRandom(1 - cubeWidth);
    cube.position.x = Math.round(mathRandom());
    cube.position.z = Math.round(mathRandom());

    floor.position.set(cube.position.x, 0, cube.position.z);

    town.add(floor);
    town.add(cube);
  }

  // Particulars
  var gmaterial = new THREE.MeshToonMaterial({
    color: 0xffff00,
    side: THREE.DoubleSide,
  });
  var gparticular = new THREE.CircleGeometry(0.01, 3);
  var aparticular = 5;

  for (let h = 1; h < 300; h++) {
    var particular = new THREE.Mesh(gparticular, gmaterial);
    particular.position.set(
      mathRandom(aparticular),
      mathRandom(aparticular),
      mathRandom(aparticular)
    );
    particular.rotation.set(mathRandom(), mathRandom(), mathRandom());
    smoke.add(particular);
  }

  var pmaterial = new THREE.MeshPhongMaterial({
    color: 0x000000,
    side: THREE.DoubleSide,
    roughness: 10,
    metalness: 0.6,
    opacity: 0.9,
    transparent: true,
  });

  var pgeometry = new THREE.PlaneGeometry(60, 60);
  var pelement = new THREE.Mesh(pgeometry, pmaterial);
  pelement.rotation.x = (-90 * Math.PI) / 180;
  pelement.position.y = -0.001;
  pelement.receiveShadow = true;
  city.add(pelement);
}

// Mouse functions
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2(),
  INTERSECTED;
var intersected;

function onMouseMove(e) {
  e.preventDefault();
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = (e.clientY / window.innerHeight) * 2 + 1;
}

function onDocumentTouchStart(e) {
  if (e.touches.length == 1) {
    e.preventDefault();
    mouse.x = e.touches[0].pageX - window.innerWidth / 2;
    mouse.y = e.touches[0].pageY - window.innerHeight / 2;
  }
}

function onDocumentTouchMove(e) {
  if (e.touches.length == 1) {
    e.preventDefault();
    mouse.x = e.touches[0].pageX - window.innerWidth / 2;
    mouse.y = e.touches[0].pageY - window.innerHeight / 2;
  }
}

window.addEventListener("mousemove", onMouseMove, false);
window.addEventListener("touchstart", onDocumentTouchStart, false);
window.addEventListener("touchmove", onDocumentTouchMove, false);

// Create lights
var ambientLight = new THREE.AmbientLight(0xffffff, 4);
var lightFront = new THREE.SpotLight(0xffffff, 20, 10);
var lightBack = new THREE.PointLight(0xffffff, 0.5);
var spotLightHelper = new THREE.SpotLightHelper(lightFront);

lightFront.rotation.x = (45 * Math.PI) / 180;
lightFront.rotation.z = (-45 * Math.PI) / 180;
lightFront.position.set(5, 5, 5);
lightFront.castShow = true;
lightFront.shadow.mapSize.width = 6000;
lightFront.shadow.mapSize.height = lightFront.shadow.mapSize.width;

lightFront.penumbra = 0.1;
lightBack.position.set(0, 6, 0);

smoke.position.y = 2;

scene.add(ambientLight);
city.add(lightFront);
scene.add(lightBack);
scene.add(city);
city.add(smoke);
city.add(town);

// Grid Helper
let gridHelper = new THREE.GridHelper(60, 120, 0xff0000, 0x000000);
city.add(gridHelper);

// Cars World
let createCars = function (cScale = 2, cPos = 20, cColor = 0xffff00) {
  var cMat = new THREE.MeshToonMaterial({
    color: cColor,
    side: THREE.DoubleSide,
  });
  var cGeo = new THREE.CubeGeometry(1, cScale / 40, cScale / 40);
  var cElem = new THREE.Mesh(cGeo, cMat);
  var cAmp = 3;

  if (createCarPos) {
    createCarPos = false;
    cElem.position.x = -cPos;
    cElem.position.z = mathRandom(cAmp);

    TweenMax.to(cElem.position, 3, {
      x: cPos,
      repeat: -1,
      yoyo: true,
      delay: mathRandom(3),
    });
  } else {
    createCarPos = true;
    cElem.position.x = mathRandom(cAmp);
    cElem.position.z = -cPos;
    cElem.position.y = (90 * Math.PI) / 180;

    TweenMax.to(cElem.position, 5, {
      z: cPos,
      repeat: -1,
      yoyo: true,
      delay: mathRandom(3),
      ease: Power1.easeInOut,
    });
  }

  cElem.receiveShadow = true;
  cElem.castShow = true;
  cElem.position.y = Math.abs(mathRandom(5));
  city.add(cElem);
};

// Calling Main Functions
generateLines();
init();
animate();
