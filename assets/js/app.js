import * as THREE from '../../lib/three.module.min.js';

const I=window.I18N;
const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));
const ease=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
const easeOutBack=t=>{const c1=1.5,c3=c1+1;return 1+c3*Math.pow(t-1,3)+c1*Math.pow(t-1,2)};
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
function progress(el){const r=el.getBoundingClientRect();const t=r.height-innerHeight;return t<=0?0:clamp(-r.top/t)}
function inView(el){const r=el.getBoundingClientRect();return r.bottom>0&&r.top<innerHeight}

/* ---------- Language gate ---------- */
const gate=document.getElementById('gate');
const hv=document.getElementById('heroVid');
function enter(l){
  I.set(l);I.save(l);
  gate.classList.add('out');document.documentElement.classList.add('nogate-pending');
  setTimeout(()=>{document.documentElement.classList.add('nogate');gate.classList.remove('out');window.scrollTo(0,0)},reduce?0:1000);
  if(!reduce)hv.play?.().catch(()=>{});
}
gate.querySelectorAll('.lang').forEach(b=>b.addEventListener('click',()=>enter(b.dataset.lang)));
document.getElementById('langBtn').addEventListener('click',()=>{const l=I.get()==='en'?'es':'en';I.set(l);I.save(l)});

const nav=document.getElementById('nav');
if(reduce){hv.removeAttribute('autoplay');hv.pause();}else{hv.play?.().catch(()=>{});}

/* ---------- Aerial orbit ---------- */
const orbit=document.getElementById('aerial');
const oc=document.getElementById('orbitCanvas');const octx=oc.getContext('2d');
const N_FR=80;const frames=new Array(N_FR);let lastFrame=-1;
const caps=[...orbit.querySelectorAll('.c')];
const oBar=document.getElementById('orbitBar'),oPct=document.getElementById('orbitPct');
const src=i=>`assets/seq/r_${String(i+1).padStart(3,'0')}.jpg`;
function loadFrame(i){if(frames[i])return;const im=new Image();im.decoding='async';im.src=src(i);im.onload=()=>{im.ok=true;if(i===0||i===lastFrame)drawFrame(i,true)};frames[i]=im}
loadFrame(0);
const loadRest=()=>{for(let s=8;s>=1;s=s>>1){for(let i=0;i<N_FR;i+=s)loadFrame(i)}};
if('IntersectionObserver' in window){const io=new IntersectionObserver(e=>{if(e[0].isIntersecting){loadRest();io.disconnect()}},{rootMargin:'1200px'});io.observe(orbit)}else loadRest();
function sizeOrbit(){const d=Math.min(devicePixelRatio||1,1.5);oc.width=oc.clientWidth*d;oc.height=oc.clientHeight*d;lastFrame=-1}
// Pixel positions of Volcán Barú's summit and of the sea on the horizon, per drone frame (1280×720), tracked from the footage.
const VOL={x:[611,618,627,635,643,658,692,752,833,914,973,1019,1061,1093,1114,1128,1130,1123,1117,1114,1106,1101,1114,1152,1197,1239,1279,1321,1365],
           y:[47,54,61,68,73,78,79,79,76,72,70,69,69,69,72,77,82,85,85,83,81,78,75,71,71,72,74,76,78]};
