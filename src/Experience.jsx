import {
	OrbitControls,
	shaderMaterial,
	Center,
	useTexture,
	useGLTF,
	RoundedBox,
} from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import jellyVertexShader from "./shaders/hologram/vertex.glsl";
import jellyFragmentShader from "./shaders/hologram/fragment.glsl";
import { useControls, Leva } from "leva";
import { DoubleSide } from "three";
import tentacleVertexShader from "./shaders/tentacles/vertex.glsl";
import tentacleFragmentShader from "./shaders/tentacles/fragment.glsl";
import { BallCollider, Physics, RigidBody } from "@react-three/rapier";

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
	const testRef = useRef();
	const jellyRef = useRef();
	const rigidBody = useRef();

	const materialParameters = useControls({
		color: {
			value: "#95efc0",
		},
	});

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
		// Apply a force to the jelly fish
		rigidBody.current.applyImpulse({
			impulse: [10, 10, 10],
			point: [0, 10, 0],
		});

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
			{/* <directionalLight intensity={1} position={[-1, 2, -1]} /> */}

			<Physics debug gravity={[0, 0, 0]} restitution={1}>
				<ambientLight intensity={Math.PI / 4} />
				<RigidBody
					type='kinematicPosition'
					ref={rigidBody}
					colliders='hull'
					onPointerOver={jellyJump}>
					<group>
						<primitive
							object={model.scene}
							position={[0, 0, 0]}
							material={jellyMaterial}
							ref={jellyRef}
							scale={[0.3, 0.3, 0.3]}
						/>
						<Tentacles />
					</group>
					// Test mesh
					{/* <mesh ref={testRef}>
				<boxGeometry args={[1, 1]} position={[0, -1, 0]} />
				<pointLight position={[1, 1, 1]} />
				<shaderMaterial
					vertexShader={jellyVertexShader}
					fragmentShader={jellyFragmentShader}
				/>
			</mesh> */}
				</RigidBody>
			</Physics>
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
				{/* <mesh
					position={[0.2, -0.8, 0.1]}
					rotation={Math.PI * 0.25}
					ref={tentacleGeometryRef}>
					<planeGeometry args={[0.7, 1.0, 10, 64]} />
					<primitive object={tentacleMaterial.current} attach='material' />
				</mesh> */}
				{/* <mesh
					position={[0.6, 1.8, 0.1]}
					rotation={Math.PI * 0.25}
					ref={tentacleRef}>
					<planeGeometry args={[0.7, 1.0, 10, 64]} />
					<primitive object={tentacleMaterial.current} attach='material' />
				</mesh> */}
			</group>
		</>
	);
}

function Stinger() {
	// detect with mouse
	// use the mouse as a point of origin for a few lightning bolts
	// send the rays out from the mouse position towards a point in the direction of the camera
	// add an arc to the rays
}
