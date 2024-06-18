varying vec3 vPosition;
uniform float uTime;
varying vec3 vNormal;
uniform vec3 uColor;

void main() {

  // Adjust the normal
  vec3 normal = normalize(vNormal);
  if(!gl_FrontFacing) {
    normal *= -1.0;
  }
  
  // Add the stripes 
  float stripes = mod((vPosition.y - uTime * 0.02) * 20.0, 1.0);
  stripes = pow(stripes, 3.0);

  // Add the Fresnel effect 
  // Formula for the fresnel effect 
  // 1) Get the normal vector and the view direction
   vec3 viewDirection = normalize(vPosition - cameraPosition);
  // Calculate the dot product of the normal and the view direction
  float fresnel = dot(viewDirection, normal) + 1.0;
  // Add 1 to the dot product 
  fresnel = pow(fresnel, 2.0);
  // Reaise the result to a power

  // Adjust the falloff 
  float falloff = smoothstep(0.8, 0.0, fresnel);

  // Add the holographic effect 
  float holographic = stripes * fresnel;
  holographic += fresnel * 1.25;
  holographic *= falloff;

  gl_FragColor = vec4(uColor, holographic);
  
}