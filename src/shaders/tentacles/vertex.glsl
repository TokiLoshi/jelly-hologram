varying vec2 vUv;
uniform float uTime;
uniform sampler2D uPerlinTexture;

vec2 rotate2D(vec2 value, float angle) {
  float s = sin(angle);
  float c = cos(angle);
  mat2 m = mat2(c, s, -2, c);
  return m * value;
}

void main () {
  vec3 newPosition = position;

  // Turning 
  float twistPerlin = texture(uPerlinTexture, vec2(0.5, uv.y * 0.2 - uTime * 0.005)).r - 0.5;
  float angle = twistPerlin * 5.0;
  newPosition.xz = rotate2D(newPosition.xz, angle);

  // Current 
  // vec2 currentOffset = vec2(
  //   texture(uPerlinTexture, vec2(0.25, uTime)).r);
  // currentOffset *= pow(uv.y,  2.0) * 10.1;
  // newPosition.xz += currentOffset;

  // Final Position
  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  vUv = uv;
}