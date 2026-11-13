
(function(){
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const STATIC=!!window.__STATIC;
const C={ink:'#0C140E',forest:'#154F27',cream:'#F7F5EC',copper:'#C68552',sage:'#75B683',muted:'#A3AEA4'};
const loops=new Set();
function frameLoop(){loops.forEach(f=>{if(f.vis) f()});requestAnimationFrame(frameLoop)}
requestAnimationFrame(frameLoop);
function visWatch(el,obj){if(!('IntersectionObserver' in window)){obj.vis=true;return}new IntersectionObserver(es=>es.forEach(e=>obj.vis=e.isIntersecting),{rootMargin:'100px'}).observe(el)}
function fit(cv){const r=cv.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2);if(!r.width)return false;const w=Math.round(r.width*d),h=Math.round(r.height*d);if(cv.width!==w||cv.height!==h){cv.width=w;cv.height=h}return d}

/* ---------- Orbit system canvas (hero / cta / soft) ---------- */
function orbitCanvas(cv,mode){
  const ctx=cv.getContext('2d');let t=Math.random()*10, mx=0,my=0;
  const labels=[['Ads','#C68552'],['Search & AI','#75B683'],['Website','#F7F5EC'],['Messaging','#75B683']];
  const stars=Array.from({length:mode==='soft'?40:90},()=>[Math.random(),Math.random(),Math.random()*1.2+.3,Math.random()]);
  if(mode==='hero') addEventListener('pointermove',e=>{mx=e.clientX/innerWidth-.5;my=e.clientY/innerHeight-.5},{passive:true});
  function draw(){
    const d=fit(cv);if(!d)return;const w=cv.width,h=cv.height;ctx.clearRect(0,0,w,h);
    t+=reduce||STATIC?0:.0035;
    for(const s of stars){ctx.fillStyle=`rgba(247,245,236,${.12+.25*Math.abs(Math.sin(t*2+s[3]*6))})`;ctx.beginPath();ctx.arc(s[0]*w,s[1]*h,s[2]*d,0,7);ctx.fill()}
    let cx,cy,R;
    if(mode==='hero'){const narrow=w/d<900;cx=w*(narrow?.5:.7)+mx*24*d;cy=h*(narrow?.3:.42)+my*18*d;R=Math.min(w*(narrow?.46:.3),h*.5)}
    else if(mode==='cta'){cx=w*.82;cy=h*.5;R=Math.min(w*.32,h*.75)}
    else {cx=w*.88;cy=h*.15;R=Math.min(w*.42,h*1.1)}
    const tilt=-.22, sy=mode==='soft'?.45:.4;
    const rings=[.42,.62,.82,1];
    // back halves + planets behind
    const planets=rings.map((rr,i)=>{const a=t*(1.6-i*.28)+i*1.7;return {rr,i,a,x:Math.cos(a),y:Math.sin(a)}});
    function ringPath(rr,from,to){ctx.beginPath();ctx.ellipse(cx,cy,R*rr,R*rr*sy,tilt,from,to)}
    rings.forEach(rr=>{ringPath(rr,Math.PI,Math.PI*2);ctx.strokeStyle='rgba(117,182,131,.16)';ctx.lineWidth=1*d;ctx.stroke()});
    const pos=p=>{const ex=Math.cos(p.a)*R*p.rr, ey=Math.sin(p.a)*R*p.rr*sy;return [cx+ex*Math.cos(tilt)-ey*Math.sin(tilt), cy+ex*Math.sin(tilt)+ey*Math.cos(tilt)]};
    const drawPlanet=(p,front)=>{const [x,y]=pos(p);const col=labels[p.i][1];const r=(p.i===0?9:6.5)*d*(front?1:.8);
      ctx.globalAlpha=front?1:.45;const g=ctx.createRadialGradient(x,y,0,x,y,r*4);g.addColorStop(0,col+'55');g.addColorStop(1,col+'00');ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r*4,0,7);ctx.fill();
      ctx.fillStyle=col;ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.fill();
      if(mode==='hero'&&front){ctx.font=`${11*d}px "JetBrains Mono",monospace`;ctx.fillStyle='rgba(247,245,236,.75)';ctx.fillText(labels[p.i][0].toUpperCase(),x+r+8*d,y+4*d)}
      ctx.globalAlpha=1};
    planets.filter(p=>Math.sin(p.a)<0).forEach(p=>drawPlanet(p,false));
    // core
    const cr=R*.16;const g=ctx.createRadialGradient(cx-cr*.3,cy-cr*.3,cr*.1,cx,cy,cr*3.2);g.addColorStop(0,'rgba(117,182,131,.35)');g.addColorStop(1,'rgba(21,79,39,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(cx,cy,cr*3.2,0,7);ctx.fill();
    const g2=ctx.createRadialGradient(cx-cr*.35,cy-cr*.35,cr*.1,cx,cy,cr);g2.addColorStop(0,'#2d8a4a');g2.addColorStop(1,C.forest);ctx.fillStyle=g2;ctx.beginPath();ctx.arc(cx,cy,cr,0,7);ctx.fill();
    if(mode==='hero'){ctx.font=`${11*d}px "JetBrains Mono",monospace`;ctx.fillStyle='rgba(247,245,236,.85)';ctx.textAlign='center';ctx.fillText('YOUR BRAND',cx,cy+4*d);ctx.textAlign='left'}
    rings.forEach(rr=>{ringPath(rr,0,Math.PI);ctx.strokeStyle='rgba(117,182,131,.32)';ctx.lineWidth=1*d;ctx.stroke()});
    planets.filter(p=>Math.sin(p.a)>=0).forEach(p=>drawPlanet(p,true));
  }
  const o={vis:false};o.f=draw;visWatch(cv,o);const f=()=>draw();f.vis=true;
  const wrapper=()=>{if(o.vis) draw()};wrapper.vis=true;loops.add(wrapper);draw();
}

/* ---------- Performance illustration: audience dots, reticle finds customers ---------- */
function perfCanvas(cv){
  const ctx=cv.getContext('2d');let dots=[],target={x:.5,y:.5},ret={x:.5,y:.5},timer=0,t=0;
  function seed(){dots=Array.from({length:110},()=>({x:Math.random(),y:.12+Math.random()*.76,vx:(Math.random()-.5)*.0006,vy:(Math.random()-.5)*.0006,c:false,k:Math.random()}))}
  seed();
  function pick(){const cand=dots.filter(d=>!d.c);if(cand.length<70){seed();return}const d=cand[(Math.random()*cand.length)|0];target={x:d.x,y:d.y}}
  function draw(){
    const d=fit(cv);if(!d)return;const w=cv.width,h=cv.height;ctx.clearRect(0,0,w,h);
    if(!(reduce||STATIC)){t++;timer++;if(timer>110){timer=0;pick()}}
    ret.x+=(target.x-ret.x)*.06;ret.y+=(target.y-ret.y)*.06;
    const rr=.13*Math.min(w,h);
    for(const p of dots){if(!(reduce||STATIC)){p.x+=p.vx;p.y+=p.vy;if(p.x<.03||p.x>.97)p.vx*=-1;if(p.y<.1||p.y>.9)p.vy*=-1}
      const dx=(p.x-ret.x)*w,dy=(p.y-ret.y)*h;if(timer>60&&dx*dx+dy*dy<rr*rr*.6&&p.k>.45)p.c=true;
      ctx.fillStyle=p.c?C.copper:'rgba(247,245,236,.28)';ctx.beginPath();ctx.arc(p.x*w,p.y*h,(p.c?3.2:2)*d,0,7);ctx.fill();
      if(p.c){ctx.strokeStyle='rgba(198,133,82,.35)';ctx.lineWidth=1*d;ctx.beginPath();ctx.arc(p.x*w,p.y*h,6*d,0,7);ctx.stroke()}}
    const x=ret.x*w,y=ret.y*h;ctx.strokeStyle='rgba(117,182,131,.9)';ctx.lineWidth=1.2*d;
    ctx.beginPath();ctx.arc(x,y,rr,0,7);ctx.stroke();
    ctx.setLineDash([3*d,5*d]);ctx.beginPath();ctx.arc(x,y,rr*1.5,t*.01,t*.01+7);ctx.stroke();ctx.setLineDash([]);
    [[0,-1],[0,1],[-1,0],[1,0]].forEach(([a,b])=>{ctx.beginPath();ctx.moveTo(x+a*rr*.75,y+b*rr*.75);ctx.lineTo(x+a*rr*1.15,y+b*rr*1.15);ctx.stroke()});
    ctx.font=`${10*d}px "JetBrains Mono",monospace`;ctx.fillStyle='rgba(247,245,236,.7)';
    ctx.fillStyle='rgba(247,245,236,.4)';ctx.beginPath();ctx.arc(18*d,h-20*d,3*d,0,7);ctx.fill();ctx.fillStyle='rgba(247,245,236,.6)';ctx.fillText('REACHED',27*d,h-16*d);
    ctx.fillStyle=C.copper;ctx.beginPath();ctx.arc(108*d,h-20*d,3*d,0,7);ctx.fill();ctx.fillStyle='rgba(247,245,236,.6)';ctx.fillText('BECAME CUSTOMERS',117*d,h-16*d);
  }
  if(STATIC){dots.forEach(p=>{if(Math.hypot(p.x-.5,p.y-.5)<.16&&p.k>.45)p.c=true})}
  const o={vis:false};visWatch(cv,o);const f=()=>{if(o.vis)draw()};f.vis=true;loops.add(f);draw();
}

/* ---------- Lifecycle illustration: messages travel the loop back to the customer ---------- */
function lifeCanvas(cv){
  const ctx=cv.getContext('2d');let t=0;
  const nodes=['WELCOME','ACTIVATE','RETURN','BUY AGAIN'];
  const chans=[['EMAIL',C.cream],['SMS',C.sage],['WHATSAPP',C.copper],['PUSH',C.sage]];
  function draw(){
    const d=fit(cv);if(!d)return;const w=cv.width,h=cv.height;ctx.clearRect(0,0,w,h);if(!(reduce||STATIC))t+=.006;
    const cx=w/2,cy=h/2,R=Math.min(w*.32,h*.36);
    ctx.strokeStyle='rgba(117,182,131,.3)';ctx.lineWidth=1.2*d;ctx.beginPath();ctx.ellipse(cx,cy,R*1.35,R,0,0,7);ctx.stroke();
    ctx.setLineDash([2*d,6*d]);ctx.beginPath();ctx.ellipse(cx,cy,R*1.35*.62,R*.62,0,0,7);ctx.stroke();ctx.setLineDash([]);
    // center customer
    ctx.fillStyle=C.forest;ctx.beginPath();ctx.arc(cx,cy,R*.24,0,7);ctx.fill();
    ctx.fillStyle=C.cream;ctx.beginPath();ctx.arc(cx,cy-R*.06,R*.07,0,7);ctx.fill();ctx.beginPath();ctx.ellipse(cx,cy+R*.1,R*.11,R*.07,0,Math.PI,0);ctx.fill();
    ctx.font=`${10*d}px "JetBrains Mono",monospace`;ctx.textAlign='center';
    nodes.forEach((n,i)=>{const a=-Math.PI/2+i*Math.PI/2;const x=cx+Math.cos(a)*R*1.35,y=cy+Math.sin(a)*R;
      ctx.fillStyle='#0A110C';ctx.strokeStyle='rgba(117,182,131,.6)';ctx.beginPath();ctx.arc(x,y,5*d,0,7);ctx.fill();ctx.stroke();
      ctx.fillStyle='rgba(247,245,236,.7)';const off=i===0?-14:(i===2?22:4);const xo=i===1?14:(i===3?-14:0);ctx.textAlign=i===1?'left':(i===3?'right':'center');ctx.fillText(n,x+xo*d,y+off*d)});
    ctx.textAlign='center';
    chans.forEach((c,i)=>{const a=t*2+i*Math.PI/2;const x=cx+Math.cos(a)*R*1.35,y=cy+Math.sin(a)*R;
      const g=ctx.createRadialGradient(x,y,0,x,y,16*d);g.addColorStop(0,c[1]+'66');g.addColorStop(1,c[1]+'00');ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,16*d,0,7);ctx.fill();
      const bw=ctx.measureText(c[0]).width+14*d;ctx.fillStyle=c[1];roundRect(x-bw/2,y-9*d,bw,18*d,9*d);ctx.fill();ctx.fillStyle=C.ink;ctx.fillText(c[0],x,y+3.5*d)});
    ctx.textAlign='left';
    function roundRect(x,y,w2,h2,r){ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w2,y,x+w2,y+h2,r);ctx.arcTo(x+w2,y+h2,x,y+h2,r);ctx.arcTo(x,y+h2,x,y,r);ctx.arcTo(x,y,x+w2,y,r);ctx.closePath()}
  }
  const o={vis:false};visWatch(cv,o);const f=()=>{if(o.vis)draw()};f.vis=true;loops.add(f);draw();
}

