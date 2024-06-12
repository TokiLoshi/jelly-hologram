import { OrbitControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

export default function Experience() {
	const testRef = useRef();
	useFrame(
		() => (testRef.current.rotation.x = testRef.current.rotation.y += 0.01)
	);
	return (
		<>
			<OrbitControls />
			<ambientLight intensity={Math.PI / 2} />
			<mesh ref={testRef}>
				<boxGeometry args={[1, 1, 1]} />
				<pointLight position={[1, 1, 1]} />
				<meshStandardMaterial color='hotpink' />
			</mesh>
		</>
	);
}
