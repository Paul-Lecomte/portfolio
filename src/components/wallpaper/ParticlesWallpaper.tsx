import { useEffect, useRef } from "react";
import * as THREE from "three";

const ParticleEffect = () => {
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

        // Array to store particles
        const particles = [];
        const particleCount = 300; // You can adjust the number of particles

        // Create the particle system
        const createParticle = (x: number, y: number, color: THREE.Color) => {
            const geometry = new THREE.CircleGeometry(5, 16); // Using circles as particles
            const material = new THREE.MeshBasicMaterial({ color, opacity: 0.5, transparent: true });
            const particle = new THREE.Mesh(geometry, material);

            particle.position.set(x, y, Math.random() * 500 - 250); // Add some depth
            particles.push(particle);
            scene.add(particle);

            particle.userData = {
                velocity: new THREE.Vector3(Math.random() * 0.5 - 0.25, Math.random() * 0.5 - 0.25, Math.random() * 0.5 - 0.25),
            };
        };

        // Create a field of particles
        for (let i = 0; i < particleCount; i++) {
            const x = Math.random() * window.innerWidth - window.innerWidth / 2;
            const y = Math.random() * window.innerHeight - window.innerHeight / 2;
            const color = new THREE.Color(Math.random(), Math.random(), Math.random());
            createParticle(x, y, color);
        }

        // Setup camera
        camera.position.z = 500;

        // Handle mouse interaction
        const mouse = new THREE.Vector2(0, 0);

        const onMouseMove = (event: MouseEvent) => {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        };

        window.addEventListener('mousemove', onMouseMove, false);

        // Update particles every frame
        const animate = () => {
            requestAnimationFrame(animate);

            particles.forEach((particle) => {
                particle.position.x += particle.userData.velocity.x;
                particle.position.y += particle.userData.velocity.y;
                particle.position.z += particle.userData.velocity.z;

                // Collision with window borders
                if (Math.abs(particle.position.x) > window.innerWidth / 2) particle.userData.velocity.x *= -1;
                if (Math.abs(particle.position.y) > window.innerHeight / 2) particle.userData.velocity.y *= -1;

                // Add simple attraction to mouse position
                const dx = mouse.x * window.innerWidth / 2 - particle.position.x;
                const dy = mouse.y * window.innerHeight / 2 - particle.position.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const force = 0.1 / distance;

                particle.userData.velocity.x += force * dx;
                particle.userData.velocity.y += force * dy;
            });

            // Update the camera position
            camera.position.x += (mouse.x * 100 - camera.position.x) * 0.05;
            camera.position.y += (-mouse.y * 100 - camera.position.y) * 0.05;
            camera.lookAt(scene.position);

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

export default ParticleEffect;