/* ---------- Search & AI: question typed, answer recommends the brand ---------- */
function searchDom(el){
  el.innerHTML=`<div class="ai-tag"><span class="on">ChatGPT</span><span>Gemini</span><span>Perplexity</span></div><div class="chat"><div class="bubble q"><span class="qt"></span></div><div class="bubble a"><span class="at"></span></div></div>`;
  const qs=[['Which savings app should I use in Lagos?','Most people recommend <span class="brand">YourBrand</span> for flexible savings, with daily interest and no hidden fees.'],['Best business account for a small shop in Abuja?','<span class="brand">YourBrand</span> comes up often. It\'s quick to open and has free transfers for small businesses.'],['Which bank app is easiest to open an account with?','Many users say <span class="brand">YourBrand</span>. You can open an account in minutes with just your BVN.']];
  const q=el.querySelector('.qt'),a=el.querySelector('.at'),qb=el.querySelector('.q'),ab=el.querySelector('.a'),tags=[...el.querySelectorAll('.ai-tag span')];
  if(reduce||STATIC){q.textContent=qs[0][0];a.innerHTML=qs[0][1];return}
  let i=0,started=false;
  function run(){const [qq,aa]=qs[i%qs.length];tags.forEach((s,k)=>s.classList.toggle('on',k===i%3));q.textContent='';a.innerHTML='';qb.classList.remove('hide');ab.classList.add('hide');q.parentElement.classList.add('caret');
    let n=0;(function type(){n++;q.textContent=qq.slice(0,n);if(n<qq.length)setTimeout(type,38);else{q.parentElement.classList.remove('caret');setTimeout(()=>{a.innerHTML=aa;ab.classList.remove('hide');setTimeout(()=>{i++;run()},3800)},500)}})()}
  new IntersectionObserver((es,io)=>{if(es[0].isIntersecting&&!started){started=true;run();io.disconnect()}},{threshold:.3}).observe(el);
}

