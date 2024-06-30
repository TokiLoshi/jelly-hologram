import {
	OrbitControls,
	shaderMaterial,
	Center,
	useTexture,
	useGLTF,
	RoundedBox,
	Torus,
} from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import jellyVertexShader from "./shaders/hologram/vertex.glsl";
import jellyFragmentShader from "./shaders/hologram/fragment.glsl";
import { useControls, Leva } from "leva";
import { DoubleSide } from "three";
import tentacleVertexShader from "./shaders/tentacles/vertex.glsl";
import tentacleFragmentShader from "./shaders/tentacles/fragment.glsl";
import { BallCollider, Physics, RigidBody } from "@react-three/rapier";
import stingerVertexShader from "./shaders/lightning/vertex.glsl";
import stingerFragmentShader from "./shaders/lightning/fragment.glsl";

// Shader material based on Bruno Simon's three.js journey hologram lesson
const jellyMaterial = new THREE.ShaderMaterial({
	uniforms: {
		uTime: new THREE.Uniform(0),
		uColor: new THREE.Uniform(new THREE.Color("#AF47D2")),
		uWiggleIntensity: new THREE.Uniform(0.0),
	},
	transparent: true,
	side: THREE.DoubleSide,
	depthWrite: false,
	vertexShader: jellyVertexShader,
	fragmentShader: jellyFragmentShader,
	blending: THREE.AdditiveBlending,
});

export default function Experience() {
	const jellyRef = useRef();
	const rigidBodyRef = useRef();
	const [isStinging, setIsStinging] = useState(false);
	const [backgroundColor, setBackgroundColor] = useState("#00224D");
	const materialParameters = useControls({
		color: {
			value: "#95efc0",
		},
	});

	// useEffect(() => {
	// 	setBackgroundHSL({ h: 0.59, s: 1.0, 1: 0.15 });
	// }, []);

	useFrame((state, delta) => {
		jellyRef.current.rotation.y += delta * 0.1;
		const elapsedTime = state.clock.getElapsedTime();
		jellyMaterial.uniforms.uTime.value = elapsedTime;
		if (!jellyMaterial.uniforms.uColor.value.equals(materialParameters.color)) {
			jellyMaterial.uniforms.uColor.value.set(materialParameters.color);
			// jellyRef.current.rotation.x += Math.sin(delta * 0.2);
		}
	});

	const jellyJump = () => {
		console.log("You touched the jelly fish!", jellyRef.current.children);
		console.log("Rigid body", rigidBodyRef.current);
		console.log("Is stinging?", isStinging);
		setIsStinging(!isStinging);
		console.log("Changed stinging", isStinging);
		// setBackgroundColor((prevColor) => {
		// 	if (prevColor === "#FFFFFF" || prevColor === "#ffffff") {
		// 		alert(
		// 			"Oh no, the jellyfish took over and now you're stuck in light mode!"
		// 		);
		// 	}
		// 	const r = parseInt(prevColor.slice(1, 3), 16);
		// 	const g = parseInt(prevColor.slice(3, 5), 16);
		// 	const b = parseInt(prevColor.slice(5, 7), 16);
		// 	console.log(`Current red`);
		// 	// if (r > 90) {
		// 	// 	alert(
		// 	// 		"The jellyfish are trying to take over! Don't let them turn this into light mode!"
		// 	// 	);
		// 	// }
		// 	const newRed = Math.min(255, r + 10);
		// 	const newGreen = Math.min(255, g + 10);
		// 	const newBlue = Math.min(255, b + 10);
		// 	const newBackground = `#${[newRed, newGreen, newBlue]
		// 		.map((x) => x.toString(16).padStart(2, "0"))
		// 		.join("")}`;
		// 	console.log(`New background color: ${newBackground}`);
		// 	return `${newBackground}`;
		// });
		// setBackgroundColor("#" + Math.floor(Math.random() * 16777215).toString(16));
		// console.log("New background color: ", backgroundColor);
		// setTimeout(() => {
		// 	setIsStinging(false);
		// }, 5000);

		// Apply a force to the jelly fish
		// rigidBodyRef.current.applyTorqueImpulse({
		// 	x: 0,
		// 	y: 0.1,
		// 	z: 0,
		// });
		// model.scene.traverse((child) => {
		// 	if (child.name === "jelly") {
		// 		child.material = jellyMaterial;
		// 		console.log("Model traversal reached!", jellyRef.current.children);
		// 		rigidBodyRef.current.applyTorqueImpulse({
		// 			x: 0.0,
		// 			y: 0.1,
		// 			z: 0.0,
		// 		});
		// 	}
		// });

		jellyMaterial.uniforms.uTime.value++;
	};

	// Traverse the scene to add the material to the jelly fish
	const model = useGLTF("./model/jellyfish1.glb");
	model.scene.traverse((child) => {
		console.log(child.name);
		if (child.name === "jelly") {
			child.material = jellyMaterial;
		}
	});

	return (
		<>
			<OrbitControls />
			<color attach='background' args={[backgroundColor]} />
			{/* <directionalLight intensity={1} position={[-1, 2, -1]} /> */}
			<ambientLight intensity={Math.PI / 4} />
			<group
				onPointerEnter={jellyJump}
				onPointerLeave={() => setIsStinging(false)}>
				<primitive
					object={model.scene}
					position={[0, 0, 0]}
					material={jellyMaterial}
					ref={jellyRef}
					scale={[0.3, 0.3, 0.3]}
				/>
				<Tentacles />
				<Stinger isStinging={isStinging} />
			</group>
			<group
				onPointerEnter={jellyJump}
				onPointerLeave={() => setIsStinging(false)}>
				<primitive
					object={model.scene}
					position={[0, 0, 0]}
					material={jellyMaterial}
					ref={jellyRef}
					scale={[0.3, 0.3, 0.3]}
				/>
				<Tentacles />
				<Stinger isStinging={isStinging} />
			</group>
			// Test mesh
			{/* 
			<Physics
				debug
				restitution={2}
				linearDamping={0.8}
				angularDamping={0.9}
				gravity={[0.0, 0.01, 0]}>
				<RigidBody ref={rigidBodyRef} colliders='hull'>
				<mesh ref={testRef}>
				<boxGeometry args={[1, 1]} position={[0, -1, 0]} />
				<pointLight position={[1, 1, 1]} />
				<shaderMaterial
					vertexShader={jellyVertexShader}
					fragmentShader={jellyFragmentShader}
				/>
			</mesh>
			</RigidBody> */}
			{/* <RigidBody position={[1.5, 2, 0]} ref={testCube}>
					<mesh castShadow onClick={cubeJump}>
						<boxGeometry />
						<meshStandardMaterial color='mediumpurple' />
					</mesh>
				</RigidBody> */}
			{/* </Physics> */}
		</>
	);
}

