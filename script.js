// --- 1. SETUP & DATA ---
const portfolioData = [ /* (Keep your existing data here) */
    { type: "BLOG", title: "Storm Systems", description: "Procedural weather generation.", image: "https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=800&q=80" },
    { type: "PHOTOGRAPHY", title: "Monsoon", description: "Streets of Mumbai.", image: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=800&q=80" },
];

// --- 2. THREE.JS SCENE SETUP ---
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x0a0a0a, 0.015); // Dark blue-black fog

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Performance
document.getElementById('canvas-container').appendChild(renderer.domElement);

camera.position.set(0, 3, 25); // Look down slightly

// --- 3. BIGGER STAGE & LIGHTS ---
// Much bigger stage to hold the text
const stageGeo = new THREE.CylinderGeometry(15, 15, 0.5, 64);
const stageMat = new THREE.MeshStandardMaterial({ 
    color: 0x050505, roughness: 0.3, metalness: 0.9, envMapIntensity: 1 
});
const stage = new THREE.Mesh(stageGeo, stageMat);
stage.position.y = -5;
stage.receiveShadow = true;
scene.add(stage);

// Invisible plane for raycasting clicks onto the "floor"
const floorPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(200, 200),
    new THREE.MeshBasicMaterial({ visible: false })
);
floorPlane.rotation.x = -Math.PI / 2;
floorPlane.position.y = -4.7;
scene.add(floorPlane);

// Dramatic Lighting
const spotLight = new THREE.SpotLight(0x4facfe, 15);
spotLight.position.set(0, 30, 10);
spotLight.angle = 0.6;
spotLight.penumbra = 1;
spotLight.castShadow = true;
scene.add(spotLight);

const rimLight = new THREE.PointLight(0xffffff, 2, 50);
rimLight.position.set(0, 5, -20); // Backlight for the text
scene.add(rimLight);

const ambientLight = new THREE.AmbientLight(0x444444);
scene.add(ambientLight);

// --- 4. REAL 3D TEXT ("SAGAR") ---
const fontLoader = new THREE.FontLoader();
// Load a bold font from a CDN
fontLoader.load('https://threejs.org/examples/fonts/helvetiker_bold.typeface.json', (font) => {
    const textGeo = new THREE.TextGeometry('SAGAR', {
        font: font,
        size: 4, // Big size
        height: 1, // Thickness
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.1,
        bevelSize: 0.1,
        bevelOffset: 0,
        bevelSegments: 5
    });

    // Center the text geometry
    textGeo.computeBoundingBox();
    const centerOffset = - 0.5 * ( textGeo.boundingBox.max.x - textGeo.boundingBox.min.x );
    
    // Cyberpunk material (reflective chrome)
    const textMat = new THREE.MeshPhysicalMaterial({ 
        color: 0xffffff, metalness: 1, roughness: 0.1, 
        clearcoat: 1.0, clearcoatRoughness: 0.1, reflectivity: 1
    });
    
    const textMesh = new THREE.Mesh(textGeo, textMat);
    textMesh.position.x = centerOffset;
    textMesh.position.y = -4.7; // Sit on stage
    textMesh.position.z = 0;
    textMesh.castShadow = true;
    scene.add(textMesh);
});

// --- 5. SUBTLE RAIN (Procedural Texture) ---
// Helper to create a "drop" texture canvas programmatically
function createDropTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 32; canvas.height = 32;
    const context = canvas.getContext('2d');
    
    const gradient = context.createRadialGradient(16, 16, 0, 16, 16, 16);
    gradient.addColorStop(0, 'rgba(255,255,255,0.8)'); // Bright center
    gradient.addColorStop(0.4, 'rgba(200,200,255,0.2)');
    gradient.addColorStop(1, 'rgba(0,0,0,0)'); // Transparent edge
    
    context.fillStyle = gradient;
    context.fillRect(0, 0, 32, 32);
    return new THREE.CanvasTexture(canvas);
}

const rainGeo = new THREE.BufferGeometry();
const rainCount = 6000; // More drops, but subtler
const posArray = new Float32Array(rainCount * 3);
const velocityArray = new Float32Array(rainCount);

for(let i = 0; i < rainCount * 3; i+=3) {
    posArray[i] = (Math.random() - 0.5) * 100; // Wide spread
    posArray[i+1] = Math.random() * 100 - 10; // High up
    posArray[i+2] = (Math.random() - 0.5) * 100; // Deep
    velocityArray[i/3] = 1 + Math.random() * 1.5; // Faster variance
}

rainGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const rainMat = new THREE.PointsMaterial({
    color: 0xaaccff, // Slight blue tint
    size: 0.3, // Small drops
    map: createDropTexture(), // Use the drop texture
    transparent: true,
    opacity: 0.4, // Subtle opacity
    depthWrite: false,
    blending: THREE.AdditiveBlending
});
const rainSystem = new THREE.Points(rainGeo, rainMat);
scene.add(rainSystem);

// --- 6. INTERACTIVE SPLASH SYSTEM (Raycasting) ---
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
let splashes = []; // Array to hold active splashes

// Create a reusable splash geometry (a ring that expands)
const splashGeo = new THREE.RingGeometry(0.1, 0.3, 32);
splashGeo.rotateX(-Math.PI / 2); // Lay flat

