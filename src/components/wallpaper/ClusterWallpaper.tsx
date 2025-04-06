import { useEffect, useRef } from "react";
import * as THREE from "three";

const ClusterWallpaper = () => {
    const canvasRef = useRef<HTMLDivElement>(null); // Reference to the canvas container

    useEffect(() => {
        if (!canvasRef.current) return;

        // Create a canvas element explicitly
        const canvas = document.createElement('canvas');
        canvasRef.current.appendChild(canvas); // Append it to the div
        const renderer = new THREE.WebGLRenderer({ canvas });

        // Set up the scene
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

        // Set up the renderer size
        renderer.setSize(window.innerWidth, window.innerHeight);
        canvasRef.current.appendChild(renderer.domElement); // Make sure we add the renderer to the DOM

        // Create a simple cluster of particles
        const particleCount = 500;
        const particles = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const velocities = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = Math.random() * 2000 - 1000;
            positions[i * 3 + 1] = Math.random() * 2000 - 1000;
            positions[i * 3 + 2] = Math.random() * 2000 - 1000;

            velocities[i * 3] = Math.random() * 2 - 1;
            velocities[i * 3 + 1] = Math.random() * 2 - 1;
            velocities[i * 3 + 2] = Math.random() * 2 - 1;
        }

        particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const material = new THREE.PointsMaterial({ color: 0x00ff00, size: 1 });
        const particleSystem = new THREE.Points(particles, material);

        scene.add(particleSystem);

        // Set up camera position
        camera.position.z = 500;

        // Animation loop
        const animate = () => {
            requestAnimationFrame(animate);

            // Update particle positions based on velocities
            const positions = particleSystem.geometry.attributes.position.array;
            for (let i = 0; i < particleCount; i++) {
                positions[i * 3] += velocities[i * 3];
                positions[i * 3 + 1] += velocities[i * 3 + 1];
                positions[i * 3 + 2] += velocities[i * 3 + 2];
            }

            particleSystem.geometry.attributes.position.needsUpdate = true;

            particleSystem.rotation.x += 0.001;
            particleSystem.rotation.y += 0.001;

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

export default ClusterWallpaper;