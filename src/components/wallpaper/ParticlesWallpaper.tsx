import { useEffect, useRef } from "react";
import * as THREE from "three";

const SublimeWallpaper: React.FC = () => {
    const canvasRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!canvasRef.current) return;

        const canvas = document.createElement("canvas");
        canvasRef.current.appendChild(canvas);
        const renderer = new THREE.WebGLRenderer({ canvas });
        renderer.setSize(window.innerWidth, window.innerHeight);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            10000
        );
        camera.position.z = 1500;

        // 🌟 Lighting (Required for MeshStandardMaterial)
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(1000, 1000, 1000);
        scene.add(directionalLight);

        const ambientLight = new THREE.AmbientLight(0x404040, 1);
        scene.add(ambientLight);

        // 🌌 Stars
        const starCount = 10000;
        const starsGeometry = new THREE.BufferGeometry();
        const starsPositions = new Float32Array(starCount * 3);
        const starsColors = new Float32Array(starCount * 3);

        for (let i = 0; i < starCount; i++) {
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;
            const radius = Math.random() * 5000 + 1000;

            starsPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
            starsPositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            starsPositions[i * 3 + 2] = radius * Math.cos(phi);

            const color = new THREE.Color(Math.random(), Math.random(), Math.random());
            starsColors[i * 3] = color.r;
            starsColors[i * 3 + 1] = color.g;
            starsColors[i * 3 + 2] = color.b;
        }

        starsGeometry.setAttribute("position", new THREE.BufferAttribute(starsPositions, 3));
        starsGeometry.setAttribute("color", new THREE.BufferAttribute(starsColors, 3));

        const starsMaterial = new THREE.PointsMaterial({
            size: 2,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
        });

        const stars = new THREE.Points(starsGeometry, starsMaterial);
        scene.add(stars);

        // 🕳️ Black Hole
        const blackHoleGeometry = new THREE.SphereGeometry(50, 32, 32);
        const blackHoleMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
        const blackHole = new THREE.Mesh(blackHoleGeometry, blackHoleMaterial);
        scene.add(blackHole);

        // 💥 Supernova
        const supernovaGeometry = new THREE.SphereGeometry(100, 32, 32);
        const supernovaMaterial = new THREE.MeshBasicMaterial({
            color: 0xffff00,
            emissive: 0xffff00,
            emissiveIntensity: 1.5,
        });
        const supernova = new THREE.Mesh(supernovaGeometry, supernovaMaterial);
        supernova.position.set(2000, 2000, 2000);
        scene.add(supernova);

        // 🌍 Load planet texture and create planets
        const loader = new THREE.TextureLoader();
        loader.load("/textures/2k_earth_daymap.jpg", (planetTexture) => {
            const createPlanet = (radius: number, orbitSpeed: number, size: number, color: number) => {
                const geometry = new THREE.SphereGeometry(size, 32, 32);
                const material = new THREE.MeshStandardMaterial({ color, map: planetTexture });
                const planet = new THREE.Mesh(geometry, material);
                planet.position.set(radius, 0, 0);
                planet.userData = {
                    angle: Math.random() * Math.PI * 2,
                    orbitSpeed,
                    radius,
                };
                return planet;
            };

            const planets = [
                createPlanet(200, 0.005, 20, 0x00ff00),
                createPlanet(400, 0.003, 30, 0x0000ff),
                createPlanet(600, 0.002, 40, 0xff0000),
            ];

            planets.forEach((planet) => scene.add(planet));

            // 🌀 Animation loop (start after planets are ready)
            const animate = () => {
                requestAnimationFrame(animate);

                stars.rotation.x += 0.0005;
                stars.rotation.y += 0.001;
                stars.rotation.z += 0.0002;

                planets.forEach((planet) => {
                    planet.userData.angle += planet.userData.orbitSpeed;
                    const r = planet.userData.radius;
                    planet.position.x = Math.cos(planet.userData.angle) * r;
                    planet.position.z = Math.sin(planet.userData.angle) * r;
                });

                const scale = 1.5 + Math.sin(Date.now() * 0.001) * 0.5;
                supernova.scale.set(scale, scale, scale);

                renderer.render(scene, camera);
            };

            animate();
        });

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