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
  uniform sampler2D uTexture;
  uniform sampler2D uDisplacement;
  uniform float uDisplaceAmount;
  uniform lowp float uShadows;
  uniform lowp float uHighlights;

  const mediump vec3 luminanceWeighting = vec3(0.2125, 0.7154, 0.0721);


  void main() {
    vec4 displacement = texture2D(uDisplacement, vUv);
    vec2 displacedUv = vec2(vUv.x, vUv.y);
    displacedUv.y = mix(vUv.y, displacement.r - 0.2, uDisplaceAmount);

    vec4 texture = texture2D(uTexture, displacedUv);
    mediump float luminance = dot(texture.rgb, luminanceWeighting);
    //(uShadows+1.0) changed to just uShadows:
    mediump float shadow = clamp((pow(luminance, 1.0/uShadows) + (-0.76)*pow(luminance, 2.0/uShadows)) - luminance, 0.0, 1.0);
    mediump float highlight = clamp((1.0 - (pow(1.0-luminance, 1.0/(2.0-uHighlights)) + (-0.8)*pow(1.0-luminance, 2.0/(2.0-uHighlights)))) - luminance, -1.0, 0.0);
    lowp vec3 result = vec3(0.0, 0.0, 0.0) + ((luminance + shadow + highlight) - 0.0) * ((texture.rgb - vec3(0.0, 0.0, 0.0))/(luminance - 0.0));

    // blend toward white if uHighlights is more than 1
    mediump float contrastedLuminance = ((luminance - 0.5) * 1.5) + 0.5;
    mediump float whiteInterp = contrastedLuminance*contrastedLuminance*contrastedLuminance;
    mediump float whiteTarget = clamp(uHighlights, 1.0, 2.0) - 1.0;
    result = mix(result, vec3(1.0), whiteInterp*whiteTarget);

    // blend toward black if uShadows is less than 1
    mediump float invContrastedLuminance = 1.0 - contrastedLuminance;
    mediump float blackInterp = invContrastedLuminance*invContrastedLuminance*invContrastedLuminance;
    mediump float blackTarget = 1.0 - clamp(uShadows, 0.0, 1.0);
    result = mix(result, vec3(0.0), blackInterp*blackTarget);

    gl_FragColor = vec4(result, texture.a);

  }
`
