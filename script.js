// VERSION 15.1 STABLE
window.onload = () => {

    // --- 0. PRELOADER ---
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => { preloader.classList.add('loaded'); }, 2000); 
    }

    // ==========================================
    // 1. MASTER PHOTO DATABASE
    // ==========================================
    // Add photos here. Top 5 go to Fan Deck.
    const myPhotos = [
        { src: "./photos/IMG_20251101_063329.jpg", location: "Tokyo, Japan", desc: "Neon lights reflecting on wet pavement." },
        { src: "./photos/IMG_20251101_070352.jpg", location: "Kyoto Streets", desc: "Traditional vibes in a modern world." },
        { src: "./photos/IMG_20250913_192716.jpg", location: "Times Square, NYC", desc: "The city that never sleeps." },
        { src: "./photos/IMG_20250914_114126.jpg", location: "Bengaluru, India", desc: "Tech hub aesthetics." },
        { src: "./photos/IMG_20250914_094000.png", location: "London Eye", desc: "A view from the top." },
    ];


    // ==========================================
    // 2. CONTENT GENERATORS
    // ==========================================

    // A. Fan Deck (Home Page)
    const fanContainer = document.querySelector('.fan-container');
    if (fanContainer) {
        fanContainer.innerHTML = ''; 
        const top5 = myPhotos.slice(0, 5);
        top5.forEach((photo) => {
            const card = document.createElement('div');
            card.className = 'fan-card';
            card.style.backgroundImage = `url('${photo.src}')`;
            card.onclick = () => window.location.href = 'photography.html';
            fanContainer.appendChild(card);
        });
    }

    // B. Photo Grid & Lightbox (Photos Page)
    const photoGrid = document.getElementById('photo-grid');
    if (photoGrid) {
        // Create Lightbox
        let lightbox = document.getElementById('lightbox');
        if (!lightbox) {
            lightbox = document.createElement('div');
            lightbox.id = 'lightbox'; lightbox.className = 'lightbox';
            lightbox.innerHTML = `<button class="lightbox-close">&times;</button><img src="" alt="Preview">`;
            document.body.appendChild(lightbox);
            const closeBtn = lightbox.querySelector('.lightbox-close');
            const close = () => lightbox.classList.remove('active');
            closeBtn.addEventListener('click', close);
            lightbox.addEventListener('click', (e) => { if (e.target === lightbox) close(); });
        }
        const lightboxImg = lightbox.querySelector('img');

        // Populate Grid
        myPhotos.forEach(photo => {
            const item = document.createElement('div');
            item.className = 'gallery-item';
            item.innerHTML = `<img src="${photo.src}" loading="lazy"><div class="location-tag"><i class="fa-solid fa-location-dot"></i> ${photo.location}</div>`;
            item.onclick = () => {
                lightboxImg.src = photo.src;
                lightbox.classList.add('active');
            };
            photoGrid.appendChild(item);
        });
    }

    // C. Blogs
    const blogGrid = document.getElementById('blog-grid');
    if (blogGrid) {
        const blogs = [
            { title: "Future of UI", desc: "Exploring neon aesthetics.", img: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600", link: "#" },
            { title: "Cyberpunk Art", desc: "Digital revolution.", img: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=600", link: "#" },
            { title: "3D Web Design", desc: "Three.js tutorials.", img: "https://images.unsplash.com/photo-1517404215738-15263e9f9178?w=600", link: "#" }
        ];
        blogs.forEach(post => {
            const card = document.createElement('a'); card.href = post.link; card.target = "_blank"; card.className = 'blog-card';
            card.innerHTML = `<img src="${post.img}" class="blog-img"><div class="blog-content"><h3 class="blog-title">${post.title}</h3><p class="blog-desc">${post.desc}</p></div>`;
            blogGrid.appendChild(card);
        });
    }

    // ==========================================
    // 3. UI LOGIC
    // ==========================================
    const navPill = document.getElementById('desktop-nav');
    if(navPill) window.addEventListener('scroll', () => navPill.classList.toggle('scrolled', window.scrollY > 50));

    const mobileToggle = document.getElementById('mobile-toggle');
    const mobileOverlay = document.getElementById('mobile-overlay');
    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => { mobileToggle.classList.toggle('open'); mobileOverlay.classList.toggle('active'); });
        document.querySelectorAll('.mobile-link').forEach(link => link.addEventListener('click', () => { mobileToggle.classList.remove('open'); mobileOverlay.classList.remove('active'); }));
    }

    // ==========================================
    // 4. THREE.JS
    // ==========================================
    const canvasContainer = document.getElementById('canvas-container');
    if (canvasContainer) {
        const scene = new THREE.Scene(); scene.fog = new THREE.FogExp2(0x121212, 0.02);
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        canvasContainer.appendChild(renderer.domElement);
        camera.position.set(0, 5, 20); camera.rotation.x = -0.2;
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); scene.add(ambientLight);
        const gridHelper = new THREE.GridHelper(200, 40, 0xFF5722, 0x333333); gridHelper.position.y = -5; scene.add(gridHelper);
        const starGeo = new THREE.BufferGeometry(); const starCount = 800; const starPos = new Float32Array(starCount * 3);
        for(let i=0; i<starCount*3; i++) starPos[i] = (Math.random() - 0.5) * 150;
        starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
        const starMat = new THREE.PointsMaterial({ size: 0.1, color: 0xFFFFFF, transparent: true, opacity: 0.5 });
        scene.add(new THREE.Points(starGeo, starMat));
        const animate = () => { requestAnimationFrame(animate); gridHelper.position.z = (gridHelper.position.z + 0.05) % 5; renderer.render(scene, camera); };
        animate();
        window.addEventListener('resize', () => { camera.aspect = window.innerWidth/window.innerHeight; camera.updateProjectionMatrix(); renderer.setSize(window.innerWidth,window.innerHeight); });
    }

    // ==========================================
    // 5. GSAP
    // ==========================================
    if (typeof gsap !== 'undefined' && document.querySelector('.hero-title')) {
        gsap.from(".hero-title", { y: 50, opacity: 0, duration: 1, ease: "power3.out", delay: 0.2 });
        gsap.from(".hero-desc", { y: 30, opacity: 0, duration: 1, ease: "power3.out", delay: 0.4 });
        gsap.from(".hero-right", { x: 50, opacity: 0, duration: 1.5, ease: "power3.out", delay: 0.5 });
        gsap.from(".hero-bottom-bar", { y: 50, opacity: 0, duration: 1, ease: "power3.out", delay: 1 });
        gsap.from(".fan-card", { scrollTrigger: { trigger: ".fan-section", start: "top 80%" }, y: 100, opacity: 0, duration: 0.8, stagger: 0.1, ease: "power2.out" });
    }
};