const SEA={f0:57,x:[40,101,253,445,565,693,829,925,973,1013,1061],y:[240,237,234,235,236,235,236,236,236,235,235]};
const aVol=document.getElementById('aVol'),aSea=document.getElementById('aSea');
let zoom=1,lastZoom=0;
function zoomAt(p){const sm=t=>t*t*(3-2*t);return p<.83?1+.12*sm(clamp((p-.62)/.21)):1+.12*(1-sm(clamp((p-.83)/.17)))}
function drawFrame(i,force){
  let k=i;while(k>=0&&!(frames[k]&&frames[k].ok))k--;
  if(k<0)return;if(k===lastFrame&&zoom===lastZoom&&!force)return;lastFrame=k;lastZoom=zoom;
  const im=frames[k];const cw=oc.width,ch=oc.height;const s=Math.max(cw/im.naturalWidth,ch/im.naturalHeight)*zoom;
  const w=im.naturalWidth*s,h=im.naturalHeight*s;octx.drawImage(im,(cw-w)/2,(ch-h)/2,w,h);
}
function place(el,fx,fy,alpha){
  if(alpha<=0.001){el.style.opacity=0;return}
  const cw=oc.clientWidth,ch=oc.clientHeight;const s=Math.max(cw/1280,ch/720)*zoom;
  const x=(cw-1280*s)/2+fx*s,y=(ch-720*s)/2+fy*s;
  const t=el.querySelector('.atxt');const w=t.offsetWidth;const g=Math.max(16,cw*.04);
  const left=clamp(x-w*.18,g,cw-g-w);t.style.setProperty('--tx',(left-x)+'px');
  el.style.transform=`translate(${x.toFixed(1)}px,${y.toFixed(1)}px)`;el.style.opacity=(x<-20||x>cw+20)?0:alpha.toFixed(3);
}
function updateAnchors(p){
  const k=Math.max(0,lastFrame);
  if(k<VOL.x.length&&p<.4){place(aVol,VOL.x[k],VOL.y[k],k<=21?1:clamp((27-k)/6))}else aVol.style.opacity=0;
  const j=k-SEA.f0;
  if(j>=0&&j<SEA.x.length&&p>=.7&&p<=.86){place(aSea,SEA.x[j],SEA.y[j],Math.min(clamp((j+1)/2.5),clamp((SEA.x.length-j)/2)))}else aSea.style.opacity=0;
}

/* ---------- Master plan 3D ---------- */
const planEl=document.getElementById('plan');
const pc=document.getElementById('planCanvas');
const PLAN=JSON.parse(document.getElementById('planData').textContent);
const FOUNDER=new Set([1,2,28,29]);
const fmtArea=a=>Math.round(a).toLocaleString('en-US')+' m²';
const order=[...PLAN.lots].sort((a,b)=>a.id-b.id); // follows the one-way loop
let R=null;
const ticksEl=document.getElementById('ticks');
order.forEach(l=>{const i=document.createElement('i');if(FOUNDER.has(l.id))i.classList.add('f');ticksEl.appendChild(i)});
const ticks=[...ticksEl.children];
const lotNum=document.getElementById('lotNum'),lotLabel=document.getElementById('lotLabel'),lotChips=document.getElementById('lotChips');
function chipsFor(l){
  const s=I.S();
  let h=FOUNDER.has(l.id)?`<span class="chip f">${s.founder}</span>`:'';
  h+=l.side==='creek'?`<span class="chip cr">${s.creek}</span>`:`<span class="chip fo">${s.forest}</span>`;
  h+=`<span class="chip">${fmtArea(l.area)}</span>`;
  return h;
}
let shownIdx=-2;
function setPanel(idx,force){
  if(idx===shownIdx&&!force)return;shownIdx=idx;const s=I.S();
  ticks.forEach((t,i)=>t.classList.toggle('on',i<=idx));
  if(idx<0){lotNum.textContent='00';lotLabel.textContent=s.start;lotChips.innerHTML=`<span class="chip">${s.entry}</span>`;return}
  const l=order[idx];lotNum.textContent=String(l.id).padStart(2,'0');lotLabel.textContent=s.lot(l.id);lotChips.innerHTML=chipsFor(l);
}
setPanel(-1,true);
I.on(()=>setPanel(shownIdx,true));