/* ---------- Conversion: 8 steps collapse to 3, a user makes it through ---------- */
function convDom(el){
  el.innerHTML=`<div class="steps-illus"><div class="steps-row">${Array.from({length:8},(_,i)=>`<i data-s="${i}">${i+1}</i>`).join('')}</div><div class="steps-caption"></div></div>`;
  const steps=[...el.querySelectorAll('i')],cap=el.querySelector('.steps-caption');const keep=[0,4,7];
  function setCap(s){cap.innerHTML=s}
  if(reduce||STATIC){steps.forEach((s,i)=>{if(!keep.includes(i))s.classList.add('gone');else s.classList.add('done')});steps.forEach((s,k)=>{if(keep.includes(k))s.textContent=keep.indexOf(k)+1});setCap('<b>3 steps</b> · sign-up complete');return}
  let started=false;
  function cycle(){steps.forEach((s,i)=>{s.className='';s.textContent=i+1});setCap('Sign-up: <b>8 steps</b>');
    let k=0;const walk=setInterval(()=>{if(k>0)steps[k-1].classList.replace('now','done');if(k===3){clearInterval(walk);steps[2].classList.add('now');setCap('<b>Dropped off</b> at step 3 of 8');setTimeout(fix,1600);return}steps[k].classList.add('now');k++},450);}
  function fix(){steps.forEach(s=>s.className='');setCap('We remove what isn\'t needed…');steps.forEach((s,i)=>{if(!keep.includes(i))setTimeout(()=>s.classList.add('gone'),200+i*80)});
    setTimeout(()=>{keep.forEach((k,j)=>steps[k].textContent=j+1);let j=0;const w=setInterval(()=>{if(j>0)steps[keep[j-1]].classList.replace('now','done');if(j===3){clearInterval(w);setCap('<b>3 steps</b> · sign-up complete');setTimeout(cycle,2600);return}steps[keep[j]].classList.add('now');j++},500)},1300)}
  new IntersectionObserver((es,io)=>{if(es[0].isIntersecting&&!started){started=true;cycle();io.disconnect()}},{threshold:.3}).observe(el);
}

