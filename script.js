window.onload = () => {

    // ==========================================
    // 0. PRELOADER LOGIC
    // ==========================================
    const preloader = document.getElementById('preloader');
    if (preloader) {
        // Wait 2 seconds for animation, then fade out
        setTimeout(() => {
            preloader.classList.add('loaded');
        }, 2000); 
    }

    // ==========================================
    // 1. MASTER PHOTO DATABASE
    // ==========================================
    // INSTRUCTION: Add your photo filenames here.
    // The top 5 photos automatically go to the Fan Deck.
    const myPhotos = [
        { 
            src: "./assets/photo1.jpg", 
            location: "Tokyo, Japan", 
            desc: "Neon lights reflecting on wet pavement." 
        },
        { 
            src: "./assets/photo2.jpg", 
            location: "Kyoto Streets", 
            desc: "Traditional vibes in a modern world." 
        },
        { 
            src: "./assets/photo3.jpg", 
            location: "Times Square, NYC", 
            desc: "The city that never sleeps." 
        },
        { 
            src: "./assets/photo4.jpg", 
            location: "Bengaluru, India", 
            desc: "Tech hub aesthetics." 
        },
        { 
            src: "./assets/photo5.jpg", 
            location: "London Eye", 
            desc: "A view from the top." 
        },
        // Add more photos below as needed...
    ];


    // ==========================================
    // 2. CONTENT GENERATORS
    // ==========================================

    // --- A. Generate Fan Deck (Home Page) ---
    const fanContainer = document.querySelector('.fan-container');
    if (fanContainer) {
        fanContainer.innerHTML = ''; // Clear any existing HTML
        
        // Take exactly the first 5 photos for the fan
        const top5 = myPhotos.slice(0, 5);
        
        top5.forEach((photo) => {
            const card = document.createElement('div');
            card.className = 'fan-card';
            card.style.backgroundImage = `url('${photo.src}')`;
            
            // Clicking any card takes you to the full gallery
            card.onclick = () => window.location.href = 'photography.html';
            
            fanContainer.appendChild(card);
        });
    }

    // --- B. Generate Photo Grid (Photography Page) ---
    const photoGrid = document.getElementById('photo-grid');
    if (photoGrid) {
        myPhotos.forEach(photo => {
            const item = document.createElement('div');
            item.className = 'gallery-item';
            
            item.innerHTML = `
                <img src="${photo.src}" loading="lazy" alt="${photo.location}">
                <div class="location-tag">
                    <i class="fa-solid fa-location-dot"></i> ${photo.location}
                </div>
                <div class="photo-desc-overlay">
                    ${photo.desc}
                </div>
            `;
            photoGrid.appendChild(item);
        });
    }

    // --- C. Generate Blogs (Blogs Page) ---
    const blogGrid = document.getElementById('blog-grid');
    if (blogGrid) {
        const blogs = [
            { title: "Future of UI", desc: "Exploring neon aesthetics.", img: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600", link: "#" },
            { title: "Cyberpunk Art", desc: "Digital revolution.", img: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=600", link: "#" },
            { title: "3D Web Design", desc: "Three.js tutorials.", img: "https://images.unsplash.com/photo-1517404215738-15263e9f9178?w=600", link: "#" }
        ];

        blogs.forEach(post => {
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


    // ==========================================
    // 3. NAVIGATION & UI INTERACTION
    // ==========================================

    // Desktop Pill Scroll Effect
    const navPill = document.getElementById('desktop-nav');
    if(navPill) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) navPill.classList.add('scrolled');
            else navPill.classList.remove('scrolled');
        });
    }

    // Mobile Menu Toggle
    const mobileToggle = document.getElementById('mobile-toggle');
    const mobileOverlay = document.getElementById('mobile-overlay');
    
    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('open');
            mobileOverlay.classList.toggle('active');
        });
        
        // Close menu when clicking a link
        const mobileLinks = document.querySelectorAll('.mobile-link');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('open');
                mobileOverlay.classList.remove('active');
            });
        });
    }


    // ==========================================
    // 4. THREE.JS BACKGROUND
    // ==========================================
    const canvasContainer = document.getElementById('canvas-container');
    if (canvasContainer) {
        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x121212, 0.02); // Dark Fog

        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        canvasContainer.appendChild(renderer.domElement);
        
        camera.position.set(0, 5, 20);
        camera.rotation.x = -0.2;
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        // Grid
        const gridHelper = new THREE.GridHelper(200, 40, 0xFF5722, 0x333333); 
        gridHelper.position.y = -5; scene.add(gridHelper);
        
        // Stars
        const starGeo = new THREE.BufferGeometry(); 
        const starCount = 800; 
        const starPos = new Float32Array(starCount * 3); 
        for(let i=0; i<starCount*3; i++) starPos[i] = (Math.random() - 0.5) * 150; 
        starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3)); 
        const starMat = new THREE.PointsMaterial({ size: 0.1, color: 0xFFFFFF, transparent: true, opacity: 0.5 }); 
        const stars = new THREE.Points(starGeo, starMat); 
        scene.add(stars);

        // Animation Loop
        const animate = () => {
            requestAnimationFrame(animate);
            gridHelper.position.z = (gridHelper.position.z + 0.05) % 5; // Infinite scroll hack
            renderer.render(scene, camera);
        };
        animate();

        // Handle Resize
        window.addEventListener('resize', () => { 
            camera.aspect = window.innerWidth / window.innerHeight; 
            camera.updateProjectionMatrix(); 
            renderer.setSize(window.innerWidth, window.innerHeight); 
        });
    }


    // ==========================================
    // 5. GSAP ANIMATIONS (HERO)
    // ==========================================
    if (typeof gsap !== 'undefined' && document.querySelector('.hero-title')) {
        gsap.from(".hero-title", { y: 50, opacity: 0, duration: 1, ease: "power3.out", delay: 0.2 });
        gsap.from(".hero-desc", { y: 30, opacity: 0, duration: 1, ease: "power3.out", delay: 0.4 });
        gsap.from(".hero-right", { x: 50, opacity: 0, duration: 1.5, ease: "power3.out", delay: 0.5 });
        gsap.from(".hero-bottom-bar", { y: 50, opacity: 0, duration: 1, ease: "power3.out", delay: 1 });
        
        // Animate Fan Cards Entrance
        gsap.from(".fan-card", { 
            scrollTrigger: { trigger: ".fan-section", start: "top 80%" }, 
            y: 100, opacity: 0, duration: 0.8, stagger: 0.1, ease: "power2.out" 
        });
    }
};
