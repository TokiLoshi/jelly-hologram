varying vec2 vUv;
uniform float uTime;
uniform sampler2D uPerlinTexture;

// From Bruno Simon 
vec2 rotate2D(vec2 value, float angle) {
  float s = sin(angle);
  float c = cos(angle);
  mat2 m = mat2(c, s, -s, c);
  return m * value;
}

#include ../includes/random2D.glsl 

void main () {
  vec3 newPosition = position;

  // Turning 
  float twistPerlin = texture(uPerlinTexture, vec2(0.5, uv.y * 0.2 - uTime * 0.005)).r - 0.5;
  float angle = twistPerlin * 5.0;
  newPosition.xz = rotate2D(newPosition.xz, angle);

  // Add bounce 
  float glitchTime = uTime + newPosition.y + twistPerlin;
  float glitchStrength = sin(glitchTime) + sin(glitchTime * 3.45) + sin(glitchTime * 8.76);
  glitchStrength /= 3.0;
  glitchStrength = smoothstep(0.3, 1.0, glitchStrength);
  glitchStrength *= 0.15;
  newPosition.x += (random2D(newPosition.xz + uTime) - 0.5) * glitchStrength;
  newPosition.y += (random2D(newPosition.zx + uTime) - 0.5) * glitchStrength;

  // Final Position
  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  vUv = uv;
}
