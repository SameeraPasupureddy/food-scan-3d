uniform vec3 glowColor;
uniform float intensity;
uniform float opacity;

varying vec3 vNormal;
varying vec3 vPosition;
varying vec2 vUv;

void main() {
  vec3 viewDir = normalize(-vPosition);
  float rim = 1.0 - max(0.0, dot(viewDir, vNormal));
  rim = pow(rim, 3.0);

  float pulse = 0.8 + 0.2 * sin(vPosition.y * 10.0 + vPosition.x * 8.0);

  vec3 color = glowColor * (1.0 + rim * 2.0) * pulse;
  float alpha = opacity * (0.6 + rim * 0.4);

  gl_FragColor = vec4(color, alpha);
}
