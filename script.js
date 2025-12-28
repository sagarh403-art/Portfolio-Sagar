window.onload = () => {
    
    // --- 1. MENU TOGGLE ---
    const menuBtn = document.getElementById('menu-toggle-btn');
    const menuOverlay = document.getElementById('menu-overlay');

    if (menuBtn && menuOverlay) {
        menuBtn.addEventListener('click', () => {
            menuBtn.classList.toggle('open');
            menuOverlay.classList.toggle('active');
        });
        document.querySelectorAll('.menu-item').forEach(link => {
            link.addEventListener('click', () => {
                menuOverlay.classList.remove('active');
                menuBtn.classList.remove('open');
            });
        });
    }

    // --- 2. THREE.JS BACKGROUND ---
    const canvasContainer = document.getElementById('canvas-container');
    const isHomePage = !!document.getElementById('hero-logo');

    if (canvasContainer) {
        const scene = new THREE.Scene();
        // Fog adds depth and fades distant objects
        scene.fog = new THREE.FogExp2(0x244855, 0.02); 

        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        canvasContainer.appendChild(renderer.domElement);
        
        camera.position.set(0, 5, 20);
        camera.rotation.x = -0.2;

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        // A. THE GRID (Floor)
        const gridHelper = new THREE.GridHelper(200, 40, 0xE64833, 0x1a353f);
        gridHelper.position.y = -5;
        scene.add(gridHelper);
        const gridHelper2 = new THREE.GridHelper(200, 40, 0xE64833, 0x1a353f);
        gridHelper2.position.y = -5; gridHelper2.position.z = -200;
        scene.add(gridHelper2);

        // B. THE CYBER SUN (Giant Wireframe Sphere)
        // Used Icosahedron with high detail (2) to look like a tech-sphere
        const sunGeo = new THREE.IcosahedronGeometry(30, 2);
        const sunMat = new THREE.MeshBasicMaterial({ 
            color: 0xE64833, // Orange
            wireframe: true,
            transparent: true,
            opacity: 0.15
        });
        const sun = new THREE.Mesh(sunGeo, sunMat);
        sun.position.set(0, 0, -80); // Far in the back
        scene.add(sun);

        // C. FLOATING DATA PARTICLES
        const starGeo = new THREE.BufferGeometry();
        const starCount = 1000;
        const starPos = new Float32Array(starCount * 3);
        for(let i=0; i<starCount*3; i++) {
            starPos[i] = (Math.random() - 0.5) * 150; // Spread wide
        }
        starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
        const starMat = new THREE.PointsMaterial({
            size: 0.2,
            color: 0x90AEAD, // Teal
            transparent: true,
            opacity: 0.8
        });
        const stars = new THREE.Points(starGeo, starMat);
        scene.add(stars);

        // D. FLOATING GEOMETRY (The centerpiece)
        const polyGeo = new THREE.IcosahedronGeometry(6, 0); 
        const polyMat = new THREE.MeshBasicMaterial({ color: 0x90AEAD, wireframe: true, transparent: true, opacity: 0.2 }); 
        const polygon = new THREE.Mesh(polyGeo, polyMat);
        polygon.position.set(0, 5, -30);
        scene.add(polygon);

        const animateMain = () => {
            requestAnimationFrame(animateMain);
            if (isHomePage) {
                // Move Grid
                gridHelper.position.z += 0.2;
                gridHelper2.position.z += 0.2;
                if (gridHelper.position.z >= 200) gridHelper.position.z = -200;
                if (gridHelper2.position.z >= 200) gridHelper2.position.z = -200;

                // Rotate Sun & Polygon
                sun.rotation.y += 0.001;
                polygon.rotation.y += 0.005; polygon.rotation.x += 0.002;
                
                // Float Particles
                stars.rotation.z += 0.0005;
            } else {
                polygon.rotation.y += 0.002;
            }
            renderer.render(scene, camera);
        };
        animateMain();
        window.addEventListener('resize', () => { camera.aspect = window.innerWidth / window.innerHeight; camera.updateProjectionMatrix(); renderer.setSize(window.innerWidth, window.innerHeight); });
    }

    // --- 3. HERO LOGO & SUBTITLE ---
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        
        const logo = document.getElementById("hero-logo");
        const subtitle = document.getElementById("hero-subtitle");

        if (logo) {
            // Init State
            gsap.set(logo, { top: "50%", left: "50%", xPercent: -50, yPercent: -50, scale: 1, opacity: 0 });
            if(subtitle) gsap.set(subtitle, { opacity: 0, y: 20 });

            const tl = gsap.timeline();

            // 1. Intro Animation
            tl.to(logo, { opacity: 1, duration: 2, delay: 3 })
              .to(subtitle, { opacity: 1, y: 0, duration: 1 }, "-=1");

            // 2. Logo Scroll (To Corner)
            gsap.to(logo, {
                scrollTrigger: { trigger: "body", start: "top top", end: "500px top", scrub: 1 },
                top: "40px", left: "40px", xPercent: 0, yPercent: 0, scale: 0.25, color: "#E64833", ease: "none"
            });

            // 3. Subtitle Scroll (Fade Out)
            if(subtitle) {
                gsap.to(subtitle, {
                    scrollTrigger: { trigger: "body", start: "top top", end: "200px top", scrub: 1 },
                    opacity: 0, y: -50
                });
            }
        }
    }

    // ... (Keep Section 4: Page Content Generator exactly as it was in v10) ...
    // ... Copy Section 4 from previous response here ...
    // --- 4. PAGE CONTENT GENERATOR ---
    if (!isHomePage) {
        if (!document.querySelector('.nav-header')) {
            const header = document.createElement('nav'); header.className = 'nav-header';
            header.innerHTML = `<a href="index.html" class="back-btn-round">← HOME</a>`;
            document.body.prepend(header);
        }

        const path = window.location.pathname;
        const isPhotoPage = path.includes("photography") || path.includes("photos");

        if (isPhotoPage) {
            const banner = document.createElement('div'); banner.className = 'banner';
            const slider = document.createElement('div'); slider.className = 'slider';
            const sliderPhotos = [
                "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80", "https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=800&q=80",
                "https://images.unsplash.com/photo-1517404215738-15263e9f9178?w=800&q=80", "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80",
                "https://images.unsplash.com/photo-1558655146-d09347e0c766?w=800&q=80", "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=800&q=80",
                "https://images.unsplash.com/photo-1535295972055-1c762f4483e5?w=800&q=80", "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&q=80"
            ];
            slider.style.setProperty('--quantity', sliderPhotos.length);
            sliderPhotos.forEach((url, index) => {
                const item = document.createElement('div'); item.className = 'item';
                item.style.setProperty('--position', index + 1);
                const img = document.createElement('img'); img.src = url; item.appendChild(img); slider.appendChild(item);
            });
            banner.appendChild(slider);
            document.querySelector('.scroll-container').appendChild(banner);

            const recentSection = document.createElement('div'); recentSection.className = 'recent-section';
            recentSection.innerHTML = '<h2 class="section-title">RECENT DROPS</h2><div class="recent-grid"></div>';
            const grid = recentSection.querySelector('.recent-grid');
            
            const recentPhotos = [
                { title: "Neon Rain", location: "Tokyo", img: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&q=80" },
                { title: "Cyber Alley", location: "Seoul", img: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=800&q=80" },
                { title: "Void", location: "Berlin", img: "https://images.unsplash.com/photo-1486744360400-1b8a11ea8416?w=800&q=80" },
                { title: "Market", location: "Hong Kong", img: "https://images.unsplash.com/photo-1535295972055-1c762f4483e5?w=800&q=80" }
            ];
            recentPhotos.forEach(photo => {
                const card = document.createElement('div'); card.className = 'recent-card';
                card.onclick = function() { this.classList.toggle('active'); };
                card.innerHTML = `<img src="${photo.img}" class="recent-img"><div class="photo-info"><h3 class="photo-title">${photo.title}</h3><div class="photo-loc"><i class="fa-solid fa-location-dot"></i> ${photo.location}</div></div>`;
                grid.appendChild(card);
            });
            document.querySelector('.scroll-container').appendChild(recentSection);

        } else {
            const blogs = [
                { title: "Digital Realms", desc: "Building worlds.", img: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80" },
                { title: "Neon Dreams", desc: "Cyberpunk aesthetics.", img: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=800&q=80" },
                { title: "Geometric Art", desc: "Math in motion.", img: "https://images.unsplash.com/photo-1517404215738-15263e9f9178?w=800&q=80" },
                { title: "Fluid UI", desc: "Interfaces that breathe.", img: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80" }
            ];
            const contentDiv = document.createElement('div'); contentDiv.className = 'feed-container';
            blogs.forEach((item, index) => {
                contentDiv.innerHTML += `<article class="content-item"><div class="content-text"><span style="color:var(--accent-orange); font-weight:bold;">0${index + 1}</span><h2 class="item-title">${item.title}</h2><p>${item.desc}</p></div><div class="content-visual"><img src="${item.img}"></div></article>`;
            });
            document.querySelector('.scroll-container').appendChild(contentDiv);
            setTimeout(() => { 
                const items = document.querySelectorAll('.content-item');
                items.forEach(item => { item.style.opacity = 1; item.style.transition = "opacity 1s ease"; });
            }, 500);
        }
    }
};
