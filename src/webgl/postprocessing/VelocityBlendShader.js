const velocityBlendFragmentShader = `varying vec2 vUv;
uniform sampler2D tDiffuse;
uniform sampler2D tVelocity;

void main()
{
	vec2 vel = texture2D(tVelocity, vUv).xy;
	vec4 color = texture2D(tDiffuse, vUv);

	color.rgb = mix(color.rgb, vec3(color.rgb * 1.25), length(vel) * 0.75);

	gl_FragColor = vec4(color.rgb, 1.0);
}`;

const velocityBlendVertexShader = `varying vec2 vUv;
void main()
{
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
	vUv = uv;
}`;

export const VelocityBlendShader = {
  uniforms: {
    tDiffuse: {
      value: null
    },
    tVelocity: {
      value: null
    }
  },
  vertexShader: velocityBlendVertexShader,
  fragmentShader: velocityBlendFragmentShader
};
