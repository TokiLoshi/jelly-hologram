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
  // Set the alpha to the texture
  gl_FragColor = vec4(1.0, 1.0, 1.0, tentacles);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}