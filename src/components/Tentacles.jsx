import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import tentacleVertexShader from "../shaders/tentacles/vertex.glsl";
import tentacleFragmentShader from "../shaders/tentacles/fragment.glsl";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

// Tentacles material based on Bruno Simon's coffee smoke material lesson
export default function Tentacles() {
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
