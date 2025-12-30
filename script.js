window.onload = () => {
    
    // --- GSAP ANIMATIONS ---
    gsap.registerPlugin(ScrollTrigger);

    // Hero Animation
    gsap.from(".hero-title", { y: 50, opacity: 0, duration: 1, delay: 0.5 });
    gsap.from(".hero-subtitle", { y: 30, opacity: 0, duration: 1, delay: 0.8 });
    gsap.from(".hero-buttons", { y: 30, opacity: 0, duration: 1, delay: 1.1 });
    gsap.from(".hero-image-container", { scale: 0.8, opacity: 0, duration: 1.5, delay: 0.5, ease: "back.out(1.7)" });

    // Section Titles Animation
    gsap.utils.toArray(".section-title").forEach(title => {
        gsap.from(title, {
            scrollTrigger: { trigger: title, start: "top 80%" },
            y: 30, opacity: 0, duration: 1
        });
    });

    // Fan Deck Animation
    gsap.from(".fan-card", {
        scrollTrigger: { trigger: ".fan-deck-section", start: "top 70%" },
        y: 100, opacity: 0, duration: 0.8, stagger: 0.1, ease: "power2.out"
    });


    // --- THREE.JS 3D SPIRAL SLIDER ---
    const spiralContainer = document.getElementById('spiral-canvas-container');

    if (spiralContainer) {
        const scene = new THREE.Scene();
        // Add some fog for depth
        scene.fog = new THREE.FogExp2(0x050f0f, 0.002);

        const camera = new THREE.PerspectiveCamera(75, spiralContainer.clientWidth / spiralContainer.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(spiralContainer.clientWidth, spiralContainer.clientHeight);
        spiralContainer.appendChild(renderer.domElement);

        // Spiral Parameters
        const radius = 150;
        const turns = 2;
        const heightStep = 50;
        const imageCount = 10; // Number of photos in the spiral
        const spiralGroup = new THREE.Group();
        scene.add(spiralGroup);

        const textureLoader = new THREE.TextureLoader();
        // Using placeholder images from Unsplash
        const imageUrls = [
            "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&q=80",
            "https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=400&q=80",
            "https://images.unsplash.com/photo-1517404215738-15263e9f9178?w=400&q=80",
            "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80",
            "https://images.unsplash.com/photo-1558655146-d09347e0c766?w=400&q=80",
            "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=400&q=80",
            "https://images.unsplash.com/photo-1535295972055-1c762f4483e5?w=400&q=80",
            "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=400&q=80",
             "https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=400&q=80",
            "https://images.unsplash.com/photo-1486744360400-1b8a11ea8416?w=400&q=80"
        ];

        for (let i = 0; i < imageCount; i++) {
            const angle = (i / imageCount) * Math.PI * 2 * turns;
            const y = - (turns * heightStep) / 2 + (i * heightStep / (imageCount / turns));
            const x = radius * Math.cos(angle);
            const z = radius * Math.sin(angle);

            const geometry = new THREE.PlaneGeometry(80, 60);
            const material = new THREE.MeshBasicMaterial({
                map: textureLoader.load(imageUrls[i % imageUrls.length]),
                side: THREE.DoubleSide
            });
            const mesh = new THREE.Mesh(geometry, material);
            
            mesh.position.set(x, y, z);
            // Make the image look towards the center/camera
            mesh.lookAt(new THREE.Vector3(0, y, 0)); 
            
            spiralGroup.add(mesh);
        }

        // Camera Position
        camera.position.set(0, 0, 400);

        // Animation Loop
        let scrollPercent = 0;
        const animate = () => {
            requestAnimationFrame(animate);

            // Rotate the entire spiral group based on a simulated scroll
            // In a real scenario, you'd link this to actual scroll position
            scrollPercent += 0.001;
            spiralGroup.rotation.y = scrollPercent * Math.PI;
            spiralGroup.position.y = Math.sin(scrollPercent * 2) * 50; // Gentle bobbing

            renderer.render(scene, camera);
        };
        animate();

        // Handle Resize
        window.addEventListener('resize', () => {
            camera.aspect = spiralContainer.clientWidth / spiralContainer.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(spiralContainer.clientWidth, spiralContainer.clientHeight);
        });
    }
};
