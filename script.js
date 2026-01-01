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
        
        // --- ADD YOUR BLOGGER POSTS HERE ---
        const blogs = [
            { 
                title: "Hello World: Welcome to My Digital Garden", 
                desc: "Stepping into the digital universe. A first look at my new journey.", 
                // Right-click the image on your actual blog -> "Copy Image Address" -> Paste here
                img: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjwDRg-t4MPWaVYbArXVKe2vjzbHxJ4Jl_3b0fLNffbQYYIWX4JA0u1c5iaP2wpCbrYGzrodg2WeNixxwc6OSuFvSs-q6W_ILxksWeEwfPvernKWGwyEPf_Z-tiJ05ZzZUBTXIqrtQBUPQAjwbAQFF3y8Nc6WM72MCysAf7TDBc1dTy2J0ZqkOMMA7NFjON/s3456/1000043079.jpg", 
                link: "https://sagarh-helloworld.blogspot.com/2025/12/hello-world-welcome-to-my-digital-garden.html" 
            },
            
            // COPY & PASTE THIS BLOCK FOR NEW POSTS:
            /*
            { 
                title: "My Second Blog Post", 
                desc: "A short summary of what this post is about.", 
                img: "https://blogger.googleusercontent.com/img/a/...", 
                link: "https://your-blog.blogspot.com/..." 
            },
            */
        ];

        blogs.forEach(post => {
            const card = document.createElement('a'); 
            card.href = post.link; 
            card.target = "_blank"; 
            card.className = 'blog-card';
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