function buildPlan(){
  const renderer=new THREE.WebGLRenderer({canvas:pc,antialias:true,powerPreference:'high-performance'});
  renderer.setPixelRatio(Math.min(devicePixelRatio||1,2));
  renderer.outputColorSpace=THREE.SRGBColorSpace;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.08;
  renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFShadowMap;
  const scene=new THREE.Scene();
  const bg=new THREE.Color('#071a12');scene.background=bg;scene.fog=new THREE.Fog(bg,420,1150);
  const camera=new THREE.PerspectiveCamera(36,1,1,3000);
  scene.add(new THREE.HemisphereLight('#e6eef2','#0a2015',1.05));
  const sun=new THREE.DirectionalLight('#fffaf0',2.1);sun.position.set(200,260,-60);sun.target.position.set(-20,0,-195);
  sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);const sc=sun.shadow.camera;sc.left=-270;sc.right=270;sc.top=270;sc.bottom=-270;sc.near=10;sc.far=800;sun.shadow.bias=-.0008;sun.shadow.normalBias=.6;
  scene.add(sun,sun.target);

  const V=(x,y,h=0)=>new THREE.Vector3(x,h,-y);
  const shapeOf=(pts,holes)=>{const s=new THREE.Shape();pts.forEach((p,i)=>i?s.lineTo(p[0],p[1]):s.moveTo(p[0],p[1]));
    (holes||[]).forEach(hp=>{const h=new THREE.Path();hp.forEach((p,i)=>i?h.lineTo(p[0],p[1]):h.moveTo(p[0],p[1]));s.holes.push(h)});return s};
  const flat=g=>{g.rotateX(-Math.PI/2);return g};
  const std=(c,r=.95,extra={})=>new THREE.MeshStandardMaterial(Object.assign({color:c,roughness:r},extra));
  const plane=(pts,holes,color,h,r)=>{const m=new THREE.Mesh(flat(new THREE.ShapeGeometry(shapeOf(pts,holes),2)),std(color,r));m.position.y=h;m.receiveShadow=true;scene.add(m);return m};

  const ground=new THREE.Mesh(new THREE.PlaneGeometry(2600,2600),std('#0f2c1d',1));
  ground.rotation.x=-Math.PI/2;ground.position.set(0,-.02,-195);ground.receiveShadow=true;scene.add(ground);
  plane(PLAN.outline,null,'#2a5a3b',.04,1);
  plane(PLAN.green,null,'#3d7a4b',.05,1);  // reserved area: left green on purpose
  scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(PLAN.outline.map(p=>V(p[0],p[1],.5))),new THREE.LineBasicMaterial({color:'#f5f2ea',transparent:true,opacity:.85})));
  // main road: sidewalks and planting strips, asphalt, three central parks
  plane(PLAN.corridor,null,'#dccfae',.12,.9);
  plane(PLAN.asphalt.outer,PLAN.asphalt.holes,'#5b615e',.16,.9);
  PLAN.parks.forEach(p=>{plane(p,null,'#5d9e5b',.24,1);
    scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(p.map(q=>V(q[0],q[1],.3))),new THREE.LineBasicMaterial({color:'#e3d3ae',transparent:true,opacity:.6})))});
  function ribbon(pts2,width,h,color,emissive){
    const curve=new THREE.CatmullRomCurve3(pts2.map(p=>V(p[0],p[1],h)),false,'centripetal');
    const n=260,pos=[],idx=[];
    for(let i=0;i<=n;i++){const t=i/n;const p=curve.getPoint(t),d=curve.getTangent(t);const nx=-d.z,nz=d.x;const L=Math.hypot(nx,nz)||1;
      pos.push(p.x+nx/L*width/2,h,p.z+nz/L*width/2,p.x-nx/L*width/2,h,p.z-nz/L*width/2);
      if(i<n){const a=i*2;idx.push(a,a+1,a+2,a+1,a+3,a+2)}}
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setIndex(idx);g.computeVertexNormals();
    const m=new THREE.Mesh(g,std(color,.85,{emissive:emissive||'#000',emissiveIntensity:emissive?.35:0,side:THREE.DoubleSide}));m.receiveShadow=true;scene.add(m);return {m,curve};
  }
  const creek=ribbon(PLAN.creek,5,.32,'#5ea3bd','#2a6f88');
  const trail=ribbon(PLAN.trail,3,.1,'#c9a97a');
  ribbon(PLAN.access,8,.08,'#1d211f');
  // one-way arrows
  const arrowShape=new THREE.Shape();arrowShape.moveTo(1.8,0);arrowShape.lineTo(-1.1,1.05);arrowShape.lineTo(-.5,0);arrowShape.lineTo(-1.1,-1.05);arrowShape.lineTo(1.8,0);
  const arrowGeo=flat(new THREE.ShapeGeometry(arrowShape));const arrowMat=new THREE.MeshBasicMaterial({color:'#f5f2ea',transparent:true,opacity:.85});
  PLAN.arrows.forEach(([x,y,a])=>{const m=new THREE.Mesh(arrowGeo,arrowMat);m.position.copy(V(x,y,.2));m.rotation.y=a;scene.add(m)});
  // entrance: guardhouse at the main easement (S.P.), gate and two royal palms
  const gh=new THREE.Group();
  const ghb=new THREE.Mesh(new THREE.BoxGeometry(4.5,3,4.5),std('#efe9dc',.8));ghb.position.y=1.5;ghb.castShadow=true;gh.add(ghb);
  const ghr=new THREE.Mesh(new THREE.ConeGeometry(4.2,2,4),std('#20262a',.7));ghr.rotation.y=Math.PI/4;ghr.position.y=4;ghr.castShadow=true;gh.add(ghr);
  gh.position.copy(V(PLAN.guard[0],PLAN.guard[1],0));scene.add(gh);
  const gate3=new THREE.Mesh(new THREE.BoxGeometry(9,.35,.35),std('#8a6a45',.8));gate3.position.copy(V(PLAN.gate[0],PLAN.gate[1],1.4));scene.add(gate3);
  function palm(x,y){const g=new THREE.Group();
    const t=new THREE.Mesh(new THREE.CylinderGeometry(.4,.65,12,10),std('#bfb8a6',.9));t.position.y=6;t.castShadow=true;g.add(t);
    const fm=std('#3f8a4c',.8,{side:THREE.DoubleSide});
    for(let i=0;i<10;i++){const f=new THREE.Mesh(new THREE.PlaneGeometry(1.5,7),fm);f.geometry.translate(0,3.5,0);f.position.y=12;f.rotation.order='YXZ';f.rotation.y=i/10*Math.PI*2;f.rotation.x=-1.05-(i%2)*.3;f.castShadow=true;g.add(f)}
    g.position.copy(V(x,y,0));scene.add(g)}
  palm(PLAN.gate[0]-7.5,PLAN.gate[1]-3);palm(PLAN.gate[0]+7.5,PLAN.gate[1]-3);

  // helpers
  const pip=(x,y,poly)=>{let c=false;for(let i=0,j=poly.length-1;i<poly.length;j=i++){const [xi,yi]=poly[i],[xj,yj]=poly[j];if(((yi>y)!==(yj>y))&&(x<(xj-xi)*(y-yi)/(yj-yi)+xi))c=!c}return c};
  const segD=(px,py,a,b)=>{const dx=b[0]-a[0],dy=b[1]-a[1];const t=clamp(((px-a[0])*dx+(py-a[1])*dy)/(dx*dx+dy*dy));return Math.hypot(px-a[0]-t*dx,py-a[1]-t*dy)};
  const polyD=(x,y,pts,closed)=>{let m=1e9;for(let i=0;i<pts.length-(closed?0:1);i++)m=Math.min(m,segD(x,y,pts[i],pts[(i+1)%pts.length]));return m};
  let seed=11;const rnd=()=>{seed=(seed*16807)%2147483647;return seed/2147483647};
  const m4=new THREE.Matrix4(),q=new THREE.Quaternion(),sv=new THREE.Vector3(),pv=new THREE.Vector3(),col=new THREE.Color();
  const treeGeo=new THREE.IcosahedronGeometry(1,1);
  const COUNT=2600;const trees=new THREE.InstancedMesh(treeGeo,std('#ffffff',.95,{flatShading:true}),COUNT);trees.castShadow=true;trees.receiveShadow=true;
  const greens=['#1d4a2c','#245636','#1a3f27','#2d6340','#163a24','#2f5a2f'];
  let placed=0,guard=0;
  while(placed<COUNT&&guard<90000){guard++;
    const x=-280+rnd()*480,y=-110+rnd()*600;
    if(pip(x,y,PLAN.outline)||polyD(x,y,PLAN.outline,true)<4)continue;
    if(pip(x,y,PLAN.green)||polyD(x,y,PLAN.green,true)<3)continue;
    if(polyD(x,y,PLAN.creek,false)<5)continue;
    if(polyD(x,y,PLAN.trail,false)<3.5)continue;
    if(polyD(x,y,PLAN.access,false)<7)continue;
    const r=2.6+rnd()*4.2;sv.set(r*(.9+rnd()*.3),r*(.8+rnd()*.5),r*(.9+rnd()*.3));pv.set(x,r*.75,-y);q.setFromEuler(new THREE.Euler(0,rnd()*6.28,0));
    m4.compose(pv,q,sv);trees.setMatrixAt(placed,m4);col.set(greens[(rnd()*greens.length)|0]).offsetHSL(0,0,(rnd()-.5)*.05);trees.setColorAt(placed,col);placed++}
  trees.count=placed;scene.add(trees);
  const PT=70;const ptrees=new THREE.InstancedMesh(treeGeo,std('#ffffff',.9,{flatShading:true}),PT);ptrees.castShadow=true;
  let pp=0;guard=0;
  while(pp<PT&&guard<9000){guard++;
    const pk=PLAN.parks[(rnd()*PLAN.parks.length)|0];let mnx=1e9,mxx=-1e9,mny=1e9,mxy=-1e9;pk.forEach(([a,b])=>{mnx=Math.min(mnx,a);mxx=Math.max(mxx,a);mny=Math.min(mny,b);mxy=Math.max(mxy,b)});
    const x=mnx+rnd()*(mxx-mnx),y=mny+rnd()*(mxy-mny);
    if(!pip(x,y,pk)||polyD(x,y,pk,true)<1.8)continue;
    const r=1.3+rnd()*1.4;sv.set(r,r*1.15,r);pv.set(x,r*1.25+.25,-y);q.identity();m4.compose(pv,q,sv);ptrees.setMatrixAt(pp,m4);
    col.set(['#4f9a50','#3f8a48','#5aa55a'][(rnd()*3)|0]);ptrees.setColorAt(pp,col);pp++}
  ptrees.count=pp;scene.add(ptrees);

  // homesites + homes
  const wallMat=std('#efe9dc',.8),roofMat=std('#262c2f',.7),porchMat=std('#8a6745',.8),terrMat=std('#d8c9a5',.9);
  const glassMat=std('#9fc4cf',.15,{metalness:.2,emissive:'#244a55',emissiveIntensity:.25});
  function house(){
    const g=new THREE.Group();const HW=12,HD=16;
    const b=new THREE.Mesh(new THREE.BoxGeometry(HW,3.6,HD),wallMat);b.position.y=1.8;b.castShadow=true;b.receiveShadow=true;g.add(b);
    const r=new THREE.Mesh(new THREE.ConeGeometry(1,1,4,1),roofMat);r.rotation.y=Math.PI/4;r.scale.set(HW/Math.SQRT2*1.16,3.6,HD/Math.SQRT2*1.12);r.position.y=3.6+1.8;r.castShadow=true;g.add(r);
    const p=new THREE.Mesh(new THREE.BoxGeometry(HW,.35,3),porchMat);p.position.set(0,.18,HD/2+1.5);p.receiveShadow=true;g.add(p);
    const t=new THREE.Mesh(new THREE.BoxGeometry(HW-1,.25,3.4),terrMat);t.position.set(0,.12,-HD/2-1.7);g.add(t);
    const w=new THREE.Mesh(new THREE.BoxGeometry(7,1.9,.2),glassMat);w.position.set(0,1.9,HD/2+.05);g.add(w);
    return g;
  }
  function label(n,founder){
    const c=document.createElement('canvas');c.width=c.height=128;const x=c.getContext('2d');
    x.fillStyle=founder?'#e3d3ae':'#f5f2ea';x.beginPath();x.arc(64,64,56,0,7);x.fill();
    x.fillStyle='#04120c';x.font='600 58px -apple-system,BlinkMacSystemFont,"Hanken Grotesk",sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText(n,64,68);
    const tx=new THREE.CanvasTexture(c);tx.colorSpace=THREE.SRGBColorSpace;
    const s=new THREE.Sprite(new THREE.SpriteMaterial({map:tx,transparent:true,depthWrite:false,opacity:0}));s.scale.set(6,6,1);s.renderOrder=10;return s;
  }
  // text tags for the creek, the private trail and the entrance (redrawn on language change)
  const tags=[];
  function tag(key,x,y,h,w){
    const c=document.createElement('canvas');c.width=1024;c.height=128;const tx=new THREE.CanvasTexture(c);tx.colorSpace=THREE.SRGBColorSpace;
    const s=new THREE.Sprite(new THREE.SpriteMaterial({map:tx,transparent:true,depthWrite:false,depthTest:false,opacity:0}));s.scale.set(w,w/8,1);s.position.copy(V(x,y,h));s.renderOrder=12;scene.add(s);
    const o={key,c,tx,s};tags.push(o);paintTag(o);return o;
  }
  function paintTag(o){
    const x=o.c.getContext('2d');x.clearRect(0,0,1024,128);const t=I.S().tags[o.key];
    x.font='600 50px -apple-system,BlinkMacSystemFont,"Hanken Grotesk",sans-serif';const w=Math.min(1000,x.measureText(t).width+70);
    x.fillStyle='rgba(4,18,12,.78)';const r=40,X=(1024-w)/2,Y=24,H=80;x.beginPath();x.moveTo(X+r,Y);x.arcTo(X+w,Y,X+w,Y+H,r);x.arcTo(X+w,Y+H,X,Y+H,r);x.arcTo(X,Y+H,X,Y,r);x.arcTo(X,Y,X+w,Y,r);x.fill();
    x.fillStyle='#f5f2ea';x.textAlign='center';x.textBaseline='middle';x.fillText(t,512,66);o.tx.needsUpdate=true;
  }
  const tm=PLAN.trail[Math.floor(PLAN.trail.length/2)],cm=PLAN.creek[18];
  tag('trail',tm[0],tm[1]-8,10,100);tag('creek',cm[0]+22,cm[1],12,72);tag('entry',PLAN.gate[0]-40,PLAN.gate[1]-14,10,80);
  I.on(()=>tags.forEach(paintTag));

  const lotObjs=[];const pickables=[];
  order.forEach((l,k)=>{
    const founder=FOUNDER.has(l.id);
    const base=l.side==='creek'?'#4d8f5f':'#3a7350';
    const geo=flat(new THREE.ExtrudeGeometry(shapeOf(l.poly),{depth:.9,bevelEnabled:false}));
    const mat=std(base,.95,{transparent:true,opacity:0,emissive:founder?'#c9b27e':'#000000',emissiveIntensity:0});
    const mesh=new THREE.Mesh(geo,mat);mesh.receiveShadow=true;mesh.visible=false;scene.add(mesh);pickables.push(mesh);
    const edge=new THREE.Line(new THREE.BufferGeometry().setFromPoints(l.poly.map(p=>V(p[0],p[1],.95))),new THREE.LineBasicMaterial({color:founder?'#e3d3ae':'#f5f2ea',transparent:true,opacity:0}));scene.add(edge);
    const h=house();h.position.copy(V(l.house[0],l.house[1],.9));
    h.rotation.y=Math.atan2(Math.cos(l.face),-Math.sin(l.face));h.visible=false;scene.add(h);
    const lab=label(l.id,founder);lab.position.copy(V(l.house[0],l.house[1],14));scene.add(lab);
    lotObjs.push({l,mesh,mat,edge,h,lab,founder,k,pos:V(l.house[0],l.house[1],0)});
  });

  // camera
  const target=new THREE.Vector3(),camPos=new THREE.Vector3(),tmp=new THREE.Vector3();
  function keys(aspect){
    const desk=aspect>1.1;const tv=Math.tan(36*Math.PI/360);let endLook,endPos;
    if(desk){ // plan lies horizontally, entrance on the left
      const wVis=Math.max(440/0.7,190*aspect);const dist=wVis/2/(tv*aspect);
      endLook=new THREE.Vector3(-10,0,-195+0.205*wVis);endPos=endLook.clone().add(new THREE.Vector3(dist*.36,dist*.93,0));
    }else{
      const dist=Math.max(430/2/tv,230/2/tv/aspect)*1.02;
      endLook=new THREE.Vector3(-15,0,-165);endPos=endLook.clone().add(new THREE.Vector3(0,dist*.94,dist*.34));
    }
    return [
      {p:0,pos:new THREE.Vector3(55,38,45),look:new THREE.Vector3(-8,0,-55)},
      {p:.45,pos:new THREE.Vector3(200,185,-90),look:new THREE.Vector3(-20,0,-200)},
      {p:1,pos:endPos,look:endLook}
    ];
  }
  let K=keys(16/9);
  const drag={on:false,x:0,y:0,yaw:0,pitch:0,ty:0,tp:0};
  pc.addEventListener('pointerdown',e=>{drag.on=true;drag.x=e.clientX;drag.y=e.clientY;pc.setPointerCapture(e.pointerId);pc.style.cursor='grabbing'});
  pc.addEventListener('pointerup',()=>{drag.on=false;pc.style.cursor='grab'});
  const ray=new THREE.Raycaster(),mv=new THREE.Vector2();const tip=document.getElementById('tip');let hovered=null;
  function setHover(o){if(hovered&&hovered!==o){hovered.mat.emissive.set(hovered.founder?'#c9b27e':'#000');hovered.hl=false}hovered=o;if(o){o.mat.emissive.set('#9fd1a8');o.hl=true}}
  pc.addEventListener('pointermove',e=>{
    if(drag.on){drag.ty=clamp(drag.ty+(e.clientX-drag.x)*.004,-.9,.9);drag.tp=clamp(drag.tp+(e.clientY-drag.y)*.002,-.25,.35);drag.x=e.clientX;drag.y=e.clientY}
    const r=pc.getBoundingClientRect();mv.x=(e.clientX-r.left)/r.width*2-1;mv.y=-(e.clientY-r.top)/r.height*2+1;ray.setFromCamera(mv,camera);
    const hit=ray.intersectObjects(pickables.filter(m=>m.visible&&m.material.opacity>.5),false)[0];
    if(hit){const o=lotObjs.find(x=>x.mesh===hit.object);setHover(o);const l=o.l,s=I.S();
      tip.innerHTML=`<b>${s.lotShort} ${l.id}</b> · ${fmtArea(l.area)} · ${l.side==='creek'?s.creek:s.forest}${o.founder?' · '+s.founderShort:''}`;
      tip.style.left=(e.clientX-r.left)+'px';tip.style.top=(e.clientY-r.top)+'px';tip.style.opacity=1}
    else{tip.style.opacity=0;setHover(null)}
  });
  pc.addEventListener('pointerleave',()=>{tip.style.opacity=0;setHover(null)});
  function resize(){const w=pc.clientWidth,h=pc.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();K=keys(w/h)}
  resize();
  const follow=new THREE.Vector3(0,0,-50);
  function update(p,time){
    const N=lotObjs.length;const r=clamp((p-.05)/.76)*N;
    let a=K[0],b=K[1];if(p>K[1].p){a=K[1];b=K[2]}
    const t=ease(clamp((p-a.p)/(b.p-a.p)));
    camPos.lerpVectors(a.pos,b.pos,t);target.lerpVectors(a.look,b.look,t);
    const cur=lotObjs[Math.min(N-1,Math.max(0,Math.floor(r)))].pos;follow.lerp(cur,.06);
    const wgt=.32*Math.sin(Math.PI*clamp((p-.05)/.8));tmp.copy(follow).sub(target).multiplyScalar(wgt);target.add(tmp);camPos.add(tmp);
    drag.yaw+=(drag.ty-drag.yaw)*.08;drag.pitch+=(drag.tp-drag.pitch)*.08;
    const sph=new THREE.Spherical().setFromVector3(camPos.clone().sub(target));
    sph.theta+=drag.yaw+(reduce?0:Math.sin(time*.00012)*.035);sph.phi=clamp(sph.phi+drag.pitch,.05,1.45);
    camera.position.copy(target).add(new THREE.Vector3().setFromSpherical(sph));camera.lookAt(target);
    lotObjs.forEach(o=>{
      const lt=clamp(r-o.k);const e=1-Math.pow(1-lt,3);
      o.mesh.visible=lt>0;o.mesh.position.y=-6*(1-e);o.mat.opacity=e;
      o.edge.material.opacity=e*(o.founder?1:.7);o.edge.position.y=o.mesh.position.y;
      if(o.founder&&!o.hl)o.mat.emissiveIntensity=lt>0?.18+.12*Math.sin(time*.003):0;
      const ht=clamp((r-o.k-.35)/.65);o.h.visible=ht>0;const s=ht>0?Math.max(.001,easeOutBack(ht)):.001;o.h.scale.set(1,s,1);o.h.position.y=.9+(1-ht)*10;
      o.lab.material.opacity=clamp((r-o.k-.6)/.4);
    });
    const ta=clamp((p-.82)/.08);tags.forEach(o=>o.s.material.opacity=o.key==='entry'?Math.max(ta,clamp(1-(p-.02)/.08)):ta);
    setPanel(Math.min(N-1,Math.floor(r))-(r<=0?1:0));
    planEl.classList.toggle('done',p>.86);
    renderer.render(scene,camera);
  }
  return {resize,update};
}
try{
  const test=document.createElement('canvas');
  if(!(test.getContext('webgl2')||test.getContext('webgl')))throw new Error('no webgl');
  R=buildPlan();
}catch(err){planEl.classList.add('nogl')}

