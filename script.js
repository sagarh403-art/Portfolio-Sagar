// --- 1. RANDOM ALPHABET FOOTER GENERATOR ---
const footerText = document.getElementById('matrix-text');

if (footerText) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$#@%&*";
    let randomString = "";
    
    // Generate a very long string (400 chars) to ensure it covers the screen
    for (let i = 0; i < 400; i++) {
        randomString += chars.charAt(Math.floor(Math.random() * chars.length)) + " ";
    }
    
    // Duplicate it for smooth infinite scroll
    footerText.innerHTML = randomString + randomString; 
}

// --- 2. 3D BACKGROUND (THE LANDO HEAD) ---
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
const container = document.getElementById('canvas-container');
if (container) container.appendChild(renderer.domElement);

// The Geometry
const geometry = new THREE.IcosahedronGeometry(2, 2);
const material = new THREE.MeshNormalMaterial({ wireframe: true });
const shape = new THREE.Mesh(geometry, material);
scene.add(shape);

camera.position.z = 5;

// Mouse Interaction
let mouseX = 0;
let mouseY = 0;
document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
});

function animate() {
    requestAnimationFrame(animate);
    
    // Constant rotation
    shape.rotation.y += 0.002;
    shape.rotation.x += 0.001;

    // Mouse look
    shape.rotation.y += mouseX * 0.05;
    shape.rotation.x += mouseY * 0.05;

    renderer.render(scene, camera);
}
animate();

// Resize Handler
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// --- 3. PAGE SPECIFIC LOGIC (For Blogs/Photos pages) ---
// This ensures the zig-zag layout still works on the other pages
const path = window.location.pathname;
const feedContainer = document.getElementById('content-feed');

if (feedContainer) {
    // ... (This is the same code from the previous response for blogs.html) ...
    // ... (If you need the blog logic again, paste the previous blog script part here) ...
}