/* ---------- Journal covers + posts ---------- */
const POSTS=[
 ['A famous name isn\'t the same as a trusted one','Brand & Strategy'],
 ['Why your brand team and growth team should be one team','Brand & Strategy'],
 ['What ChatGPT says when Nigerians ask for a recommendation','Search & AI'],
 ['Your ads are fine. Your landing page is the problem.','Conversion'],
 ['Why fintech users go quiet after sign-up','Lifecycle'],
 ['What we test in Meta creative every week','Performance'],
 ['Cheap clicks are expensive','Performance'],
 ['WhatsApp is the most underused retention channel in Nigeria','Lifecycle']];
function cover(i,cat){
  const bg=['#0E2A17','#154F27','#13201A','#1B3524'][i%4];const acc=cat==='Performance'||cat==='Conversion'?'#C68552':'#75B683';
  const rot=(i*37)%180, r1=30+(i*7)%25, cx=55+(i*13)%35, cy=35+(i*11)%35;
  return `<svg viewBox="0 0 160 120" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><rect width="160" height="120" fill="${bg}"/><g transform="rotate(${rot} ${cx} ${cy})" fill="none" stroke="#F7F5EC" stroke-opacity=".22" stroke-width=".6"><ellipse cx="${cx}" cy="${cy}" rx="${r1+30}" ry="${(r1+30)*.42}"/><ellipse cx="${cx}" cy="${cy}" rx="${r1+14}" ry="${(r1+14)*.42}"/><ellipse cx="${cx}" cy="${cy}" rx="${r1}" ry="${r1*.42}"/></g><circle cx="${cx}" cy="${cy}" r="${8+i%4*2}" fill="#154F27" stroke="#75B683" stroke-opacity=".5" stroke-width=".6"/><circle cx="${cx+(r1+14)*.8}" cy="${cy-6}" r="3.2" fill="${acc}"/><text x="10" y="112" font-family="JetBrains Mono, monospace" font-size="5.5" fill="#F7F5EC" fill-opacity=".55" letter-spacing=".5">NO. ${String(i+1).padStart(2,'0')}</text></svg>`}
