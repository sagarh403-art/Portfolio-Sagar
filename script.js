// --- 1. WAIT FOR PAGE LOAD ---
document.addEventListener('DOMContentLoaded', () => {
    
    // --- MENU LOGIC (Debugged) ---
    const menuBtn = document.getElementById('menu-toggle-btn');
    const menuOverlay = document.getElementById('menu-overlay');
    const menuLinks = document.querySelectorAll('.menu-item');

    if (menuBtn && menuOverlay) {
        menuBtn.addEventListener('click', () => {
            menuOverlay.classList.toggle('active');
            // Toggle text
            if (menuOverlay.classList.contains('active')) {
                menuBtn.innerText = "CLOSE";
            } else {
                menuBtn.innerText = "MENU";
            }
        });

        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuOverlay.classList.remove('active');
                menuBtn.innerText = "MENU";
            });
        });
    }

    // --- SCROLL ANIMATION (The Shrink Fix) ---
    // Ensure GSAP is loaded
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        const logo = document.getElementById("hero-logo");
        
        if (logo) {
            gsap.to(logo, {
                scrollTrigger: {
                    trigger: "body",
                    start: "top top", // Start animating immediately
                    end: "500px top", // Finish when scrolled 500px
                    scrub: 1 // Smoothly tie animation to scrollbar
                },
                // THE TRANSFORMATION
                top: "30px",           // Move to top of screen
                scale: 0.2,            // Shrink to 20% size
                yPercent: 0,           // Remove vertical centering offset
                xPercent: -50,         // KEEP horizontal centering (-50%)
                ease: "power1.inOut"   // Smooth easing
            });
        }
    }

    // --- ZIG ZAG CONTENT (For Blogs/Photos pages) ---
    // If the logo doesn't exist (we are not on home page), load content
    if (!document.getElementById("hero-logo")) {
        const header = document.createElement('nav'); 
        header.className = 'nav-header';
        header.innerHTML = `<a href="index.html" class="back-btn-round">← HOME</a>`;
        document.body.prepend(header);

        const data = [
            { title: "Soft Design", desc: "Why rounded corners matter.", img: "https://images.unsplash.com/photo-1517404215738-15263e9f9178?w=800&q=80" },
            { title: "Color Theory", desc: "Using pastels effectively.", img: "https://images.unsplash.com/photo-1520690214124-2405c5217036?w=800&q=80" },
            { title: "3D Shapes", desc: "From cubes to donuts.", img: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80" },
            { title: "Animation", desc: "Making things float.", img: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=800&q=80" }
        ];

        const contentDiv = document.createElement('div');
        contentDiv.className = 'feed-container';
        
        data.forEach((item, index) => {
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

        setTimeout(() => {
            if(typeof gsap !== 'undefined') {
                gsap.utils.toArray('.content-item').forEach(item => {
                    gsap.to(item, { opacity: 1, duration: 1, scrollTrigger: { trigger: item, start: "top 85%" } });
                });
            }
        }, 100);
    }
});

// --- 2. THREE.JS BACKGROUND ---
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x24243e, 0.02);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
const container = document.getElementById('canvas-container');
if(container) container.appendChild(renderer.domElement);

camera.position.z = 15;

const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);
const dirLight1 = new THREE.DirectionalLight(0xff6b6b, 0.8);
dirLight1.position.set(-10, 10, 10);
scene.add(dirLight1);
const dirLight2 = new THREE.DirectionalLight(0x4ecdc4, 0.8);
dirLight2.position.set(10, -10, 10);
scene.add(dirLight2);

// Soft Shapes
const objects = [];
const matCoral = new THREE.MeshPhysicalMaterial({ color: 0xff6b6b, roughness: 0.4, clearcoat: 0.5 });
const matMint = new THREE.MeshPhysicalMaterial({ color: 0x4ecdc4, roughness: 0.4, clearcoat: 0.5 });
const matYellow = new THREE.MeshPhysicalMaterial({ color: 0xffe66d, roughness: 0.4, clearcoat: 0.5 });

function createSoftShape() {
    const type = Math.floor(Math.random() * 3);
    let mesh;
    let material = [matCoral, matMint, matYellow][Math.floor(Math.random() * 3)];
    if (type === 0) mesh = new THREE.Mesh(new THREE.TorusGeometry(1.5, 0.6, 16, 50), material);
    else if (type === 1) mesh = new THREE.Mesh(new THREE.IcosahedronGeometry(1.5, 1), material);
    else mesh = new THREE.Mesh(new THREE.CapsuleGeometry(0.8, 2, 4, 8), material);

    mesh.position.x = (Math.random() - 0.5) * 40;
    mesh.position.y = (Math.random() - 0.5) * 50 - 5;
    mesh.position.z = (Math.random() - 0.5) * 20 - 5;
    
    mesh.userData = { speed: Math.random() * 0.02 + 0.01, rotX: Math.random() * 0.01, rotY: Math.random() * 0.01 };
    scene.add(mesh);
    objects.push(mesh);
}

for(let i=0; i<25; i++) createSoftShape();

let scrollY = 0;
function animate() {
    requestAnimationFrame(animate);
    objects.forEach(obj => {
        obj.rotation.x += obj.userData.rotX;
        obj.rotation.y += obj.userData.rotY;
        obj.position.y += obj.userData.speed + (scrollY * 0.0002);
        if(obj.position.y > 25) obj.position.y = -30;
    });
    renderer.render(scene, camera);
}
animate();

window.addEventListener('scroll', () => scrollY = window.scrollY);
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
