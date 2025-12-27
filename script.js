import * as THREE from 'https://cdn.skypack.dev/three@0.129.0/build/three.module.js';
import { gsap } from 'https://cdn.skypack.dev/gsap';

// --- SETUP ---
const scene = new THREE.Scene();
// Add subtle fog for depth (fade to black)
scene.fog = new THREE.FogExp2(0x050505, 0.1);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#webgl'), alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio); // Keep it crisp for pixel art feel

// --- THE GLITCHY NEWSPAPER OBJECT ---
// We use a PlaneGeometry with many segments so we can distort it
const geometry = new THREE.PlaneGeometry(6, 8, 32, 32);

// Load a "Newspaper" texture (Replace this URL with your own photo later!)
const loader = new THREE.TextureLoader();
// Using a generic noise/grid texture for the "Glitch" look
const texture = loader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/grid.png'); 
texture.magFilter = THREE.NearestFilter; // KEEPS IT PIXELATED (Important for 8-bit)

const material = new THREE.MeshBasicMaterial({ 
    map: texture,
    wireframe: true, // Gives the "Digital Frame" look
    color: 0x33ff00, // Retro Green wireframe
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.8
});

const paper = new THREE.Mesh(geometry, material);
scene.add(paper);

// --- ANIMATION VARIABLES ---
let time = 0;

// --- SCROLL LOGIC ---
let scrollY = window.scrollY;
window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
    
    // Twist the paper as you scroll
    gsap.to(paper.rotation, {
        x: scrollY * 0.001,
        y: scrollY * 0.002,
        duration: 0.5
    });
});

// --- ANIMATION LOOP ---
function animate() {
    requestAnimationFrame(animate);
    time += 0.05;

    // GLITCH EFFECT: Randomly distort the vertices
    // This makes the paper look like it's "buzzing" or glitching
    const positionAttribute = geometry.attributes.position;
    
    for (let i = 0; i < positionAttribute.count; i++) {
        // Get original positions (We approximate by using sine waves)
        const x = positionAttribute.getX(i);
        const y = positionAttribute.getY(i);
        
        // Create a "Wave" effect
        const z = Math.sin(x * 2 + time) * 0.2 + Math.cos(y * 1.5 + time) * 0.2;
        
        // Add random "Glitch" noise occasionally
        const noise = (Math.random() - 0.5) * 0.05; 
        
        positionAttribute.setZ(i, z + noise);
    }
    positionAttribute.needsUpdate = true; // Tell Three.js to update the shape

    renderer.render(scene, camera);
}

// Handle Window Resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();
