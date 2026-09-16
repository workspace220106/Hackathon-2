import {
  ShaderMaterial
} from 'three';
import {
  createShaderChunk
} from '../utils/shader-chunk.js';

export const particlesFragmentShaderAlt = `uniform vec3 uColor;

varying float vFade;
varying float vRandomOpacity;
varying float vCameraFade;

void main() {
	float fadeIn = smoothstep(0., 0.035, vFade);
	float fadeOut = 1.0 - smoothstep(0.035, 1.0, vFade);
	float fadeRender = fadeIn * fadeOut;

	vec2 uv = gl_PointCoord;

	float strength = distance(uv, vec2(0.5));
	strength = 1.0 - strength;
	strength = pow(strength, 3.0);

	gl_FragColor.rgb = uColor;
	gl_FragColor.a = strength * fadeRender * vRandomOpacity;
}`;

const particlesFragmentShader = `uniform vec3 uColor;

varying float vFade;
varying float vRandomOpacity;
varying float vCameraFade;

void main() {
	float fadeIn = smoothstep(0., 0.035, vFade);
	float fadeOut = 1.0 - smoothstep(0.035, 1.0, vFade);
	float fadeRender = fadeIn * fadeOut;

	vec2 uv = gl_PointCoord;

	float strength = distance(uv, vec2(0.5));
	strength = 1.0 - strength;
	strength = pow(strength, 3.0);

	gl_FragColor.rgb = uColor;
	gl_FragColor.a = strength * fadeRender * vRandomOpacity;
}`;

const particlesFragmentChunk = createShaderChunk(particlesFragmentShader, "fragmentShader");

const particlesVertexShader = `attribute float aScale;
attribute float aSpeed;
attribute float aOpacity;
attribute vec3 aPositions;

uniform float uTime;
uniform float uDisplacementSpeed;
uniform float uDeformationSpeed;
uniform float uScale;
uniform vec3 uArea;
uniform vec3 uDisplacement;
uniform vec3 uDeformationAmplitude;
uniform vec3 uDeformationFrequency;

varying float vRandomOpacity;
varying float vFade;
varying float vCameraFade;

void main() {
  float displacementSpeed = uTime * aSpeed * uDisplacementSpeed * 0.001;
  float life = mod(displacementSpeed + aOpacity, 1.0);

  vec3 particlePosition = position;

  particlePosition.x *= uArea.x;
  particlePosition.y *= uArea.y;
  particlePosition.z *= uArea.z;

  particlePosition.x += (life) * uDisplacement.x;
  particlePosition.y += (life) * uDisplacement.y;
  particlePosition.z += (life) * uDisplacement.z;

  particlePosition.x += sin(uTime * uDeformationSpeed * aSpeed + particlePosition.y * uDeformationFrequency.x) * uDeformationAmplitude.x;
  particlePosition.y += cos(uTime * uDeformationSpeed * aSpeed + particlePosition.x * uDeformationFrequency.y) * uDeformationAmplitude.y;
  particlePosition.z += cos(uTime * uDeformationSpeed * aSpeed + particlePosition.z * uDeformationFrequency.z) * uDeformationAmplitude.z;

  vec4 mv = modelViewMatrix * vec4(particlePosition, 1.0);
  gl_Position = projectionMatrix * mv;

  vRandomOpacity = aOpacity;
  vFade = life;
  vCameraFade = 1.0 - smoothstep(0.45, 0.55, min(10., (10. / length(mv.xyz))));

  gl_PointSize = 10.0 * aScale * uScale;
}`;

const particlesVertexChunk = createShaderChunk(particlesVertexShader, "vertexShader");

export class ParticlesMaterial extends ShaderMaterial {
  constructor(e = {}) {
    super(e), particlesFragmentChunk.use(this), particlesVertexChunk.use(this)
  }
}
