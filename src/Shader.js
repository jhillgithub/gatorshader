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
  void main() {
    vec4 texture = texture2D(uTexture, vUv);
    gl_FragColor = texture * brightness;
  }
`
