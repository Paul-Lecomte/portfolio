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

        // Array to store all objects (spheres, cubes, etc.)
        const objects = [];
        const particleCount = 500;

        // Function to create a random shape
        const createRandomShape = () => {
            const geometryType = Math.random() > 0.5 ? 'sphere' : 'cube'; // Randomly choose between a sphere and a cube
            const color = new THREE.Color(Math.random(), Math.random(), Math.random()); // Random color

            let geometry;
            let size = Math.random() * 10 + 5;

            if (geometryType === 'sphere') {
                geometry = new THREE.SphereGeometry(size, 16, 16);
            } else {
                geometry = new THREE.BoxGeometry(size, size, size);
            }

            const material = new THREE.MeshBasicMaterial({
                color: color,
                wireframe: Math.random() > 0.5, // Random wireframe or solid
            });

            const shape = new THREE.Mesh(geometry, material);

            shape.position.set(
                Math.random() * 1000 - 500, // Random x position
                Math.random() * 1000 - 500, // Random y position
                Math.random() * 1000 - 500  // Random z position
            );

            // Random speed and direction
            shape.userData = {
                velocity: new THREE.Vector3(
                    Math.random() * 2 - 1,
                    Math.random() * 2 - 1,
                    Math.random() * 2 - 1
                ),
                rotationSpeed: new THREE.Vector3(
                    Math.random() * 0.05,
                    Math.random() * 0.05,
                    Math.random() * 0.05
                ),
            };

            objects.push(shape);
            scene.add(shape);
        };

        // Create multiple random shapes
        for (let i = 0; i < particleCount; i++) {
            createRandomShape();
        }

        // Set up camera position
        camera.position.z = 500;

        // Animation loop
        const animate = () => {
            requestAnimationFrame(animate);

            // Update positions and rotations of the shapes
            objects.forEach((obj) => {
                obj.position.add(obj.userData.velocity); // Update position based on velocity

                // Bounce the shapes off the walls
                if (Math.abs(obj.position.x) > 500) obj.userData.velocity.x *= -1;
                if (Math.abs(obj.position.y) > 500) obj.userData.velocity.y *= -1;
                if (Math.abs(obj.position.z) > 500) obj.userData.velocity.z *= -1;

                // Update rotations
                obj.rotation.x += obj.userData.rotationSpeed.x;
                obj.rotation.y += obj.userData.rotationSpeed.y;
                obj.rotation.z += obj.userData.rotationSpeed.z;
            });

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