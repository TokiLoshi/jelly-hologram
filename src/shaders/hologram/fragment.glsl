varying vec3 vPosition;
uniform float uTime;
varying vec3 vNormal;

void main() {

  // Adjust the normal
  
  // Add the stripes 
  float stripes = mod((vPosition.y - uTime * 0.02) * 20.0, 1.0);
  stripes = pow(stripes, 3.0);

  // Add the Fresnel effect 
  // Formula for the fresnel effect 
  // 1) Get the normal vector and the view direction
   vec3 viewDirection = normalize(vPosition - cameraPosition);
  // Calculate the dot product of the normal and the view direction
  float fresnel = dot(vNormal, viewDirection);
  // Add 1 to the dot product 
  // Reaise the result to a power

 


  // Adjust the falloff 

  // Add the holographic effect 

  gl_FragColor = vec4(1.0, 1.0, 1.0, fresnel);
  
}