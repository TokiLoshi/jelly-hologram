import { OrbitControls } from "@react-three/drei";
import { useState } from "react";
import { useControls, Leva } from "leva";
import Tentacles from "./components/Tentacles";
import Stinger from "./components/Stinger";
import Jellyfish from "./components/Jellyfish";

export default function Experience() {
	const [isStinging, setIsStinging] = useState(false);
	const [backgroundColor, setBackgroundColor] = useState("#00224D");
	const materialParameters = useControls({
		color: {
			value: "#95efc0",
		},
	});

	return (
		<>
			<OrbitControls />
			<ambientLight intensity={Math.PI / 4} />
			<group
				onPointerEnter={() => setIsStinging(true)}
				onPointerLeave={(e) =>
					setTimeout(() => {
						console.log(`Pointer left the jelly fish ${e}`);
						setIsStinging(false);
					}, 500)
				}>
				<Jellyfish materialParameters={materialParameters} />
				<Tentacles />
				<Stinger isStinging={isStinging} />
			</group>
		</>
	);
}

// useFrame((state, delta) => {
// 	jellyRef.current.rotation.y += delta * 0.1;
// 	const elapsedTime = state.clock.getElapsedTime();
// 	jellyMaterial.uniforms.uTime.value = elapsedTime;
// 	if (!jellyMaterial.uniforms.uColor.value.equals(materialParameters.color)) {
// 		jellyMaterial.uniforms.uColor.value.set(materialParameters.color);
// 	}
// });

// Traverse the scene to add the material to the jelly fish
// const model = useGLTF("./model/jellyfish1.glb");
// model.scene.traverse((child) => {
// 	console.log(child.name);
// 	if (child.name === "jelly") {
// 		child.material = jellyMaterial;
// 	}
// });
