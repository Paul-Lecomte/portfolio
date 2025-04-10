import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const SublimeWallpaper = () => {
    const canvasRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!canvasRef.current) return;

        const canvas = document.createElement("canvas");
        canvasRef.current.appendChild(canvas);
        const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 20000);
        camera.position.set(0, 1500, 2500);
        camera.lookAt(0, 0, 0); // Look toward the center of the scene

        // Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 2);
        scene.add(ambientLight);

        // Sun's Point Light (strong light outside the texture)
        const sunLight = new THREE.PointLight(0xffffff, 200, 0, 2);
        sunLight.position.set(0, 0, 0); // Sun at the center
        scene.add(sunLight);

        // Background
        const textureLoader = new THREE.TextureLoader();
        const starBackground = textureLoader.load("/textures/8k_stars_milky_way.jpg");
        const bgGeometry = new THREE.SphereGeometry(10000, 64, 64);
        const bgMaterial = new THREE.MeshBasicMaterial({
            map: starBackground,
            side: THREE.BackSide,
        });
        const backgroundSphere = new THREE.Mesh(bgGeometry, bgMaterial);
        scene.add(backgroundSphere);

        // Load GLTF Model
        const loader = new GLTFLoader();
        console.log("GLTFLoader initialized:", loader);

        loader.load(
            '/models/scene.gltf',
            (gltf) => {
                console.log('GLTF model loaded:', gltf);
                scene.add(gltf.scene);
            },
            (progress) => {
                console.log('Loading progress:', progress);
            },
            (error) => {
                console.error('Error loading GLTF model:', error);
            }
        );

        // Planets
        const planetsData = [
            { name: "Sun", texture: "2k_sun.jpg", size: 150, distance: 0, speed: 0 }, // Sun at the center
            { name: "Mercury", texture: "2k_mercury.jpg", size: 25, distance: 400, speed: 0.01 },
            { name: "Venus", texture: "2k_venus_surface.jpg", size: 40, distance: 600, speed: 0.008 },
            { name: "Earth", texture: "2k_earth_daymap.jpg", size: 50, distance: 800, speed: 0.006 },
            { name: "Mars", texture: "2k_mars.jpg", size: 35, distance: 1000, speed: 0.005 },
            { name: "Jupiter", texture: "2k_jupiter.jpg", size: 110, distance: 1400, speed: 0.003 },
            { name: "Saturn", texture: "2k_saturn.jpg", size: 95, distance: 1700, speed: 0.0025 },
            { name: "Uranus", texture: "2k_uranus.jpg", size: 70, distance: 2000, speed: 0.002 },
            { name: "Neptune", texture: "2k_neptune.jpg", size: 70, distance: 2300, speed: 0.0018 },
            { name: "Pluto", texture: "2k_pluto.jpg", size: 20, distance: 2700, speed: 0.001 },
            { name: "Ceres", texture: "2k_ceres.jpg", size: 15, distance: 1200, speed: 0.004 },
            { name: "Moon", texture: "2k_moon.jpg", size: 12, distance: 100, speed: 0.02, orbiting: "Earth" },
        ];

        const planets: THREE.Mesh[] = [];

        planetsData.forEach((data) => {
            const tex = textureLoader.load(`/textures/${data.texture}`);
            const geometry = new THREE.SphereGeometry(data.size, 32, 32);
            const material = new THREE.MeshStandardMaterial({ map: tex, emissive: data.name === "Sun" ? 0xffcc00 : 0x000000, emissiveIntensity: data.name === "Sun" ? 1 : 0 });
            const planet = new THREE.Mesh(geometry, material);
            planet.userData = { angle: Math.random() * Math.PI * 2, speed: data.speed, radius: data.distance };
            planet.position.x = data.distance;
            scene.add(planet);
            planets.push(planet);
        });

        // ⚫ Black Holes
        const blackHoles: THREE.Mesh[] = [];

        const createBlackHole = () => {
            const geometry = new THREE.TorusGeometry(40, 10, 16, 100);
            const material = new THREE.MeshBasicMaterial({ color: 0x000000 });
            const hole = new THREE.Mesh(geometry, material);
            hole.position.set(
                Math.random() * 10000 - 5000,
                Math.random() * 10000 - 5000,
                Math.random() * 10000 - 5000
            );
            scene.add(hole);
            blackHoles.push(hole);

            setTimeout(() => {
                scene.remove(hole);
                blackHoles.splice(blackHoles.indexOf(hole), 1);
            }, 15000); // lasts 15s
        };

        setInterval(createBlackHole, 20000); // every 20s

        // ☄️ Comets with glowing tails
        const comets: { core: THREE.Mesh; trail: THREE.Points; velocity: THREE.Vector3 }[] = [];

        const createComet = () => {
            const cometCore = new THREE.Mesh(
                new THREE.SphereGeometry(10, 16, 16),
                new THREE.MeshBasicMaterial({ color: 0xffffff })
            );
            cometCore.position.set(-3000, Math.random() * 2000 - 1000, -3000);

            const trailGeometry = new THREE.BufferGeometry();
            const trailLength = 100;
            const trailPositions = new Float32Array(trailLength * 3);
            for (let i = 0; i < trailLength; i++) {
                trailPositions[i * 3 + 0] = cometCore.position.x;
                trailPositions[i * 3 + 1] = cometCore.position.y;
                trailPositions[i * 3 + 2] = cometCore.position.z;
            }
            trailGeometry.setAttribute("position", new THREE.BufferAttribute(trailPositions, 3));
            const trailMaterial = new THREE.PointsMaterial({
                size: 4,
                color: 0x88ccff,
                transparent: true,
                opacity: 0.6,
            });
            const trail = new THREE.Points(trailGeometry, trailMaterial);

            const velocity = new THREE.Vector3(10 + Math.random() * 5, 0, 10 + Math.random() * 5);

            scene.add(cometCore);
            scene.add(trail);

            comets.push({ core: cometCore, trail, velocity });

            setTimeout(() => {
                scene.remove(cometCore);
                scene.remove(trail);
                comets.splice(0, 1);
            }, 10000); // lasts 10s
        };

        setInterval(createComet, 15000); // create a comet every 15s

        // ☄️ Meteorites
        const meteors: THREE.Mesh[] = [];

        const createMeteor = () => {
            const geometry = new THREE.SphereGeometry(5, 8, 8);
            const material = new THREE.MeshStandardMaterial({ color: 0xff5500 });
            const meteor = new THREE.Mesh(geometry, material);
            meteor.position.set(0, 0, -5000);
            meteor.userData.velocity = new THREE.Vector3(
                Math.random() * 4 - 2,
                Math.random() * 4 - 2,
                15 + Math.random() * 5
            );
            scene.add(meteor);
            meteors.push(meteor);

            setTimeout(() => {
                scene.remove(meteor);
                meteors.splice(meteors.indexOf(meteor), 1);
            }, 7000); // lasts 7s
        };

        setInterval(createMeteor, 1000); // create meteor every 1s

        // 💡 Random Light Flashes
        const flashLight = new THREE.PointLight(0xffccaa, 1, 800);
        scene.add(flashLight);

        setInterval(() => {
            flashLight.position.set(
                Math.random() * 4000 - 2000,
                Math.random() * 4000 - 2000,
                Math.random() * 4000 - 2000
            );
            flashLight.intensity = 2 + Math.random() * 2;

            setTimeout(() => {
                flashLight.intensity = 0;
            }, 500);
        }, 7000); // every 7s

        // Animation loop
        const animate = () => {
            requestAnimationFrame(animate);

            planets.forEach((planet) => {
                planet.userData.angle += planet.userData.speed;
                const radius = planet.userData.radius;
                planet.position.x = Math.cos(planet.userData.angle) * radius;
                planet.position.z = Math.sin(planet.userData.angle) * radius;
                planet.rotation.y += 0.002;
            });

            meteors.forEach((meteor) => {
                meteor.position.add(meteor.userData.velocity);
            });

            comets.forEach(({ core, trail, velocity }) => {
                core.position.add(velocity);

                const positions = trail.geometry.attributes.position.array as Float32Array;
                for (let i = positions.length - 3; i >= 3; i--) {
                    positions[i] = positions[i - 3];
                }
                positions[0] = core.position.x;
                positions[1] = core.position.y;
                positions[2] = core.position.z;
                trail.geometry.attributes.position.needsUpdate = true;
            });

            backgroundSphere.rotation.y += 0.0001;
            renderer.render(scene, camera);
        };

        animate();

        // Resize
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
            renderer.dispose();
        };
    }, []);

    return (
        <div
            ref={canvasRef}
            style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                overflow: "hidden",
                zIndex: -1,
            }}
        />
    );
};

export default SublimeWallpaper;