// Tentacles material based on Bruno Simon's coffee smoke material lesson
function Tentacles() {
	const perlinTexture = useTexture("./noiseTexture2.png");
	perlinTexture.wrapS = THREE.RepeatWrapping;
	perlinTexture.wrapT = THREE.RepeatWrapping;

	const tentacleRef = useRef();

	const tentacleMaterial = useRef(
		new THREE.ShaderMaterial({
			vertexShader: tentacleVertexShader,
			fragmentShader: tentacleFragmentShader,
			wireframe: false,
			side: THREE.DoubleSide,
			transparent: true,
			depthWrite: false,
			uniforms: {
				uPerlinTexture: new THREE.Uniform(perlinTexture),
				uTime: new THREE.Uniform(0),
			},
		})
	);

	const tentacleGeometryRef = useRef();
	console.log("Tentacle Geometry", tentacleGeometryRef.current);

	useFrame((state, delta) => {
		const elapsedTime = state.clock.getElapsedTime();
		if (tentacleRef.current) {
			tentacleRef.current.rotation.y += delta * 0.1;
		}

		if (tentacleGeometryRef.current) {
			tentacleGeometryRef.current.rotation.z += cos(delta * 20);
		}
		tentacleMaterial.current.uniforms.uTime.value = elapsedTime;
	});

	return (
		<>
			<group>
				<mesh position={[0, -1.0, 0]} ref={tentacleRef}>
					{/* <RoundedBox args={[0.5, 1, 1]} /> */}
					<planeGeometry
						args={[0.8, 1.0, 16, 64]}
						ref={tentacleGeometryRef.current}
					/>
					<primitive object={tentacleMaterial.current} attach='material' />
				</mesh>
			</group>
		</>
	);
}

function Stinger({ isStinging }) {
	console.log("In stinger function?", isStinging);
	// if (isStinging) {
	const stringerRef = useRef();
	const perlinTexture = useTexture("./noiseTexture2.png");
	perlinTexture.wrapS = THREE.RepeatWrapping;
	perlinTexture.wrapT = THREE.RepeatWrapping;
	const stingerMaterial = useRef(
		new THREE.ShaderMaterial({
			vertexShader: stingerVertexShader,
			fragmentShader: stingerFragmentShader,
			wireframe: false,
			transparent: true,
			depthWrite: false,
			side: THREE.DoubleSide,
			uniforms: {
				uPerlinTexture: new THREE.Uniform(perlinTexture),
				uTime: new THREE.Uniform(0),
			},
		})
	);
	useFrame((state, delta) => {
		if (stringerRef.current) {
			stingerMaterial.current.uniforms.uTime.value =
				state.clock.getElapsedTime();
		}
	});
	return (
		<>
			{isStinging && (
				<mesh
					rotation-x={-Math.PI * 0.5}
					position={[0, -0.6, -0]}
					ref={stringerRef}
					scale={0.4}>
					<torusGeometry args={[1, 3, 56, 50]} />
					<primitive object={stingerMaterial.current} attach='material' />
				</mesh>
			)}
		</>
	);
	// }
}
