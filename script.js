document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. THE 3D ROBOT MENU BUTTON
    // ==========================================
    const robotContainer = document.getElementById('robot-container');
    if (robotContainer) {
        const robScene = new THREE.Scene();
        // Transparent background
        const robCamera = new THREE.PerspectiveCamera(50, 1, 0.1, 100); 
        robCamera.position.z = 5;

        const robRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        robRenderer.setSize(80, 80); // Matches CSS size
        robotContainer.appendChild(robRenderer.domElement);

        // Robot Head (Box)
        const headGeo = new THREE.BoxGeometry(2.5, 2.5, 2.5);
        const headMat = new THREE.MeshNormalMaterial({ wireframe: false }); // Colorful look
        const robotHead = new THREE.Mesh(headGeo, headMat);
        
        // Eyes (Spheres)
        const eyeGeo = new THREE.SphereGeometry(0.4, 16, 16);
        const eyeMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
        const eye1 = new THREE.Mesh(eyeGeo, eyeMat);
        const eye2 = new THREE.Mesh(eyeGeo, eyeMat);
        eye1.position.set(-0.6, 0.2, 1.3);
        eye2.position.set(0.6, 0.2, 1.3);
        
        const robotGroup = new THREE.Group();
        robotGroup.add(robotHead);
        robotGroup.add(eye1);
        robotGroup.add(eye2);
        robScene.add(robotGroup);

        // Animation Loop for Robot
        const animateRobot = () => {
            requestAnimationFrame(animateRobot);
            robotGroup.rotation.y += 0.02; // Rotate continuously
            robotGroup.rotation.x = Math.sin(Date.now() * 0.002) * 0.2; // Nod slightly
            robRenderer.render(robScene, robCamera);
        };
        animateRobot();

        // Click Logic
        const menuOverlay = document.getElementById('menu-overlay');
        robotContainer.addEventListener('click', () => {
            menuOverlay.classList.toggle('active');
        });
        
        document.querySelectorAll('.menu-item').forEach(link => {
            link.addEventListener('click', () => {
                menuOverlay.classList.remove('active');
            });
        });
    }

    // ==========================================
    // 2. MAIN BACKGROUND SCENE (The Polygon)
    // ==========================================
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x1a1a2e, 0.03);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    const container = document.getElementById('canvas-container');
    if(container) container.appendChild(renderer.domElement);

    camera.position.z = 10;

    // The Big 3D Decagon (Icosahedron actually looks better/more "polygon")
    const polyGeo = new THREE.IcosahedronGeometry(4, 1); // 4 = size, 1 = detail
    const polyMat = new THREE.MeshBasicMaterial({ 
        color: 0x00f3ff, 
        wireframe: true, 
        transparent: true, 
        opacity: 0.3 
    });
    const polygon = new THREE.Mesh(polyGeo, polyMat);
    scene.add(polygon);

    // Some floating particles for depth
    const partsGeo = new THREE.BufferGeometry();
    const partsCount = 500;
    const posArray = new Float32Array(partsCount * 3);
    for(let i=0; i<partsCount*3; i++) posArray[i] = (Math.random()-0.5) * 50;
    partsGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const partsMat = new THREE.PointsMaterial({ size: 0.05, color: 0xffffff });
    const particles = new THREE.Points(partsGeo, partsMat);
    scene.add(particles);

    // Animation Loop
    let scrollY = 0;
    const animateMain = () => {
        requestAnimationFrame(animateMain);

        // Rotate Polygon
        polygon.rotation.y += 0.002;
        polygon.rotation.x += 0.001;

        // Move Polygon UP on scroll and Fade Out
        polygon.position.y = scrollY * 0.01; 
        
        // Opacity math: Start 0.3, fade to 0 as we scroll down
        let newOp = 0.3 - (scrollY * 0.0005);
        if (newOp < 0) newOp = 0;
        polygon.material.opacity = newOp;

        renderer.render(scene, camera);
    };
    animateMain();

    window.addEventListener('scroll', () => scrollY = window.scrollY);
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // ==========================================
    // 3. SAGAR ANIMATION (Color -> Shrink -> Left)
    // ==========================================
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        
        const logo = document.getElementById("hero-logo");
        
        if (logo) {
            const letters = document.querySelectorAll('.letter');
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: "body",
                    start: "top top",
                    end: "600px top", // Duration of animation
                    scrub: 1
                }
            });

            // 1. Change Colors (Water color effect)
            tl.to(letters, {
                color: (i) => i % 2 === 0 ? "#00f3ff" : "#ff007f", // Cyan/Pink
                stagger: 0.1,
                duration: 1
            })
            // 2. Back to White
            .to(letters, {
                color: "#ffffff",
                duration: 1
            })
            // 3. Shrink & Move to Top-Left
            .to(logo, {
                top: "40px",
                left: "40px",
                scale: 0.25,
                xPercent: 0, // Reset horizontal center
                yPercent: 0, // Reset vertical center
                transformOrigin: "top left",
                position: "fixed",
                duration: 2
            });
        }
    }

    // ==========================================
    // 4. BLOGS / PHOTOS CONTENT GENERATOR
    // ==========================================
    const isHomePage = document.getElementById('hero-logo');

    // Only run this if we are NOT on the home page (Logo missing)
    if (!isHomePage) {
        
        // Fix: Check if header already exists to prevent duplicates
        if (!document.querySelector('.nav-header')) {
            const header = document.createElement('nav'); 
            header.className = 'nav-header';
            header.innerHTML = `<a href="index.html" class="back-btn-round">← HOME</a>`;
            document.body.prepend(header);
        }

        const data = [
            { title: "Digital Realms", desc: "Building worlds with code.", img: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80" },
            { title: "Neon Dreams", desc: "The aesthetics of cyberpunk.", img: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=800&q=80" },
            { title: "Geometric Art", desc: "Mathematics in motion.", img: "https://images.unsplash.com/photo-1517404215738-15263e9f9178?w=800&q=80" },
            { title: "Fluid UI", desc: "Interfaces that breathe.", img: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80" }
        ];

        const contentDiv = document.createElement('div');
        contentDiv.className = 'feed-container';
        
        data.forEach((item, index) => {
            contentDiv.innerHTML += `
                <article class="content-item">
                    <div class="content-text">
                        <span style="color:var(--accent-cyan); font-weight:bold;">0${index + 1}</span>
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
