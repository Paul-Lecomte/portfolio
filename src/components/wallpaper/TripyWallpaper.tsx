import { useEffect, useRef } from "react";
import * as THREE from "three";

const CreativeCodingWallpaper: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // Set up scene, camera, and renderer
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 1;

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);  // Full screen
        renderer.setPixelRatio(window.devicePixelRatio);
        containerRef.current.appendChild(renderer.domElement);

        // GLSL fragment shader code (fractal animation)
        const fragmentShader = `
      uniform float iTime;
      uniform vec3 iResolution;
      
      vec3 palette(float t) {
        vec3 a = vec3(0.5, 0.5, 0.5);
        vec3 b = vec3(0.5, 0.5, 0.5);
        vec3 c = vec3(1.0, 1.0, 1.0);
        vec3 d = vec3(0.263,0.416,0.557);

        return a + b * cos(6.28318 * (c * t + d));
      }

      void main() {
        vec2 fragCoord = gl_FragCoord.xy;
        vec2 uv = (fragCoord * 2.0 - iResolution.xy) / iResolution.y;
        vec2 uv0 = uv;
        vec3 finalColor = vec3(0.0);
        
        for (float i = 0.0; i < 4.0; i++) {
          uv = fract(uv * 1.5) - 0.5;

          float d = length(uv) * exp(-length(uv0));
          vec3 col = palette(length(uv0) + i * .4 + iTime * .4);

          d = sin(d * 8. + iTime) / 8.;
          d = abs(d);

          d = pow(0.01 / d, 1.2);
          finalColor += col * d;
        }

        gl_FragColor = vec4(finalColor, 1.0);
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

        // Plane geometry covering the screen
        const geometry = new THREE.PlaneGeometry(2, 2);
        const plane = new THREE.Mesh(geometry, material);
        scene.add(plane);

        // Set camera aspect ratio to fill the screen
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        // Animation loop
        const animate = () => {
            requestAnimationFrame(animate);

            material.uniforms.iTime.value += 0.05;  // Animate time for the shader
            renderer.render(scene, camera);
        };

        animate();

        // Handle window resizing
        const handleResize = () => {
            // Update camera and renderer dimensions
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);

            // Update shader resolution uniform to maintain correct scaling
            material.uniforms.iResolution.value.set(window.innerWidth, window.innerHeight, 1);
        };

        // Add resize event listener
        window.addEventListener("resize", handleResize);

        // Clean up on unmount
        return () => {
            window.removeEventListener("resize", handleResize);
            containerRef.current?.removeChild(renderer.domElement);
            renderer.dispose();
        };
    }, []);

    return <div ref={containerRef} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }} />;
};

export default CreativeCodingWallpaper;