// --- 1. SETUP & SCENE ---
const scene = new THREE.Scene();
// No dark background color - letting CSS radial gradient show through
// Add fog to blend particles into the orange distance
scene.fog = new THREE.FogExp2(0xFF9F43, 0.002);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('canvas-container').appendChild(renderer.domElement);
camera.position.z = 30;

// --- 2. CREATE DNA HELIX (Procedural) ---
const dnaGroup = new THREE.Group();
const particleCount = 60; // How long the DNA is
const radius = 4;
const spacing = 1.5;

// Create atoms (Spheres)
const atomGeo = new THREE.SphereGeometry(0.3, 16, 16);
const atomMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 });
const connectorMat = new THREE.MeshBasicMaterial({ color: 0xffffff, opacity: 0.3, transparent: true });

for (let i = 0; i < particleCount; i++) {
    const angle = i * 0.5;
    const y = (i * spacing) - (particleCount * spacing / 2);

    // Strand 1
    const x1 = Math.cos(angle) * radius;
    const z1 = Math.sin(angle) * radius;
    const atom1 = new THREE.Mesh(atomGeo, atomMat);
    atom1.position.set(x1, y, z1);
    
    // Strand 2 (Opposite side)
    const x2 = Math.cos(angle + Math.PI) * radius;
    const z2 = Math.sin(angle + Math.PI) * radius;
    const atom2 = new THREE.Mesh(atomGeo, atomMat);
    atom2.position.set(x2, y, z2);

    // Connector (The bond between strands)
    // We create a cylinder between the two atoms
    const dist = radius * 2;
    const connectorGeo = new THREE.CylinderGeometry(0.05, 0.05, dist, 8);
    const connector = new THREE.Mesh(connectorGeo, connectorMat);
    
    // Math to position and rotate the connector correctly
    connector.position.set(0, y, 0);
    connector.rotation.y = -angle; // Rotate to match helix
    connector.rotation.z = Math.PI / 2; // Lay flat

    dnaGroup.add(atom1);
    dnaGroup.add(atom2);
    dnaGroup.add(connector);
}

// Rotate the whole DNA so it looks diagonal/interesting
dnaGroup.rotation.z = Math.PI / 6; 
scene.add(dnaGroup);

// --- 3. CREATE SAND PARTICLES ---
const sandGeo = new THREE.BufferGeometry();
const sandCount = 1500;
const posArray = new Float32Array(sandCount * 3);

for(let i = 0; i < sandCount * 3; i++) {
    // Spread particles wide
    posArray[i] = (Math.random() - 0.5) * 100;
}

sandGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const sandMat = new THREE.PointsMaterial({
    size: 0.15,
    color: 0xffddaa, // Light sand color
    transparent: true,
    opacity: 0.8
});

const sandSystem = new THREE.Points(sandGeo, sandMat);
scene.add(sandSystem);

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);
const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(10, 10, 10);
scene.add(pointLight);

// --- 4. ANIMATION LOOP ---
let scrollY = 0;

function animate() {
    requestAnimationFrame(animate);

    // Rotate DNA constantly
    dnaGroup.rotation.y += 0.005;

    // Sand Movement (The "Moving Up" effect)
    // We move particles UP (+) based on their Y position relative to scroll
    sandSystem.rotation.y = scrollY * 0.0002; // Slight twist
    sandSystem.position.y = scrollY * 0.02; // Move entire system up as you scroll down
    
    renderer.render(scene, camera);
}
animate();

// --- 5. LOGO & SCROLL LOGIC (GSAP) ---
gsap.registerPlugin(ScrollTrigger);

// Animate Logo: Center (Big) -> Top Left (Small)
gsap.to(".logo-container", {
    top: "30px",
    left: "40px",
    xPercent: 0, 
    yPercent: 0,
    scale: 0.3, // Shrink to 30% size
    transformOrigin: "top left", // Shrink towards corner
    scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "200px top", // Animation finishes after scrolling 200px
        scrub: 1 // Smoothly ties animation to scrollbar
    }
});

// Update Scroll Variable for Three.js
window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
});

// Handle Resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// --- 6. MENU LOGIC ---
window.toggleMenu = function() {
    const overlay = document.getElementById('menu-overlay');
    const btn = document.querySelector('.menu-btn');
    overlay.classList.toggle('active');
    
    if(overlay.classList.contains('active')) {
        btn.innerText = "CLOSE";
        btn.style.color = "white";
        btn.style.borderColor = "white";
    } else {
        btn.innerText = "MENU";
        btn.style.color = "#2d2d2d";
        btn.style.borderColor = "#2d2d2d";
    }
}

window.closeMenu = function() {
    document.getElementById('menu-overlay').classList.remove('active');
    const btn = document.querySelector('.menu-btn');
    btn.innerText = "MENU";
    btn.style.color = "#2d2d2d";
    btn.style.borderColor = "#2d2d2d";
}

window.scrollToSection = function(id) {
    const el = document.getElementById(id);
    if(el) el.scrollIntoView({ behavior: 'smooth' });
}
