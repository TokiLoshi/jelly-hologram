import React from "react";
import ReactDOM from "react-dom/client";
import Experience from "./Experience.jsx";
import { Leva } from "leva";
import { Canvas } from "@react-three/fiber";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")).render(
	<>
		<Leva collapsed />
		<Canvas
			className='r3f-canvas'
			camera={{
				fov: 20,
				near: 0.5,
				far: 250,
				position: [-8, 2, 6],
			}}>
			<color attach='background' args={["#171720"]} />
			<Experience />
		</Canvas>
	</>
);
