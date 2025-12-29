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
    const isHomePage = !!document.getElementById('hero-main-title'); // Only true on index.html

    if (canvasContainer) {
        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x0F1C22, 0.02);
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        canvasContainer.appendChild(renderer.domElement);
        
        // DEFAULT CAMERA POSITION (Home)
        camera.position.set(0, 5, 20);
        camera.rotation.x = -0.2;

        // IF NOT HOME PAGE (Photos/Blogs) -> RESET CAMERA
        if (!isHomePage) {
            camera.position.set(0, 0, 30); // Look straight at center
            camera.rotation.x = 0;
        }

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        // GRID
        const gridHelper = new THREE.GridHelper(200, 40, 0xFF4D30, 0x0F1C22); 
        gridHelper.position.y = -5; 
        scene.add(gridHelper);
        const gridHelper2 = new THREE.GridHelper(200, 40, 0xFF4D30, 0x0F1C22); 
        gridHelper2.position.y = -5; gridHelper2.position.z = -200; 
        scene.add(gridHelper2);

        // PARTICLES
        const starGeo = new THREE.BufferGeometry(); const starCount = 1000; const starPos = new Float32Array(starCount * 3); 
        for(let i=0; i<starCount*3; i++) starPos[i] = (Math.random() - 0.5) * 150; 
        starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3)); 
        const starMat = new THREE.PointsMaterial({ size: 0.15, color: 0x00F0FF, transparent: true, opacity: 0.8 }); 
        const stars = new THREE.Points(starGeo, starMat); 
        scene.add(stars);

        // CENTRAL POLYGON (For Spiral Center)
        const polyGeo = new THREE.IcosahedronGeometry(5, 1); 
        const polyMat = new THREE.MeshBasicMaterial({ color: 0x90AEAD, wireframe: true, transparent: true, opacity: 0.2 }); 
        const polygon = new THREE.Mesh(polyGeo, polyMat);
        if (isHomePage) {
            polygon.position.set(0, 5, -30); // Background deco
        } else {
            polygon.position.set(0, 0, 0); // Center of spiral
        }
        scene.add(polygon);

        const animateMain = () => {
            requestAnimationFrame(animateMain);
            if (isHomePage) {
                gridHelper.position.z += 0.1; gridHelper2.position.z += 0.1;
                if (gridHelper.position.z >= 200) gridHelper.position.z = -200;
                if (gridHelper2.position.z >= 200) gridHelper2.position.z = -200;
                stars.rotation.z += 0.0002;
                polygon.rotation.y += 0.005;
            } else {
                // Inner page animation
                polygon.rotation.y += 0.01; 
                polygon.rotation.x += 0.005;
            }
            renderer.render(scene, camera);
        };
        animateMain();
        window.addEventListener('resize', () => { camera.aspect = window.innerWidth / window.innerHeight; camera.updateProjectionMatrix(); renderer.setSize(window.innerWidth, window.innerHeight); });
    }

    // --- 3. PAGE CONTENT GENERATOR ---
    const scrollContainer = document.querySelector('.scroll-container');
    const path = window.location.pathname;
    const isPhotoPage = path.includes("photography") || path.includes("photos");
    const isBlogPage = path.includes("blogs");

    if (!isHomePage && scrollContainer) {
        
        // --- PHOTOGRAPHY PAGE ---
        if (isPhotoPage) {
            // 3D Slider
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
            scrollContainer.appendChild(banner);

            // GRID LAYOUT (Restored)
            const recentSection = document.createElement('div'); recentSection.className = 'feed-container';
            recentSection.innerHTML = '<h2 style="text-align:center; color:white; margin-bottom:50px;">GALLERY</h2>';
            
            const gridDiv = document.createElement('div');
            gridDiv.className = 'recent-grid';

            const recentPhotos = [
                { title: "Neon Rain", img: sliderPhotos[0] }, 
                { title: "Cyber Alley", img: sliderPhotos[1] }, 
                { title: "Void", img: sliderPhotos[2] }, 
                { title: "Market", img: sliderPhotos[3] }
            ];
            recentPhotos.forEach(photo => { 
                const card = document.createElement('div'); card.className = 'recent-card';
                card.innerHTML = `
                    <img src="${photo.img}" class="recent-img">
                    <div class="photo-info">
                        <h3 class="photo-title">${photo.title}</h3>
                    </div>
                `;
                gridDiv.appendChild(card);
            });
            recentSection.appendChild(gridDiv);
            scrollContainer.appendChild(recentSection);
        }

        // --- BLOGS PAGE ---
        if (isBlogPage) {
            const blogs = [
                { title: "Digital Realms", desc: "Building worlds in code.", img: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80", link: "https://yourblogger.com" },
                { title: "Neon Dreams", desc: "Cyberpunk aesthetics.", img: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=800&q=80", link: "https://yourblogger.com" },
                { title: "Geometric Art", desc: "Math in motion.", img: "https://images.unsplash.com/photo-1517404215738-15263e9f9178?w=800&q=80", link: "https://yourblogger.com" }
            ];

            const contentDiv = document.createElement('div'); contentDiv.className = 'feed-container';
            blogs.forEach((item, index) => {
                const article = document.createElement('article');
                article.className = 'content-item';
                article.onclick = () => window.open(item.link, '_blank');
                
                // NO "READ ON BLOGGER" TEXT
                article.innerHTML = `
                    <div class="content-text">
                        <span style="color:var(--accent-orange); font-weight:bold;">0${index + 1}</span>
                        <h2 class="item-title">${item.title}</h2>
                        <p>${item.desc}</p>
                    </div>
                    <div class="content-visual"><img src="${item.img}"></div>
                `;
                contentDiv.appendChild(article);
            });
            scrollContainer.appendChild(contentDiv);
        }
    }
};
