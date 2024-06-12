import {
	OrbitControls,
	shaderMaterial,
	Center,
	useGLTF,
} from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

export default function Experience() {
	const testRef = useRef();
	const jellyRef = useRef();
	useFrame(
		() => (testRef.current.rotation.x = testRef.current.rotation.y += 0.01)
	);

	useFrame((state, delta) => {
		jellyRef.current.rotation.x = jellyRef.current.rotation.x += 0.01;
		// (jellyRef.current.scale.y = 1 + 0.5 * Math.sin(delta * 2));
	});

	const model = useGLTF("./model/jellyfish.glb");

	return (
		<>
			<OrbitControls />

			<ambientLight intensity={Math.PI / 2} />
			<Center>
				<primitive
					object={model.scene}
					// material={new THREE.MeshStandardMaterial({ color: "white" })}
					ref={jellyRef}
				/>
			</Center>
			<mesh ref={testRef}>
				<boxGeometry args={[1, 1]} position={[0, -1, 0]} />
				<pointLight position={[1, 1, 1]} />
				<meshStandardMaterial color='mediumpurple' />
			</mesh>
		</>
	);
}
