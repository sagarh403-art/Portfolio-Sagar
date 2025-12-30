window.onload = () => {

    // --- 1. NAVIGATION LOGIC ---
    const navPill = document.getElementById('desktop-nav');
    if(navPill) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) navPill.classList.add('scrolled');
            else navPill.classList.remove('scrolled');
        });
    }

    const mobileToggle = document.getElementById('mobile-toggle');
    const mobileOverlay = document.getElementById('mobile-overlay');
    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('open');
            mobileOverlay.classList.toggle('active');
        });
    }

    // --- 2. THREE.JS BACKGROUND ---
    const canvasContainer = document.getElementById('canvas-container');
    if (canvasContainer) {
        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x121212, 0.02);
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        canvasContainer.appendChild(renderer.domElement);
        camera.position.set(0, 5, 20); camera.rotation.x = -0.2;
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); scene.add(ambientLight);
        
        const gridHelper = new THREE.GridHelper(200, 40, 0xFF5722, 0x333333); 
        gridHelper.position.y = -5; scene.add(gridHelper);
        const starGeo = new THREE.BufferGeometry(); const starCount = 800; const starPos = new Float32Array(starCount * 3);
        for(let i=0; i<starCount*3; i++) starPos[i] = (Math.random() - 0.5) * 150;
        starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
        const starMat = new THREE.PointsMaterial({ size: 0.1, color: 0xFFFFFF, transparent: true, opacity: 0.5 });
        scene.add(new THREE.Points(starGeo, starMat));

        const animate = () => {
            requestAnimationFrame(animate);
            gridHelper.position.z = (gridHelper.position.z + 0.05) % 5; 
            renderer.render(scene, camera);
        };
        animate();
        window.addEventListener('resize', () => { camera.aspect = window.innerWidth/window.innerHeight; camera.updateProjectionMatrix(); renderer.setSize(window.innerWidth,window.innerHeight); });
    }

    // --- 3. PAGE CONTENT GENERATORS ---
    
    // A. PHOTOGRAPHY GRID GENERATOR (With Locations)
    const photoGrid = document.getElementById('photo-grid');
    if (photoGrid) {
        // ADD YOUR PHOTOS & LOCATIONS HERE
        const myPhotos = [
            { src: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80", location: "Tokyo, Japan" },
            { src: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=800&q=80", location: "Kyoto Streets" },
            { src: "https://images.unsplash.com/photo-1517404215738-15263e9f9178?w=800&q=80", location: "Neon City" },
            { src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80", location: "Cyberpunk District" },
        ];

        myPhotos.forEach(photo => {
            const item = document.createElement('div');
            item.className = 'gallery-item';
            // Add image and location tag
            item.innerHTML = `
                <img src="${photo.src}" loading="lazy">
                <div class="location-tag"><i class="fa-solid fa-location-dot"></i> ${photo.location}</div>
            `;
            photoGrid.appendChild(item);
        });
    }

    // B. BLOG GENERATOR
    const blogGrid = document.getElementById('blog-grid');
    if (blogGrid) {
        const fallbackBlogs = [
            { title: "Future of UI", desc: "Exploring neon aesthetics.", img: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600", link: "#" },
            { title: "Cyberpunk Art", desc: "Digital revolution.", img: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=600", link: "#" },
            { title: "3D Web Design", desc: "Three.js tutorials.", img: "https://images.unsplash.com/photo-1517404215738-15263e9f9178?w=600", link: "#" }
        ];

        fallbackBlogs.forEach(post => {
            const card = document.createElement('a');
            card.href = post.link;
            card.target = "_blank";
            card.className = 'blog-card';
            card.innerHTML = `
                <img src="${post.img}" class="blog-img">
                <div class="blog-content">
                    <h3 class="blog-title">${post.title}</h3>
                    <p class="blog-desc">${post.desc}</p>
                </div>
            `;
            blogGrid.appendChild(card);
        });
    }

    // --- 4. HERO ANIMATIONS (GSAP) ---
    if (typeof gsap !== 'undefined' && document.querySelector('.hero-title')) {
        gsap.from(".hero-title", { y: 50, opacity: 0, duration: 1, delay: 0.2 });
        gsap.from(".hero-desc", { y: 30, opacity: 0, duration: 1, delay: 0.4 });
        gsap.from(".hero-right", { x: 50, opacity: 0, duration: 1.5, delay: 0.5 });
        gsap.from(".hero-bottom-bar", { y: 50, opacity: 0, duration: 1, delay: 1 });
    }
};
