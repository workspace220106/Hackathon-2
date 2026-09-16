import {
  DoubleSide,
  InstancedBufferAttribute,
  InstancedBufferGeometry,
  MathUtils,
  Mesh,
  MeshPhongMaterial,
  PlaneGeometry,
  Vector3
} from 'three';
import {
  app
} from '../../core/App.js';

export class Particles extends Mesh {
  constructor(e) {
    super(), this._params = e, this._attributes = this._setAttributes(), this._geometry = this._createGeometry(), this._material = this._createMaterial(), this._mesh = this._createMesh(), this._shaderUniforms = null
  }
  _setAttributes() {
    const e = new Vector3,
      t = new Float32Array(this._params.particleCount * 3),
      n = new Float32Array(this._params.particleCount * 3),
      i = new Float32Array(this._params.particleCount * 1),
      r = new Float32Array(this._params.particleCount * 1),
      o = new Float32Array(this._params.particleCount * 1),
      a = new Float32Array(this._params.particleCount * 3);
    for (let l = 0; l < this._params.particleCount; l++) t[l * 3 + 0] = MathUtils.randFloatSpread(50), t[l * 3 + 1] = MathUtils.randFloatSpread(50), t[l * 3 + 2] = MathUtils.randFloatSpread(50), e.set(Math.PI * Math.random() * 2, Math.PI * Math.random() * 2, Math.PI * Math.random() * 2), e.normalize(), n[l * 3 + 0] = e.x, n[l * 3 + 1] = e.y, n[l * 3 + 2] = e.z, i[l + 0] = MathUtils.randFloat(.15, 1), r[l + 0] = MathUtils.randFloat(1, 4), o[l + 0] = MathUtils.randFloat(.2, 1), a[l + 0] = Math.random();
    return {
      positions: t,
      rotations: n,
      scale: i,
      speed: r,
      opacity: o,
      random: a
    }
  }
  _createGeometry() {
    const e = new PlaneGeometry,
      t = new InstancedBufferGeometry;
    return t.index = e.index, t.attributes.position = e.attributes.position, t.attributes.normal = e.attributes.normal, t.attributes.uv = e.attributes.uv, t.setAttribute("aPositions", new InstancedBufferAttribute(this._attributes.positions, 3, !1)), t.setAttribute("aRotations", new InstancedBufferAttribute(this._attributes.rotations, 3, !1)), t.setAttribute("aScale", new InstancedBufferAttribute(this._attributes.scale, 1, !1)), t.setAttribute("aSpeed", new InstancedBufferAttribute(this._attributes.speed, 1, !1)), t.setAttribute("aOpacity", new InstancedBufferAttribute(this._attributes.opacity, 1, !1)), t.setAttribute("aRandom", new InstancedBufferAttribute(this._attributes.random, 1, !1)), t
  }
  _createMaterial() {
    const e = app.core.assetsManager.get("aboutTexLeaves"),
      t = new MeshPhongMaterial({
        transparent: !0,
        side: DoubleSide,
        depthWrite: !1
      }),
      n = t;
    return n.uniforms = {
      uTime: {
        value: 0
      },
      uDisplacementSpeed: {
        value: this._params.displacementSpeed
      },
      uDeformationSpeed: {
        value: this._params.deformationSpeed
      },
      uScale: {
        value: this._params.scale
      },
      uRotationSpeed: {
        value: this._params.rotationSpeed
      },
      uArea: {
        value: this._params.area
      },
      uDisplacement: {
        value: this._params.displacement
      },
      uDeformationAmplitude: {
        value: this._params.deformationAmplitude
      },
      uDeformationFrequency: {
        value: this._params.deformationFrequency
      },
      uTexture: {
        value: e
      },
      uColor: {
        value: this._params.color
      },
      uOpacity: {
        value: this._params.opacity
      }
    }, t.onBeforeCompile = i => {
      i.uniforms.uTime = n.uniforms.uTime, i.uniforms.uDisplacementSpeed = n.uniforms.uDisplacementSpeed, i.uniforms.uDeformationSpeed = n.uniforms.uDeformationSpeed, i.uniforms.uScale = n.uniforms.uScale, i.uniforms.uRotationSpeed = n.uniforms.uRotationSpeed, i.uniforms.uArea = n.uniforms.uArea, i.uniforms.uDisplacement = n.uniforms.uDisplacement, i.uniforms.uDeformationAmplitude = n.uniforms.uDeformationAmplitude, i.uniforms.uDeformationFrequency = n.uniforms.uDeformationFrequency, i.uniforms.uTexture = n.uniforms.uTexture, i.uniforms.uColor = n.uniforms.uColor, i.uniforms.uOpacity = n.uniforms.uOpacity, this._shaderUniforms = i.uniforms, i.vertexShader = i.vertexShader.replace("#define PHONG", `
				#define PHONG
				attribute float aScale;
				attribute float aSpeed;
				attribute float aOpacity;
				attribute vec3 aPositions;
				attribute vec3 aRotations;
				attribute float aRandom;

				uniform float uTime;
				uniform float uDisplacementSpeed;
				uniform float uDeformationSpeed;
				uniform float uScale;
				uniform float uRotationSpeed;
				uniform vec3 uArea;
				uniform vec3 uDisplacement;
				uniform vec3 uDeformationAmplitude;
				uniform vec3 uDeformationFrequency;

				varying float vRandomOpacity;
				varying float vFade;
				varying float vRandom;
				varying vec2 vUv;

				mat4 rotate3d(vec3 axis, float angle) {
				axis = normalize(axis);
				float s = sin(angle);
				float c = cos(angle);
				float oc = 1.0 - c;
				return mat4(oc * axis.x * axis.x + c, oc * axis.x * axis.y - axis.z * s, oc * axis.z * axis.x + axis.y * s, 0.0, oc * axis.x * axis.y + axis.z * s, oc * axis.y * axis.y + c, oc * axis.y * axis.z - axis.x * s, 0.0, oc * axis.z * axis.x - axis.y * s, oc * axis.y * axis.z + axis.x * s, oc * axis.z * axis.z + c, 0.0, 0.0, 0.0, 0.0, 1.0);
				}
			`), i.vertexShader = i.vertexShader.replace("#include <beginnormal_vertex>", `
				vec3 objectNormal = vec3( normal );

				mat4 rotationMatrix = rotate3d(aRotations.xyz, uTime * aSpeed * uRotationSpeed) * rotate3d(aRotations.zyx, uTime * aSpeed * uRotationSpeed);

				objectNormal = vec4(rotationMatrix * vec4(objectNormal, 1.0)).xyz;
				
				#ifdef USE_TANGENT
					vec3 objectTangent = vec3( tangent.xyz );
				#endif
			`), i.vertexShader = i.vertexShader.replace("#include <begin_vertex>", `
				vec3 transformed = (position * vec3(uScale)) * aScale;

				float displacementSpeed = uTime * aSpeed * uDisplacementSpeed * 0.001;
				float life = mod(displacementSpeed + aOpacity, 1.0);

				// Rotation
				
				vec4 planeParticle = rotationMatrix * vec4(transformed, 1.);

				// Movement
				vec3 instancedPosition = aPositions;
				instancedPosition.x *= uArea.x;
				instancedPosition.y *= uArea.y;
				instancedPosition.z *= uArea.z;

				instancedPosition.x += (life) * uDisplacement.x;
				instancedPosition.y += (life) * uDisplacement.y;
				instancedPosition.z += (life) * uDisplacement.z;

				// Deformation
				instancedPosition.x += sin(uTime * uDeformationSpeed * aSpeed + instancedPosition.y * uDeformationFrequency.x) * uDeformationAmplitude.x;
				instancedPosition.y += cos(uTime * uDeformationSpeed * aSpeed + instancedPosition.x * uDeformationFrequency.y) * uDeformationAmplitude.y;
				instancedPosition.z += cos(uTime * uDeformationSpeed * aSpeed + instancedPosition.z * uDeformationFrequency.z) * uDeformationAmplitude.z;

				planeParticle += vec4(instancedPosition, 1.0);

				#ifdef USE_ALPHAHASH
					vPosition = vec3( position );
				#endif

				vRandomOpacity = aOpacity;
				vFade = life;
				vUv = uv;
				vRandom = aRandom;
			`), i.vertexShader = i.vertexShader.replace("#include <project_vertex>", `
				 vec4 mvPosition = modelViewMatrix * planeParticle;
		
				gl_Position = projectionMatrix * mvPosition;
			`), i.fragmentShader = i.fragmentShader.replace("#include <common>", `#include <common>
				uniform vec3 uColor;
				uniform float uOpacity;
				uniform sampler2D uTexture;
				varying float vFade;
				varying float vRandomOpacity;
				varying float vRandom;
				varying vec2 vUv;`), i.fragmentShader = i.fragmentShader.replace("#include <color_fragment>", `
					#include <color_fragment>
					vec4 textureColor = texture2D(uTexture, vUv);
					
					float fadeIn = smoothstep(0., 0.035, vFade);
					float fadeOut = 1.0 - smoothstep(0.035, 1.0, vFade);
					float fadeRender = fadeIn * fadeOut;
					
					diffuseColor *= textureColor;
					diffuseColor.a *= fadeRender * uOpacity * vRandomOpacity;
					diffuseColor.rgb *= uColor;
				`)
    }, t
  }
  _createMesh() {
    const e = new Mesh(this._geometry, this._material);
    return this.add(e), e.frustumCulled = !1, e
  }
  render(e, t) {
    const n = this._material;
    n.uniforms && (n.uniforms.uTime.value = e), this._shaderUniforms && (this._shaderUniforms.uTime.value = e)
  }
}
