document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. MENU TOGGLE (Stylized X) ---
    const menuBtn = document.getElementById('menu-toggle-btn');
    const menuOverlay = document.getElementById('menu-overlay');

    if (menuBtn && menuOverlay) {
        menuBtn.addEventListener('click', () => {
            menuBtn.classList.toggle('open'); // Triggers CSS X animation
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
        
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        canvasContainer.appendChild(renderer.domElement);
        camera.position.z = 20;

        // Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);
        const pointLight = new THREE.PointLight(0xffffff, 1);
        pointLight.position.set(10, 10, 10);
        scene.add(pointLight);

        // A. PROMINENT ICOSAHEDRON (Interact with SAGAR)
        const polyGeo = new THREE.IcosahedronGeometry(6, 1); // Increased Size
        const polyMat = new THREE.MeshStandardMaterial({ 
            color: 0x00f3ff, // Cyan to pop against background
            wireframe: true, 
            transparent: true, 
            opacity: 0.5,
            emissive: 0x244855,
            emissiveIntensity: 0.5
        }); 
        const polygon = new THREE.Mesh(polyGeo, polyMat);
        scene.add(polygon);

        let scrollY = 0;
        const animateMain = () => {
            requestAnimationFrame(animateMain);
            
            // Interaction: Rotate Polygon based on scroll
            polygon.rotation.y += 0.002 + (scrollY * 0.0001);
            polygon.rotation.x += 0.001;
            
            // If Home Page, make it float around the center text
            if(isHomePage) {
                // Gentle pulse scale
                const scale = 1 + Math.sin(Date.now() * 0.001) * 0.1;
                polygon.scale.set(scale, scale, scale);
            }

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

    // --- 3. HERO LOGO (FIXED TOP-LEFT MOVEMENT) ---
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        
        const logo = document.getElementById("hero-logo");
        if (logo) {
            const tl = gsap.timeline();

            // 1. LANDING: Center Screen
            // We set transforms explicitly to ensure start state
            tl.fromTo(logo, 
                { opacity: 0, scale: 0.5, top: "50%", left: "50%", xPercent: -50, yPercent: -50 }, 
                { opacity: 1, scale: 1, top: "50%", left: "50%", xPercent: -50, yPercent: -50, duration: 2.5, ease: "power3.out", delay: 3 }
            );

            // 2. SCROLL: Force to Top-Left
            // We animate 'top' and 'left' to fixed pixels, and kill the % transforms
            gsap.to(logo, {
                scrollTrigger: { 
                    trigger: "body", 
                    start: "top top", 
                    end: "500px top", 
                    scrub: 1 
                },
                top: "40px",
                left: "40px",
                xPercent: 0, // IMPORTANT: Resets horizontal center
                yPercent: 0, // IMPORTANT: Resets vertical center
                scale: 0.25,
                color: "#E64833",
                ease: "power1.out"
            });
        }
    }

    // --- 4. PAGE CONTENT GENERATOR ---
    if (!isHomePage) {
        if (!document.querySelector('.nav-header')) {
            const header = document.createElement('nav'); 
            header.className = 'nav-header';
            header.innerHTML = `<a href="index.html" class="back-btn-round">← HOME</a>`;
            document.body.prepend(header);
        }

        const path = window.location.pathname;
        const isPhotoPage = path.includes("photography") || path.includes("photos");

        if (isPhotoPage) {
            // SLIDER
            const banner = document.createElement('div'); banner.className = 'banner';
            const slider = document.createElement('div'); slider.className = 'slider';
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
            document.querySelector('.scroll-container') ? document.querySelector('.scroll-container').appendChild(banner) : document.body.appendChild(banner);

            // GRID
            const recentPhotos = [
                { title: "Neon Rain", location: "Tokyo", img: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&q=80" },
                { title: "Cyber Alley", location: "Seoul", img: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=800&q=80" },
                { title: "Void", location: "Berlin", img: "https://images.unsplash.com/photo-1486744360400-1b8a11ea8416?w=800&q=80" },
                { title: "Market", location: "Hong Kong", img: "https://images.unsplash.com/photo-1535295972055-1c762f4483e5?w=800&q=80" }
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
            document.querySelector('.scroll-container') ? document.querySelector('.scroll-container').appendChild(recentSection) : document.body.appendChild(recentSection);

        } else {
            // BLOGS
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
            document.querySelector('.scroll-container') ? document.querySelector('.scroll-container').appendChild(contentDiv) : document.body.appendChild(contentDiv);
            
            setTimeout(() => { 
                const items = document.querySelectorAll('.content-item');
                items.forEach(item => { item.style.opacity = 1; item.style.transition = "opacity 1s ease"; });
            }, 500);
        }
    }
});
