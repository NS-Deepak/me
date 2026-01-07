import React, { useRef, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import * as THREE from 'three';

function App() {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // --- Scene setup ---
    const scene = new THREE.Scene();

    // --- Camera ---
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const initialDistance = window.innerWidth < 768 ? 12 : 8;
    camera.position.set(0, 2, initialDistance);

    // --- Renderer ---
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);

    // --- Lighting ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 2.0); // Brighter sun
    sunLight.position.set(10, 5, 5);
    // Shadows disabled as per user request
    scene.add(sunLight);



    // Texture Loader
    const loader = new THREE.TextureLoader();

    // Load Real NASA Assets
    const dayTexture = loader.load('/textures/earth_atmos_2048.jpg');
    const nightTexture = loader.load('/textures/earth_lights_2048.png');
    const specularTexture = loader.load('/textures/earth_specular_2048.jpg');
    const cloudTexture = loader.load('/textures/earth_clouds_2048.png');

    // Earth with Custom Ultra-Realistic Shader
    const earthGeometry = new THREE.SphereGeometry(2, 64, 64);

    const earthMaterial = new THREE.MeshStandardMaterial({
      map: dayTexture,
      color: 0x4488ff // Fallback color
    });

    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    earth.receiveShadow = true;
    earth.castShadow = true;
    scene.add(earth);

    // Cloud Layer (High-res, transparent, slightly larger)
    const cloudGeometry = new THREE.SphereGeometry(2.01, 64, 64); // Very close to surface
    const cloudMaterial = new THREE.MeshStandardMaterial({
      map: cloudTexture,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide
    });
    const clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
    scene.add(clouds);

    // Outer Atmosphere (Halo)
    const atmosphereGeometry = new THREE.SphereGeometry(2.15, 64, 64);
    const atmosphereMaterial = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.5 - dot(vNormal, vec3(0, 0, 1.0)), 4.5); // Thinner, sharper halo
          gl_FragColor = vec4(0.3, 0.6, 1.0, intensity * 2.0);
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
      depthWrite: false
    });
    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    scene.add(atmosphere);

    // --- Milky Way Background ---
    const starTexture = loader.load('/textures/starfield.png'); // Standard high-res starfield
    // Create a large sphere for the background to simulate the Milky Way
    const bgGeometry = new THREE.SphereGeometry(100, 32, 32);
    const bgMaterial = new THREE.MeshBasicMaterial({
      map: starTexture,
      side: THREE.BackSide
    });
    const background = new THREE.Mesh(bgGeometry, bgMaterial);
    scene.add(background);

    // --- Satellite (Detailed Model) ---
    const satelliteGroup = new THREE.Group();
    scene.add(satelliteGroup);

    // Helper: Create Wrinkled Foil Texture (Procedural)
    const createFoilTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      if (!ctx) return new THREE.Texture();

      // Background gradient for base metallic variance
      const grad = ctx.createLinearGradient(0, 0, 512, 512);
      grad.addColorStop(0, '#ffd700');
      grad.addColorStop(0.5, '#f5c500');
      grad.addColorStop(1, '#e6b800');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 512, 512);

      // Add subtle noise
      for (let i = 0; i < 2000; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        const size = Math.random() * 2;
        ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.2})`;
        ctx.fillRect(x, y, size, size);
      }

      // Add "wrinkles" (Subtle, varied opacity)
      for (let i = 0; i < 60; i++) {
        ctx.strokeStyle = `rgba(0,0,0,${Math.random() * 0.15})`;
        ctx.lineWidth = Math.random() * 1.5;
        ctx.beginPath();
        ctx.moveTo(Math.random() * 512, Math.random() * 512);
        ctx.bezierCurveTo(
          Math.random() * 512, Math.random() * 512,
          Math.random() * 512, Math.random() * 512,
          Math.random() * 512, Math.random() * 512
        );
        ctx.stroke();
      }

      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      return texture;
    };

    // Helper: Create Solar Grid Texture (Procedural)
    const createSolarGridTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      if (!ctx) return new THREE.Texture();

      // 1. Base solar blue (dark, rich)
      const grad = ctx.createLinearGradient(0, 0, 512, 512);
      grad.addColorStop(0, '#05122b');
      grad.addColorStop(1, '#0b1d40');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 512, 512);

      const gridSize = 64; // 8x8 cells

      // 2. Draw Cells with slight variation
      for (let x = 0; x < 512; x += gridSize) {
        for (let y = 0; y < 512; y += gridSize) {
          // Slight color variation for realism
          const variance = Math.random() * 20 - 10;
          const baseBlue = 40 + variance;
          ctx.fillStyle = `rgb(10, 20, ${baseBlue})`;
          ctx.fillRect(x + 2, y + 2, gridSize - 4, gridSize - 4);

          // 3. Photovoltaic Busbars (The thin silver lines)
          ctx.strokeStyle = 'rgba(200, 200, 255, 0.3)'; // Silver-ish
          ctx.lineWidth = 1;
          // Vertical busbars
          for (let k = 10; k < gridSize - 4; k += 10) {
            ctx.beginPath();
            ctx.moveTo(x + k, y + 2);
            ctx.lineTo(x + k, y + gridSize - 2);
            ctx.stroke();
          }

          // 4. Subtle Specular Highlight per cell (fake distinct finish)
          ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
          ctx.fillRect(x + 2, y + 2, gridSize - 4, (gridSize - 4) * 0.3);
        }
      }

      // 5. Main Frame Grid (Thick separating lines)
      ctx.strokeStyle = '#1a1a1a'; // Dark frame
      ctx.lineWidth = 4;
      for (let i = 0; i <= 512; i += gridSize) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 512); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(512, i); ctx.stroke();
      }

      // 6. Cross intersections (optional bolts/details)
      ctx.fillStyle = '#555';
      for (let i = 0; i <= 512; i += gridSize) {
        for (let j = 0; j <= 512; j += gridSize) {
          ctx.beginPath();
          ctx.arc(i, j, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      const texture = new THREE.CanvasTexture(canvas);
      texture.anisotropy = 4; // sharpen at angles
      return texture;
    };

    const foilTex = createFoilTexture();
    const solarTex = createSolarGridTexture();

    // Materials
    const foilMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff, // Let the texture handle color
      map: foilTex,
      metalness: 1.0,
      roughness: 0.3,
      bumpMap: foilTex,
      bumpScale: 0.005,
    });

    const panelMaterial = new THREE.MeshStandardMaterial({
      map: solarTex,
      metalness: 0.8,
      roughness: 0.2,
      emissive: 0x0a1d37,
      emissiveIntensity: 0.5,
    });

    const grayMetalMaterial = new THREE.MeshStandardMaterial({
      color: 0x444444,
      metalness: 0.9,
      roughness: 0.4
    });

    const darkMetalMaterial = new THREE.MeshStandardMaterial({
      color: 0x111111,
      metalness: 0.8,
      roughness: 0.6
    });

    // 1. Main Bus (Gold Foil Box)
    const busGeometry = new THREE.BoxGeometry(0.2, 0.2, 0.3);
    const bus = new THREE.Mesh(busGeometry, foilMaterial);
    satelliteGroup.add(bus);

    // Advanced Greeble (Tanks, wires, modules)
    // Fuel Tanks (Cylinders)
    const tankGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.08, 12);
    const tank1 = new THREE.Mesh(tankGeo, grayMetalMaterial);
    tank1.position.set(0.08, 0.08, 0);
    satelliteGroup.add(tank1);

    const tank2 = new THREE.Mesh(tankGeo, grayMetalMaterial);
    tank2.position.set(-0.08, 0.08, 0);
    satelliteGroup.add(tank2);

    // Structural Wire/Tubes
    const createTube = (p1: THREE.Vector3, p2: THREE.Vector3) => {
      const dist = p1.distanceTo(p2);
      const tubeGeo = new THREE.CylinderGeometry(0.005, 0.005, dist, 8);
      const tube = new THREE.Mesh(tubeGeo, darkMetalMaterial);
      tube.position.copy(p1).add(p2).multiplyScalar(0.5);
      tube.lookAt(p2);
      tube.rotation.x += Math.PI / 2;
      return tube;
    };

    satelliteGroup.add(createTube(new THREE.Vector3(0.1, 0, 0), new THREE.Vector3(0.1, 0, 0.1)));
    satelliteGroup.add(createTube(new THREE.Vector3(-0.1, 0, 0), new THREE.Vector3(-0.1, 0, 0.1)));

    // Extra modules
    for (let i = 0; i < 8; i++) {
      const mGeo = new THREE.BoxGeometry(0.04, 0.02, 0.04);
      const m = new THREE.Mesh(mGeo, i % 2 === 0 ? grayMetalMaterial : darkMetalMaterial);
      m.position.set((Math.random() - 0.5) * 0.18, -0.1, (Math.random() - 0.5) * 0.25);
      satelliteGroup.add(m);
    }


    // 2. Solar Panels (Textured Wings)
    const createWing = (direction: number) => {
      const wingGroup = new THREE.Group();
      const segmentCount = 3;
      const segmentWidth = 0.14;
      const spacing = 0.16;

      for (let i = 0; i < segmentCount; i++) {
        const panel = new THREE.Mesh(new THREE.BoxGeometry(segmentWidth, 0.22, 0.01), panelMaterial);
        panel.position.set((i * spacing + 0.1) * direction, 0, 0);
        wingGroup.add(panel);

        // Frame for depth
        const frameGeo = new THREE.BoxGeometry(segmentWidth + 0.01, 0.23, 0.005);
        const frame = new THREE.Mesh(frameGeo, darkMetalMaterial);
        frame.position.copy(panel.position);
        frame.position.z -= 0.004;
        wingGroup.add(frame);

        if (i < segmentCount - 1) {
          const strut = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, 0.04), darkMetalMaterial);
          strut.rotation.z = Math.PI / 2;
          strut.position.set((i * spacing + 0.1 + segmentWidth / 2 + 0.01) * direction, 0, 0);
          wingGroup.add(strut);
        }
      }
      return wingGroup;
    };

    satelliteGroup.add(createWing(-1));
    satelliteGroup.add(createWing(1));

    // 3. High Gain Antenna (Dish with struts)
    const dishGroup = new THREE.Group();
    const dishGeo = new THREE.SphereGeometry(0.1, 32, 12, 0, Math.PI * 2, 0, 0.6);
    const dishMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.8, roughness: 0.3, side: THREE.DoubleSide });
    const dish = new THREE.Mesh(dishGeo, dishMat);
    dish.rotation.x = Math.PI / 2;
    dishGroup.add(dish);

    // Dish struts
    for (let i = 0; i < 3; i++) {
      const strut = new THREE.Mesh(new THREE.CylinderGeometry(0.003, 0.003, 0.12), darkMetalMaterial);
      const angle = (i / 3) * Math.PI * 2;
      strut.position.set(Math.cos(angle) * 0.04, 0.05, Math.sin(angle) * 0.04);
      strut.rotation.x = Math.PI / 6;
      strut.lookAt(0, 0.1, 0);
      dishGroup.add(strut);
    }

    const feed = new THREE.Mesh(new THREE.SphereGeometry(0.015, 8, 8), darkMetalMaterial);
    feed.position.set(0, 0.08, 0);
    dishGroup.add(feed);

    dishGroup.position.set(0, 0.15, 0);
    dishGroup.rotation.x = -Math.PI / 3;
    satelliteGroup.add(dishGroup);

    // 4. Detailed Sensor/Camera
    const cameraBody = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.06, 16), darkMetalMaterial);
    cameraBody.rotation.x = Math.PI / 2;
    cameraBody.position.set(0.05, -0.05, 0.16);

    const lens = new THREE.Mesh(new THREE.CircleGeometry(0.025, 16), new THREE.MeshStandardMaterial({ color: 0x000000, metalness: 1.0, roughness: 0.0 }));
    lens.position.set(0, 0.031, 0);
    lens.rotation.x = -Math.PI / 2;
    cameraBody.add(lens);
    satelliteGroup.add(cameraBody);


    // --- Orbit path ---
    const orbitRadius = 3.5;
    const orbitInclination = 1.2;
    const orbitPoints: THREE.Vector3[] = [];
    const segments = 64;

    for (let i = 0; i <= segments; i++) {
      const t = (i / segments) * Math.PI * 2;
      const x = Math.cos(t) * orbitRadius;
      const y = Math.sin(t * orbitInclination) * orbitRadius * 0.3;
      const z = Math.sin(t) * orbitRadius;
      orbitPoints.push(new THREE.Vector3(x, y, z));
    }

    const orbitGeometry = new THREE.BufferGeometry().setFromPoints(orbitPoints);
    const orbitMaterial = new THREE.LineBasicMaterial({
      color: 0x00ffff,
      transparent: true,
      opacity: 0.4,
    });
    const orbitLine = new THREE.Line(orbitGeometry, orbitMaterial);
    scene.add(orbitLine);

    // --- Ground station (Bangalore) ---
    const lat = 12.9716;
    const lon = 77.5946;
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    const stationRadius = 2.05;

    const stationX = -(stationRadius * Math.sin(phi) * Math.cos(theta));
    const stationZ = stationRadius * Math.sin(phi) * Math.sin(theta);
    const stationY = stationRadius * Math.cos(phi);

    const stationGeometry = new THREE.ConeGeometry(0.05, 0.15, 8);
    const stationMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const station = new THREE.Mesh(stationGeometry, stationMaterial);
    station.position.set(stationX, stationY, stationZ);
    station.lookAt(earth.position);
    scene.add(station);

    const stationLight = new THREE.PointLight(0xff0000, 1, 0.5);
    stationLight.position.set(stationX, stationY, stationZ);
    scene.add(stationLight);

    // --- Custom Controls ---
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let cameraRotation = { x: 0.3, y: 0 };

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      cameraRotation.y += deltaX * 0.005;
      cameraRotation.x += deltaY * 0.005;
      cameraRotation.x = Math.max(-Math.PI / 2 + 0.1, Math.min(Math.PI / 2 - 0.1, cameraRotation.x));

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };


    renderer.domElement.addEventListener('mousedown', onMouseDown);
    renderer.domElement.addEventListener('mousemove', onMouseMove);
    renderer.domElement.addEventListener('mouseup', onMouseUp);

    // --- Animation Loop ---
    let time = 0;
    const orbitSpeed = 0.2;

    const animate = () => {
      requestAnimationFrame(animate);

      time += 0.016;

      // Rotate earth slowly
      earth.rotation.y += 0.001;
      clouds.rotation.y += 0.0013; // Clouds move slightly faster
      const t = time * orbitSpeed;
      const x = Math.cos(t) * orbitRadius;
      const y = Math.sin(t * orbitInclination) * orbitRadius * 0.3;
      const z = Math.sin(t) * orbitRadius;

      satelliteGroup.position.set(x, y, z);
      satelliteGroup.lookAt(earth.position);
      satelliteGroup.rotation.y += 0.02;

      const radius = camera.position.length();
      camera.position.x = radius * Math.sin(cameraRotation.y) * Math.cos(cameraRotation.x);
      camera.position.y = radius * Math.sin(cameraRotation.x);
      camera.position.z = radius * Math.cos(cameraRotation.y) * Math.cos(cameraRotation.x);
      camera.lookAt(earth.position);

      renderer.render(scene, camera);
    };

    animate();

    // --- Window Resize Handler ---
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);

      // Responsively adjust camera distance
      const newDistance = window.innerWidth < 768 ? 12 : 8;
      camera.position.normalize().multiplyScalar(newDistance);
    };

    window.addEventListener('resize', handleResize);

    // --- Cleanup ---
    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('mousedown', onMouseDown);
      renderer.domElement.removeEventListener('mousemove', onMouseMove);
      renderer.domElement.removeEventListener('mouseup', onMouseUp);
      mountRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return (
    <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>


      <div ref={mountRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
}

export default App;