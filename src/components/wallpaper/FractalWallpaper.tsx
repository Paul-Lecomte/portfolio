import { useEffect, useRef } from "react";
import * as THREE from "three";

const FractalWallpaper: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // Scene setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 1;

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        containerRef.current.appendChild(renderer.domElement);

        // GLSL code (your fractal pyramid shader)
        const fragmentShader = `
      uniform float iTime;
      uniform vec3 iResolution;
      
      // Palette function to transition between colors
      vec3 palette(float d) {
        return mix(vec3(0.2, 0.7, 0.9), vec3(1., 0., 1.), d);
      }

      // Rotation function for transformation
      vec2 rotate(vec2 p, float a) {
        float c = cos(a);
        float s = sin(a);
        return p * mat2(c, s, -s, c);
      }

      // Mapping function for fractal geometry
      float map(vec3 p) {
        for(int i = 0; i < 8; ++i) {
          float t = iTime * 0.2;
          p.xz = rotate(p.xz, t);
          p.xy = rotate(p.xy, t * 1.89);
          p.xz = abs(p.xz);
          p.xz -= .5;
        }
        return dot(sign(p), p) / 5.;
      }

      // Raymarching function
      vec4 rm(vec3 ro, vec3 rd) {
        float t = 0.;
        vec3 col = vec3(0.);
        float d;
        for(float i = 0.; i < 64.; i++) {
          vec3 p = ro + rd * t;
          d = map(p) * .5;
          if(d < 0.02) {
            break;
          }
          if(d > 100.) {
            break;
          }
          col += palette(length(p) * .1) / (400. * (d));
          t += d;
        }
        return vec4(col, 1. / (d * 100.));
      }

      // Main image rendering
      void main() {
        vec2 fragCoord = gl_FragCoord.xy;
        vec2 uv = (fragCoord - (iResolution.xy / 2.)) / iResolution.x;
        vec3 ro = vec3(0., 0., -50.);
        ro.xz = rotate(ro.xz, iTime);
        vec3 cf = normalize(-ro);
        vec3 cs = normalize(cross(cf, vec3(0., 1., 0.)));
        vec3 cu = normalize(cross(cf, cs));

        vec3 uuv = ro + cf * 3. + uv.x * cs + uv.y * cu;
        vec3 rd = normalize(uuv - ro);

        vec4 col = rm(ro, rd);
        gl_FragColor = col;
      }
    `;

        const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

        // ShaderMaterial with the fractal shader
        const material = new THREE.ShaderMaterial({
            uniforms: {
                iTime: { value: 0.0 },
                iResolution: { value: new THREE.Vector3(window.innerWidth, window.innerHeight, 1) }
            },
            fragmentShader,
            vertexShader,
            side: THREE.DoubleSide
        });

        // Create a plane geometry that covers the entire screen
        const geometry = new THREE.PlaneGeometry(2, 2);
        const plane = new THREE.Mesh(geometry, material);
        scene.add(plane);

        // Set the camera's aspect ratio based on the window size
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        // Animation loop to update time and render the scene
        const animate = () => {
            requestAnimationFrame(animate);

            material.uniforms.iTime.value += 0.05; // Update the time for animation
            renderer.render(scene, camera);
        };

        animate();

        // Resize handler to update resolution and aspect ratio
        const handleResize = () => {
            // Update camera aspect ratio
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();

            // Update renderer size
            renderer.setSize(window.innerWidth, window.innerHeight);

            // Update shader resolution uniform
            material.uniforms.iResolution.value.set(window.innerWidth, window.innerHeight, 1);
        };

        window.addEventListener("resize", handleResize);

        // Cleanup on unmount
        return () => {
            window.removeEventListener("resize", handleResize);
            containerRef.current?.removeChild(renderer.domElement);
            renderer.dispose();
        };
    }, []);

    return <div ref={containerRef} style={{ position: "absolute", top: 0, left: 0, width: "100vw", height: "100vh", zIndex: -1 }} />;
};

export default FractalWallpaper;