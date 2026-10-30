/* ---------- Bintang berkelip + pita Bima Sakti ---------- */
(function(){
  var box=document.querySelector('.stars'),tm;
  function build(){
    box.querySelectorAll('i').forEach(function(n){n.remove()});
    var w=innerWidth,h=innerHeight,a=35*Math.PI/180,ca=Math.cos(a),sa=Math.sin(a),span=Math.hypot(w,h)/2,sp=Math.min(w,h)*.09;
    function rnd(){return (Math.random()*100).toFixed(1)+'vw '+(Math.random()*100).toFixed(1)+'vh'}
    function band(){
      for(var k=0;k<20;k++){
        var t=(Math.random()*2-1)*span,n=(Math.random()+Math.random()+Math.random()-1.5)*2*sp;
        var x=w/2+t*ca-n*sa,y=h/2+t*sa+n*ca;
        if(x>=0&&x<=w&&y>=0&&y<=h)return Math.round(x)+'px '+Math.round(y)+'px';
      }
      return rnd();
    }
    [[80,1,4,1,rnd],[40,2,6,2,rnd],[14,3,8,3,rnd],[220,1,7,3,band],[90,1,5,1,band]].forEach(function(L,k){
      var sh=[],i;
      for(i=0;i<L[0];i++)sh.push(L[4]()+' 0 0 var(--s'+L[3]+')');
      var el=document.createElement('i');
      el.style.cssText='width:'+L[1]+'px;height:'+L[1]+'px;--d:'+L[2]+'s;--dl:-'+(k*1.7)+'s;box-shadow:'+sh.join(',');
      box.appendChild(el);
    });
  }
  build();
  addEventListener('resize',function(){clearTimeout(tm);tm=setTimeout(build,250)});
})();

/* ---------- Tema gelap/terang ---------- */
(function(){
  var root=document.documentElement,btn=document.getElementById('theme'),cur=null;
  try{cur=localStorage.getItem('theme')}catch(e){}
  if(!cur)cur='dark';
  function apply(v){root.setAttribute('data-theme',v);btn.setAttribute('aria-label',v==='dark'?'Ganti ke tema terang':'Ganti ke tema gelap');btn.querySelector('.lbl').textContent=v==='dark'?'Tema terang':'Tema gelap';try{localStorage.setItem('theme',v)}catch(e){}}
  apply(cur);
  btn.addEventListener('click',function(){apply(root.getAttribute('data-theme')==='dark'?'light':'dark')});
})();

/* ---------- Tab ---------- */
(function(){
  var tabs=[].slice.call(document.querySelectorAll('[role=tab]'));
  var panels=[].slice.call(document.querySelectorAll('[role=tabpanel]'));
  function show(id,focus){
    if(!document.getElementById(id))id='home';
    tabs.forEach(function(t){var on=t.getAttribute('aria-controls')===id;t.setAttribute('aria-selected',on);t.tabIndex=on?0:-1;if(on&&focus)t.focus()});
    panels.forEach(function(p){p.hidden=p.id!==id});document.body.dataset.tab=id;
    try{if(location.hash!=='#'+id)history.replaceState(null,'','#'+id)}catch(e){}
    window.scrollTo(0,0);
  }
  tabs.forEach(function(t,i){
    t.addEventListener('click',function(){show(t.getAttribute('aria-controls'))});
    t.addEventListener('keydown',function(e){
      var n=(e.key==='ArrowRight'||e.key==='ArrowDown')?i+1:(e.key==='ArrowLeft'||e.key==='ArrowUp')?i-1:null;if(n!==null)e.preventDefault();
      if(n===null)return;
      show(tabs[(n+tabs.length)%tabs.length].getAttribute('aria-controls'),true);
    });
  });
  document.querySelectorAll('[data-go]').forEach(function(b){b.addEventListener('click',function(){show(b.dataset.go)})});
  window.addEventListener('hashchange',function(){show(location.hash.slice(1))});
  show(location.hash.slice(1)||'home');
})();

