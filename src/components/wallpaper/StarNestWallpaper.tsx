import { useEffect, useRef } from "react";
import * as THREE from "three";

const StarNestWallpaper = () => {
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // Create a new scene, camera, and renderer
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(20, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 2;

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);  // Fullscreen renderer
        renderer.setPixelRatio(window.devicePixelRatio);  // Handle high DPI screens
        containerRef.current.appendChild(renderer.domElement);  // Attach renderer to DOM

        // GLSL fragment shader code for "Star Nest"
        const fragmentShader = `
          #define iterations 17
          #define formuparam 0.53
          #define volsteps 20
          #define stepsize 0.1
          #define zoom   0.800
          #define tile   0.850
          #define speed  0.010 
          #define brightness 0.0015
          #define darkmatter 0.300
          #define distfading 0.730
          #define saturation 0.850

          uniform float iTime;
          uniform vec3 iResolution;

          void mainImage(out vec4 fragColor, in vec2 fragCoord) {
              vec2 uv = fragCoord.xy / iResolution.xy; // Normalize by resolution
              uv -= 0.5; // Center the coordinates
              uv.y *= iResolution.y / iResolution.x; // Correct for aspect ratio
              vec3 dir = vec3(uv * zoom, 1.);
              float time = iTime * speed + 0.25;

              // Define 'from' as the camera or viewpoint position
              vec3 from = vec3(1., 0.5, 0.5);  // You can adjust these values as needed
              from += vec3(time * 2., time, -2.); // Adjust movement over time

              // Volumetric rendering
              float s = 0.1, fade = 1.;
              vec3 v = vec3(0.);
              for (int r = 0; r < volsteps; r++) {
                  vec3 p = from + s * dir * 0.5;
                  p = abs(vec3(tile) - mod(p, vec3(tile * 2.))); // Tiling fold
                  float pa, a = pa = 0.;
                  for (int i = 0; i < iterations; i++) { 
                      p = abs(p) / dot(p, p) - formuparam; // The magic formula
                      a += abs(length(p) - pa); // Absolute sum of average change
                      pa = length(p);
                  }
                  float dm = max(0., darkmatter - a * a * 0.001); // Dark matter
                  a *= a * a; // Add contrast
                  if (r > 6) fade *= 1. - dm; // Dark matter, don't render near
                  v += fade;
                  v += vec3(s, s * s, s * s * s * s) * a * brightness * fade; // Coloring based on distance
                  fade *= distfading; // Distance fading
                  s += stepsize;
              }
              v = mix(vec3(length(v)), v, saturation); // Color adjust
              fragColor = vec4(v * 0.01, 1.);  
          }

          void main() {
              mainImage(gl_FragColor, gl_FragCoord.xy);
          }
        `;

        // Vertex shader
        const vertexShader = `
          varying vec2 vUv;
          void main() {
              vUv = uv;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `;

        // ShaderMaterial with uniforms for time and resolution
        const material = new THREE.ShaderMaterial({
            uniforms: {
                iTime: { value: 0.0 },
                iResolution: { value: new THREE.Vector3(window.innerWidth, window.innerHeight, 1) }
            },
            fragmentShader,
            vertexShader,
            side: THREE.DoubleSide
        });

        // Fullscreen plane geometry
        const geometry = new THREE.PlaneGeometry(2, 2); // This plane will cover the entire screen
        const plane = new THREE.Mesh(geometry, material);
        scene.add(plane);

        // Set camera aspect ratio to fill the screen
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        // Animation loop
        const animate = () => {
            requestAnimationFrame(animate);
            material.uniforms.iTime.value += 0.05;  // Animate shader time
            renderer.render(scene, camera);
        };

        animate();

        // Resize event listener to update renderer and camera on window resize
        const handleResize = () => {
            // Update camera and renderer dimensions
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);

            // Update shader resolution uniform to maintain correct scaling, enforcing min resolution
            material.uniforms.iResolution.value.set(
                Math.max(window.innerWidth, 1920),
                Math.max(window.innerHeight, 1080),
                1
            );
        };

        window.addEventListener("resize", handleResize);

        // Cleanup on component unmount
        return () => {
            window.removeEventListener("resize", handleResize);
            containerRef.current?.removeChild(renderer.domElement);
            renderer.dispose();
        };
    }, []);

    return <div ref={containerRef} style={{ width: "100%", height: "100vh", margin: 0 }} />;
};

export default StarNestWallpaper;