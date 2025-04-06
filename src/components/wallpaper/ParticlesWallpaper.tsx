import { useEffect, useRef } from "react";
import * as THREE from "three";

const SublimeWallpaper: React.FC = () => {
    const canvasRef = useRef<HTMLDivElement>(null); // Reference to the canvas container

    useEffect(() => {
        if (!canvasRef.current) return;

        // Create a canvas element explicitly
        const canvas = document.createElement('canvas');
        canvasRef.current.appendChild(canvas); // Append it to the div
        const renderer = new THREE.WebGLRenderer({ canvas });

        // Set up the scene
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);

        // Set up the renderer size
        renderer.setSize(window.innerWidth, window.innerHeight);

        // Create stars
        const starCount = 10000;
        const starsGeometry = new THREE.BufferGeometry();
        const starsPositions = new Float32Array(starCount * 3);
        const starsColors = new Float32Array(starCount * 3);

        // Create stars in a spherical distribution
        for (let i = 0; i < starCount; i++) {
            const theta = Math.random() * Math.PI * 2;  // Random angle in the horizontal plane
            const phi = Math.random() * Math.PI;  // Random angle in the vertical plane

            // Convert spherical coordinates to cartesian coordinates
            const radius = Math.random() * 5000 + 1000;  // Random radius between 1000 and 6000
            starsPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
            starsPositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            starsPositions[i * 3 + 2] = radius * Math.cos(phi);

            // Assign random color to each star
            const color = new THREE.Color(Math.random(), Math.random(), Math.random());
            starsColors[i * 3] = color.r;
            starsColors[i * 3 + 1] = color.g;
            starsColors[i * 3 + 2] = color.b;
        }

        // Add the stars to the scene
        starsGeometry.setAttribute('position', new THREE.BufferAttribute(starsPositions, 3));
        starsGeometry.setAttribute('color', new THREE.BufferAttribute(starsColors, 3));

        const starsMaterial = new THREE.PointsMaterial({
            size: 2,  // Size of the stars
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
        });

        const stars = new THREE.Points(starsGeometry, starsMaterial);
        scene.add(stars);

        // Create the Black Hole
        const blackHoleGeometry = new THREE.SphereGeometry(50, 32, 32);
        const blackHoleMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
        const blackHole = new THREE.Mesh(blackHoleGeometry, blackHoleMaterial);
        scene.add(blackHole);

        // Create Supernova effect (bright expanding star)
        const supernovaGeometry = new THREE.SphereGeometry(100, 32, 32);
        const supernovaMaterial = new THREE.MeshBasicMaterial({
            color: 0xffff00,  // Supernova bright yellow
            emissive: 0xffff00,
            emissiveIntensity: 1.5,
        });
        const supernova = new THREE.Mesh(supernovaGeometry, supernovaMaterial);
        supernova.position.set(2000, 2000, 2000);
        scene.add(supernova);

        // Create planets orbiting the black hole
        const planetTexture = new THREE.TextureLoader().load('https://www.solarsystemscope.com/textures/download/earthmap1k.jpg'); // Earth texture

        const createPlanet = (radius: number, orbitSpeed: number, size: number, color: number) => {
            const geometry = new THREE.SphereGeometry(size, 32, 32);
            const material = new THREE.MeshStandardMaterial({ color: color, map: planetTexture });
            const planet = new THREE.Mesh(geometry, material);
            planet.position.set(radius, 0, 0);  // Set initial position on the orbit

            // Animate orbit
            let angle = Math.random() * Math.PI * 2;
            planet.userData = { angle: angle, orbitSpeed: orbitSpeed };

            return planet;
        };

        const planets = [
            createPlanet(200, 0.005, 20, 0x00ff00),  // Green planet
            createPlanet(400, 0.003, 30, 0x0000ff),  // Blue planet
            createPlanet(600, 0.002, 40, 0xff0000),  // Red planet
        ];

        planets.forEach(planet => scene.add(planet));

        // Set up camera position
        camera.position.z = 1500; // Camera stays in the center of the scene

        // Animation loop
        const animate = () => {
            requestAnimationFrame(animate);

            // Rotate the entire starry system
            stars.rotation.x += 0.0005;
            stars.rotation.y += 0.001;
            stars.rotation.z += 0.0002;

            // Rotate planets around the black hole
            planets.forEach(planet => {
                planet.userData.angle += planet.userData.orbitSpeed;
                planet.position.x = Math.cos(planet.userData.angle) * planet.position.length();
                planet.position.z = Math.sin(planet.userData.angle) * planet.position.length();
            });

            // Animate the supernova (it expands and fades over time)
            supernova.scale.set(1.5 + Math.sin(Date.now() * 0.001) * 0.5, 1.5 + Math.sin(Date.now() * 0.001) * 0.5, 1.5 + Math.sin(Date.now() * 0.001) * 0.5);

            // Gravitational lensing effect for the black hole (distorting stars around it)
            stars.geometry.attributes.position.needsUpdate = true;

            // Render the scene
            renderer.render(scene, camera);
        };

        animate();

        // Handle window resize
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };

        window.addEventListener("resize", handleResize);

        // Cleanup function on unmount
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
                zIndex: -1, // Ensure it stays in the background
            }}
        />
    );
};

export default SublimeWallpaper;