/* ---------- Efek ripple saat dipencet ---------- */
document.addEventListener('pointerdown',function(e){
  var t=e.target.closest('button:not([role=tab]):not(#theme),.btn,.links a');
  if(!t||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  var r=t.getBoundingClientRect(),d=Math.max(r.width,r.height)*2,sp=document.createElement('span');
  sp.className='ripple';
  sp.style.cssText='width:'+d+'px;height:'+d+'px;left:'+(e.clientX-r.left-d/2)+'px;top:'+(e.clientY-r.top-d/2)+'px';
  t.appendChild(sp);setTimeout(function(){sp.remove()},600);
});

/* ---------- Slider foto ---------- */
document.querySelectorAll('[data-slider]').forEach(function(s){
  var tr=s.querySelector('.track'),n=tr.children.length,dots=s.querySelector('.dots'),cnt=s.querySelector('.count'),i;
  for(i=0;i<n;i++)dots.appendChild(document.createElement('i'));
  function cur(){return Math.round(tr.scrollLeft/tr.clientWidth)}
  function upd(){var c=Math.min(n-1,Math.max(0,cur()));[].forEach.call(dots.children,function(d,k){d.className=k===c?'on':''});cnt.textContent=(c+1)+' / '+n}
  function go(d){var c=cur()+d;if(c<0)c=n-1;if(c>=n)c=0;tr.scrollTo({left:c*tr.clientWidth})}
  s.querySelector('.prev').addEventListener('click',function(){go(-1)});
  s.querySelector('.next').addEventListener('click',function(){go(1)});
  tr.addEventListener('scroll',function(){requestAnimationFrame(upd)});
  tr.addEventListener('keydown',function(e){if(e.key==='ArrowRight'){e.preventDefault();go(1)}else if(e.key==='ArrowLeft'){e.preventDefault();go(-1)}});
  addEventListener('resize',upd);upd();
});

/* ---------- Popup skill ---------- */
(function(){
  var dlg=document.getElementById('skill-dialog');if(!dlg)return;
  var logo=document.getElementById('sk-logo'),t=document.getElementById('sk-title'),d=document.getElementById('sk-desc');
  document.querySelectorAll('.skill-btn').forEach(function(b){
    b.addEventListener('click',function(){
      var sv=b.querySelector('svg');logo.textContent='';if(sv){logo.appendChild(sv.cloneNode(true));logo.style.display=''}else{logo.style.display='none'}
      t.textContent=b.dataset.name;d.textContent=b.dataset.desc;dlg.showModal();
    });
  });
  document.getElementById('sk-close').addEventListener('click',function(){dlg.close()});
  dlg.addEventListener('click',function(e){if(e.target===dlg)dlg.close()});
})();


/* ---------- Galeri poster (memakai foto dari Projek Event Sekolah) ---------- */
(function(){
  var tr=document.querySelector('.gtrack.posters');if(!tr)return;
  var pre=[].slice.call(tr.children);var src=document.querySelectorAll('.work-card .track[aria-label="Foto Projek Event Sekolah"] img');
  var cap=['Rahasia Sang Penari','Sasara Ndawi Kankwar \u00b7 H-5','Sasara Ndawi Kankwar \u00b7 H-3','Sasara Ndawi Kankwar \u00b7 H-1','Poster pemeran','Poster kolase','Teaser Teror di Balik Kanvas','Teror di Balik Kanvas'];
  [].forEach.call(src,function(im,i){
    var f=document.createElement('figure'),c=im.cloneNode(true),fc=document.createElement('figcaption');
    fc.textContent=cap[i]||im.alt;f.appendChild(c);f.appendChild(fc);tr.appendChild(f);
  });
  pre.forEach(function(p){tr.appendChild(p)});
})();

/* ---------- Galeri fotografi ---------- */
document.querySelectorAll('.gal').forEach(function(g){
  var tr=g.querySelector('.gtrack');
  function step(){return tr.firstElementChild.getBoundingClientRect().width+14}
  g.querySelector('.prev').addEventListener('click',function(){
    if(tr.scrollLeft<=2)tr.scrollTo({left:tr.scrollWidth});else tr.scrollBy({left:-step()});
  });
  g.querySelector('.next').addEventListener('click',function(){
    if(tr.scrollLeft+tr.clientWidth>=tr.scrollWidth-2)tr.scrollTo({left:0});else tr.scrollBy({left:step()});
  });
});

/* ---------- Efek Bima Sakti saat dipencet ---------- */
(function(){
  var reduce=matchMedia('(prefers-reduced-motion: reduce)');
  var cv=document.createElement('canvas');cv.className='galaxy-fx';cv.setAttribute('aria-hidden','true');
  var hasPop=typeof cv.showPopover==='function';
  if(hasPop)cv.setAttribute('popover','manual');
  document.body.appendChild(cv);
  var ctx=cv.getContext('2d'),W=0,H=0,ps=[],gl=[],raf=0,TAU=Math.PI*2;
  var DARK=['#ffffff','#cdbfff','#8fb8ff','#ff9fe0','#ffd98a','#9ff3ff'],
      LIGHT=['#6d4aff','#3b82f6','#d946ef','#f59e0b','#0ea5a5','#4f46e5'];
  function size(){var d=Math.min(devicePixelRatio||1,2);W=innerWidth;H=innerHeight;cv.width=W*d;cv.height=H*d;ctx.setTransform(d,0,0,d,0,0)}
  size();addEventListener('resize',size);
  function isDark(){
    var c=getComputedStyle(document.body).backgroundColor,m=c.match(/[\d.]+/g)||[];
    if(m.length>3&&+m[3]===0){c=getComputedStyle(document.documentElement).backgroundColor;m=c.match(/[\d.]+/g)||[]}
    return m.length<3||(0.299*m[0]+0.587*m[1]+0.114*m[2])<140;
  }
  function front(){
    if(!hasPop)return;
    try{
      if(cv.matches(':popover-open')&&document.querySelector('dialog[open]'))cv.hidePopover();
      if(!cv.matches(':popover-open'))cv.showPopover();
    }catch(e){}
  }
  function rnd(a,b){return a+Math.random()*(b-a)}
  function burst(x,y){
    if(ps.length>420)return;
    var dark=isDark(),cols=dark?DARK:LIGHT,arms=3,i,now=performance.now();
    gl.push({x:x,y:y,t0:now,c:cols[2],dark:dark});
    for(i=0;i<56;i++){
      var arm=i%arms,R=rnd(26,120);
      ps.push({x:x,y:y,t0:now,life:rnd(800,1500),R:R,a0:arm*TAU/arms+rnd(-.28,.28)+R/60*.9,spin:rnd(1.3,2.1),
        s:rnd(.7,2.4),c:cols[(Math.random()*cols.length)|0],tw:rnd(0,TAU),k:0,dark:dark});
    }
    for(i=0;i<6;i++){
      ps.push({x:x,y:y,t0:now,life:rnd(900,1400),R:rnd(20,90),a0:rnd(0,TAU),spin:rnd(1,2),
        s:rnd(4,7),c:cols[(Math.random()*cols.length)|0],tw:rnd(0,TAU),k:1,dark:dark});
    }
    for(i=0;i<14;i++){
      ps.push({x:x,y:y,t0:now,life:rnd(1100,1700),R:rnd(10,70),a0:rnd(0,TAU),spin:rnd(.8,1.6),
        s:rnd(9,20),c:cols[(Math.random()*cols.length)|0],tw:0,k:2,dark:dark});
    }
    front();
    if(!raf)raf=requestAnimationFrame(tick);
  }
  function sparkle(x,y,s){
    ctx.beginPath();ctx.moveTo(x,y-s);ctx.quadraticCurveTo(x,y,x+s,y);ctx.quadraticCurveTo(x,y,x,y+s);
    ctx.quadraticCurveTo(x,y,x-s,y);ctx.quadraticCurveTo(x,y,x,y-s);ctx.fill();
  }
  function tick(now){
    ctx.clearRect(0,0,W,H);
    var i,p,t,e,r,a,al,x,y,dark=true;
    for(i=gl.length-1;i>=0;i--){
      var g=gl[i];t=(now-g.t0)/650;
      if(t>=1){gl.splice(i,1);continue}
      var rad=14+t*76,gr=ctx.createRadialGradient(g.x,g.y,0,g.x,g.y,rad);
      ctx.globalCompositeOperation=g.dark?'lighter':'source-over';
      gr.addColorStop(0,g.dark?'rgba(255,255,255,'+(.55*(1-t))+')':'rgba(109,74,255,'+(.3*(1-t))+')');
      gr.addColorStop(.45,g.dark?'rgba(150,130,255,'+(.25*(1-t))+')':'rgba(59,130,246,'+(.14*(1-t))+')');
      gr.addColorStop(1,'rgba(120,120,255,0)');
      ctx.fillStyle=gr;ctx.beginPath();ctx.arc(g.x,g.y,rad,0,TAU);ctx.fill();
    }
    for(i=ps.length-1;i>=0;i--){
      p=ps[i];t=(now-p.t0)/p.life;
      if(t>=1){ps.splice(i,1);continue}
      e=1-(1-t)*(1-t);r=p.R*e;a=p.a0+p.spin*t;
      x=p.x+Math.cos(a)*r;y=p.y+Math.sin(a)*r;
      al=Math.pow(1-t,1.4);
      ctx.globalCompositeOperation=p.dark?'lighter':'source-over';
      ctx.fillStyle=p.c;
      if(p.k===2){ctx.globalAlpha=al*(p.dark?.07:.05);ctx.beginPath();ctx.arc(x,y,p.s*(.6+t),0,TAU);ctx.fill()}
      else{
        al*=.65+.35*Math.sin(now*.02+p.tw);
        ctx.globalAlpha=Math.max(0,al);
        if(p.k===1)sparkle(x,y,p.s*(1-t*.4));
        else{ctx.beginPath();ctx.arc(x,y,p.s,0,TAU);ctx.fill();ctx.globalAlpha=Math.max(0,al*.25);ctx.beginPath();ctx.arc(x,y,p.s*2.6,0,TAU);ctx.fill()}
      }
    }
    ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';
    if(ps.length||gl.length)raf=requestAnimationFrame(tick);
    else{raf=0;ctx.clearRect(0,0,W,H)}
  }
  var SEL='button,a,[role=tab],[data-go],summary,label,select,input';
  document.addEventListener('pointerdown',function(e){
    if(reduce.matches||!e.target.closest)return;
    if(e.target.closest(SEL))burst(e.clientX,e.clientY);
  },true);
  document.addEventListener('click',function(e){
    if(reduce.matches||e.detail!==0||!e.target.closest)return;
    var t=e.target.closest(SEL);if(!t)return;
    var r=t.getBoundingClientRect();burst(r.left+r.width/2,r.top+r.height/2);
  },true);
})();

/* ---------- Suara klik (dibuat langsung dengan Web Audio, tanpa file) ---------- */
(function(){
  var AC=window.AudioContext||window.webkitAudioContext,ac=null,master=null,on=true,btn=document.getElementById('sound');
  try{on=localStorage.getItem('snd')!=='off'}catch(e){}
  function ui(){if(!btn)return;btn.setAttribute('aria-pressed',on?'true':'false');btn.setAttribute('aria-label',on?'Matikan suara':'Nyalakan suara')}
  ui();
  function ctx(){
    if(!AC)return null;
    if(!ac){
      ac=new AC();master=ac.createGain();master.gain.value=.55;master.connect(ac.destination);
      var d=ac.createDelay(),fb=ac.createGain(),wet=ac.createGain();
      d.delayTime.value=.17;fb.gain.value=.32;wet.gain.value=.35;
      master.connect(d);d.connect(fb);fb.connect(d);d.connect(wet);wet.connect(ac.destination);
    }
    if(ac.state==='suspended')ac.resume();
    return ac;
  }
  function chime(){
    if(!on)return;var a=ctx();if(!a)return;var t=a.currentTime;
    var sc=[523.25,587.33,659.25,783.99,880,1046.5,1174.66,1318.5],s0=(Math.random()*3)|0,ns=[sc[s0],sc[s0+2],sc[s0+4]];
    ns.forEach(function(f,i){
      var s=t+i*.07,o=a.createOscillator(),g=a.createGain();
      o.type='sine';o.frequency.value=f;
      g.gain.setValueAtTime(.0001,s);g.gain.exponentialRampToValueAtTime(.15,s+.012);g.gain.exponentialRampToValueAtTime(.0001,s+.9);
      o.connect(g);g.connect(master);o.start(s);o.stop(s+1);
      var o2=a.createOscillator(),g2=a.createGain();
      o2.type='triangle';o2.frequency.value=f*2;
      g2.gain.setValueAtTime(.0001,s);g2.gain.exponentialRampToValueAtTime(.035,s+.01);g2.gain.exponentialRampToValueAtTime(.0001,s+.5);
      o2.connect(g2);g2.connect(master);o2.start(s);o2.stop(s+.6);
    });
    var len=(a.sampleRate*.5)|0,buf=a.createBuffer(1,len,a.sampleRate),d=buf.getChannelData(0),i;
    for(i=0;i<len;i++)d[i]=Math.random()*2-1;
    var n=a.createBufferSource(),bp=a.createBiquadFilter(),ng=a.createGain();
    n.buffer=buf;bp.type='bandpass';bp.Q.value=2.5;
    bp.frequency.setValueAtTime(400,t);bp.frequency.exponentialRampToValueAtTime(4200,t+.45);
    ng.gain.setValueAtTime(.0001,t);ng.gain.exponentialRampToValueAtTime(.05,t+.12);ng.gain.exponentialRampToValueAtTime(.0001,t+.5);
    n.connect(bp);bp.connect(ng);ng.connect(master);n.start(t);n.stop(t+.5);
  }
  var SEL='button,a,[role=tab],[data-go],summary,label,select,input';
  document.addEventListener('pointerdown',function(e){
    var t=e.target.closest&&e.target.closest(SEL);
    if(t&&t.id!=='sound')chime();
  },true);
  document.addEventListener('click',function(e){
    var t=e.target.closest&&e.target.closest(SEL);
    if(t&&e.detail===0&&t.id!=='sound')chime();
  },true);
  if(btn)btn.addEventListener('click',function(){
    on=!on;ui();try{localStorage.setItem('snd',on?'on':'off')}catch(e){}
    if(on)chime();
  });
})();

/* ---------- Perbesar foto/poster ---------- */
(function(){
  var d=document.createElement('dialog');d.id='lb';d.innerHTML='<img alt="">';document.body.appendChild(d);
  var im=d.querySelector('img');
  document.addEventListener('click',function(e){
    var t=e.target;
    if(t===d||t===im){d.close();return}
    if(t.tagName==='IMG'&&t.closest('.gtrack')){im.src=t.src;im.alt=t.alt;d.showModal()}
  });
})();