document.querySelectorAll('[data-cover]').forEach(c=>{if(!c.querySelector('img'))c.innerHTML=cover(+c.dataset.cover,c.dataset.cat||'')});

/* ---------- Raven + orbit illustration (About) ---------- */
(function(){const s=document.getElementById('ravenSvg');if(!s)return;
 s.innerHTML=`<defs><radialGradient id="rg" cx=".4" cy=".35"><stop offset="0" stop-color="#2d8a4a"/><stop offset="1" stop-color="#154F27"/></radialGradient></defs>
 <g fill="none" stroke="#154F27" stroke-opacity=".35"><ellipse cx="200" cy="210" rx="180" ry="70" transform="rotate(-14 200 210)"/><ellipse cx="200" cy="210" rx="130" ry="50" transform="rotate(-14 200 210)" stroke-dasharray="3 6"/></g>
 <circle cx="200" cy="210" r="96" fill="url(#rg)"/>
 <path d="M150 238c18-6 30-22 40-40 8-14 20-26 38-28 12-1 22 4 28 12l18 2-14 10c2 20-8 38-28 48-16 8-36 8-52 6-12-2-22-4-30-10Z" fill="#101910"/>
 <path d="M166 236c22-2 46-16 60-36" stroke="#2a3a2d" stroke-width="3" fill="none" stroke-linecap="round"/>
 <path d="M150 238l-26 14 30-4" fill="#101910"/>
 <circle cx="248" cy="186" r="3.5" fill="#C68552"/>
 <path d="M200 250v18M214 249v19" stroke="#101910" stroke-width="3" stroke-linecap="round"/>
 <g id="ravenPlanet"><circle cx="0" cy="0" r="12" fill="#A36B44"/></g>`;
 const p=s.querySelector('#ravenPlanet');let t=0;
 const f=()=>{if(!(reduce||STATIC))t+=.008;const a=t;const x=Math.cos(a)*180,y=Math.sin(a)*70;const r=-14*Math.PI/180;p.setAttribute('transform',`translate(${200+x*Math.cos(r)-y*Math.sin(r)} ${210+x*Math.sin(r)+y*Math.cos(r)})`);p.style.opacity=Math.sin(a)<-.2&&Math.abs(x)<90?.25:1};f.vis=true;loops.add(f);f();
})();

