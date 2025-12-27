// --- 1. SETUP ---
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x24243e, 0.02); // Deep Indigo Fog

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('canvas-container').appendChild(renderer.domElement);

camera.position.z = 12;
camera.position.y = 0;

// --- 2. SOFT STUDIO LIGHTING ---
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

// Warm light from left
const dirLight1 = new THREE.DirectionalLight(0xff6b6b, 0.8);
dirLight1.position.set(-10, 10, 10);
scene.add(dirLight1);

// Cool light from right
const dirLight2 = new THREE.DirectionalLight(0x4ecdc4, 0.8);
dirLight2.position.set(10, -10, 10);
scene.add(dirLight2);

// --- 3. ROUNDED 3D TEXT ("SAGAR") ---
let textMesh;
const fontLoader = new THREE.FontLoader();

fontLoader.load('https://threejs.org/examples/fonts/helvetiker_bold.typeface.json', (font) => {
    const textGeo = new THREE.TextGeometry('SAGAR', {
        font: font,
        size: 1.8, // SMALLER SIZE (As requested)
        height: 0.5, 
        curveSegments: 20, // Smoother curves
        bevelEnabled: true,
        bevelThickness: 0.3, // Very thick bevel (Balloon look)
        bevelSize: 0.1,
        bevelSegments: 10 // Smooth edges (No sharp corners)
    });
    
    textGeo.computeBoundingBox();
    const centerOffset = - 0.5 * ( textGeo.boundingBox.max.x - textGeo.boundingBox.min.x );
    textGeo.translate(centerOffset, 0, 0);

    const textMat = new THREE.MeshPhysicalMaterial({ 
        color: 0xffffff, 
        roughness: 0.2, // Shiny plastic
        metalness: 0.1,
        clearcoat: 0.5
    });

    textMesh = new THREE.Mesh(textGeo, textMat);
    textMesh.position.y = 0;
    scene.add(textMesh);
});

// --- 4. FLOATING SOFT SHAPES (Not Cyberpunk) ---
const objects = [];
const matCoral = new THREE.MeshPhysicalMaterial({ color: 0xff6b6b, roughness: 0.4 });
const matMint = new THREE.MeshPhysicalMaterial({ color: 0x4ecdc4, roughness: 0.4 });
const matYellow = new THREE.MeshPhysicalMaterial({ color: 0xffe66d, roughness: 0.4 });

function createSoftShape() {
    const type = Math.floor(Math.random() * 3);
    let mesh;
    let material = [matCoral, matMint, matYellow][Math.floor(Math.random() * 3)];

    if (type === 0) {
        // Torus (Donut) - Very Round
        mesh = new THREE.Mesh(new THREE.TorusGeometry(0.8, 0.4, 16, 50), material);
    } else if (type === 1) {
        // Icosahedron (Ball)
        mesh = new THREE.Mesh(new THREE.IcosahedronGeometry(1, 1), material);
    } else {
        // Capsule
        mesh = new THREE.Mesh(new THREE.CapsuleGeometry(0.5, 1, 4, 8), material);
    }

    // Random Position
    mesh.position.x = (Math.random() - 0.5) * 30;
    mesh.position.y = (Math.random() - 0.5) * 40 - 10;
    mesh.position.z = (Math.random() - 0.5) * 15 - 5;
    
    mesh.userData = { speed: Math.random() * 0.01 + 0.005 };
    scene.add(mesh);
    objects.push(mesh);
}

// Create 20 Soft shapes
for(let i=0; i<20; i++) createSoftShape();

// --- 5. ANIMATION LOOP ---
let scrollY = 0;

function animate() {
    requestAnimationFrame(animate);

    // Float Shapes Up
    objects.forEach(obj => {
        obj.rotation.x += 0.01;
        obj.rotation.y += 0.01;
        obj.position.y += obj.userData.speed + (scrollY * 0.0002);
        if(obj.position.y > 20) obj.position.y = -25;
    });

    // Parallax Text (Moves to top center)
    if (textMesh) {
        const targetY = scrollY * 0.012; 
        const targetScale = Math.max(0.5, 1 - (scrollY * 0.001));

        if(targetY < 5) {
            textMesh.position.y = targetY;
        } else {
            textMesh.position.y = 5; // Stick at top
        }
        textMesh.scale.set(targetScale, targetScale, targetScale);
        textMesh.rotation.y = Math.sin(Date.now() * 0.001) * 0.1; // Gentle sway
    }

    renderer.render(scene, camera);
}
animate();

window.addEventListener('scroll', () => scrollY = window.scrollY);
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// --- 6. MENU ---
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

// --- 7. ZIG-ZAG CONTENT GENERATOR (For Blogs/Photos) ---
const isHomePage = !window.location.pathname.includes("html") || window.location.pathname.includes("index");

if (!isHomePage) {
    // 1. Header
    const header = document.createElement('nav'); 
    header.className = 'nav-header';
    header.innerHTML = `<a href="index.html" class="back-btn-round">← HOME</a>`;
    document.body.prepend(header);

    // 2. Dummy Data (6 Items to prove Zig Zag works)
    const data = [
        { title: "Soft Design", desc: "Why rounded corners matter.", img: "https://images.unsplash.com/photo-1517404215738-15263e9f9178?w=800&q=80" },
        { title: "Color Theory", desc: "Using pastels effectively.", img: "https://images.unsplash.com/photo-1520690214124-2405c5217036?w=800&q=80" },
        { title: "3D Shapes", desc: "From cubes to donuts.", img: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80" },
        { title: "Animation", desc: "Making things float.", img: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=800&q=80" },
        { title: "Typography", desc: "Finding the right font.", img: "https://images.unsplash.com/photo-1558655146-d09347e0c766?w=800&q=80" },
        { title: "Layouts", desc: "The zig-zag pattern.", img: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=800&q=80" }
    ];

    const contentDiv = document.createElement('div');
    contentDiv.className = 'feed-container';
    
    data.forEach((item, index) => {
        // We create specific classes or just let CSS nth-child handle it
        contentDiv.innerHTML += `
            <article class="content-item">
                <div class="content-text">
                    <span style="color:var(--accent-yellow); font-weight:bold;">0${index + 1}</span>
                    <h2 class="item-title">${item.title}</h2>
                    <p>${item.desc}</p>
                </div>
                <div class="content-visual">
                    <img src="${item.img}">
                </div>
            </article>
        `;
    });
    
    document.querySelector('.scroll-container')?.appendChild(contentDiv);

    // Fade In Animation
    setTimeout(() => {
        gsap.utils.toArray('.content-item').forEach(item => {
            gsap.to(item, { opacity: 1, duration: 1, scrollTrigger: { trigger: item, start: "top 85%" } });
        });
    }, 100);
}
