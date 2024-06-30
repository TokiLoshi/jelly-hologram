// uniform float uTime;
// void main() {
//   gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
// }

// stingerFragmentShader.glsl
uniform float uTime;
uniform sampler2D uPerlinTexture;
varying vec2 vUv;

// From Bruno Simon 
vec2 rotate2D(vec2 value, float angle) {
  float s = sin(angle);
  float c = cos(angle);
  mat2 m = mat2(c, s, -s, c);
  return m * value;
}

#include ../includes/random2D.glsl 

void main() {
  vec2 stingUv = vUv;
  stingUv.x *= 0.6;
  stingUv.y *= 0.3;
  stingUv.y -= uTime * 0.08;
  float sting = texture(uPerlinTexture, vUv).b;
  sting = smoothstep(0.4, 1.0, sting);  
  sting *= smoothstep(0.0, 0.1, vUv.x);
  // sting *= smoothstep(1.0, 0.9, vUv.x);
  // sting *= smoothstep(0.0, 0.1, vUv.y);
  // sting *= smoothstep(1.0, 0.9, vUv.y); 
  
  float alpha = abs(sin(uTime * 4.0)); // Flickering effect

  vec3 color = vec3(1.0, 1.0, 1.0); // Purple lightning
  gl_FragColor = vec4(color * sting, sting);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
