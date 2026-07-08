varying vec3 vNormal;
varying vec3 vPosition;
varying vec2 vUv;
uniform float uTime;

void main() {
  vNormal = normalize(normalMatrix * normal);
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  vPosition = mvPosition.xyz;
  vUv = uv;

  vec3 pos = position;
  float displacement = sin(pos.x * 4.0 + uTime) * 0.02 +
                       sin(pos.y * 5.0 + uTime * 1.2) * 0.02 +
                       sin(pos.z * 3.5 + uTime * 0.8) * 0.02;
  pos += normal * displacement;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
