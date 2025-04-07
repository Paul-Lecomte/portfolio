import { useEffect, useRef } from "react";
import * as THREE from "three";

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
        camera.position.z = 2000;

        // Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        scene.add(ambientLight);
        const sunLight = new THREE.PointLight(0xffffff, 1.5, 0);
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

        // Planets
        const planetsData = [
            { name: "Mercury", texture: "2k_mercury.jpg", size: 25, distance: 400, speed: 0.01 },
            { name: "Venus", texture: "2k_venus_surface.jpg", size: 40, distance: 600, speed: 0.008 },
            { name: "Earth", texture: "2k_earth_daymap.jpg", size: 50, distance: 800, speed: 0.006 },
            { name: "Mars", texture: "2k_mars.jpg", size: 35, distance: 1000, speed: 0.005 },
            { name: "Jupiter", texture: "2k_jupiter.jpg", size: 110, distance: 1400, speed: 0.003 },
            { name: "Saturn", texture: "2k_saturn.jpg", size: 95, distance: 1700, speed: 0.0025 },
            { name: "Uranus", texture: "2k_uranus.jpg", size: 70, distance: 2000, speed: 0.002 },
            { name: "Neptune", texture: "2k_neptune.jpg", size: 70, distance: 2300, speed: 0.0018 },
        ];

        const planets: THREE.Mesh[] = [];

        planetsData.forEach((data) => {
            const tex = textureLoader.load(`/textures/${data.texture}`);
            const geometry = new THREE.SphereGeometry(data.size, 32, 32);
            const material = new THREE.MeshStandardMaterial({ map: tex });
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
            }, 7000);
        };

        setInterval(createMeteor, 1000); // every 10s

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
        }, 7000);

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