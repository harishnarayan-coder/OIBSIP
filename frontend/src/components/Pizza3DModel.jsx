import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Environment, Float } from '@react-three/drei';
import * as THREE from 'three';

// Procedural Pizza Base (Dough)
const PizzaBase = () => {
    return (
        <mesh receiveShadow castShadow position={[0, -0.1, 0]}>
            <cylinderGeometry args={[2.5, 2.5, 0.2, 64]} />
            <meshStandardMaterial color="#f4a460" roughness={0.8} />
        </mesh>
    );
};

// Procedural Sauce layer
const SauceLayer = () => {
    return (
        <mesh receiveShadow castShadow position={[0, 0.01, 0]}>
            <cylinderGeometry args={[2.3, 2.3, 0.05, 64]} />
            <meshStandardMaterial color="#c0392b" roughness={0.3} />
        </mesh>
    );
};

// Procedural Cheese layer
const CheeseLayer = () => {
    return (
        <mesh receiveShadow castShadow position={[0, 0.06, 0]}>
            <cylinderGeometry args={[2.2, 2.2, 0.08, 64]} />
            <meshStandardMaterial color="#f1c40f" roughness={0.5} />
        </mesh>
    );
};

// Helper for random placement in a circle
const getRandomPositionInCircle = (radius) => {
    const angle = Math.random() * Math.PI * 2;
    const r = Math.sqrt(Math.random()) * radius;
    return [Math.cos(angle) * r, Math.sin(angle) * r];
};

// Procedural Veggies (Little green/yellow/red cubes scattered)
const VeggiesScattered = ({ count = 15 }) => {
    const group = useRef();

    return (
        <group ref={group} position={[0, 0.15, 0]}>
            {Array.from({ length: count }).map((_, i) => {
                const [x, z] = getRandomPositionInCircle(2.0);
                const color = ['#2ecc71', '#f39c12', '#e74c3c'][Math.floor(Math.random() * 3)];
                const rot = [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI];
                return (
                    <mesh key={i} position={[x, 0, z]} rotation={rot} castShadow>
                        <boxGeometry args={[0.2, 0.2, 0.2]} />
                        <meshStandardMaterial color={color} roughness={0.6} />
                    </mesh>
                );
            })}
        </group>
    );
};

// Procedural Meat (Little dark red/brown cylinders for pepperoni/sausage scattered)
const MeatScattered = ({ count = 12 }) => {
    const group = useRef();

    return (
        <group ref={group} position={[0, 0.18, 0]}>
            {Array.from({ length: count }).map((_, i) => {
                const [x, z] = getRandomPositionInCircle(2.0);
                return (
                    <mesh key={i} position={[x, 0, z]} rotation={[Math.PI / 2, 0, Math.random() * Math.PI]} castShadow>
                        <cylinderGeometry args={[0.2, 0.2, 0.05, 16]} />
                        <meshStandardMaterial color="#8e44ad" roughness={0.8} /> {/* Using purple/brown hues */}
                    </mesh>
                );
            })}
        </group>
    );
};

// Main Scene Component handling rotation and rendering parts
const PizzaScene = ({ cart }) => {
    const group = useRef();

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        // Slow continuous rotation
        if (group.current) {
            group.current.rotation.y = t * 0.2;
            group.current.position.y = Math.sin(t * 1.5) * 0.1; // Gentle bobbing
        }
    });

    return (
        <group ref={group}>
            {cart.base && <PizzaBase />}
            {cart.sauce && <SauceLayer />}
            {cart.cheese && <CheeseLayer />}
            {cart.veggies && cart.veggies.length > 0 && <VeggiesScattered count={cart.veggies.length * 8} />}
            {cart.meat && cart.meat.length > 0 && <MeatScattered count={cart.meat.length * 6} />}
        </group>
    );
};

// The Canvas Wrapper exported to use anywhere
const Pizza3DModel = ({ cart }) => {
    return (
        <div style={{ width: '100%', height: '100%', minHeight: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Canvas shadows camera={{ position: [0, 4, 6], fov: 45 }}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 5]} intensity={1} castShadow shadow-mapSize={[1024, 1024]} />
                <pointLight position={[-10, 10, -10]} intensity={0.5} />
                <Environment preset="city" />
                <Float speed={2} rotationIntensity={0.1} floatIntensity={0.5}>
                    <PizzaScene cart={cart} />
                </Float>
                <ContactShadows position={[0, -1.5, 0]} opacity={0.4} scale={10} blur={2} far={4} />
                <OrbitControls enableZoom={true} maxPolarAngle={Math.PI / 2} minDistance={3} maxDistance={10} />
            </Canvas>
            <div style={{ textAlign: 'center', marginTop: '-30px', color: '#666', fontSize: '0.9em', pointerEvents: 'none', zIndex: 10 }}>
                <span>Drag to rotate • Scroll to zoom</span>
            </div>
        </div>
    );
};

export default Pizza3DModel;
