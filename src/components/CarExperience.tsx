'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const MAX_PIXEL_RATIO = 2;

export default function CarExperience() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050505);

    const camera = new THREE.PerspectiveCamera(38, 1, 0.01, 100);
    camera.position.set(2.4, 1.35, 3.6);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, MAX_PIXEL_RATIO));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;

    // Minimal studio lighting: broad key + restrained fill + rim.
    const key = new THREE.DirectionalLight(0xffffff, 3.2);
    key.position.set(3, 5, 4);
    scene.add(key);

    const fill = new THREE.DirectionalLight(0x9fb3c8, 0.8);
    fill.position.set(-4, 2, 1);
    scene.add(fill);

    const rim = new THREE.DirectionalLight(0xffffff, 2.0);
    rim.position.set(-2, 4, -5);
    scene.add(rim);

    const ambient = new THREE.HemisphereLight(0x777777, 0x050505, 0.45);
    scene.add(ambient);

    const carRoot = new THREE.Group();
    scene.add(carRoot);

    const loader = new GLTFLoader();
    let disposed = false;

    loader.load(
      '/models/toy-car.glb',
      (gltf) => {
        if (disposed) return;

        const model = gltf.scene;
        carRoot.add(model);

        // Normalize the source asset without baking assumptions into the GLB.
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        const maxDimension = Math.max(size.x, size.y, size.z);

        if (maxDimension > 0) {
          const targetSize = 2.4;
          model.scale.multiplyScalar(targetSize / maxDimension);
        }

        const normalizedBox = new THREE.Box3().setFromObject(model);
        const normalizedCenter = normalizedBox.getCenter(new THREE.Vector3());
        model.position.sub(normalizedCenter);
        model.position.y -= normalizedBox.min.y;

        // Preserve the source material setup for this first baseline.
        model.traverse((object) => {
          if (!(object instanceof THREE.Mesh)) return;
          object.castShadow = false;
          object.receiveShadow = false;
        });
      },
      undefined,
      (error) => {
        console.error('Failed to load ToyCar.glb', error);
      },
    );

    const resize = () => {
      const width = canvas.clientWidth || window.innerWidth;
      const height = canvas.clientHeight || window.innerHeight;
      const pixelRatio = Math.min(window.devicePixelRatio, MAX_PIXEL_RATIO);

      camera.aspect = width / Math.max(height, 1);
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(width, height, false);
    };

    resize();
    window.addEventListener('resize', resize);

    let frameId = 0;
    const render = () => {
      frameId = window.requestAnimationFrame(render);
      renderer.render(scene, camera);
    };

    render();

    return () => {
      disposed = true;
      window.removeEventListener('resize', resize);
      window.cancelAnimationFrame(frameId);

      carRoot.traverse((object) => {
        if (!(object instanceof THREE.Mesh)) return;
        object.geometry.dispose();

        const materials = Array.isArray(object.material)
          ? object.material
          : [object.material];

        for (const material of materials) {
          material.dispose();
        }
      });

      renderer.dispose();
      renderer.renderLists.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className="car-canvas" aria-label="3D car scene" />;
}