/* ---------- Team avatars orbit ---------- */
document.querySelectorAll('.avatar').forEach((a,i)=>{const o=a.querySelector('.orbiter');if(!o)return;let t=i*2;const f=()=>{if(!(reduce||STATIC))t+=.012;o.setAttribute('cx',48+Math.cos(t)*44);o.setAttribute('cy',48+Math.sin(t)*44)};f.vis=true;loops.add(f);f()});

/* ---------- Client logo marquee ---------- */
(function(){const L=[['access','Access Bank','#fff'],['lg','LG','#fff'],['quidax','Quidax','#fff'],['unilever','Unilever','#120f94'],['diageo','Diageo','#fff'],['chicken','Chicken Republic','#ff0000'],['premiumtrust','PremiumTrust Bank','#fff'],['kelloggs',"Kellogg's Nigeria",'#fff'],['gino','Gino','#fff'],['kerrygold','Kerrygold','#fff'],['multigate','Multigate','#fff'],['mixta','Mixta Africa','#fff'],['mainsqueeze','MainSqueeze','#fff']];
 const tall=['unilever','chicken','lg','kerrygold','mainsqueeze'];
 const tile=(l,hide)=>`<div class="ltile${tall.includes(l[0])?' tall':''}" style="background:${l[2]}"${hide?' aria-hidden="true"':''}><img src="/assets/img/clients/${l[0]}.png" alt="${hide?'':l[1]}"></div>`;
 const tr=document.getElementById('track');if(tr)tr.innerHTML=L.map(l=>tile(l,false)).join('')+L.map(l=>tile(l,true)).join('');})();

/* ---------- Mount canvases ---------- */
document.querySelectorAll('[data-orbit]').forEach(c=>orbitCanvas(c,c.dataset.orbit));
document.querySelectorAll('[data-illus="performance"]').forEach(perfCanvas);
document.querySelectorAll('[data-illus="lifecycle"]').forEach(lifeCanvas);
document.querySelectorAll('[data-illus-dom="search"]').forEach(searchDom);
document.querySelectorAll('[data-illus-dom="conversion"]').forEach(convDom);

