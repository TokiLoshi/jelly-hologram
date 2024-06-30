// void main() {
//   vec4 modelPosition = modelMatrix * vec4(position, 1.0);
//   vec4 viewPosition = viewMatrix * modelPosition;
//   vec4 projectionPosition = projectionMatrix * viewPosition;
//   gl_Position = projectionPosition;
// }

// stingerVertexShader.glsl
uniform float uTime;
varying vec2 vUv;
uniform sampler2D uPerlinTexture;

vec2 rotate2D(vec2 value, float angle) {
  float s = sin(angle);
  float c = cos(angle);
  mat2 m = mat2(c, s, -s, c);
  return m * value;
}
#include ../includes/random2D.glsl 

void main() {
    // Scale lightening 
    

    vec3 newPosition = position;
    float twistPerlin = texture(uPerlinTexture, vec2(1.0, uv.y * 0.2 - uTime * 0.005)).b - 0.5;
    newPosition.x += sin(position.x * 5.0 + uTime * 2.0) * 0.1; // Simulate lightning jaggedness
    newPosition.x += twistPerlin * 0.1;
    //  newPosition.z += cos(position.y * 10.0 + uTime * 5.0) * 0.1; // Simulate lightning jaggedness
    float angle = twistPerlin * 0.5;
    newPosition.xz = rotate2D(newPosition.xz, angle);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
    vUv = uv;
}
