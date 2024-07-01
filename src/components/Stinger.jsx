import React, { useRef } from "react";
import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import stingerVertexShader from "../shaders/lightning/vertex.glsl";
import stingerFragmentShader from "../shaders/lightning/fragment.glsl";
import * as THREE from "three";

export default function Stinger({ isStinging }) {
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
					<torusGeometry args={[1, 2, 56, 50]} />
					<primitive object={stingerMaterial.current} attach='material' />
				</mesh>
			)}
		</>
	);
}
