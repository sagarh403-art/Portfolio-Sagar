document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. MENU TOGGLE LOGIC ---
    const menuBtn = document.getElementById('menu-toggle-btn');
    const menuOverlay = document.getElementById('menu-overlay');

    if (menuBtn && menuOverlay) {
        menuBtn.addEventListener('click', () => {
            menuOverlay.classList.toggle('active');
            if (menuOverlay.classList.contains('active')) {
                menuBtn.innerHTML = '<i class="fa-solid fa-xmark"></i> CLOSE';
            } else {
                menuBtn.innerHTML = '<i class="fa-solid fa-bars"></i> MENU';
            }
        });
        
        document.querySelectorAll('.menu-item').forEach(link => {
            link.addEventListener('click', () => {
                menuOverlay.classList.remove('active');
                menuBtn.innerHTML = '<i class="fa-solid fa-bars"></i> MENU';
            });
        });
    }

    // --- 2. THREE.JS BACKGROUND (SAND + POLYGON) ---
    const canvasContainer = document.getElementById('canvas-container');
    if (canvasContainer) {
        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x1a1a2e, 0.03);

        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        canvasContainer.appendChild(renderer.domElement);
        camera.position.z = 10;

        // A. Polygon
        const polyGeo = new THREE.IcosahedronGeometry(4, 1); 
        const polyMat = new THREE.MeshBasicMaterial({ color: 0x00f3ff, wireframe: true, transparent: true, opacity: 0.3 });
        const polygon = new THREE.Mesh(polyGeo, polyMat);
        scene.add(polygon);

        // B. Infinite Sand
        const sandGeo = new THREE.BufferGeometry();
        const sandCount = 1500;
        const posArray = new Float32Array(sandCount * 3);
        const speedArray = new Float32Array(sandCount); 

        for(let i=0; i<sandCount; i++) {
            posArray[i*3] = (Math.random() - 0.5) * 60;   
            posArray[i*3+1] = (Math.random() - 0.5) * 60; 
            posArray[i*3+2] = (Math.random() - 0.5) * 40; 
            speedArray[i] = 0.005 + Math.random() * 0.01; 
        }

        sandGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        const sandMat = new THREE.PointsMaterial({ size: 0.12, color: 0x00f3ff, transparent: true, opacity: 0.8 });
        const sandSystem = new THREE.Points(sandGeo, sandMat);
        scene.add(sandSystem);

        let scrollY = 0;
        const animateMain = () => {
            requestAnimationFrame(animateMain);

            // Polygon fades on scroll
            polygon.rotation.y += 0.002;
            polygon.rotation.x += 0.001;
            polygon.position.y = scrollY * 0.01; 
            polygon.material.opacity = Math.max(0, 0.3 - (scrollY * 0.0005));

            // Sand moves infinitely
            const positions = sandSystem.geometry.attributes.position.array;
            for(let i=0; i<sandCount; i++) {
                positions[i*3+1] += speedArray[i]; 
                if(positions[i*3+1] > 30) positions[i*3+1] = -30;
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
    }

    // --- 3. SAGAR ANIMATION (GSAP) ---
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        
        const logo = document.getElementById("hero-logo");
        if (logo) {
            const letters = document.querySelectorAll('.letter');
            const tl = gsap.timeline({
                scrollTrigger: { trigger: "body", start: "top top", end: "600px top", scrub: 1 }
            });

            tl.to(letters, { color: (i) => i % 2 === 0 ? "#00f3ff" : "#ff007f", stagger: 0.1, duration: 1 })
              .to(letters, { color: "#ffffff", duration: 1 })
              .to(logo, { top: "40px", left: "40px", scale: 0.25, xPercent: 0, yPercent: 0, transformOrigin: "top left", position: "fixed", duration: 2 });
        }
    }

    // --- 4. PAGE CONTENT GENERATOR (Blogs/Photos) ---
    const isHomePage = document.getElementById('hero-logo');

    if (!isHomePage) {
        
        // Add Back Button
        if (!document.querySelector('.nav-header')) {
            const header = document.createElement('nav'); 
            header.className = 'nav-header';
            header.innerHTML = `<a href="index.html" class="back-btn-round">← HOME</a>`;
            document.body.prepend(header);
        }

        const path = window.location.pathname;
        const isPhotoPage = path.includes("photography") || path.includes("photos");

        // PHOTOGRAPHY PAGE
        if (isPhotoPage) {
            const banner = document.createElement('div');
            banner.className = 'banner';
            const slider = document.createElement('div');
            slider.className = 'slider';
            
            const sliderPhotos = [
                "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80",
                "https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=800&q=80",
                "https://images.unsplash.com/photo-1517404215738-15263e9f9178?w=800&q=80",
                "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80",
                "https://images.unsplash.com/photo-1558655146-d09347e0c766?w=800&q=80",
                "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=800&q=80",
                "https://images.unsplash.com/photo-1535295972055-1c762f4483e5?w=800&q=80",
                "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&q=80"
            ];
            slider.style.setProperty('--quantity', sliderPhotos.length);
            sliderPhotos.forEach((url, index) => {
                const item = document.createElement('div'); item.className = 'item';
                item.style.setProperty('--position', index + 1);
                const img = document.createElement('img'); img.src = url;
                item.appendChild(img); slider.appendChild(item);
            });
            banner.appendChild(slider);
            document.querySelector('.scroll-container').appendChild(banner);

            // Recent Grid
            const recentPhotos = [
                { title: "Neon Rain", location: "Tokyo, Japan", img: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&q=80" },
                { title: "Cyber Alley", location: "Seoul, Korea", img: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=800&q=80" },
                { title: "Void Structure", location: "Berlin, Germany", img: "https://images.unsplash.com/photo-1486744360400-1b8a11ea8416?w=800&q=80" },
                { title: "Night Market", location: "Hong Kong", img: "https://images.unsplash.com/photo-1535295972055-1c762f4483e5?w=800&q=80" }
            ];
            const recentSection = document.createElement('div'); recentSection.className = 'recent-section';
            const title = document.createElement('h2'); title.className = 'section-title'; title.innerText = "RECENT DROPS"; recentSection.appendChild(title);
            const grid = document.createElement('div'); grid.className = 'recent-grid';
            recentPhotos.forEach(photo => {
                const card = document.createElement('div'); card.className = 'recent-card';
                card.onclick = function() { this.classList.toggle('active'); };
                card.innerHTML = `<img src="${photo.img}" class="recent-img"><div class="photo-info"><h3 class="photo-title">${photo.title}</h3><div class="photo-loc"><i class="fa-solid fa-location-dot"></i> ${photo.location}</div></div>`;
                grid.appendChild(card);
            });
            recentSection.appendChild(grid);
            document.querySelector('.scroll-container').appendChild(recentSection);
        } 
        
        // BLOGS PAGE
        else {
            const blogs = [
                { title: "Digital Realms", desc: "Building worlds with code.", img: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80" },
                { title: "Neon Dreams", desc: "The aesthetics of cyberpunk.", img: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=800&q=80" },
                { title: "Geometric Art", desc: "Mathematics in motion.", img: "https://images.unsplash.com/photo-1517404215738-15263e9f9178?w=800&q=80" },
                { title: "Fluid UI", desc: "Interfaces that breathe.", img: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80" }
            ];

            const contentDiv = document.createElement('div'); contentDiv.className = 'feed-container';
            blogs.forEach((item, index) => {
                contentDiv.innerHTML += `<article class="content-item"><div class="content-text"><span style="color:var(--accent-cyan); font-weight:bold;">0${index + 1}</span><h2 class="item-title">${item.title}</h2><p>${item.desc}</p></div><div class="content-visual"><img src="${item.img}"></div></article>`;
            });
            document.querySelector('.scroll-container').appendChild(contentDiv);
            setTimeout(() => { if(typeof gsap !== 'undefined') gsap.utils.toArray('.content-item').forEach(item => gsap.to(item, { opacity: 1, duration: 1, scrollTrigger: { trigger: item, start: "top 85%" } })); }, 100);
        }
    }
});


// FAKE LOADER (Or wait for window.onload)
window.addEventListener('load', () => {
    const loader = document.getElementById('preloader');
    if(loader) {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    }
});

