// uniform sampler2D uPerlinTexture;
// varying vec2 vUv;
// uniform float uTime; 

// void main () {
//   // Scale the tentacles
//   vec2 tentaclesUv = vUv;
//   tentaclesUv.x *= 0.5;
//   tentaclesUv.y *= 0.3;
//   tentaclesUv.y -= uTime * 0.03;
  
//   // Load in the texture
//   float tentacles = texture(uPerlinTexture, tentaclesUv).r;

//   // Remap the texture
//   tentacles = smoothstep(0.4, 1.0, tentacles);

//   // Edges 
//   tentacles *= smoothstep(0.0, 0.1, vUv.x);
//   tentacles *= smoothstep(1.0, 0.9, vUv.x);
//   tentacles *= smoothstep(0.0, 0.1, vUv.y);
//   tentacles *= smoothstep(1.0, 0.9, vUv.y);

//   // Set the alpha to the texture
//   gl_FragColor = vec4(0.0, 0.3, 1.0, tentacles);
//   // Dev color
//   // gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
//   #include <tonemapping_fragment>
//   #include <colorspace_fragment>
// }

uniform sampler2D uPerlinTexture;
varying vec2 vUv;
uniform float uTime; 

void main () {
  // Scale the tentacles
  vec2 tentaclesUv = vUv;
  tentaclesUv.x *= 0.5;
  tentaclesUv.y *= 0.3;
  tentaclesUv.y -= uTime * 0.03;
  
  // Load in the texture
  float tentacles = texture(uPerlinTexture, tentaclesUv).r;

  // Remap the texture
  tentacles = smoothstep(0.4, 1.0, tentacles);

  // Edges 
  tentacles *= smoothstep(0.0, 0.1, vUv.x);
  tentacles *= smoothstep(1.0, 0.9, vUv.x);
  tentacles *= smoothstep(0.0, 0.1, vUv.y);
  tentacles *= smoothstep(1.0, 0.9, vUv.y);

  // Set the alpha to the texture
  gl_FragColor = vec4(0.0, 0.3, 1.0, tentacles);
  // Dev color
  // gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}