(function(){if(!document.getElementById('problemText'))return;
/* ---------- Problem: word reveal + pieces ---------- */
const pt=document.getElementById('problemText');
pt.querySelectorAll('p').forEach(p=>p.innerHTML=p.textContent.split(' ').map(w=>`<span class="w">${w}</span>`).join(' '));
const words=[...pt.querySelectorAll('.w')];const pmark=document.getElementById('problemMark');
const pieces=document.getElementById('pieces');const orbitEl=document.getElementById('piecesOrbit');
const pcs=[...pieces.querySelectorAll('.piece')];
const JOURNEY={
 apart:{title:'Your customer sees one journey. Most brands build it in pieces.',cap:'Somewhere in here, they leave. Each step was built by a different team, and nobody checked how they fit together.',
  cards:[['The ad','Instagram','','“Open an account in 2 minutes.”'],['The website','Landing page','','“Smart banking for growing businesses.”'],['Sign-up','Step 4 of 9','bad','Upload a utility bill to continue'],['After sign-up','Day 30','bad','No message. No follow-up.']]},
 joined:{title:'We make every step say the same thing.',cap:'One promise, kept at every step. That’s how customers stay.',
  cards:[['The ad','Instagram','','“Open an account in 2 minutes.”'],['The website','Landing page','good','“2 minutes. Here’s all you’ll need.”'],['Sign-up','Step 2 of 3','good','Just your BVN and a selfie'],['After sign-up','Day 1 · WhatsApp','good','“You’re in. Add ₦1,000 to get your card.”']]}};
const journeyEl=document.getElementById('problem');
function fillJourney(state){const J=JOURNEY[state];document.getElementById('journeyTitle').textContent=J.title;document.getElementById('journeyCap').textContent=J.cap;
  pcs.forEach((p,i)=>{const [a,b,cls,body]=J.cards[i];const ks=p.querySelectorAll('.k span');ks[0].textContent=a;ks[1].textContent=b;ks[1].className=cls;p.querySelector('b').textContent=body})}
let curState=null;
function setPieces(state){
  if(state===curState)return;const first=curState===null;curState=state;
  pieces.classList.toggle('joined',state==='joined');orbitEl.style.opacity=state==='joined'?1:0;
  document.querySelectorAll('[data-pieces]').forEach(b=>{b.setAttribute('aria-pressed',b.dataset.pieces===state);b.classList.remove('nudge')});
  if(first||reduce||STATIC){fillJourney(state)}else{journeyEl.classList.add('swapping');setTimeout(()=>{fillJourney(state);journeyEl.classList.remove('swapping')},300)}
  pcs.forEach((p,i)=>{
    if(state==='joined'){const box=pieces.getBoundingClientRect();const cur=p.style.transform;p.style.transform='none';const r0=p.getBoundingClientRect();p.style.transform=cur;
      const a=-Math.PI*.75+i*Math.PI/2;const tx=box.left+box.width/2+Math.cos(a)*box.width*(box.width<500?.4:.3)-(r0.left+r0.width/2);const ty=box.top+box.height/2+Math.sin(a)*box.height*.33-(r0.top+r0.height/2);
      p.style.transform=`translate(${tx}px,${ty}px) rotate(0deg)`}
    else{const [x,y,r]=p.dataset.a.split(',').map(Number);p.style.transform=`translate(${x}px,${y}px) rotate(${r}deg)`}
  });
}
document.querySelectorAll('[data-pieces]').forEach(b=>b.addEventListener('click',()=>setPieces(b.dataset.pieces)));
setPieces(window.__JOURNEY||'apart');
let ptStarted=false;
function playProblem(){if(ptStarted)return;ptStarted=true;
  if(reduce||STATIC){pmark.classList.remove('reset');return}
  pt.classList.add('playing');words.forEach((w,i)=>{setTimeout(()=>w.classList.add('lit'),i*70);setTimeout(()=>{w.classList.remove('lit');w.classList.add('set')},i*70+500)});
  const end=words.length*70+600;setTimeout(()=>{pmark.classList.remove('reset')},end);setTimeout(()=>pt.classList.remove('playing'),end+200);
  setTimeout(()=>{if(curState==='apart')document.querySelector('[data-pieces="joined"]').classList.add('nudge')},end+1200);
}


observeOnce(document.getElementById('problem'),playProblem,.3);
})();
/* ---------- Pricing ---------- */
const PRICES={foundation:{ngn:[2.5,7.5],usd:[1750,5250]},growth:{ngn:[4.5,13.5],usd:[3000,9000]},partnership:{ngn:[7.5,22.5],usd:[5000,15000]}};
let period='m',cur='ngn';
function fmt(v){return cur==='ngn'?'₦'+v+'m':'$'+v.toLocaleString('en-US')}
function renderAmt(el,str,animate){
  el.innerHTML=[...str].map(ch=>/\d/.test(ch)?`<span class="col" data-d="${ch}">${'0123456789'.split('').map(n=>`<span>${n}</span>`).join('')}</span>`:`<span>${ch}</span>`).join('');
  const cols=el.querySelectorAll('.col');
  cols.forEach(c=>{c.style.transition='none';c.style.transform=animate?'translateY(0)':`translateY(-${c.dataset.d*1.1}em)`});
  if(animate){void el.offsetWidth;cols.forEach((c,i)=>{setTimeout(()=>{c.style.transition='';c.style.transform=`translateY(-${c.dataset.d*1.1}em)`},30+i*60)})}
}
function renderPrices(animate){
  document.querySelectorAll('[data-tier]').forEach(t=>{const p=PRICES[t.dataset.tier][cur][period==='m'?0:1];renderAmt(t.querySelector('[data-amt]'),fmt(p),animate);
    t.querySelector('[data-per]').textContent=period==='m'?'per month · 90-day pilot':'for the 90-day pilot'});
}
renderPrices(false);
document.querySelectorAll('[data-period]').forEach(b=>b.addEventListener('click',()=>{period=b.dataset.period;document.querySelectorAll('[data-period]').forEach(x=>x.setAttribute('aria-pressed',x===b));renderPrices(!reduce)}));
document.querySelectorAll('[data-cur]').forEach(b=>b.addEventListener('click',()=>{cur=b.dataset.cur;document.querySelectorAll('[data-cur]').forEach(x=>x.setAttribute('aria-pressed',x===b));renderPrices(!reduce)}));
document.querySelectorAll('[data-tab]').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('[data-tab]').forEach(x=>x.setAttribute('aria-selected',x===b));['f','g','p'].forEach(k=>document.getElementById('panel-'+k).hidden=k!==b.dataset.tab)}));

