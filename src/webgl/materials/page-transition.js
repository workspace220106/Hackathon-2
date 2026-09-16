const PAGE_TRANSITION_KEY = "pageTransition";

export function coverScale(s, e, t = 1.08) {
  const n = s / e;
  return .5 * Math.sqrt(n * n + 1) * t
}

const OUTPUT_FRAGMENT_INCLUDE = "#include <output_fragment>";

const BEGIN_VERTEX_INCLUDE = "#include <begin_vertex>";

const pageTransitionUniformsGlsl = `
uniform float uTransition;
uniform vec2 uResolution;
uniform vec2 uViewport;

float getPageTransitionVisibility(vec2 screenUv, float transition, vec2 resolution) {
	vec2 uv = screenUv - 0.5;
	uv.x *= resolution.x / resolution.y;
	float dist = length(uv);
	float overlayStrength = 1.0 - step(transition, dist);
	return 1.0 - overlayStrength;
}
`;

const pageTransitionFragmentGlsl = `
	vec2 pageTransitionScreenUv = gl_FragCoord.xy / uViewport;
	float pageTransitionVisibility = getPageTransitionVisibility(pageTransitionScreenUv, uTransition, uResolution);
	if (pageTransitionVisibility < 0.001) discard;
	outgoingLight *= pageTransitionVisibility;
	diffuseColor.a *= pageTransitionVisibility;
`;

const SHADOW_OUTPUT_LINE = "gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );";

const pageTransitionShadowFragmentGlsl = `
	vec2 pageTransitionScreenUv = gl_FragCoord.xy / uViewport;
	float pageTransitionVisibility = getPageTransitionVisibility(pageTransitionScreenUv, uTransition, uResolution);
	if (pageTransitionVisibility < 0.001) discard;
	gl_FragColor.a *= pageTransitionVisibility;
`;

const pageTransitionShadowRevealGlsl = `
	if (uShadowReveal < 0.001) discard;
	vec2 pageTransitionScreenUv = gl_FragCoord.xy / uViewport;
	float pageTransitionVisibility = getPageTransitionVisibility(pageTransitionScreenUv, uTransition, uResolution);
	if (pageTransitionVisibility < 0.001) discard;
	gl_FragColor.a *= pageTransitionVisibility;
`;

const revealScaleVertexGlsl = `
	transformed *= uRevealScale;
`;

function injectRevealScale(s) {
  s.vertexShader.includes(BEGIN_VERTEX_INCLUDE) && (s.vertexShader.includes("uRevealScale") || (s.vertexShader = `uniform float uRevealScale;
${s.vertexShader}`, s.vertexShader = s.vertexShader.replace(BEGIN_VERTEX_INCLUDE, `${BEGIN_VERTEX_INCLUDE}
${revealScaleVertexGlsl}`)))
}

function injectPageTransitionFragment(s, {
  shadowReveal: e = !1
} = {}) {
  if (s.fragmentShader = `
		${pageTransitionUniformsGlsl}
		${e?`uniform float uShadowReveal;
`:""}
		${s.fragmentShader}
	`, s.fragmentShader.includes(OUTPUT_FRAGMENT_INCLUDE)) {
    s.fragmentShader = s.fragmentShader.replace(OUTPUT_FRAGMENT_INCLUDE, `${pageTransitionFragmentGlsl}${OUTPUT_FRAGMENT_INCLUDE}`);
    return
  }
  if (s.fragmentShader.includes(SHADOW_OUTPUT_LINE)) {
    const t = e ? "gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) * uShadowReveal );" : SHADOW_OUTPUT_LINE,
      n = e ? pageTransitionShadowRevealGlsl : pageTransitionShadowFragmentGlsl;
    s.fragmentShader = s.fragmentShader.replace(SHADOW_OUTPUT_LINE, `${t}${n}`)
  }
}

export function applyPageTransition(s, e, t = {}) {
  var l, u;
  if (!s || (l = s.userData) != null && l.pageTransitionBound) return;
  const {
    beforeCompile: n,
    revealScale: i,
    shadowReveal: r
  } = t, o = s.onBeforeCompile;
  s.userData.pageTransitionBound = !0, s.userData.pageTransitionReveal = !!i, s.userData.pageTransitionShadowReveal = !!r, s.onBeforeCompile = (h, c) => {
    o == null || o(h, c), n == null || n(h, c), h.uniforms.uTransition = e.uTransition, h.uniforms.uResolution = e.uResolution, h.uniforms.uViewport = e.uViewport, injectPageTransitionFragment(h, {
      shadowReveal: !!r
    }), i && (h.uniforms.uRevealScale = i, injectRevealScale(h)), r && (h.uniforms.uShadowReveal = r)
  };
  const a = (u = s.customProgramCacheKey) == null ? void 0 : u.bind(s);
  s.customProgramCacheKey = () => {
    const h = (a == null ? void 0 : a()) ?? s.type,
      c = s.userData.pageTransitionReveal ? "_reveal" : "",
      d = s.userData.pageTransitionShadowReveal ? "_shadowReveal" : "";
    return `${h}_${PAGE_TRANSITION_KEY}${c}${d}`
  }, s.needsUpdate = !0
}

export function applyShadowPageTransition(s, e) {
  s.transparent = !0, s.depthWrite = !1, applyPageTransition(s, e, {
    shadowReveal: e.uShadowReveal
  })
}

const OUTGOING_LIGHT_LINE = "vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;";

export function applyLitPageTransition(s, e, t, n = {}) {
  applyPageTransition(s, e, {
    ...n,
    beforeCompile: i => {
      var r;
      (r = n.beforeCompile) == null || r.call(n, i), i.fragmentShader = i.fragmentShader.replace(OUTGOING_LIGHT_LINE, `${OUTGOING_LIGHT_LINE}
				 outgoingLight *= ${t.toFixed(2)};`)
    }
  })
}

export const FRUIT_SCALE_A = 1.25;

export const FRUIT_SCALE_B = 1.25;

export const FRUIT_A = .05;

export const FRUIT_B = .06;

export const FRUIT_C = .02;
