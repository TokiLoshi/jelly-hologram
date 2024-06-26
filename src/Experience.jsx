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

// Shader material based on Bruno Simon's three.js journey hologram lesson
const jellyMaterial = new THREE.ShaderMaterial({
	uniforms: {
		uTime: new THREE.Uniform(0),
		uColor: new THREE.Uniform(new THREE.Color("#AF47D2")),
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
	// useFrame(
	// 	() => (testRef.current.rotation.x = testRef.current.rotation.y += 0.01)
	// );

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
			<ambientLight intensity={Math.PI / 4} />
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
		</>
	);
}

// Tentacles material based on Bruno Simon's coffee smoke material lesson
function Tentacles() {
	const perlinTexture = useTexture("./noiseTexture2.png");
	perlinTexture.wrapS = THREE.RepeatWrapping;
	perlinTexture.wrapT = THREE.RepeatWrapping;

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

	useFrame((state, delta) => {
		const elapsedTime = state.clock.getElapsedTime();
		tentacleMaterial.current.uniforms.uTime.value = elapsedTime;
	});

	return (
		<>
			<group>
				<mesh position={[0, -1.0, 0]}>
					{/* <RoundedBox args={[0.5, 1, 1]} /> */}
					<planeGeometry args={[0.8, 1.0, 16, 64]} />
					<primitive object={tentacleMaterial.current} attach='material' />
				</mesh>
				<mesh position={[0.1, -0.9, 0.1]}>
					{/* <RoundedBox args={[0.5, 1, 1]} /> */}
					<planeGeometry args={[0.6, 1.0, 10, 64]} rotation={Math.PI * 0.25} />
					<primitive object={tentacleMaterial.current} attach='material' />
				</mesh>
			</group>
		</>
	);
}