/* ---------- Work filters ---------- */
document.querySelectorAll('#workFilters button').forEach(b=>b.addEventListener('click',()=>{
  document.querySelectorAll('#workFilters button').forEach(x=>x.setAttribute('aria-pressed',x===b));
  let n=0;document.querySelectorAll('#cases .case').forEach(c=>{const show=b.dataset.f==='all'||c.dataset.tags.split(' ').includes(b.dataset.f);c.hidden=!show;if(show)n++});
  document.getElementById('casesEmpty').hidden=n>0;
}));
/* ---------- Journal filters ---------- */
document.querySelectorAll('#journalFilters button').forEach(b=>b.addEventListener('click',()=>{
  document.querySelectorAll('#journalFilters button').forEach(x=>x.setAttribute('aria-pressed',x===b));
  document.querySelectorAll('.journal-full .post').forEach(p=>p.hidden=!(b.dataset.c==='all'||p.dataset.cat===b.dataset.c));
}));

/* ---------- Entrances, marks, process ---------- */
function observeFx(root){
  if(reduce||STATIC||!('IntersectionObserver' in window))return;
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.remove('pre');io.unobserve(e.target)}}),{threshold:.12});
  root.querySelectorAll('.fx').forEach(el=>{const r=el.getBoundingClientRect();if(r.top>innerHeight*.92){el.classList.add('pre');io.observe(el)}});
}
function observeOnce(el,fn,th=.35){if(reduce||STATIC){fn();return}new IntersectionObserver((es,io)=>{if(es[0].isIntersecting){fn();io.disconnect()}},{threshold:th}).observe(el)}
document.querySelectorAll('[data-mark]').forEach(m=>observeOnce(m,()=>m.classList.remove('reset'),.8));
document.querySelectorAll('[data-process]').forEach(p=>observeOnce(p,()=>p.classList.remove('reset'),.3));

/* ---------- Page start ---------- */
requestAnimationFrame(()=>{observeFx(document);navCheck()});

/* ---------- Menu ---------- */
document.getElementById('menuBtn').addEventListener('click',e=>{const m=document.getElementById('mobileMenu');const o=m.classList.toggle('open');e.currentTarget.setAttribute('aria-expanded',o)});

/* ---------- Nav flip + progress ---------- */
const nav=document.getElementById('nav'),ring=document.getElementById('ringP'),top=document.getElementById('totop');
function navCheck(){const y=nav.getBoundingClientRect().bottom-8;const on=[...document.querySelectorAll('.light')].some(s=>{const r=s.getBoundingClientRect();return r.top<=y&&r.bottom>=y});nav.classList.toggle('on-light',on)}
function prog(){const max=document.documentElement.scrollHeight-innerHeight;const p=max>0?scrollY/max:0;ring.style.strokeDashoffset=144.5*(1-p);top.classList.toggle('show',scrollY>600)}
addEventListener('scroll',()=>{navCheck();prog()},{passive:true});prog();
top.addEventListener('click',()=>scrollTo({top:0,behavior:reduce?'auto':'smooth'}));
})();
