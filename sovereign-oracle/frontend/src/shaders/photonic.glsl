// Photonic lattice vertex/fragment shaders (Three.js ShaderMaterial).
// Uniforms: uTime, uLux, uCct, u_EM002_Reson, u_AudioAmp, uPatterns[7]
varying vec3 vPos;
uniform float uTime;
uniform float uLux;
uniform float uCct;
uniform float u_EM002_Reson;
uniform float u_AudioAmp;

void main() {
  vPos = position;
  float distort = 0.1 * sin(uTime * 2.0 + position.x * 3.0) * (1.0 + u_AudioAmp);
  vec3 p = position + normal * distort;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}

// fragment
varying vec3 vPosF;
uniform float uTimeF;
uniform float uLuxF;
uniform float uCctF;
void mainF() {
  float warmth = clamp((uCctF - 2000.0) / 8000.0, 0.0, 1.0);
  vec3 col = mix(vec3(1.0, 0.6, 0.3), vec3(0.4, 0.7, 1.0), warmth);
  col *= (0.3 + 0.7 * uLuxF);
  col += 0.1 * vec3(sin(uTimeF + vPosF.x), cos(uTimeF + vPosF.y), sin(uTimeF + vPosF.z));
  gl_FragColor = vec4(col, 1.0);
}
