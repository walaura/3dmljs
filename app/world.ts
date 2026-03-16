import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { ParsedData } from '../types';

export const initThree = (canvas: HTMLCanvasElement, parsed: ParsedData) => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas });

    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.position.set(10, 10, 10);
    camera.lookAt(0, 0, 0);

    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    const keys: { [key: string]: boolean } = {};
    window.addEventListener('keydown', (event) => {
        keys[event.code] = true;
    });
    window.addEventListener('keyup', (event) => {
        keys[event.code] = false;
    });

    (window as any).lvl = parsed;
    const levels: string[] = [];
    const blockSize = 1;

    levels.forEach((levelStr: string, z: number) => {
        const rows = levelStr.split('\n').map(row => row.trim()).filter(row => row);
        rows.forEach((row: string, y: number) => {
            const cells = row.split(/[, ]+/).map(cell => cell.trim()).filter(cell => cell);
            cells.forEach((cell: string, x: number) => {
                // if cell is empty make a sphere, otherwise make a cube
                const hue = (z * 60) % 360; // Different hue per level
                const color = new THREE.Color(`hsl(${hue}, 70%, 50%)`);
                if (cell !== '.' && cell !== '..') {
                    const geometry = new THREE.BoxGeometry(blockSize, blockSize, blockSize);
                    const material = new THREE.MeshBasicMaterial({ color });
                    const cube = new THREE.Mesh(geometry, material);
                    cube.position.set(x * blockSize, y * blockSize, z * blockSize);
                    scene.add(cube);
                }
                else {
                    const geometry = new THREE.SphereGeometry(blockSize / 2, 16, 16);
                    const material = new THREE.MeshBasicMaterial({ color: 0x0000ff });
                    const sphere = new THREE.Mesh(geometry, material);
                    sphere.position.set(x * blockSize, y * blockSize, z * blockSize);
                    scene.add(sphere);
                }
            });
        });
    });

    const animate = () => {
        requestAnimationFrame(animate);

        // WASD movement
        const speed = 0.1;
        if (keys['KeyW']) camera.position.z -= speed;
        if (keys['KeyS']) camera.position.z += speed;
        if (keys['KeyA']) camera.position.x -= speed;
        if (keys['KeyD']) camera.position.x += speed;

        controls.update();
        renderer.render(scene, camera);
    };
    animate();
};