import{r as e}from"./rolldown-runtime-hePW80VL.js";import{i as t,t as n}from"./vendor-react-CaQEq8OT.js";import{F as r,M as i,R as a,v as o}from"./config-DnxUhk9L.js";import{A as s,C as c,D as l,E as u,F as d,I as f,L as p,M as m,N as ee,O as te,P as ne,R as re,S as h,T as ie,_ as g,b as ae,f as oe,g as se,gt as ce,h as le,j as ue,k as _,lt as v,m as de,p as y,v as fe,w as pe,x as me,y as b}from"./index-QITTcNB2.js";import{$ as he,C as x,D as ge,E as _e,F as S,G as ve,K as C,N as w,O as T,P as E,R as D,S as O,T as ye,U as be,Y as k,Z as A,_ as j,a as xe,c as Se,dt as M,f as N,i as Ce,it as we,k as Te,m as Ee,n as De,nt as Oe,q as ke,r as Ae,t as je,tt as Me,ut as Ne,v as P,y as Pe}from"./vendor-3d-DWdRWYhm.js";var F=e(t(),1),I=n(),Fe={az:-45,el:60,el0:78,viewH:38,tx:-1.9,tz:-4.9,viewH2:39,tx2:5,tz2:-3};function Ie(){if(typeof location>`u`)return Fe;let e=new URLSearchParams(location.search).get(`fcam`);if(!e)return Fe;let t=e.split(`,`).map(Number),n=[`az`,`el`,`el0`,`viewH`,`tx`,`tz`,`viewH2`,`tx2`,`tz2`],r={...Fe};return n.forEach((e,n)=>{Number.isFinite(t[n])&&(r[e]=t[n])}),r}var L=e=>e<0?0:e>1?1:e,R=(e,t,n)=>{let r=L((n-e)/(t-e));return r*r*(3-2*r)},z=(e,t,n)=>e+(t-e)*n,B=Math.PI/180,Le=r(`trace`),Re=r(`depart`),V=e=>new x(e),H={heatMsLast:0,heatMsMax:0,heatUpdates:0};typeof window<`u`&&(window.__fulfilmentPerf=H);var ze=`
varying vec2 vXZ;
void main() {
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vXZ = wp.xz;
  gl_Position = projectionMatrix * viewMatrix * wp;
}
`,Be=`
uniform sampler2D uHeat;
uniform vec2 uHeatOrigin;
uniform vec2 uHeatSize;
uniform vec2 uTexel;
uniform vec3 uBase;
uniform vec3 uGrid1;
uniform vec3 uGrid5;
uniform vec3 uC1;
uniform vec3 uC2;
uniform vec3 uC3;
uniform float uGain;
uniform float uCore;
uniform vec3 uEdge;
uniform vec2 uHalf;
varying vec2 vXZ;

float gridLine(vec2 p, float spacing, float halfW) {
  vec2 d = abs(fract(p / spacing + 0.5) - 0.5) * spacing;
  vec2 fw = fwidth(p) * 0.75;
  vec2 l = 1.0 - smoothstep(vec2(halfW), vec2(halfW) + fw, d);
  return max(l.x, l.y);
}

vec3 ramp(float h) {
  vec3 c = uC1 * smoothstep(0.0, 0.25, h);
  c = mix(c, uC2, smoothstep(0.25, 0.6, h));
  c = mix(c, uC3, smoothstep(0.6, 0.95, h));
  return c;
}

void main() {
  vec3 col = uBase;
  col = mix(col, uGrid1, gridLine(vXZ, 1.0, 0.012) * 0.9);
  col = mix(col, uGrid5, gridLine(vXZ, 5.0, 0.02));
  // building footprint: a hairline just inside the slab edge
  vec2 dEdge = uHalf - abs(vXZ);
  float edgeD = min(dEdge.x, dEdge.y);
  float fwE = fwidth(edgeD);
  col = mix(col, uEdge, (1.0 - smoothstep(0.05, 0.05 + fwE * 1.5, abs(edgeD - 0.35))) * 0.9);
  // painted staging lanes in front of the 8 dock doors (static floor marking, hairline grey)
  {
    float zz = mod(vXZ.y + 12.0, 3.0) - 1.5;
    float inX = step(14.5, vXZ.x) * step(vXZ.x, 20.6);
    float inZ = step(abs(vXZ.y), 11.6);
    vec2 d = vec2(min(abs(vXZ.x - 14.5), abs(vXZ.x - 20.6)), abs(abs(zz) - 1.05));
    vec2 fw2 = fwidth(vXZ) * 0.9;
    float lx = (1.0 - smoothstep(0.03, 0.03 + fw2.x, d.x)) * step(abs(zz), 1.05);
    float lz = (1.0 - smoothstep(0.03, 0.03 + fw2.y, d.y)) * inX;
    col = mix(col, uEdge, max(lx * step(14.4, vXZ.x) * step(vXZ.x, 20.7), lz) * inZ * 0.85);
  }
  vec2 uv = (vXZ - uHeatOrigin) / uHeatSize;
  float hc = texture2D(uHeat, uv).r;
  float hb = texture2D(uHeat, uv + vec2(uTexel.x, 0.0)).r + texture2D(uHeat, uv - vec2(uTexel.x, 0.0)).r
           + texture2D(uHeat, uv + vec2(0.0, uTexel.y)).r + texture2D(uHeat, uv - vec2(0.0, uTexel.y)).r;
  float h = (hc * 2.0 + hb) / 6.0;
  // soft light map + a crisp core along the busiest lines (the "copper")
  vec3 glow = ramp(h) * (0.55 + 1.1 * smoothstep(0.45, 1.0, h));
  float core = smoothstep(0.5, 0.85, hc) * uCore;
  vec3 coreCol = mix(uC2, uC3, smoothstep(0.75, 1.05, hc)) * (0.9 + 1.6 * smoothstep(0.8, 1.1, hc));
  col += (glow + coreCol * core * 0.6) * uGain;
  gl_FragColor = vec4(col, 1.0);
}
`,Ve=`
attribute float aT;
varying float vT;
void main() {
  vT = aT;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`,He=`
uniform vec3 uSignal;
uniform vec3 uFilament;
uniform float uIntensity;
varying float vT;
void main() {
  float a = pow(max(1.0 - vT, 0.0), 1.6);
  vec3 c = mix(uFilament * 1.6, uSignal, smoothstep(0.0, 0.14, vT));
  gl_FragColor = vec4(c * uIntensity, a);
}
`,Ue=`
attribute float aSeg;
attribute float aU;
attribute float aSide;
attribute float aLen;
varying float vSeg;
varying float vU;
varying float vSide;
varying float vLen;
void main() {
  vSeg = aSeg; vU = aU; vSide = aSide; vLen = aLen;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`,We=`
uniform float uDrawA;
uniform float uDrawB;
uniform float uTime;
uniform vec3 uColor;
uniform vec3 uHead;
varying float vSeg;
varying float vU;
varying float vSide;
varying float vLen;
void main() {
  float draw = vSeg < 0.5 ? uDrawA : uDrawB;
  if (vU > draw || draw <= 0.0) discard;
  float head = smoothstep(draw - 0.06, draw, vU) * step(draw, 0.999);
  float core = 1.0 - smoothstep(0.2, 1.0, abs(vSide));
  // packets: the order's signal running along its own trace (a 0.6 m dash every 3.2 m, 2.4 m/s)
  float f = fract((vU * vLen - uTime * 2.4) / 3.2);
  float pk = smoothstep(0.0, 0.03, f) * (1.0 - smoothstep(0.12, 0.19, f));
  vec3 c = uColor * (0.35 + 2.4 * pk) + uHead * 2.2 * head;
  gl_FragColor = vec4(c * (0.6 + 0.4 * core), core);
}
`,Ge=`
varying vec2 vUv;
void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`,Ke=`
uniform vec3 uColor;
uniform float uLevel;
varying vec2 vUv;
void main() {
  float e = min(min(vUv.x, 1.0 - vUv.x), min(vUv.y, 1.0 - vUv.y));
  float edge = 1.0 - smoothstep(0.0, 0.07, e);
  gl_FragColor = vec4(uColor * uLevel * (edge * 3.0 + 0.25), 1.0);
}
`;function U({progress:e,labels:t,order:n,onRackHover:r,onRackClick:Fe}){let U=v(),Je=a(),G=i(),K=(0,F.useMemo)(Ie,[]),Ye=Math.min(60,U.robots),q=U.trailSamples,J=Ee(e=>e.camera),Y=Ee(e=>e.size),X=(0,F.useMemo)(()=>{let e=[];for(let t=0;t<60&&e.length<Ye;t++)(Ye>=60||t<32||t>=48)&&e.push(t);return e},[Ye]),Z=(0,F.useMemo)(()=>{let e=new w,t=[],n=e=>(t.push(e),e),r=new Uint16Array(g),i=n(new ye(r,88,56,Me,E));i.minFilter=be,i.magFilter=be,i.wrapS=O,i.wrapT=O,i.generateMipmaps=!1,i.flipY=!1,i.needsUpdate=!0;let a=n(new we({vertexShader:ze,fragmentShader:Be,uniforms:{uHeat:{value:i},uHeatOrigin:{value:new Ne(de,le)},uHeatSize:{value:new Ne(88*se,56*se)},uTexel:{value:new Ne(1/88,1/56)},uBase:{value:V(`#07080A`)},uGrid1:{value:V(`#0F1115`)},uGrid5:{value:V(`#181B21`)},uC1:{value:V(`#3A1608`)},uC2:{value:V(o.signal)},uC3:{value:V(o.filament)},uGain:{value:1},uCore:{value:1},uEdge:{value:V(`#2E323B`)},uHalf:{value:new Ne(22,14)}}})),s=n(new A(44,28));s.rotateX(-Math.PI/2);let d=new C(s,a);d.renderOrder=-1,e.add(d);let m=n(new Se(ae,b,fe,2,.03));{let e=m.attributes.normal,t=new Float32Array(e.count*3),n=V(`#454A56`),r=V(`#15171C`);for(let i=0;i<e.count;i++){let a=e.getY(i)>.7?n:r;t[i*3]=a.r,t[i*3+1]=a.g,t[i*3+2]=a.b}m.setAttribute(`color`,new P(t,3))}let te=n(new k({color:`#ffffff`,vertexColors:!0,roughness:.7,metalness:.15}));te.onBeforeCompile=e=>{e.vertexShader=e.vertexShader.replace(`#include <common>`,`#include <common>
varying float vLocalY;
varying float vSide;`).replace(`#include <begin_vertex>`,`#include <begin_vertex>
vLocalY = position.y;
vSide = 1.0 - step(0.7, abs(normal.y));`),e.fragmentShader=e.fragmentShader.replace(`#include <common>`,`#include <common>
varying float vLocalY;
varying float vSide;`).replace(`#include <color_fragment>`,`#include <color_fragment>
          {
            float y = vLocalY + ${(b/2).toFixed(3)};
            float beam = 1.0 - smoothstep(0.018, 0.04, abs(fract(y / 0.52) - 0.08) * 0.52);
            diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.034, 0.038, 0.047), beam * vSide);
          }`)};let ne=new D(m,te,288),h=new ve,oe=0;for(let e=0;e<8;e++)for(let t of[-1,1])for(let n=0;n<18;n++)h.makeTranslation(l(n),b/2,ee(e,t)),ne.setMatrixAt(oe++,h);ne.instanceMatrix.needsUpdate=!0,e.add(ne);let ce=n(new j(.35,.3,.35)),ue=n(new k({color:`#6E5D47`,roughness:.85})),v=re(`fulfilment:cartons`),y=[];for(let e=0;e<8;e++)for(let t of[-1,1])for(let n=0;n<18;n++)for(let r=0;r<4;r++)for(let i=0;i<2;i++){let a=l(n)-.2+.4*i+(v()-.5)*.04,o=.04+r*.52+.15,s=ee(e,t)+t*(fe/2-.13);y.push([a,o,s])}for(let e=y.length-1;e>0;e--){let t=Math.floor(v()*(e+1)),n=y[e];y[e]=y[t],y[t]=n}let me=Math.min(1200,y.length),x=new D(ce,ue,me),_e=new he,xe=new Te,N=new M(1,1,1),Ce=new M;for(let e=0;e<me;e++){let[t,n,r]=y[e];xe.set(0,(v()-.5)*.12,0),_e.setFromEuler(xe);let i=.85+v()*.3;N.set(1,.8+v()*.35,1).multiplyScalar(i),Ce.set(t,n*1+N.y*.3/2-.15,r),h.compose(Ce,_e,N),x.setMatrixAt(e,h)}x.instanceMatrix.needsUpdate=!0,e.add(x);let Ee=n(new Se(.8,.9,1.6,2,.04));{let e=Ee.attributes.normal,t=new Float32Array(e.count*3),n=V(`#E4E6EA`),r=V(`#8E939C`);for(let i=0;i<e.count;i++){let a=e.getY(i)>.7?n:r;t[i*3]=a.r,t[i*3+1]=a.g,t[i*3+2]=a.b}Ee.setAttribute(`color`,new P(t,3))}let De=n(new k({color:`#C9CCD2`,roughness:.5,vertexColors:!0})),Ae=new D(Ee,De,6);for(let e=0;e<6;e++)h.makeTranslation(6,.45,p(e)),Ae.setMatrixAt(e,h);Ae.instanceMatrix.needsUpdate=!0,e.add(Ae);let je=n(new j(.3,.35,28)),F=n(new k({color:`#3A3F4A`,roughness:.8})),I=new C(je,F);I.position.set(21.35,.175,0),e.add(I);let Fe=n(new A(2.4,2.9));Fe.rotateY(-Math.PI/2);let Ie=n(new k({color:`#6A707C`,roughness:.6,metalness:.1,transparent:!0,opacity:.55})),L=new D(Fe,Ie,8);for(let e=0;e<8;e++)h.makeTranslation(21.18,1.45,_(e)),L.setMatrixAt(e,h);L.instanceMatrix.needsUpdate=!0,e.add(L);let R=n(new j(1,1,1)),z=n(new ke({color:`#ffffff`,toneMapped:!1})),B=new D(R,z,24);for(let e=0;e<8;e++){let t=_(e);h.compose(Ce.set(21.12,1.5,t-1.25),_e.identity(),N.set(.06,3,.1)),B.setMatrixAt(e*3,h),h.compose(Ce.set(21.12,1.5,t+1.25),_e.identity(),N.set(.06,3,.1)),B.setMatrixAt(e*3+1,h),h.compose(Ce.set(21.12,2.95,t),_e.identity(),N.set(.06,.1,2.6)),B.setMatrixAt(e*3+2,h);for(let t=0;t<3;t++)B.setColorAt(e*3+t,V(`#000000`))}B.instanceMatrix.needsUpdate=!0,B.instanceColor&&(B.instanceColor.needsUpdate=!0),e.add(B);let Le=n(new Se(.6,.18,.6,2,.06)),Re=n(new k({color:`#C9CCD2`,roughness:.4,metalness:.1})),H=new D(Le,Re,61);H.instanceMatrix.setUsage(T),H.frustumCulled=!1,e.add(H);let U=n(new A(.36,.08));U.rotateX(-Math.PI/2);let qe=n(new ke({color:`#ffffff`,toneMapped:!1})),W=new D(U,qe,61);W.instanceMatrix.setUsage(T),W.frustumCulled=!1;for(let e=0;e<=60;e++)W.setColorAt(e,V(o.signal));e.add(W);let Je=n(new j(.34,.22,.34)),G=new D(Je,ue,61);G.instanceMatrix.setUsage(T),G.frustumCulled=!1,e.add(G);let K=61*q*2,Ye=new Float32Array(K*3),J=new Float32Array(K),Y=new Uint32Array(61*(q-1)*6),X=0;for(let e=0;e<61;e++)for(let t=0;t<q;t++){let n=(e*q+t)*2;J[n]=J[n+1]=t/(q-1),t<q-1&&(Y[X++]=n,Y[X++]=n+1,Y[X++]=n+2,Y[X++]=n+1,Y[X++]=n+3,Y[X++]=n+2)}let Z=n(new Pe),Q=new P(Ye,3);Q.setUsage(T),Z.setAttribute(`position`,Q),Z.setAttribute(`aT`,new P(J,1)),Z.setIndex(new P(Y,1));let Xe=n(new we({vertexShader:Ve,fragmentShader:He,uniforms:{uSignal:{value:V(o.signal)},uFilament:{value:V(o.filament)},uIntensity:{value:1.6}},transparent:!0,depthWrite:!1,blending:2})),Ze=new C(Z,Xe);Ze.frustumCulled=!1,Ze.renderOrder=2,e.add(Ze);let Qe=n(new Pe);{let e=[],t=(t,n,r,i)=>{let a=r-t,o=i-n,s=Math.hypot(a,o),c=-o/s*.085,l=a/s*.085;e.push(t+c,0,n+l,t-c,0,n-l,r+c,0,i+l),e.push(t-c,0,n-l,r-c,0,i-l,r+c,0,i+l)};t(-1.1,-.55,.3,0),t(-1.1,.55,.3,0),Qe.setAttribute(`position`,new P(new Float32Array(e),3))}let $e=n(new ke({color:`#ffffff`,toneMapped:!1,transparent:!0,depthWrite:!1,blending:2,side:2})),$=new D(Qe,$e,3);$.frustumCulled=!1;for(let e=0;e<3;e++)$.setColorAt(e,V(`#000000`));e.add($);let et=n(new j(ae+.06,b+.06,fe+.06)),tt=n(new we({vertexShader:Ge,fragmentShader:Ke,uniforms:{uColor:{value:V(o.signal)},uLevel:{value:0}},transparent:!0,depthWrite:!1,blending:2})),nt=new C(et,tt);nt.position.set(l(13),b/2,ee(2,1)),nt.visible=!1,nt.renderOrder=3,e.add(nt);let rt=[[[l(13),u(3)],[3,u(3)],[3,f(2)],[pe,f(2)]],[[ie,f(2)],[9,f(2)],[9,_(6)],[c,_(6)],[22.6,_(6)]]],it=[],at=[],ot=[],st=[],ct=[],lt=[],ut=.07;rt.forEach((e,t)=>{let n=0;for(let t=1;t<e.length;t++)n+=Math.hypot(e[t][0]-e[t-1][0],e[t][1]-e[t-1][1]);let r=0;for(let i=1;i<e.length;i++){let[a,o]=e[i-1],[s,c]=e[i],l=Math.hypot(s-a,c-o),u=-(c-o)/l*ut,d=(s-a)/l*ut,f=(s-a)/l*ut,p=(c-o)/l*ut,m=it.length/3,ee=r/n,te=(r+l)/n,ne=[[a-f+u,o-p+d,ee,1],[a-f-u,o-p-d,ee,-1],[s+f+u,c+p+d,te,1],[s+f-u,c+p-d,te,-1]];for(let[e,r,i,a]of ne)it.push(e,.045,r),at.push(t),ot.push(i),st.push(a),ct.push(n);lt.push(m,m+1,m+2,m+1,m+3,m+2),r+=l}});let dt=n(new Pe);dt.setAttribute(`position`,new P(new Float32Array(it),3)),dt.setAttribute(`aSeg`,new P(new Float32Array(at),1)),dt.setAttribute(`aU`,new P(new Float32Array(ot),1)),dt.setAttribute(`aSide`,new P(new Float32Array(st),1)),dt.setAttribute(`aLen`,new P(new Float32Array(ct),1)),dt.setIndex(lt);let ft=n(new we({vertexShader:Ue,fragmentShader:We,uniforms:{uDrawA:{value:0},uDrawB:{value:0},uTime:{value:0},uColor:{value:V(o.filament).multiplyScalar(1.15)},uHead:{value:V(`#ffffff`)}},transparent:!0,depthWrite:!1,blending:2})),pt=new C(dt,ft);pt.renderOrder=4,pt.frustumCulled=!1,e.add(pt);let mt=n(new Oe(.2,.3,32));mt.rotateX(-Math.PI/2);let ht=n(new ke({color:`#ffffff`,toneMapped:!1,transparent:!0,depthWrite:!1,blending:2})),gt=new D(mt,ht,3);[[l(13),u(3)],[pe,f(2)],[c,_(6)]].forEach(([e,t],n)=>{h.makeTranslation(e,.05,t),gt.setMatrixAt(n,h),gt.setColorAt(n,V(`#000000`))}),gt.renderOrder=5,gt.frustumCulled=!1,e.add(gt);let _t=n(new j(.86,.96,1.66)),vt=n(new we({vertexShader:Ge,fragmentShader:Ke,uniforms:{uColor:{value:V(o.signal)},uLevel:{value:0}},transparent:!0,depthWrite:!1,blending:2})),yt=new C(_t,vt);yt.position.set(6,.45,p(2)),yt.visible=!1,yt.renderOrder=3,e.add(yt);let bt=n(new j(17.5,b,22.5)),xt=n(new ke({visible:!1})),St=new C(bt,xt);St.position.set((l(0)+l(17))/2,b/2,0);let Ct=new ge(o.studioCool,1.5);Ct.position.set(-10,20,8),e.add(Ct);let wt=new S(o.studioCool,`#050506`,.55);return e.add(wt),{group:e,disposables:t,heatTex:i,heatData:r,floorMat:a,bodies:H,leds:W,totes:G,trailAttr:Q,trailPos:Ye,trailMat:Xe,trails:Ze,frames:B,doors:L,chevrons:$,pulse:nt,pulseMat:tt,stPulse:yt,stPulseMat:vt,orderMat:ft,vias:gt,zone:St}},[q]);(0,F.useEffect)(()=>()=>Z.disposables.forEach(e=>e.dispose()),[Z]);let Q=(0,F.useMemo)(()=>{let e=s(h,new Float64Array(g)).slice(),t=s(me,new Float64Array(g)),n=new Float64Array(g),r=[];for(let i=0;i<g;i++)n[i]=t[i]-.7*e[i],n[i]>0&&r.push(n[i]);r.sort((e,t)=>e-t);let i=r[Math.floor(r.length*.985)]||1,a=i/60;return{W_MORNING:.3,morning:e,cRef:i,c0:a,norm:1/Math.log(1+i/a),acc:new Float64Array(g)}},[]),Xe=(0,F.useRef)({ambient:0,tReset:NaN,tPrevStory:NaN,tHeat:NaN,span:0,prevP:NaN,flashAt:0,px:0,py:0,robot:{x:0,z:0,yaw:0,kind:0,loaded:0,seg:-1},hints:new Int32Array(61).fill(-1),samples:new Float32Array(q*2),m4:new ve,q:new he,e:new Te,v:new M,s:new M(1,1,1),c:new x,target:new M(K.tx,0,K.tz),proj:new M}),Ze=(0,F.useMemo)(()=>V(o.signal),[]),Qe=(0,F.useMemo)(()=>V(o.filament),[]),$e=(0,F.useMemo)(()=>V(`#000000`),[]);(0,F.useLayoutEffect)(()=>{J.near=.1,J.far=400,J.updateProjectionMatrix()},[J]);let $=.12*(q-1)*(48/q);return N((r,i)=>{let a=Xe.current,o=Math.min(.1,Math.max(0,i)),c=e.current??0,u=d(c);Je||G?a.ambient=0:Math.abs(u-a.tReset)<=120?a.ambient+=o:(a.ambient=0,a.tReset=u);let f=u+a.ambient,re=Number.isNaN(a.tPrevStory)||o<=0?0:Math.abs(u-a.tPrevStory)/o;a.tPrevStory=u;let ie=Le(L(c/.06)),ae=Y.width<768,se=ae?z(84,72,ie):z(K.el0,K.el,ie),le=K.az;if(!Je&&!G){let e=1-Math.exp(-o*3);a.px+=(r.pointer.x-a.px)*e,a.py+=(r.pointer.y-a.py)*e,le+=a.px*1.5,se+=a.py*1.5}let v=R(.6,.86,c);a.target.set(z(K.tx,K.tx2,v),0,z(K.tz,K.tz2,v));let de=z(K.viewH,K.viewH2,v);ae&&(a.target.set(z(-3.5,9,v),0,z(-1.5,3,v)),de=30);let fe=se*B,pe=le*B;J.position.set(a.target.x+80*Math.cos(fe)*Math.sin(pe),80*Math.sin(fe),a.target.z+80*Math.cos(fe)*Math.cos(pe)),J.up.set(0,1,0),J.lookAt(a.target);let me=c>.97?z(1,.02,Re(L((c-.97)/.025))):1;if(J.zoom=Y.height/de*me,J.updateProjectionMatrix(),Number.isNaN(a.tHeat)||Math.abs(u-a.tHeat)>=60){let e=performance.now();a.tHeat=u;let t=s(Math.max(u,h),Q.acc),n=Z.heatData,r=1-Q.W_MORNING;for(let e=0;e<g;e++){let i=t[e]-r*Q.morning[e],a=i>0?Math.log(1+i/Q.c0)*Q.norm:0;n[e]=_e.toHalfFloat(Math.min(1.25,a))}Z.heatTex.needsUpdate=!0;let i=performance.now()-e;H.heatMsLast=i,H.heatMsMax=Math.max(H.heatMsMax,i),H.heatUpdates++}let he=$;if(!Je&&!G){let e=Math.min(60,Math.max($,re*.05)),t=e>a.span?.06:.35;a.span+=(e-a.span)*(1-Math.exp(-o/t)),he=Math.max($,a.span)}let x=he/(q-1),{bodies:ge,leds:S,totes:ve,trailPos:C}=Z,w=a.m4,T=a.robot,E=n.current;E.active&&(E.elapsed=(performance.now()-E.startedAt)/1e3,E.carrying=oe(E.elapsed),E.elapsed>14.5&&(E.active=!1));let D=!G,O=0,ye=(e,t)=>{let n=e*q*2*3;for(let e=0;e<q;e++){let r=t[2*e],i=t[2*e+1],a=Math.max(0,e-1),o=Math.min(q-1,e+1),s=t[2*a]-t[2*o],c=t[2*a+1]-t[2*o+1],l=Math.hypot(s,c);l>1e-5?(s/=l,c/=l):(s=0,c=0);let u=.06*(1-.35*(e/(q-1))),d=n+e*6;C[d]=r-c*u,C[d+1]=.035,C[d+2]=i+s*u,C[d+3]=r+c*u,C[d+4]=.035,C[d+5]=i-s*u}},be=e=>{let t=e*q*2*3;C.fill(0,t,t+q*6)};for(let e=0;e<X.length;e++){let t=X[e];t===17&&E.active?y(E,T):(T.seg=a.hints[t],m(t,f,T),a.hints[t]=T.seg),a.e.set(0,T.yaw,0),a.q.setFromEuler(a.e),a.v.set(T.x,.1,T.z),a.s.set(1,1,1),w.compose(a.v,a.q,a.s),ge.setMatrixAt(O,w);let n=Math.sin(T.yaw)*.16,r=Math.cos(T.yaw)*.16;a.v.set(T.x+n,.192,T.z+r),w.compose(a.v,a.q,a.s),S.setMatrixAt(O,w);let i=t===0?te(0,f):t===17&&E.active&&E.elapsed<9.6;i?a.c.copy(Qe).multiplyScalar(3.2):a.c.copy(Ze).multiplyScalar(T.kind===0?3:T.kind===3?.7:2),S.setColorAt(O,a.c);let o=T.loaded||i;a.v.set(T.x-n*.4,.3,T.z-r*.4),a.s.setScalar(+!!o),w.compose(a.v,a.q,a.s),ve.setMatrixAt(O,w),a.s.setScalar(1),D?(t===17&&E.active?qe(E,x,q,a.samples):ne(t,f,x,q,a.samples,0,a.hints[t]),ye(O,a.samples)):be(O),O++}ge.count=O,S.count=O,ve.count=O,ge.instanceMatrix.needsUpdate=!0,S.instanceMatrix.needsUpdate=!0,S.instanceColor&&(S.instanceColor.needsUpdate=!0),ve.instanceMatrix.needsUpdate=!0,Z.trailAttr.needsUpdate=!0,Z.trailAttr.clearUpdateRanges(),Z.trailAttr.addUpdateRange(0,O*q*6),Z.trails.geometry.setDrawRange(0,O*(q-1)*6),Z.trailMat.uniforms.uIntensity.value=1.6*Math.max(.42,Math.min(1,$*1.4/he)**.55);let k=0,A=.5;if(c>=.8215){let e=L((c-.8215)/.0135);if(k=e<.35?z(A,2,e/.35):z(2,A,(e-.35)/.65),!Je&&!G&&a.prevP<.8215&&c<.836&&(a.flashAt=performance.now()),a.flashAt>0){let e=(performance.now()-a.flashAt)/1e3,t=e<.12?z(A,2.2,e/.12):z(2.2,A,L((e-.12)/1.1));k=Math.max(k,t),e>1.4&&(a.flashAt=0)}}else a.flashAt=0;a.prevP=c;let j=R(.9495,.958,c);for(let e=0;e<8;e++){let t=e===6?Math.max(k,1.2*j):k;t<=.001?a.c.copy($e):a.c.copy(Ze).multiplyScalar(t);for(let t=0;t<3;t++)Z.frames.setColorAt(e*3+t,a.c)}Z.frames.instanceColor&&(Z.frames.instanceColor.needsUpdate=!0);{let e=R(.95,.962,c);a.v.set(21.18,1.45+e*1.35,_(6)),a.s.set(1,Math.max(.001,1-e*.93),1),w.compose(a.v,a.q.identity(),a.s),Z.doors.setMatrixAt(6,w),Z.doors.instanceMatrix.needsUpdate=!0,a.s.set(1,1,1)}{let e=Z.chevrons,t=R(.9495,.951,c)*(1-R(.968,.978,c)),n=L((c-.95)/.025)*4;for(let r=0;r<3;r++){let i=((ce()*.55+r/3)%1+1)%1,o=G?0:t*Math.sin(Math.PI*i);a.v.set(21.9+i*6+n,.04,_(6)),a.s.set(1,1,1),w.compose(a.v,a.q.identity(),a.s),e.setMatrixAt(r,w),a.c.copy(Ze).multiplyScalar(2.4*o),e.setColorAt(r,a.c)}e.instanceMatrix.needsUpdate=!0,e.instanceColor&&(e.instanceColor.needsUpdate=!0)}{let e=ue(f),t=R(.148,.153,c)*(1-R(.158,.165,c)),n=Math.max(t,e>=0&&e<=1?Math.sin(Math.PI*e):0);Z.pulse.visible=n>.002,Z.pulseMat.uniforms.uLevel.value=n}let xe=L((c-.1528)/.012),Se=L((c-.905)/.044);Z.orderMat.uniforms.uDrawA.value=xe,Z.orderMat.uniforms.uDrawB.value=Se,Z.orderMat.uniforms.uTime.value=G?0:ce();{let e=Z.vias,t=[+(c>=.1528),+(xe>=1),+(Se>=1)];for(let n=0;n<3;n++)a.c.copy(Qe).multiplyScalar(1.6*t[n]),e.setColorAt(n,a.c);e.instanceColor&&(e.instanceColor.needsUpdate=!0)}{let e=.7*R(.27,.2775,c)*(1-R(.33,.4,c));Z.stPulse.visible=e>.002,Z.stPulseMat.uniforms.uLevel.value=e}let M=t.current,N=(e,t,n,r)=>{if(!e)return;a.proj.set(t,n,r).project(J);let i=(a.proj.x*.5+.5)*Y.width,o=(-a.proj.y*.5+.5)*Y.height;e.style.transform=`translate3d(${i.toFixed(1)}px, ${o.toFixed(1)}px, 0)`};c>=.14&&c<.3&&N(M.picked,l(13),b+.1,ee(2,1)),c>=.25&&c<.84&&N(M.configured,6,.9,p(2)),c>=.8&&c<.97&&N(M.cutoff,21,3,_(3)+1.5),c>=.93&&N(M.depart,21,3,_(6)),E.active&&(y(E,W),N(M.order,W.x,.3,W.z))}),(0,I.jsxs)(I.Fragment,{children:[(0,I.jsx)(`color`,{attach:`background`,args:[o.void]}),(0,I.jsx)(`primitive`,{object:Z.group}),(0,I.jsx)(`primitive`,{object:Z.zone,onPointerOver:()=>r?.(!0),onPointerOut:()=>r?.(!1),onClick:()=>Fe?.()}),(0,I.jsxs)(De,{multisampling:U.msaa,enableNormalPass:!1,children:[(0,I.jsx)(je,{mipmapBlur:!0,luminanceThreshold:.7,intensity:.8,radius:.5,levels:U.bloomLevels}),(0,I.jsx)(Ce,{offset:.25,darkness:.7}),(0,I.jsx)(Ae,{mode:xe.ACES_FILMIC})]})]})}function qe(e,t,n,r){let i=W;for(let a=0;a<n;a++)y(e,i,-a*t),r[2*a]=i.x,r[2*a+1]=i.z}var W={x:0,z:0,yaw:0,kind:0,loaded:0,seg:-1};export{U as default};