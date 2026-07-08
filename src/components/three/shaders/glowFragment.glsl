uniform vec3 uColor;
uniform float uIntensity;
uniform float uOpacity;
uniform float uTime;
uniform float uPulseSpeed;

varying vec3 vNormal;
varying vec3 vPosition;
varying vec2 vUv;

void main() {
  vec3 viewDir = normalize(-vPosition);
  float rim = 1.0 - max(0.0, dot(viewDir, vNormal));
  rim = pow(rim, 3.0);

  float pulse = 0.7 + 0.3 * sin(uTime * uPulseSpeed + vPosition.y * 8.0 + vPosition.x * 6.0);

  float glow = 1.0 + rim * 2.5;
  vec3 color = uColor * glow * pulse;

  float alpha = uOpacity * (0.5 + rim * 0.5) * pulse;

  gl_FragColor = vec4(color, alpha);
}
