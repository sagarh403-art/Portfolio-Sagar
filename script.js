// --- 1. EXAMPLE DATA (So you can see the layout) ---
const portfolioData = [
    {
        type: "BLOG",
        title: "The Architecture of Void",
        description: "Designing negative space in digital environments.",
        image: "https://images.unsplash.com/photo-1487621167305-5d248087c724?auto=format&fit=crop&w=800&q=80",
        fullText: `<p>We often focus on what we build, but the void we leave behind is just as important...</p>`
    },
    {
        type: "PHOTOGRAPHY",
        title: "Tokyo After Midnight",
        description: "Street photography series. Fujifilm X-T4.",
        image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80"
    },
    {
        type: "BLOG",
        title: "Rendering Dreams",
        description: "Using Three.js to visualize subconscious thoughts.",
        image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
        fullText: `<p>WebGL allows us to break the laws of physics. Gravity is optional. Light is programmable...</p>`
    },
    {
        type: "PHOTOGRAPHY",
        title: "Concrete Jungle",
        description: "Brutalist architecture in India.",
        image: "https://images.unsplash.com/photo-1486744360400-1b8a11ea8416?auto=format&fit=crop&w=800&q=80"
    }
];

// --- 2. THREE.JS SCENE SETUP ---
const scene = new THREE.Scene();
// Fog matches the dark charcoal background
scene.fog = new THREE.FogExp2(0x1a1a1a, 0.02);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
const container = document.getElementById('canvas-container');
if(container) container.appendChild(renderer.domElement);

camera.position.z = 15;
camera.position.y = 2;

// --- 3. CREATE THE "STAGE" ---
// A cylinder to act as the platform
const stageGeo = new THREE.CylinderGeometry(8, 8, 0.5, 64);
const stageMat = new THREE.MeshStandardMaterial({ 
    color: 0x111111, 
    roughness: 0.2, 
    metalness: 0.8 
});
const stage = new THREE.Mesh(stageGeo, stageMat);
stage.position.y = -4; // Sit below the camera
scene.add(stage);

// Spotlights to light up the stage
const spotLight = new THREE.SpotLight(0xffffff, 10);
spotLight.position.set(0, 15, 0);
spotLight.angle = Math.PI / 6;
spotLight.penumbra = 0.5;
scene.add(spotLight);

const blueLight = new THREE.PointLight(0x4444ff, 2, 20);
blueLight.position.set(-5, 2, 5);
scene.add(blueLight);

// --- 4. LARGER SAND PARTICLES ---
const sandGeo = new THREE.BufferGeometry();
const sandCount = 800; // Fewer particles, but bigger
const posArray = new Float32Array(sandCount * 3);

for(let i = 0; i < sandCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 40; // Spread
}

sandGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const sandMat = new THREE.PointsMaterial({
    size: 0.15, // BIGGER SIZE
    color: 0xaaaaaa, // Greyish dust
    transparent: true,
    opacity: 0.6
});

const sandSystem = new THREE.Points(sandGeo, sandMat);
scene.add(sandSystem);

// --- 5. ANIMATION LOOP ---
let scrollY = 0;
let mouseX = 0;
let mouseY = 0;

function animate() {
    requestAnimationFrame(animate);

    // Rotate stage slowly
    stage.rotation.y += 0.001;

    // Move Sand UP (+y) based on scroll
    // Also add a gentle "float" animation
    const time = Date.now() * 0.0005;
    sandSystem.position.y = (scrollY * 0.01) + Math.sin(time) * 0.5;
    sandSystem.rotation.y = scrollY * 0.0001;

    // Camera Sway (Parallax)
    camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.05;
    camera.position.y += (2 + mouseY * 0.5 - camera.position.y) * 0.05;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
}
animate();

// --- 6. SCROLL & LOGO ANIMATION (GSAP) ---
// This handles shrinking the "SAGAR" text to the top-left
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    gsap.to(".logo-container", {
        top: "40px",
        left: "50px",
        xPercent: 0, 
        yPercent: 0,
        scale: 0.25, // Shrink to 25%
        transformOrigin: "top left",
        scrollTrigger: {
            trigger: "body",
            start: "top top",
            end: "300px top",
            scrub: 1.5 // Slower scrub for smoothness
        }
    });
}

// --- 7. MENU LOGIC (STRIKETHROUGH) ---
window.toggleMenu = function() {
    document.getElementById('menu-overlay').classList.toggle('active');
}
window.closeMenu = function() {
    document.getElementById('menu-overlay').classList.remove('active');
}
window.scrollToSection = function(id) {
    const el = document.getElementById(id);
    if(el) el.scrollIntoView({ behavior: 'smooth' });
}

// Auto-Strikethrough Logic
function setActiveMenu() {
    const path = window.location.pathname;
    const links = document.querySelectorAll('.menu-item');
    
    links.forEach(link => {
        link.classList.remove('active-link');
        
        // Check URL for Blogs/Photos
        if (path.includes("blogs.html") && link.innerText === "BLOGS") {
            link.classList.add('active-link');
        }
        else if (path.includes("photography.html") && link.innerText === "PHOTOS") {
            link.classList.add('active-link');
        }
    });

    // If on home page, default to HOME
    if (!path.includes("html") || path.endsWith("index.html") || path === "/") {
        links[0].classList.add('active-link');
    }
}
setActiveMenu(); // Run on load

// --- 8. RENDER BLOGS/PHOTOS CONTENT ---
// This part populates the 'blogs.html' and 'photography.html' pages
const feedContainer = document.getElementById('content-feed');
if (feedContainer) {
    let pageType = "";
    const path = window.location.pathname;
    if (path.includes("blogs.html")) pageType = "BLOG";
    if (path.includes("photography.html")) pageType = "PHOTOGRAPHY";

    const items = portfolioData.filter(item => item.type === pageType);

    items.forEach(item => {
        const article = document.createElement('article');
        article.className = 'content-item';
        article.innerHTML = `
            <div class="content-text">
                <span style="color:var(--accent-color); font-weight:bold;">0${Math.floor(Math.random()*9)}</span>
                <h2 class="item-title">${item.title}</h2>
                <p class="item-desc">${item.description}</p>
            </div>
            <div class="content-visual">
                <img src="${item.image}" alt="${item.title}" class="content-img">
            </div>
        `;
        feedContainer.appendChild(article);
    });
    
    // Zig Zag Animation
    gsap.utils.toArray('.content-item').forEach(item => {
        gsap.to(item, {
            opacity: 1, y: 0, duration: 1, 
            scrollTrigger: { trigger: item, start: "top 80%" }
        });
    });
}

// Listeners
window.addEventListener('scroll', () => scrollY = window.scrollY);
window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
});
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
