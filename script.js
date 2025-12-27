document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. WIREFRAME ROBOT HEAD (MENU)
    // ==========================================
    const robotContainer = document.getElementById('robot-container');
    if (robotContainer) {
        const robScene = new THREE.Scene();
        const robCamera = new THREE.PerspectiveCamera(50, 1, 0.1, 100); 
        robCamera.position.z = 5;

        const robRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        robRenderer.setSize(60, 60); 
        robotContainer.appendChild(robRenderer.domElement);

        // -- LINE ART HEAD --
        const headGeo = new THREE.BoxGeometry(1.8, 1.8, 1.8);
        const headMat = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true });
        const robotHead = new THREE.Mesh(headGeo, headMat);
        
        // Eyes
        const eyeGeo = new THREE.PlaneGeometry(0.3, 0.3);
        const eyeMat = new THREE.MeshBasicMaterial({ color: 0x00f3ff, side: THREE.DoubleSide });
        const eye1 = new THREE.Mesh(eyeGeo, eyeMat);
        const eye2 = new THREE.Mesh(eyeGeo, eyeMat);
        eye1.position.set(-0.4, 0.1, 0.91);
        eye2.position.set(0.4, 0.1, 0.91);
        
        const robotGroup = new THREE.Group();
        robotGroup.add(robotHead);
        robotGroup.add(eye1);
        robotGroup.add(eye2);
        robScene.add(robotGroup);

        const animateRobot = () => {
            requestAnimationFrame(animateRobot);
            robotGroup.rotation.y += 0.015;
            robotGroup.rotation.x = Math.sin(Date.now() * 0.002) * 0.1;
            robRenderer.render(robScene, robCamera);
        };
        animateRobot();

        const menuOverlay = document.getElementById('menu-overlay');
        robotContainer.addEventListener('click', () => {
            menuOverlay.classList.toggle('active');
        });
        document.querySelectorAll('.menu-item').forEach(link => {
            link.addEventListener('click', () => menuOverlay.classList.remove('active'));
        });
    }

    // ==========================================
    // 2. MAIN SCENE: POLYGON + RISING SAND
    // ==========================================
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x1a1a2e, 0.03);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    const container = document.getElementById('canvas-container');
    if(container) container.appendChild(renderer.domElement);
    camera.position.z = 10;

    // A. The Big Wireframe Polygon
    const polyGeo = new THREE.IcosahedronGeometry(4, 1); 
    const polyMat = new THREE.MeshBasicMaterial({ color: 0x00f3ff, wireframe: true, transparent: true, opacity: 0.3 });
    const polygon = new THREE.Mesh(polyGeo, polyMat);
    scene.add(polygon);

    // B. RISING SAND PARTICLES (ADJUSTED LOGIC)
    const sandGeo = new THREE.BufferGeometry();
    const sandCount = 1000;
    const posArray = new Float32Array(sandCount * 3);
    const speedArray = new Float32Array(sandCount); 

    for(let i=0; i<sandCount; i++) {
        posArray[i*3] = (Math.random() - 0.5) * 60;   
        posArray[i*3+1] = (Math.random() - 0.5) * 60; 
        posArray[i*3+2] = (Math.random() - 0.5) * 40; 
        
        // --- CHANGE 1: SUPER SLOW AMBIENT SPEED ---
        // Was 0.02, now 0.0005 (Barely moving)
        speedArray[i] = 0.0005 + Math.random() * 0.001; 
    }

    sandGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    const sandMat = new THREE.PointsMaterial({ 
        size: 0.12, 
        color: 0x00f3ff, 
        transparent: true, 
        opacity: 0.8 
    });
    
    const sandSystem = new THREE.Points(sandGeo, sandMat);
    scene.add(sandSystem);

    // Animation Loop
    let scrollY = 0;
    const animateMain = () => {
        requestAnimationFrame(animateMain);

        // 1. Polygon Anim
        polygon.rotation.y += 0.002;
        polygon.position.y = scrollY * 0.01; 
        let newOp = 0.3 - (scrollY * 0.0005); 
        polygon.material.opacity = Math.max(0, newOp);

        // 2. Sand Anim (Logic Update)
        
        // --- CHANGE 2: MOVE WHOLE SYSTEM WITH SCROLL ---
        // As you scroll down (scrollY increases), the system moves UP (+y)
        sandSystem.position.y = scrollY * 0.05; 

        // Internal "Very Slow" Drift
        const positions = sandSystem.geometry.attributes.position.array;
        for(let i=0; i<sandCount; i++) {
            // Add the tiny speed value we set earlier
            positions[i*3+1] += speedArray[i]; 

            // If particle goes too high inside the system, reset to bottom
            if(positions[i*3+1] > 30) {
                positions[i*3+1] = -30;
            }
        }
        sandSystem.geometry.attributes.position.needsUpdate = true; 

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
    // 3. SAGAR ANIMATION
    // ==========================================
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        
        const logo = document.getElementById("hero-logo");
        if (logo) {
            const letters = document.querySelectorAll('.letter');
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: "body", start: "top top", end: "600px top", scrub: 1
                }
            });

            tl.to(letters, { color: (i) => i % 2 === 0 ? "#00f3ff" : "#ff007f", stagger: 0.1, duration: 1 })
              .to(letters, { color: "#ffffff", duration: 1 })
              .to(logo, { top: "40px", left: "40px", scale: 0.25, xPercent: 0, yPercent: 0, transformOrigin: "top left", position: "fixed", duration: 2 });
        }
    }

    // ==========================================
    // 4. BLOGS GENERATOR
    // ==========================================
    const isHomePage = document.getElementById('hero-logo');
    if (!isHomePage) {
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
                    <div class
                    