function createSplash(position) {
    const splashMat = new THREE.MeshBasicMaterial({
        color: 0xffffff, transparent: true, opacity: 0.8, side: THREE.DoubleSide
    });
    const splashMesh = new THREE.Mesh(splashGeo, splashMat);
    splashMesh.position.copy(position);
    splashMesh.position.y += 0.1; // Just above floor
    splashMesh.userData = { expandRate: 0.1 + Math.random()*0.1, life: 1.0 }; // Custom data for animation
    scene.add(splashMesh);
    splashes.push(splashMesh);
}

function onPointerClick(event) {
    // Calculate pointer position in normalized device coordinates (-1 to +1)
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(pointer, camera);
    // Check if we hit the invisible floor plane
    const intersects = raycaster.intersectObject(floorPlane);

    if (intersects.length > 0) {
        createSplash(intersects[0].point);
    }
}
window.addEventListener('click', onPointerClick);
window.addEventListener('touchstart', (e) => onPointerClick(e.touches[0]), {passive: false});


// --- 7. ANIMATION LOOP ---
let lastScrollY = window.scrollY;
let mouseX = 0; let mouseY = 0;

function animate() {
    requestAnimationFrame(animate);
    const time = Date.now() * 0.001;

    // Rotate Stage slowly
    stage.rotation.y = Math.sin(time * 0.2) * 0.1;

    // Animate Rain Drops
    const positions = rainSystem.geometry.attributes.position.array;
    for(let i = 1; i < rainCount * 3; i+=3) {
        positions[i] -= velocityArray[Math.floor(i/3)];
        if (positions[i] < -20) positions[i] = 80; // Reset to top
    }
    rainSystem.geometry.attributes.position.needsUpdate = true;

    // Animate Splashes
    splashes.forEach((splash, index) => {
        splash.scale.x += splash.userData.expandRate;
        splash.scale.y += splash.userData.expandRate;
        splash.scale.z += splash.userData.expandRate;
        splash.userData.life -= 0.02;
        splash.material.opacity = splash.userData.life;
        
        // Remove dead splashes
        if(splash.userData.life <= 0) {
            scene.remove(splash);
            splashes.splice(index, 1);
        }
    });

    // Camera Movement
    camera.position.x += (mouseX * 1 - camera.position.x) * 0.05;
    camera.position.y += (3 + mouseY * 0.5 - camera.position.y) * 0.05;
    camera.lookAt(0, -2, 0);

    renderer.render(scene, camera);
}
animate();

// --- 8. UI LOGIC (Audio, Menu, Scroll) ---
// Audio Toggle
const soundBtn = document.getElementById('sound-toggle');
const audio = document.getElementById('rain-audio');
let isMuted = true;
if(soundBtn && audio) {
    soundBtn.addEventListener('click', () => {
        isMuted = !isMuted;
        if(!isMuted) { audio.play(); soundBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>'; } 
        else { audio.pause(); soundBtn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>'; }
    });
}

// Scroll overlay logic
window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    const overlay = document.getElementById('rain-overlay');
    if (currentScroll < lastScrollY && overlay) overlay.style.opacity = '0.4';
    else if (overlay) overlay.style.opacity = '0';
    lastScrollY = currentScroll;
});

// Mouse tracking
window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
});

// Resize handler
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Logo Shrink Animation
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    const logo = document.querySelector(".logo-container");
    if(logo) {
        gsap.to(".logo-container", {
            top: "40px", left: "50px", xPercent: 0, yPercent: 0,
            scale: 0.3, transformOrigin: "top left",
            scrollTrigger: { trigger: "body", start: "top top", end: "300px top", scrub: 1 }
        });
    }
}

// --- 9. MENU & PAGE GENERATION (Keep previous logic) ---
const menuBtn = document.getElementById('menu-toggle-btn');
const menuOverlay = document.getElementById('menu-overlay');
if (menuBtn && menuOverlay) {
    menuBtn.addEventListener('click', () => {
        menuOverlay.classList.toggle('active');
        menuBtn.innerText = menuOverlay.classList.contains('active') ? "CLOSE" : "MENU";
    });
    document.querySelectorAll('.menu-item').forEach(link => {
        link.addEventListener('click', () => {
            menuOverlay.classList.remove('active'); menuBtn.innerText = "MENU";
        });
    });
}

// Blog/Photo Page Generator
const isHomePage = document.querySelector('.logo-container');
if (!isHomePage) {
    const header = document.createElement('nav'); header.className = 'nav-header';
    header.innerHTML = `<a href="index.html" class="back-btn-large">← HOME</a><h2 style="font-family:'Syne'; font-size:1.5rem; margin:0; color:white;">ARCHIVE</h2>`;
    document.body.prepend(header);

    const contentDiv = document.createElement('div'); contentDiv.className = 'feed-container';
    const pageType = window.location.pathname.includes("blogs") ? "BLOG" : "PHOTOGRAPHY";
    portfolioData.filter(item => item.type === pageType).forEach(item => {
        contentDiv.innerHTML += `
            <article class="content-item">
                <div class="content-text"><h2 class="item-title">${item.title}</h2><p>${item.description}</p></div>
                <div class="content-visual"><img src="${item.image}" class="content-img"></div>
            </article>`;
    });
    document.querySelector('.scroll-container')?.appendChild(contentDiv);
    setTimeout(() => { gsap.utils.toArray('.content-item').forEach(item => gsap.to(item, { opacity: 1, y: 0, duration: 1, scrollTrigger: { trigger: item, start: "top 80%" } })); }, 100);
}