/* ---------- Rail ---------- */
const rail=document.getElementById('rail');
document.getElementById('railPrev').onclick=()=>rail.scrollBy({left:-rail.clientWidth*.8,behavior:'smooth'});
document.getElementById('railNext').onclick=()=>rail.scrollBy({left:rail.clientWidth*.8,behavior:'smooth'});

/* ---------- Form → WhatsApp handoff ---------- */
const form=document.getElementById('form'),doneBox=document.getElementById('doneBox'),msgEl=document.getElementById('msg'),err=document.getElementById('formErr');
let msgText='';
form.addEventListener('submit',e=>{
  e.preventDefault();const s=I.S();
  // Nothing is stored or sent from this page: the text is cleaned, length-limited and handed to WhatsApp as plain text.
  const clean=(v,max)=>String(v||'').replace(/[\u0000-\u001f\u007f<>{}\[\]`]/g,'').replace(/\s+/g,' ').trim().slice(0,max);
  const f=new FormData(form);const name=clean(f.get('name'),80),email=clean(f.get('email'),120);
  if(name.length<2||!/^[^\s@]{1,64}@[^\s@]{1,190}\.[A-Za-z]{2,24}$/.test(email)){err.textContent=s.err;return}
  err.textContent='';
  const sel=id=>{const el=document.getElementById(id);return el.options[el.selectedIndex].text};
  msgText=s.msg({name,email,country:clean(f.get('country'),56),look:sel('fLook'),when:sel('fWhen')});
  msgEl.textContent=msgText;
  document.getElementById('waLink').href='https://wa.me/50765348511?text='+encodeURIComponent(msgText);
  form.style.display='none';doneBox.classList.add('on');
});
document.getElementById('copyBtn').addEventListener('click',async e=>{
  const s=I.S();try{await navigator.clipboard.writeText(msgText);e.target.textContent=s.copied}catch{e.target.textContent=s.copyFail}
});

/* ---------- Main loop ---------- */
function frame(time){
  nav.classList.toggle('solid',scrollY>innerHeight*.6);
  const st=document.getElementById('statement');const words=st.children;
  const sr=st.getBoundingClientRect();const sp=clamp((innerHeight*.82-sr.top)/(sr.height+innerHeight*.3));
  if(!reduce)for(let i=0;i<words.length;i++)words[i].style.opacity=(.26+.74*clamp(sp*words.length*1.15-i)).toFixed(3);
  if(inView(orbit)){
    const p=progress(orbit);zoom=reduce?1:zoomAt(p);drawFrame(Math.round(p*(N_FR-1)));updateAnchors(p);
    oBar.style.width=(p*100).toFixed(1)+'%';oPct.textContent=Math.round(p*100)+'%';
    caps.forEach(c=>c.classList.toggle('on',p>=+c.dataset.from&&p<+c.dataset.to));
  }
  if(R&&inView(planEl))R.update(reduce?1:progress(planEl),time);
  requestAnimationFrame(frame);
}
function onResize(){sizeOrbit();drawFrame(Math.max(0,lastFrame),true);updateAnchors(progress(orbit));R&&R.resize()}
addEventListener('resize',onResize);
sizeOrbit();requestAnimationFrame(frame);
