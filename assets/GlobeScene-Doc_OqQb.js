import{r as e}from"./rolldown-runtime-hePW80VL.js";import{i as t,t as n}from"./vendor-react-CaQEq8OT.js";import{F as r,M as i,_ as a,b as o,m as s,v as c,w as l}from"./config-DnxUhk9L.js";import{a as u,c as d,d as ee,et as te,gt as ne,i as f,l as p,lt as m,o as re,s as h,u as ie,ut as g}from"./index-QITTcNB2.js";import{$ as _,C as v,G as ae,I as y,K as b,L as oe,N as x,Q as S,R as C,Z as w,a as T,ct as E,dt as D,f as O,i as k,it as A,k as j,m as M,n as se,r as N,st as ce,t as P,v as F,y as I}from"./vendor-3d-DWdRWYhm.js";var L=e(t(),1),R=Math.PI/180,le=3.4,z=21.6,B=s.map(e=>e.code);function V(e){return B.indexOf(e)}function H(e,t,n=1,r=new D){let i=e*R,a=t*R;return r.set(Math.cos(i)*Math.sin(a)*n,Math.sin(i)*n,Math.cos(i)*Math.cos(a)*n)}function U(e){return((1080-s[V(e)].utcOffsetMin)%1440+1440)%1440}var ue=new j(0,0,0,`XYZ`);function de(e,t,n=new _){return ue.set(e*R,-t*R,0,`XYZ`),n.setFromEuler(ue)}function fe(e,t){return Math.sin(Math.PI*t)*(.06+.22*e/Math.PI)}function pe(e,t,n,r=new D){let i=Math.min(1,Math.max(-1,e.dot(t))),a=Math.acos(i);if(a<1e-5)r.copy(e);else{let i=Math.sin(a),o=Math.sin((1-n)*a)/i,s=Math.sin(n*a)/i;r.set(e.x*o+t.x*s,e.y*o+t.y*s,e.z*o+t.z*s)}return r.multiplyScalar(1+fe(a,n))}var W=`
#define PI 3.141592653589793
vec3 slerpN(vec3 a, vec3 b, float t) {
  float d = clamp(dot(a, b), -1.0, 1.0);
  float ang = acos(d);
  if (ang < 1e-4) return a;
  float s = sin(ang);
  return (sin((1.0 - t) * ang) * a + sin(t * ang) * b) / s;
}
vec3 arcPos(vec3 a, vec3 b, float t) {
  float ang = acos(clamp(dot(a, b), -1.0, 1.0));
  return slerpN(a, b, t) * (1.0 + sin(PI * t) * (0.06 + 0.22 * ang / PI));
}
// signed story minutes since a daily event at minute-of-day m (−720..720)
float sinceDaily(float clock, float m) {
  return mod(clock - m + 720.0, 1440.0) - 720.0;
}
`,me=`
attribute float aHubDist;
attribute float aHubIdx;
uniform float uDotPx;
uniform float uDpr;
uniform float uRefDist;
uniform float uViewScale;
uniform float uReveal;
uniform vec3 uRevealCentre;
uniform float uCov;
uniform float uCovR;
uniform float uCovSame;
uniform float uCovNextW;
uniform float uWave;
uniform float uNight;
uniform vec3 uSun;
uniform float uFocus;
uniform float uFocusW;
uniform float uOpacity;
uniform vec3 uColPaper;
uniform vec3 uColSignal;
uniform vec3 uColFilament;
varying vec3 vColor;
varying float vAlpha;
void main() {
  vec3 n = normalize(position);
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  float ndv = dot(normalize(normalMatrix * n), normalize(-mv.xyz));
  if (ndv <= 0.0) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); gl_PointSize = 0.0; vAlpha = 0.0; vColor = vec3(0.0); return; }
  gl_Position = projectionMatrix * mv;

  float limb = smoothstep(0.0, 0.35, ndv);
  float ang = acos(clamp(dot(n, uRevealCentre), -1.0, 1.0));
  float reveal = smoothstep(uReveal, uReveal - 0.05, ang);
  // the reveal front ignites (Filament) while it travels outward from DXB
  float front = (1.0 - smoothstep(0.0, 0.07, abs(ang - uReveal + 0.03))) * step(uReveal, 3.1);

  // coverage: every covered dot turns Signal; the same-day core burns at full, the next-day ring at uCovNextW
  float rs = min(uCovR, uCovSame);
  float covS = smoothstep(rs, rs - 120.0, aHubDist) * uCov;
  float covN = smoothstep(uCovR, uCovR - 120.0, aHubDist) * uCov;
  float k = max(covS, covN * uCovNextW);
  float covered = max(covS, covN);
  float wave = uWave * uCov * (1.0 - smoothstep(0.0, 60.0, abs(aHubDist - uCovR))) * step(1.0, uCovR);
  // focused hub: its own footprint
  float mine = (abs(aHubIdx - uFocus) < 0.5 ? 1.0 : 0.0) * uFocusW;
  float fS = mine * smoothstep(500.0, 380.0, aHubDist);
  float fN = mine * smoothstep(1500.0, 1380.0, aHubDist);
  k = max(k, max(fS, fN * 0.5));
  covered = max(covered, fN);

  // night
  float sd = dot(n, uSun);
  float day = smoothstep(-0.05, 0.05, sd);
  float lum = mix(1.0, mix(0.5, 1.0, day), uNight);
  float dawn = uNight * (1.0 - smoothstep(0.012, 0.035, abs(sd)));

  vec3 col = uColPaper * lum;
  float a = 0.42 * mix(0.85, 1.0, day * uNight + (1.0 - uNight));
  col = mix(col, uColSignal * mix(0.5, 1.15, k), covered);
  a = mix(a, mix(0.55, 1.0, k), covered);
  col = mix(col, mix(uColSignal, uColFilament, 0.65) * 1.5, wave);
  a = mix(a, 1.0, wave);
  col = mix(col, uColSignal * 1.6, dawn * 0.9);
  a = mix(a, 0.95, dawn);
  col = mix(col, mix(uColSignal, uColFilament, 0.7) * 1.4, front * 0.85);
  a = mix(a, 1.0, front);

  vColor = col;
  vAlpha = a * limb * reveal * uOpacity;
  float size = uDotPx * uDpr * uViewScale * (uRefDist / -mv.z);
  gl_PointSize = size * (1.0 + 0.4 * k * covered + 0.3 * wave + 0.2 * dawn + 0.3 * front);
}
`,he=`
varying vec3 vColor;
varying float vAlpha;
void main() {
  float r = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.35, r) * vAlpha;
  if (a < 0.004) discard;
  gl_FragColor = vec4(vColor, a);
}
`,ge=`
varying vec3 vN;
varying vec3 vV;
varying vec3 vObjN;
void main() {
  vObjN = normalize(position);
  vN = normalize(normalMatrix * normal);
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vV = -mv.xyz;
  gl_Position = projectionMatrix * mv;
}
`,_e=`
uniform vec3 uColOcean;
uniform vec3 uColOceanDay;
uniform vec3 uColRim;
uniform vec3 uColSignal;
uniform vec3 uColVoid;
uniform float uNight;
uniform vec3 uSun;
uniform float uOpacity;
varying vec3 vN;
varying vec3 vV;
varying vec3 vObjN;
void main() {
  float ndv = clamp(dot(normalize(vN), normalize(vV)), 0.0, 1.0);
  float sd = dot(normalize(vObjN), uSun);
  float day = smoothstep(-0.08, 0.12, sd);
  vec3 base = mix(uColOcean, mix(uColOcean, uColOceanDay, day), uNight);
  vec3 col = base + uColRim * pow(1.0 - ndv, 3.2) * 0.6;
  // the terminator also crosses the oceans, faintly (it moves → it may carry the signal colour)
  float term = uNight * (1.0 - smoothstep(0.0, 0.012, abs(sd))) * smoothstep(0.05, 0.4, ndv);
  col += uColSignal * term * 0.07;
  gl_FragColor = vec4(mix(uColVoid, col, uOpacity), 1.0);
}
`,ve=`
varying vec3 vWorld;
varying vec3 vCentre;
varying float vScale;
void main() {
  vec4 w = modelMatrix * vec4(position, 1.0);
  vWorld = w.xyz;
  vCentre = (modelMatrix * vec4(0.0, 0.0, 0.0, 1.0)).xyz;
  vScale = length(modelMatrix[0].xyz);
  gl_Position = projectionMatrix * viewMatrix * w;
}
`,ye=`
uniform vec3 uColRim;
uniform float uOpacity;
varying vec3 vWorld;
varying vec3 vCentre;
varying float vScale;
void main() {
  vec3 rd = normalize(vWorld - cameraPosition);
  vec3 oc = vCentre - cameraPosition;
  float b = length(oc - rd * dot(oc, rd)) / vScale;
  float x = (b - 1.0) / 0.08;
  if (x < 0.0) discard;
  float g = pow(1.0 - clamp(x, 0.0, 1.0), 2.4);
  gl_FragColor = vec4(uColRim * g * 0.22 * 2.2 * uOpacity, 1.0);
}
`,be=`
${W}
attribute float aT;
attribute float aSide;
attribute vec3 aA;
attribute vec3 aB;
attribute vec4 aInfo;   // kind (0 backbone, 1 ORD, 2 pair), seed, fire minute A (−1 none), fire minute B
attribute vec2 aEnds;   // hub indices
uniform float uRouteW;
uniform float uWidthScale;
uniform float uFocus;
uniform float uFocusW;
varying float vT;
varying float vSide;
varying vec4 vInfo;
varying float vAng;
varying float vHi;
void main() {
  float ang = acos(clamp(dot(aA, aB), -1.0, 1.0));
  float t0 = clamp(aT, 0.0, 1.0);
  vec3 p = arcPos(aA, aB, t0);
  float e = 0.004;
  vec3 pa = arcPos(aA, aB, max(t0 - e, 0.0));
  vec3 pb = arcPos(aA, aB, min(t0 + e, 1.0));
  vec3 wp = (modelMatrix * vec4(p, 1.0)).xyz;
  vec3 tang = normalize((modelMatrix * vec4(pb - pa, 0.0)).xyz + vec3(1e-7));
  vec3 toCam = normalize(cameraPosition - wp);
  vec3 side = normalize(cross(tang, toCam) + vec3(1e-7));
  float hi = (abs(aEnds.x - uFocus) < 0.5 || abs(aEnds.y - uFocus) < 0.5) ? 1.0 : 0.0;
  float kindW = aInfo.x > 0.5 ? 2.0 : 1.0; // ORD and the A → B pair are drawn 2× wide
  float w = uRouteW * uWidthScale * kindW * mix(1.0, 2.0, hi * uFocusW);
  wp += side * aSide * w * 0.5;
  gl_Position = projectionMatrix * viewMatrix * vec4(wp, 1.0);
  vT = t0;
  vSide = aSide;
  vInfo = aInfo;
  vAng = ang;
  vHi = hi;
}
`,xe=`
uniform float uRoutes;
uniform float uOrd;
uniform float uOrdVis;
uniform float uFocusW;
uniform float uPairT;
uniform float uOpacity;
uniform vec3 uColAsh;
uniform vec3 uColPaper;
uniform vec3 uColSignal;
varying float vT;
varying float vSide;
varying vec4 vInfo;
varying float vAng;
varying float vHi;
void main() {
  float kind = vInfo.x;
  float edge = 1.0 - smoothstep(0.45, 1.0, abs(vSide));
  float dash = step(0.45, fract(vT * vAng * 46.0));
  vec3 col;
  float a;
  if (kind < 0.5) {
    float f = uFocusW * vHi;
    col = mix(uColAsh, uColPaper, f);
    a = mix(0.25, 0.6, f) * mix(1.0, 0.35, uFocusW * (1.0 - vHi)) * uRoutes;
  } else if (kind < 1.5) {
    // ORD-48213: planned = dashed Paper; flown part = a solid Signal trace (only what moves leaves light)
    float flown = uOrd >= 1.0 ? 1.0 : (uOrd > 0.0 ? step(vT, uOrd) : 0.0);
    col = mix(uColPaper, uColSignal, flown);
    a = mix(0.42 * dash, 0.9, flown) * uOrdVis;
  } else {
    float drawn = step(vT, clamp(uPairT, 0.0, 1.0));
    col = uColPaper;
    a = 0.7 * drawn * step(0.0001, uPairT);
  }
  a *= edge * uOpacity;
  if (a < 0.004) discard;
  gl_FragColor = vec4(col, a);
}
`,Se=`
uniform float uTime;
uniform float uClock;
uniform float uLive;
uniform float uFires;
uniform float uOrd;
uniform float uOrdVis;
uniform float uPairT;
uniform float uFocusW;
uniform float uOpacity;
uniform vec3 uColSignal;
uniform vec3 uColFilament;
varying float vT;
varying float vSide;
varying vec4 vInfo;
varying float vAng;
varying float vHi;
float sinceDaily(float clock, float m) { return mod(clock - m + 720.0, 1440.0) - 720.0; }
// comet with head at h (route t units) and tail length L: returns (intensity, headness)
vec2 comet(float t, float h, float L) {
  float s = (t - (h - L)) / L;
  if (s < 0.0 || s > 1.0) return vec2(0.0);
  return vec2(s * s, smoothstep(0.8, 1.0, s));
}
void main() {
  float kind = vInfo.x;
  float edge = 1.0 - smoothstep(0.0, 1.0, abs(vSide));
  edge *= edge;
  vec2 c = vec2(0.0);
  if (kind < 0.5) {
    float dim = mix(1.0, 0.35, uFocusW * (1.0 - vHi));
    float speed = 0.22 / max(vAng, 0.12);
    for (int k = 0; k < 2; k++) {
      float h = fract(vInfo.y + float(k) * 0.5 + uTime * speed) * 1.14;
      c = max(c, comet(vT, h, 0.12) * uLive * dim);
    }
    if (vInfo.z >= 0.0) {
      float h = sinceDaily(uClock, vInfo.z) / ${130 .toFixed(1)} * 1.14;
      if (h > 0.0) c = max(c, comet(vT, h, 0.14) * uFires);
    }
    if (vInfo.w >= 0.0) {
      float h = sinceDaily(uClock, vInfo.w) / ${130 .toFixed(1)} * 1.14;
      if (h > 0.0) c = max(c, comet(1.0 - vT, h, 0.14) * uFires);
    }
  } else if (kind < 1.5) {
    if (uOrd > 0.0 && uOrd < 1.06) c = comet(vT, uOrd, 0.18) * 1.5 * uOrdVis * (1.0 - smoothstep(1.0, 1.06, uOrd));
  } else {
    float h = uPairT - 1.0;
    if (h > 0.0 && h < 1.14) c = comet(vT, h * 1.14, 0.16) * 1.3;
  }
  float I = c.x * edge * uOpacity;
  if (I < 0.003) discard;
  vec3 col = mix(uColSignal * 1.4, uColFilament * 2.4, c.y);
  gl_FragColor = vec4(col * I, I);
}
`,Ce=`
attribute float aIdx;
attribute float aFire;
attribute float aPop;
uniform float uHubPx;
uniform float uViewH;
uniform float uHubPop;
uniform float uClock;
uniform float uFocus;
uniform float uFocusW;
uniform float uPairB;
varying vec2 vPx;
varying float vR;
varying float vFire;
varying float vDim;
varying float vIdx;
varying float vVis;
float sinceDaily(float clock, float m) { return mod(clock - m + 720.0, 1440.0) - 720.0; }
float easeClack(float x) { float c1 = 0.55; float y = x - 1.0; return 1.0 + (c1 + 1.0) * y * y * y + c1 * y * y; }
void main() {
  vec4 cw = modelMatrix * instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0);
  vec4 cv = viewMatrix * cw;
  float pxW = -cv.z * 2.0 / (projectionMatrix[1][1] * uViewH);   // world units per CSS px at this depth
  float dt = sinceDaily(uClock, aFire);
  float fire = 1.0 - smoothstep(0.0, ${z.toFixed(1)}, abs(dt));
  float pop = aPop < 0.0 ? 1.0 : easeClack(clamp((uHubPop - aPop) / 0.45, 0.0, 1.0));
  float isF = (abs(aIdx - uFocus) < 0.5 || abs(aIdx - uPairB) < 0.5) ? 1.0 : 0.0;
  float R = uHubPx * mix(1.0, 2.2, fire) * mix(1.0, 1.35, isF * uFocusW);
  float extent = R * 3.6 + 10.0;                                // quad half-size: core + glow + pulse ring
  vec3 local = vec3(position.xy * extent * pxW * pop, 0.0);
  vec4 wp = modelMatrix * instanceMatrix * vec4(local, 1.0);
  gl_Position = projectionMatrix * viewMatrix * wp;
  vPx = position.xy * extent;
  vR = R;
  vFire = fire;
  vDim = mix(1.0, 0.35, uFocusW * (1.0 - isF));
  vIdx = aIdx;
  vVis = step(0.001, pop);
  // fade hubs on the far limb (the ocean depth hides the far side)
  vec3 centre = (modelMatrix * vec4(0.0, 0.0, 0.0, 1.0)).xyz;
  vec3 nrm = normalize(cw.xyz - centre);
  vVis *= smoothstep(0.0, 0.18, dot(nrm, normalize(cameraPosition - cw.xyz)));
}
`,we=`
uniform float uTime;
uniform float uOpacity;
uniform vec3 uColSignal;
uniform vec3 uColFilament;
varying vec2 vPx;
varying float vR;
varying float vFire;
varying float vDim;
varying float vIdx;
varying float vVis;
void main() {
  float r = length(vPx);
  float ext = vR * 3.6 + 10.0;
  float core = 1.0 - smoothstep(vR - 0.8, vR + 0.6, r);
  // DotCut halo: 4 px ring at 18 % + an 18 px glow at 45 % (the match-cut dot IS the DXB hub)
  float ring = (1.0 - smoothstep(vR + 3.2, vR + 4.4, r)) * 0.18;
  float glow = exp(-max(r - vR, 0.0) / (vR * 0.55 + 1.6)) * 0.4 * (1.0 - smoothstep(ext * 0.5, ext, r));
  float f = fract(0.4 * uTime + 0.13 * vIdx);
  float pr = vR * (1.0 + 2.5 * f);
  float pulse = (1.0 - smoothstep(0.0, 1.1, abs(r - pr))) * (1.0 - f) * 0.7;
  float halo = max(ring, glow) * (1.0 - core);
  float a = clamp(core + halo + pulse * (1.0 - core), 0.0, 1.0);
  vec3 col = mix(uColSignal * 1.5, uColFilament * 2.2, vFire * core);
  float alpha = a * vVis * vDim * uOpacity;
  if (alpha < 0.004) discard;
  gl_FragColor = vec4(col, alpha);
}
`,Te=`
attribute float aH;
attribute float aIdx;
uniform float uViewH;
varying float vY;
varying float vIdx;
varying float vSide;
void main() {
  vec4 cw = modelMatrix * instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0);
  vec3 centre = (modelMatrix * vec4(0.0, 0.0, 0.0, 1.0)).xyz;
  vec3 axis = normalize(cw.xyz - centre);
  vec3 toCam = normalize(cameraPosition - cw.xyz);
  vec3 side = normalize(cross(axis, toCam) + vec3(1e-5));
  vec4 cv = viewMatrix * cw;
  float pxW = -cv.z * 2.0 / (projectionMatrix[1][1] * uViewH);
  float scale = length(modelMatrix[0].xyz);
  vec3 wp = cw.xyz + axis * position.y * aH * scale + side * position.x * 2.2 * pxW;
  gl_Position = projectionMatrix * viewMatrix * vec4(wp, 1.0);
  vY = position.y;
  vIdx = aIdx;
  vSide = position.x * 2.0;
}
`,Ee=`
uniform float uLive;
uniform float uTime;
uniform float uOpacity;
uniform float uFocusW;
uniform float uFocus;
uniform vec3 uColSignal;
varying float vY;
varying float vIdx;
varying float vSide;
void main() {
  if (uLive <= 0.001) discard;
  float pulse = 0.72 + 0.28 * sin(uTime * 1.3 + vIdx * 1.7);
  float dim = mix(1.0, 0.35, uFocusW * (abs(vIdx - uFocus) < 0.5 ? 0.0 : 1.0));
  float a = pow(clamp(1.0 - vY, 0.0, 1.0), 1.6) * (1.0 - smoothstep(0.3, 1.0, abs(vSide))) * uLive * pulse * dim * uOpacity * 0.85;
  if (a < 0.003) discard;
  gl_FragColor = vec4(uColSignal * 1.3 * a, a);
}
`,De=`
uniform float uViewH;
uniform float uHubPx;
uniform float uDeliver;
varying vec2 vPx;
varying float vRad;
void main() {
  vec4 cw = modelMatrix * vec4(0.0, 0.0, 0.0, 1.0);
  vec4 cv = viewMatrix * cw;
  float pxW = -cv.z * 2.0 / (projectionMatrix[1][1] * uViewH);
  float rad = uHubPx * (1.4 + 9.0 * uDeliver);
  float extent = max(rad, uHubPx * 3.4) + 6.0;
  vec4 wp = modelMatrix * vec4(position.xy * extent * pxW, 0.0, 1.0);
  gl_Position = projectionMatrix * viewMatrix * wp;
  vPx = position.xy * extent;
  vRad = rad;
}
`,Oe=`
uniform float uDeliver;
uniform float uOpacity;
uniform float uHubPx;
uniform vec3 uColFilament;
uniform vec3 uColSignal;
varying vec2 vPx;
varying float vRad;
void main() {
  if (uDeliver <= 0.0) discard;
  float r = length(vPx);
  float d = uDeliver;
  // the shockwave (expands and fades) + the delivered marker ring that stays
  float shock = (1.0 - smoothstep(0.0, 1.6, abs(r - vRad))) * pow(1.0 - d, 1.4);
  float mr = uHubPx * (1.6 + 1.6 * d);
  float marker = (1.0 - smoothstep(0.0, 1.1, abs(r - mr))) * smoothstep(0.0, 0.25, d) * 0.85;
  float a = max(shock, marker) * smoothstep(0.0, 0.03, d) * uOpacity;
  if (a < 0.004) discard;
  vec3 col = mix(uColFilament * 2.0, uColSignal * 1.5, 0.4 + 0.6 * d);
  gl_FragColor = vec4(col * a, a);
}
`,ke=48,G=o.length+2;function K(e){return new v(e)}function Ae(e){let t=2166136261;for(let n=0;n<e.length;n++)t^=e.charCodeAt(n),t=Math.imul(t,16777619);return(t>>>0)/4294967296}function je(e){return{uTime:{value:12},uClock:{value:880},uDotPx:{value:e.dotPx},uDpr:{value:e.dpr},uRefDist:{value:le},uViewScale:{value:1},uViewH:{value:900},uHubPx:{value:3.6},uOpacity:{value:1},uReveal:{value:Math.PI+.1},uRevealCentre:{value:H(s[0].lat,s[0].lon)},uCov:{value:0},uCovR:{value:0},uCovSame:{value:500},uCovNextW:{value:1},uWave:{value:0},uNight:{value:0},uSun:{value:new D(0,0,1)},uRoutes:{value:0},uLive:{value:0},uFires:{value:0},uOrd:{value:-1},uOrdVis:{value:0},uDeliver:{value:0},uHubPop:{value:1},uFocus:{value:-1},uFocusW:{value:0},uPairA:{value:-1},uPairB:{value:-1},uPairT:{value:0},uRouteW:{value:.0025},uColPaper:{value:K(c.paper)},uColSignal:{value:K(c.signal)},uColFilament:{value:K(c.filament)},uColAsh:{value:K(c.ash)},uColOcean:{value:K(`#07080A`)},uColOceanDay:{value:K(`#0B0D11`)},uColRim:{value:K(`#2B3644`)},uColVoid:{value:K(c.void)}}}function q(e,t,n={}){let r={...n};for(let n of t)r[n]=e[n];return r}function Me(e,t,n){let r=new Float32Array(t),i=new Float32Array(t),a=n.map(e=>e.x),o=n.map(e=>e.y),s=n.map(e=>e.z);for(let n=0;n<t;n++){let t=e[n*3],c=e[n*3+1],l=e[n*3+2],u=-2,d=0;for(let e=0;e<a.length;e++){let n=t*a[e]+c*o[e]+l*s[e];n>u&&(u=n,d=e)}r[n]=Math.acos(Math.min(1,Math.max(-1,u)))*6371,i[n]=d}return{dist:r,idx:i}}function J(e){let t=je(e),n=new x;n.name=`trace-globe`,n.rotation.order=`XYZ`;let r=s.map(e=>H(e.lat,e.lon)),i=r[V(`DXB`)],c=new E(.995,96,64),l=new A({vertexShader:ge,fragmentShader:_e,uniforms:q(t,[`uColOcean`,`uColOceanDay`,`uColRim`,`uColSignal`,`uColVoid`,`uNight`,`uSun`,`uOpacity`])}),u=new b(c,l);u.name=`ocean`,u.renderOrder=0,n.add(u);let d=new E(1.08,64,48),ee=new A({vertexShader:ve,fragmentShader:ye,uniforms:q(t,[`uColRim`,`uOpacity`]),side:1,transparent:!0,depthWrite:!1,blending:2}),te=new b(d,ee);te.name=`halo`,te.renderOrder=1,n.add(te);let ne=e.dots.length,f=new Float32Array(ne*3),p=new D;for(let t=0;t<ne;t++){let[n,r]=e.dots[t];H(n,r,1,p),f[t*3]=p.x,f[t*3+1]=p.y,f[t*3+2]=p.z}let{dist:m,idx:re}=Me(f,ne,r),h=new I;h.setAttribute(`position`,new F(f,3)),h.setAttribute(`aHubDist`,new F(m,1)),h.setAttribute(`aHubIdx`,new F(re,1)),h.boundingSphere=new ce(new D,1.01);let ie=new A({vertexShader:me,fragmentShader:he,uniforms:q(t,[`uDotPx`,`uDpr`,`uRefDist`,`uViewScale`,`uReveal`,`uRevealCentre`,`uCov`,`uCovR`,`uCovSame`,`uCovNextW`,`uWave`,`uNight`,`uSun`,`uFocus`,`uFocusW`,`uOpacity`,`uColPaper`,`uColSignal`,`uColFilament`]),transparent:!0,depthWrite:!1}),g=new S(h,ie);g.name=`land`,g.renderOrder=2,n.add(g);let v=new Float32Array(98),T=new Float32Array(98);for(let e=0;e<=ke;e++)v[e*2]=v[e*2+1]=e/ke,T[e*2]=-1,T[e*2+1]=1;let O=[];for(let e=0;e<ke;e++){let t=e*2;O.push(t,t+1,t+2,t+1,t+3,t+2)}let k=new oe;k.setIndex(O),k.setAttribute(`position`,new F(new Float32Array(294),3)),k.setAttribute(`aT`,new F(v,1)),k.setAttribute(`aSide`,new F(T,1));let j=new Float32Array(G*3),M=new Float32Array(G*3),se=new Float32Array(G*4),N=new Float32Array(G*2),P=(e,t,n,r,i,a,o,s,c)=>{j.set([t.x,t.y,t.z],e*3),M.set([n.x,n.y,n.z],e*3),se.set([r,i,a,o],e*4),N.set([s,c],e*2)};o.forEach(([e,t],n)=>{let i=V(e),a=V(t);P(n,r[i],r[a],0,Ae(`route:${e}-${t}`),U(e),U(t),i,a)});let L=V(a.origin),R=V(a.destination),le=o.length,z=o.length+1;P(le,r[L],r[R],1,.5,-1,-1,L,R),P(z,r[0],r[1],2,.5,-1,-1,-1,-1);let B=new y(j,3),ue=new y(M,3);k.setAttribute(`aA`,B),k.setAttribute(`aB`,ue),k.setAttribute(`aInfo`,new y(se,4)),k.setAttribute(`aEnds`,new y(N,2)),k.instanceCount=G;let de=[`uRouteW`,`uFocus`,`uFocusW`],fe=new A({vertexShader:be,fragmentShader:xe,uniforms:q(t,[...de,`uRoutes`,`uOrd`,`uOrdVis`,`uPairT`,`uOpacity`,`uColAsh`,`uColPaper`,`uColSignal`],{uWidthScale:{value:1}}),transparent:!0,depthWrite:!1}),W=new b(k,fe);W.name=`routes`,W.frustumCulled=!1,W.renderOrder=3,n.add(W);let K=new A({vertexShader:be,fragmentShader:Se,uniforms:q(t,[...de,`uTime`,`uClock`,`uLive`,`uFires`,`uOrd`,`uOrdVis`,`uPairT`,`uOpacity`,`uColSignal`,`uColFilament`],{uWidthScale:{value:3.2}}),transparent:!0,depthWrite:!1,blending:2}),J=new b(k,K);J.name=`comets`,J.frustumCulled=!1,J.renderOrder=4,n.add(J);let Y=new w(1,1);Y.translate(0,.5,0);let Ne=new Float32Array(s.length),Pe=new Float32Array(s.length);s.forEach((e,t)=>{Ne[t]=.04+.12*e.share/.15,Pe[t]=t}),Y.setAttribute(`aH`,new y(Ne,1)),Y.setAttribute(`aIdx`,new y(Pe,1));let Fe=new A({vertexShader:Te,fragmentShader:Ee,uniforms:q(t,[`uViewH`,`uLive`,`uTime`,`uOpacity`,`uFocus`,`uFocusW`,`uColSignal`]),transparent:!0,depthWrite:!1,blending:2}),X=new C(Y,Fe,s.length);X.name=`pillars`,X.frustumCulled=!1,X.renderOrder=5;let Z=new w(2,2),Ie=new Float32Array(s.length),Le=new Float32Array(s.length),Re=new Float32Array(s.length);s.forEach((e,t)=>{Ie[t]=t,Le[t]=U(e.code);let n=Math.acos(Math.min(1,Math.max(-1,r[t].dot(i))));Re[t]=e.code===`DXB`?-1:n/Math.PI*.55}),Z.setAttribute(`aIdx`,new y(Ie,1)),Z.setAttribute(`aFire`,new y(Le,1)),Z.setAttribute(`aPop`,new y(Re,1));let ze=new A({vertexShader:Ce,fragmentShader:we,uniforms:q(t,[`uHubPx`,`uViewH`,`uHubPop`,`uClock`,`uFocus`,`uFocusW`,`uPairB`,`uTime`,`uOpacity`,`uColSignal`,`uColFilament`]),transparent:!0,depthWrite:!1}),Q=new C(Z,ze,s.length);Q.name=`hubs`,Q.frustumCulled=!1,Q.renderOrder=6;let Be=new ae,Ve=new _,He=new D(0,0,1),Ue=new D(1,1,1);r.forEach((e,t)=>{Ve.setFromUnitVectors(He,e),Be.compose(e.clone().multiplyScalar(1.003),Ve,Ue),Q.setMatrixAt(t,Be),Be.compose(e.clone().multiplyScalar(1.001),Ve,Ue),X.setMatrixAt(t,Be)}),Q.instanceMatrix.needsUpdate=!0,X.instanceMatrix.needsUpdate=!0,n.add(X),n.add(Q);let We=new w(2,2),Ge=new A({vertexShader:De,fragmentShader:Oe,uniforms:q(t,[`uViewH`,`uHubPx`,`uDeliver`,`uOpacity`,`uColFilament`,`uColSignal`]),transparent:!0,depthWrite:!1,blending:2}),$=new b(We,Ge);$.name=`delivery-ring`,$.frustumCulled=!1,$.renderOrder=7;{let e=r[R];$.position.copy(e).multiplyScalar(1.004),$.quaternion.setFromUnitVectors(He,e)}n.add($);let Ke=r[L],qe=r[R];return{group:n,uniforms:t,hubs:Q,hubPositions:r,setFocus(e){e&&(t.uFocus.value=V(e))},setPair(e,n){if(!e||!n){t.uPairT.value=0,t.uPairA.value=-1,t.uPairB.value=-1;return}let i=V(e),a=V(n);t.uPairA.value=i,t.uPairB.value=a;let o=r[i],s=r[a];j.set([o.x,o.y,o.z],z*3),M.set([s.x,s.y,s.z],z*3),B.needsUpdate=!0,ue.needsUpdate=!0},ordPoint(e,t){return pe(Ke,qe,Math.min(1,Math.max(0,e)),t)},dispose(){for(let e of[c,d,h,k,Y,Z,We])e.dispose();for(let e of[l,ee,ie,fe,K,Fe,ze,Ge])e.dispose();Q.dispose(),X.dispose()}}}var Y=n(),Ne=null;function Pe(){if(!Ne){let e=m().globeDots,t=`./geo/land-dots-${e}.json`;Ne=g(fetch(t).then(e=>{if(!e.ok)throw Error(`[reach] ${t} → ${e.status}`);return e.json()}),1,`geo:land-dots-${e}`)}return Ne}var Fe=e=>{let t=e<0?0:e>1?1:e;return t*t*(3-2*t)},X=r(`trace`),Z=r(`arrive`),Ie=[`cov`,`routes`,`live`],Le=16,Re=12,ze=56,Q=8;function Be({progress:e,store:t}){let n=(0,L.use)(Pe()),r=M(e=>e.gl),a=M(e=>e.camera),o=(0,L.useMemo)(()=>J({dots:n,dotPx:2.2,dpr:r.getPixelRatio()}),[n,r]);(0,L.useEffect)(()=>()=>o.dispose(),[o]),(0,L.useEffect)(()=>()=>{a.clearViewOffset()},[a]);let g=(0,L.useMemo)(d,[]),v=(0,L.useMemo)(()=>s.map(e=>U(e.code)),[]),ae=(0,L.useMemo)(()=>s.map((e,t)=>t).sort((e,t)=>s[t].share-s[e].share),[]),y=(0,L.useMemo)(()=>[],[]),b=(0,L.useMemo)(()=>new Float32Array(s.length),[]),oe=(0,L.useMemo)(()=>[],[]),x=(0,L.useMemo)(()=>({code:new Float32Array(s.length).fill(28),city:new Float32Array(s.length).fill(90),fire:new Float32Array(s.length).fill(132),measured:!1}),[]),S=(0,L.useMemo)(()=>{let e=o.hubPositions[0].clone(),t=new D(e.z,0,-e.x).normalize(),n=new D().crossVectors(e,t).normalize(),r=118*Math.PI/180;return{n:e,dir:n.clone().multiplyScalar(Math.cos(r)).addScaledVector(t,Math.sin(r)),p:new D,lastText:``}},[o]),C=(0,L.useMemo)(()=>({q:new _,qf:new _,aim:new _,aimSet:!1,aimDist:u,mid:new D,w:new D,v:new D,toCam:new D,lastPair:``,lastOffset:-1,lastW:0,lastH:0}),[]),w=m(),E=i();return O((n,r)=>{let i=h(e.current??0),a=ie(i,g),c=performance.now(),d=Math.min(Math.max(r,0),.1),m=o.uniforms,_=n.camera,{width:w,height:T}=n.size,D=ee(i);t.overrideWindow!==D&&(t.override.cov=t.override.routes=t.override.live=null,t.overrideWindow=D);let O=a.clock,k=0;if(t.sunStart>0){let e=c-t.sunStart;e<8e3?(O=a.clock+1440*X(e/f),k=Z(Math.min(1,e/400))):e<8600?k=1-Z((e-f)/600):t.sunStart=0}t.clock=O;let A={cov:a.cov,routes:a.routes,live:a.live},j=1-Math.exp(-d/.12);for(let e of Ie){let n=t.override[e];n===null?t.layer[e]=A[e]:t.layer[e]+=(+!!n-t.layer[e])*j}let M=Math.max(t.layer.routes,k),se=Math.max(t.layer.live,k);m.uTime.value=E?12:ne(),m.uClock.value=O;let N=l(O);m.uSun.value.set(N[0],N[1],N[2]),m.uNight.value=Math.max(a.night,k),m.uReveal.value=a.reveal,m.uHubPop.value=a.hubPop,m.uHubPx.value=a.hubPx,m.uCov.value=t.layer.cov*(1-k),m.uCovR.value=a.covR,m.uCovNextW.value=a.covNextW,m.uWave.value=a.wave,m.uRoutes.value=M,m.uLive.value=E?0:se,m.uFires.value=E?0:Math.max(a.fires,k),m.uOrd.value=k>0?p(O):a.ord,m.uOrdVis.value=Math.max(a.ordVis,k),m.uDeliver.value=a.deliver,m.uOpacity.value=a.opacity;let ce=w/T<.9,P=ce?Math.min(2.6,Math.max(1,.98/(w/T))):1;m.uViewH.value=T,m.uViewScale.value=T/900*P,m.uDpr.value=n.gl.getPixelRatio(),t.focusT=h(t.focusT+(t.focusTarget?1:-1)*d/1.4),!t.focusTarget&&t.focusT===0&&(t.focus=-1);let F=X(t.focusT);m.uFocus.value=t.focus,m.uFocusW.value=t.focus>=0?F:0;let I=t.pairA>=0&&t.pairB>=0?`${t.pairA}-${t.pairB}`:``;if(I!==C.lastPair&&(C.lastPair=I,I?o.setPair(s[t.pairA].code,s[t.pairB].code):o.setPair(null)),I&&(t.pairT=Math.min(2.2,t.pairT+d*(t.pairT<1?1/.9:1/1.4))),m.uPairT.value=I?t.pairT:0,!t.dragging){let e=.94**(d*60);if(t.dLon+=t.vLon*d*1e3,t.dLat+=t.vLat*d*1e3,t.vLon*=e,t.vLat*=e,t.releasedAt>0&&c-t.releasedAt>4e3){let e=1-Math.exp(-d/.45);t.dLon-=t.dLon*e,t.dLat-=t.dLat*e,Math.abs(t.dLon)+Math.abs(t.dLat)<.01&&(t.dLon=t.dLat=0,t.releasedAt=0)}}let L=a.lat;t.dLat=Math.max(-60-L,Math.min(60-L,t.dLat)),de(a.lat+t.dLat,a.lon+t.dLon,C.q);let R=u;if(t.focus>=0&&F>0){let e=t.pairA>=0&&t.pairB>=0,n,r;if(e){C.mid.copy(o.hubPositions[t.pairA]).add(o.hubPositions[t.pairB]).normalize(),n=Math.asin(Math.max(-1,Math.min(1,C.mid.y)))*180/Math.PI,r=Math.atan2(C.mid.x,C.mid.z)*180/Math.PI;let e=o.hubPositions[t.pairA].angleTo(o.hubPositions[t.pairB]);R=u+Math.min(1.2,e*1.1)}else{let e=s[t.focus];n=e.lat,r=e.lon+(w/T<.9?0:14)}if(de(Math.max(-60,Math.min(60,n+t.dLat)),r+t.dLon,C.qf),!C.aimSet)C.aim.copy(C.qf),C.aimDist=R,C.aimSet=!0;else{let e=1-Math.exp(-d/.35);C.aim.slerp(C.qf,e),C.aimDist+=(R-C.aimDist)*e}C.q.slerp(C.aim,F),R=C.aimDist}else C.aimSet=!1;o.group.quaternion.copy(C.q),o.group.updateMatrixWorld();let le=(a.dist+(R-a.dist)*(t.focus>=0?F:0))*P;_.position.set(0,0,le),_.lookAt(0,0,0);let z=ce?0:a.offset,B=ce?.2*(a.offset/re):0,V=z*10+B;(V!==C.lastOffset||w!==C.lastW||T!==C.lastH)&&(C.lastOffset=V,C.lastW=w,C.lastH=T,z>0||B>0?_.setViewOffset(w,T,-z*w,B*T,w,T):_.clearViewOffset()),_.updateMatrixWorld();let H=a.labels;for(let e=0;e<s.length;e++){C.w.copy(o.hubPositions[e]).applyQuaternion(C.q),C.toCam.copy(_.position).sub(C.w).normalize();let n=C.w.dot(C.toCam);C.v.copy(C.w).project(_);let r=t.hubScreen[e];r.x=(C.v.x+1)/2*w,r.y=(1-C.v.y)/2*T,r.facing=n;let i=e===0||a.hubPop>.2;r.vis=n>.1&&H>.05&&i;let s=t.labels[e];if(s){let i=t.focus>=0&&t.focus!==e&&t.pairB!==e?1-.65*F:1,a=h((r.y-64)/18),o=r.vis?H*h((n-.1)/.2)*i*a:0;s.style.transform=`translate3d(${r.x.toFixed(1)}px, ${r.y.toFixed(1)}px, 0)`,b[e]=o;let c=t.hover===e||t.focus===e||t.pairB===e?`1`:`0`;s.dataset.hot!==c&&(s.dataset.hot=c)}else b[e]=0}oe.length=0;for(let e of ae){let n=t.labels[e];if(!n)continue;let r=t.hubScreen[e],i=b[e];if(i>.01&&n.dataset.hot!==`1`)for(let e of oe){let n=t.hubScreen[e];if(Math.abs(n.x-r.x)<30&&Math.abs(n.y-r.y)<13){i=0;break}}i>.01&&oe.push(e),b[e]=i,n.style.opacity=i.toFixed(3)}!x.measured&&typeof document<`u`&&document.fonts?.status===`loaded`&&(x.measured=!0,t.labels.forEach((e,t)=>{let[n,r,i]=e?Array.from(e.children):[];n?.offsetWidth&&(x.code[t]=n.offsetWidth),r?.offsetWidth&&(x.city[t]=r.offsetWidth),i?.offsetWidth&&(x.fire[t]=i.offsetWidth)}));let U=w-(w<768?Q:ze);for(let e=0;e<s.length;e++){let n=t.labels[e];if(!n)continue;let r=t.hubScreen[e],i=n.dataset.hot===`1`?Math.max(x.code[e],x.city[e]):x.code[e],a=r.x+Le+i>U?`1`:`0`;n.dataset.flip!==a&&(n.dataset.flip=a)}y.length=0;for(let e of ae){let n=t.labels[e];if(!n)continue;let r=t.hubScreen[e],i=((O-v[e]+720)%1440+1440)%1440-720,a=m.uFires.value>.2&&r.vis&&b[e]>.01&&i>=0&&i<60&&r.x+Re+x.fire[e]<=U;if(a)for(let e of y){let n=t.hubScreen[e];if(Math.abs(n.x-r.x)<150&&Math.abs(n.y-r.y)<30){a=!1;break}}a&&y.push(e);let o=a?`1`:`0`;n.dataset.fire!==o&&(n.dataset.fire=o)}if(t.radiusLine&&t.radiusLabel&&t.radiusTick){let e=a.cov*Fe((a.p-.115)/.02)*(1-Fe((a.p-.465)/.015))*(1-F)*(1-k);if(e>.01&&a.covR>60){let n=a.covR/6371;S.p.copy(S.n).multiplyScalar(Math.cos(n)).addScaledVector(S.dir,Math.sin(n)).multiplyScalar(1.004),S.p.applyQuaternion(C.q).project(_);let r=(S.p.x+1)/2*w,i=(1-S.p.y)/2*T,o=t.hubScreen[0];t.radiusLine.setAttribute(`x1`,o.x.toFixed(1)),t.radiusLine.setAttribute(`y1`,o.y.toFixed(1)),t.radiusLine.setAttribute(`x2`,r.toFixed(1)),t.radiusLine.setAttribute(`y2`,i.toFixed(1)),t.radiusTick.setAttribute(`cx`,r.toFixed(1)),t.radiusTick.setAttribute(`cy`,i.toFixed(1)),t.radiusLabel.style.transform=`translate3d(${r.toFixed(1)}px, ${i.toFixed(1)}px, 0)`;let s=Math.hypot(r-o.x,i-o.y),c=`${te(Math.round(a.covR/10)*10)} KM`;c!==S.lastText&&(S.lastText=c,t.radiusLabel.textContent=c);let l=e.toFixed(3);t.radiusLine.style.opacity=l,t.radiusTick.style.opacity=l,t.radiusLabel.style.opacity=(e*Fe((s-22)/14)).toFixed(3)}else t.radiusLine.style.opacity=`0`,t.radiusTick.style.opacity=`0`,t.radiusLabel.style.opacity=`0`}}),(0,Y.jsxs)(Y.Fragment,{children:[(0,Y.jsx)(`color`,{attach:`background`,args:[c.void]}),(0,Y.jsx)(`primitive`,{object:o.group}),(0,Y.jsxs)(se,{multisampling:w.msaa,enableNormalPass:!1,children:[(0,Y.jsx)(P,{mipmapBlur:!0,luminanceThreshold:.6,intensity:.9,radius:.6,levels:w.bloomLevels}),(0,Y.jsx)(k,{offset:.25,darkness:.7}),(0,Y.jsx)(N,{mode:T.ACES_FILMIC})]})]})}export{Be as default};