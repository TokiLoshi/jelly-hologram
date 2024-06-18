import {
	OrbitControls,
	shaderMaterial,
	Center,
	useGLTF,
} from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import jellyVertexShader from "./shaders/hologram/vertex.glsl";
import jellyFragmentShader from "./shaders/hologram/fragment.glsl";

console.log(jellyVertexShader);
console.log(jellyFragmentShader);

const jellyMaterial = new THREE.ShaderMaterial({
	uniforms: {
		uTime: new THREE.Uniform(0),
		uColor: new THREE.Color(0x00ff00),
	},
	transparent: true,
	side: THREE.DoubleSide,
	depthWrite: false,
	vertexShader: jellyVertexShader,
	fragmentShader: jellyFragmentShader,
});

export default function Experience() {
	const testRef = useRef();
	const jellyRef = useRef();
	// useFrame(
	// 	() => (testRef.current.rotation.x = testRef.current.rotation.y += 0.01)
	// );

	useFrame((state, delta) => {
		jellyRef.current.rotation.y += delta * 0.1;
		const elapsedTime = state.clock.getElapsedTime();
		jellyMaterial.uniforms.uTime.value = elapsedTime;
		// jellyRef.current.rotation.x += Math.sin(delta * 0.2);
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
			<ambientLight intensity={Math.PI / 2} />
			<primitive
				object={model.scene}
				position={[0, 0, 0]}
				material={jellyMaterial}
				ref={jellyRef}
				scale={[0.3, 0.3, 0.3]}
			/>
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
