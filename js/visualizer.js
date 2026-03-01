// Globals and initializer for Three.js visualizer
let scene, camera, renderer, analyser, dataArray, source, audioContext;
let lines = []; // Array for the lines
let stars; // The star particle system
let starData = []; // To store additional data per star
let currentVisualization = "default"; // 'default' or e.g. 'spiral' for predefined songs

let mouseX = 0,
  mouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

// Shooting star control variables
let isShootingStarActive = false;
let lastShootingStarTime = 0;
const shootingStarInterval = 2000; // 2 seconds
const shootingStarDuration = 1500;

// Mouse interaction variables
let isDragging = false;
let previousMouseX = 0;
let previousMouseY = 0;

// Initial camera position and line counts
const initialCameraZ = 280;
const baseLineCount = 90;
const maxLineCount = 150;
const minLineCount = 20;

// Frequency ranges (populated when audio analyser is created)
let frequencyRanges = {};

function initThree() {
  // Cleanup previous Three.js instance if it exists
  if (renderer) {
    if (renderer.domElement && renderer.domElement.parentNode) {
      renderer.domElement.parentNode.removeChild(renderer.domElement);
    }
    renderer.dispose();
  }

  // Reset globals
  scene = null;
  camera = null;
  renderer = null;
  lines = [];
  stars = null;
  starData = [];

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);

  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    2000
  );
  camera.position.z = initialCameraZ;

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Create initial geometry
  if (typeof createLines === "function") createLines(baseLineCount);
  if (typeof createStars === "function") createStars();

  const ambientLight = new THREE.AmbientLight(0x404040);
  scene.add(ambientLight);

  // Interactivity
  document.addEventListener("mousemove", onDocumentMouseMove, false);
  document.addEventListener("wheel", onDocumentMouseWheel, false);
  window.addEventListener("resize", onWindowResize, false);
  renderer.domElement.addEventListener("click", onCanvasClick, false);
  renderer.domElement.addEventListener("mousedown", onMouseDown, false);
  renderer.domElement.addEventListener("mouseup", onMouseUp, false);
  renderer.domElement.addEventListener("mousemove", onMouseMove, false);

  // Custom UI bindings
  // const uploadIcon = document.getElementById("upload-icon-container");
  // if (uploadIcon)
  //   uploadIcon.addEventListener("click", () => {
  //     if (window.openSongPopup) window.openSongPopup();
  //   });

  const fileInput = document.getElementById("hidden-file-input");
  if (fileInput) fileInput.addEventListener("change", handleFileSelect);

  const removeBtn = document.getElementById("remove-file-bottom");
  if (removeBtn) removeBtn.addEventListener("click", resetAudio);

  const playBtn = document.getElementById("tooltip-container");
  if (playBtn) playBtn.addEventListener("click", playDefaultAudio);

  // Start render loop (animation will only update visuals when audio analyser exists)
  animateEqualizer();
}

window.initThree = initThree;
