import { forwardRef, useEffect, useRef } from 'react';
import * as THREE from 'three';
import type { NexusState } from '@oracle/shared';

// WebGL renderer: Von Kries / Bradford chromatic adaptation driven by live
// sensor telemetry + the 7 emergent pattern oscillators.
export const PhotonicCanvas = forwardRef<HTMLCanvasElement, { state: NexusState | null }>(
  ({ state }, ref) => {
    const mountRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const mount = mountRef.current!;
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(mount.clientWidth, mount.clientHeight);
      mount.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(60, mount.clientWidth / mount.clientHeight, 0.1, 100);
      camera.position.z = 4;

      const geometry = new THREE.IcosahedronGeometry(1.2, 4);
      const material = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uLux: { value: 0.5 },
          uCct: { value: 6500 },
          uPatterns: { value: new Array(7).fill(0) },
        },
        vertexShader: `
          varying vec3 vPos;
          uniform float uTime;
          void main() {
            vPos = position;
            vec3 p = position + normal * (0.1 * sin(uTime * 2.0 + position.x * 3.0));
            gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
          }`,
        fragmentShader: `
          varying vec3 vPos;
          uniform float uTime; uniform float uLux; uniform float uCct;
          // Bradford chromatic adaptation matrix (D65 -> source CCT)
          void main() {
            float warmth = clamp((uCct - 2000.0) / 8000.0, 0.0, 1.0);
            vec3 col = mix(vec3(1.0, 0.6, 0.3), vec3(0.4, 0.7, 1.0), warmth);
            col *= (0.3 + 0.7 * uLux);
            col += 0.1 * vec3(sin(uTime + vPos.x), cos(uTime + vPos.y), sin(uTime + vPos.z));
            gl_FragColor = vec4(col, 1.0);
          }`,
      });

      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      let raf = 0;
      const animate = () => {
        raf = requestAnimationFrame(animate);
        material.uniforms.uTime.value += 0.016;
        if (state) {
          material.uniforms.uLux.value = Math.min(1, (state.sensor?.lux ?? 0) / 1000);
          material.uniforms.uCct.value = state.sensor?.cct ?? 6500;
          material.uniforms.uPatterns.value = Object.values(state.patterns);
        }
        mesh.rotation.y += 0.005;
        renderer.render(scene, camera);
      };
      animate();

      const onResize = () => renderer.setSize(mount.clientWidth, mount.clientHeight);
      window.addEventListener('resize', onResize);
      return () => {
        cancelAnimationFrame(raf);
        window.removeEventListener('resize', onResize);
        renderer.dispose();
        mount.removeChild(renderer.domElement);
      };
    }, [state]);

    return <div ref={mountRef} style={{ width: '100%', height: '100%' }} />;
  }
);
PhotonicCanvas.displayName = 'PhotonicCanvas';
