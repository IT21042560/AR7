import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
import { OBJLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/OBJLoader.js";

// Create a Three.js scene
const scene = new THREE.Scene();

// Create a camera and set its position
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 500;

// Create a renderer and set its size
const renderer = new THREE.WebGLRenderer({ alpha: true }); // Alpha: true for transparent background
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("container3D").appendChild(renderer.domElement);

// Instantiate a loader for the .obj file
const loader = new OBJLoader();

// Load the .obj file
let object;
loader.load(
  'models/model.obj', // Update the path to your .obj file
  function (obj) {
    object = obj;
    scene.add(object);
    object.position.set(0, 0, 0); // Center the model
    object.scale.set(10, 10, 10); // Adjust the scale

    // Change object color after loading
    changeObjectColor(object, 0x3cb371); // Change color to your desired color
  },
  function (xhr) {
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
  },
  function (error) {
    console.error(error);
  }
);

// Function to change the color of the object
function changeObjectColor(object, colorHex) {
  object.traverse((child) => {
    if (child.isMesh) {
      // Check if the mesh has a material that can be colored
      if (child.material && child.material instanceof THREE.MeshStandardMaterial) {
        child.material.color.set(colorHex);
      } else if (child.material && Array.isArray(child.material)) {
        // If the material is an array (multiple materials)
        child.material.forEach((mat) => {
          if (mat instanceof THREE.MeshStandardMaterial) {
            mat.color.set(colorHex);
          }
        });
      }
    }
  });
}

// Create a video element for the camera feed
const video = document.createElement('video');
video.autoplay = true;
video.style.display = 'none'; // Hide the video element

// Access the user's camera
navigator.mediaDevices.getUserMedia({ video: true })
  .then((stream) => {
    video.srcObject = stream; // Set the video source to the camera stream
    const videoTexture = new THREE.VideoTexture(video); // Create a texture from the video feed
    scene.background = videoTexture; // Set the video texture as the scene background
  })
  .catch((err) => {
    console.error("Error accessing the camera: ", err);
  });

// Set up camera controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.enableZoom = true;

// Render the scene
function animate() {
  requestAnimationFrame(animate);

  // Make the object move if it is an eye and is loaded
  if (object) {
    // You can add any animations or transformations here
  }

  // Render the scene
  renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Start the animation loop
animate();
