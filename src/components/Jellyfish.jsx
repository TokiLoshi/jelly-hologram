import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import jellyVertexShader from "../shaders/hologram/vertex.glsl";
import jellyFragmentShader from "../shaders/hologram/fragment.glsl";

export default function Jellyfish({ materialParameters }) {
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
	const jellyRef = useRef();
	const model = useGLTF("./model/jellyfish1.glb");
	model.scene.traverse((child) => {
		console.log(child.name);
		if (child.name === "jelly") {
			child.material = jellyMaterial;
		}
	});
	console.log("Material parameters: ", materialParameters);

	useFrame((state, delta) => {
		jellyRef.current.rotation.y += delta * 0.1;
		const elapsedTime = state.clock.getElapsedTime();
		jellyMaterial.uniforms.uTime.value = elapsedTime;
		if (!jellyMaterial.uniforms.uColor.value.equals(materialParameters.color)) {
			jellyMaterial.uniforms.uColor.value.set(materialParameters.color);
		}
	});

	return (
		<>
			<primitive
				object={model.scene}
				position={[0, 0, 0]}
				material={jellyMaterial}
				ref={jellyRef}
				scale={[0.3, 0.3, 0.3]}
			/>
		</>
	);
}
