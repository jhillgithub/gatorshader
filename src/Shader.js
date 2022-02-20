import glsl from 'babel-plugin-glsl/macro';

// vertex shader
export const vertexShader = glsl`
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// fragment shader
export const fragmentShader = glsl`

  varying vec2 vUv;
  uniform float brightness;
  uniform sampler2D uTexture;
  uniform sampler2D uDisplacement;

  void main() {
    vec4 displacement = texture2D(uDisplacement, vUv);
    vec2 displacedUv = vec2(vUv.x, vUv.y);
    displacedUv.y = mix(vUv.y, displacement.r - 0.2, 0.05);

    vec4 texture = texture2D(uTexture, displacedUv);
    gl_FragColor = texture * brightness;
  }
`
