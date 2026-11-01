/* ==========================================================================
   Threat globe background + back-to-top button (shared by all pages)
   <script src="globe.js" data-mode="full"></script>   home / projects: HUD, arcs, cursor lock-on
   <script src="globe.js" data-mode="calm"></script>   slow grid globe only (dimmed)
   <script src="globe.js" data-mode="drift" data-colors="#2dd4bf,#00e5ff" data-mix=".3" data-n="120,55"></script>
                                                       tool pages: sparse floating points in the page's accent colours
                                                       (data-n = desktop,phone count; optional data-opacity, default .9)
   <script src="globe.js" data-mode="none"></script>   write-ups: back-to-top button only
   Draws on #bg-canvas (if present) so each page's existing opacity / scroll-fade / print rules still apply.
   ========================================================================== */
(function(){
  var me=document.currentScript, MODE=(me&&me.getAttribute('data-mode'))||'full';
  var REDUCE=matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- styles ---------- */
  var css=document.createElement('style');
  css.textContent=
    '#bg-aurora{position:fixed;inset:0;z-index:0;pointer-events:none;overflow:hidden}'+
    '#bg-aurora::before{content:"";position:absolute;inset:-5%;filter:blur(10px);animation:auroraDrift 26s ease-in-out infinite alternate;background:'+
      'radial-gradient(38% 34% at 14% 8%,rgba(0,229,255,.13),transparent 70%),'+
      'radial-gradient(30% 28% at 72% 18%,rgba(47,129,247,.10),transparent 70%),'+
      'radial-gradient(34% 30% at 92% 88%,rgba(255,59,78,.10),transparent 70%)}'+
    '#bg-aurora::after{content:"";position:absolute;inset:0;opacity:.07;mix-blend-mode:overlay;background-image:url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'160\' height=\'160\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'.85\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")}'+
    '@keyframes auroraDrift{to{transform:translate3d(3%,2%,0) scale(1.06)}}'+
    '#toTop{position:fixed;right:24px;bottom:24px;z-index:9000;width:46px;height:46px;border-radius:50%;padding:0;display:flex;align-items:center;justify-content:center;cursor:pointer;'+
      'background:rgba(8,11,16,.78);border:1px solid rgba(0,229,255,.35);color:#00e5ff;-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);'+
      'box-shadow:0 0 18px rgba(0,229,255,.25),inset 0 0 10px rgba(0,229,255,.08);opacity:0;transform:translateY(14px) scale(.9);pointer-events:none;'+
      'transition:opacity .35s,transform .35s,box-shadow .25s,border-color .25s,background .25s}'+
    '#toTop.show{opacity:1;transform:none;pointer-events:auto;animation:topPulse 2.6s ease-in-out infinite}'+
    '#toTop:hover,#toTop:focus-visible{background:rgba(0,229,255,.12);border-color:#00e5ff;box-shadow:0 0 28px rgba(0,229,255,.55),inset 0 0 12px rgba(0,229,255,.15);outline:none}'+
    '#toTop svg{width:18px;height:18px;transition:transform .25s}#toTop:hover svg{transform:translateY(-2px)}'+
    '@keyframes topPulse{50%{box-shadow:0 0 26px rgba(0,229,255,.42),inset 0 0 10px rgba(0,229,255,.12)}}'+
    '@media(max-width:560px){#toTop{right:16px;bottom:16px;width:42px;height:42px}}'+
    '@media(prefers-reduced-motion:reduce){#bg-aurora::before,#toTop.show{animation:none}}'+
    '@media print{#bg-aurora,#toTop{display:none!important}}';
  document.head.appendChild(css);

  /* ---------- back-to-top ---------- */
  var top=document.createElement('button');
  top.id='toTop'; top.type='button'; top.setAttribute('aria-label','Back to top'); top.setAttribute('data-link','');
  top.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
  if(MODE!=='full') top.style.zIndex='250'; // tool pages: toasts and slide-in panels sit above the button
  document.body.appendChild(top);
  function checkTop(){top.classList.toggle('show',window.scrollY>innerHeight*0.8);}
  addEventListener('scroll',checkTop,{passive:true}); setInterval(checkTop,400); checkTop(); // interval covers pages whose inertia scroller skips scroll events
  top.addEventListener('click',function(){window.scrollTo({top:0,behavior:REDUCE?'auto':'smooth'});});

  var cv=document.getElementById('bg-canvas');
  if(MODE==='none'||!cv) return;

  /* ---------- keep printouts clean (DFIR / pentest reports print from these pages) ---------- */
  function setPrint(on){['bg-canvas','bg-glow','bg-aurora'].forEach(function(id){var el=document.getElementById(id);if(el)el.style.display=on?'none':'';});}
  addEventListener('beforeprint',function(){setPrint(true);}); addEventListener('afterprint',function(){setPrint(false);});

  if(MODE==='drift'){ drift(); return; }

  /* ---------- aurora backdrop ---------- */
  var aur=document.createElement('div'); aur.id='bg-aurora'; aur.setAttribute('aria-hidden','true');
  cv.parentNode.insertBefore(aur,cv);

  /* ---------- globe ---------- */
  var ctx=cv.getContext('2d'); if(!ctx) return;
  var FULL=MODE==='full', W,H,MOB,DPR=Math.min(devicePixelRatio||1,2), t=0, last=performance.now();
  var mx=-9999,my=-9999;
  if(FULL){addEventListener('mousemove',function(e){mx=e.clientX;my=e.clientY;},{passive:true});
    document.addEventListener('mouseleave',function(){mx=my=-9999;});}

  // nodes on the 15-degree grid intersections
  var P=[];
  for(var la=-75;la<=75;la+=15)for(var lo=0;lo<360;lo+=15){var A=la*Math.PI/180,O=lo*Math.PI/180;P.push([Math.cos(A)*Math.cos(O),Math.sin(A),Math.cos(A)*Math.sin(O)]);}
  // grid polylines (parallels + meridians), 72 points each
  var LINES=[], k;
  for(la=-75;la<=75;la+=15){var pl=[],r=Math.cos(la*Math.PI/180),y=Math.sin(la*Math.PI/180);for(k=0;k<=72;k++){var a=k/72*6.283;pl.push([Math.cos(a)*r,y,Math.sin(a)*r]);}LINES.push(pl);}
  for(lo=0;lo<180;lo+=15){var pm=[],o=lo*Math.PI/180;for(k=0;k<=72;k++){var b=k/72*6.283;pm.push([Math.cos(b)*Math.cos(o),Math.sin(b),Math.cos(b)*Math.sin(o)]);}LINES.push(pm);}

  var hit=new Float32Array(P.length), arcs=[], nextArc=0, ry=0.6, rx=-0.35, tgt=0, tgtT=0, recX=null, recY=null;
  var R,CX,CY, cyR,syR,cxR,sxR;
  var CYAN=[0,229,255], RED=[255,59,78];
  function mix(k){return 'rgb('+((CYAN[0]+(RED[0]-CYAN[0])*k)|0)+','+((CYAN[1]+(RED[1]-CYAN[1])*k)|0)+','+((CYAN[2]+(RED[2]-CYAN[2])*k)|0)+')';}
  function proj(v){
    var x=v[0]*cyR-v[2]*syR, z=v[0]*syR+v[2]*cyR, y=v[1]*cxR-z*sxR; z=v[1]*sxR+z*cxR;
    return [CX+x*R, CY+y*R, z];
  }
  // 3D polyline with depth-faded segments, batched into a few alpha buckets
  function line3(pts,col,aF,aB,w){
    var buckets={}, p=proj(pts[0]);
    for(var i=1;i<pts.length;i++){var q=proj(pts[i]),a=(p[2]+q[2])<0?aF:aB,key=Math.round(a*20);
      if(key>0)(buckets[key]=buckets[key]||[]).push(p[0],p[1],q[0],q[1]); p=q;}
    ctx.strokeStyle=col; ctx.lineWidth=w||1;
    for(var kk in buckets){var s=buckets[kk];ctx.globalAlpha=kk/20;ctx.beginPath();for(var j=0;j<s.length;j+=4){ctx.moveTo(s[j],s[j+1]);ctx.lineTo(s[j+2],s[j+3]);}ctx.stroke();}
  }

  function layout(){
    W=innerWidth; H=innerHeight; MOB=W<760;
    cv.width=W*DPR; cv.height=H*DPR; cv.style.width=W+'px'; cv.style.height=H+'px'; ctx.setTransform(DPR,0,0,DPR,0,0);
    R=MOB?Math.min(W*0.5,H*0.36):Math.min(W*0.30,H*0.42);
    CX=MOB?W*0.62:W*0.72; CY=MOB?H*0.68:H*0.52;
  }

  function frame(dt){
    var g=(MOB?0.6:1)*(FULL?1:0.4); // quieter on phones (behind text) and on tool pages (behind forms/output)
    if(!REDUCE){
      var tx=mx>0?(mx/W-0.5)*0.6:0, ty=my>0?(my/H-0.5)*0.4:0;
      ry+=dt*(FULL?0.12:0.06)+tx*dt*0.5; rx+=((-0.35+ty)-rx)*0.03;
    }
    cyR=Math.cos(ry);syR=Math.sin(ry);cxR=Math.cos(rx);sxR=Math.sin(rx);
    ctx.clearRect(0,0,W,H);

    // atmosphere
    var rim=ctx.createRadialGradient(CX,CY,R*0.9,CX,CY,R*1.12);
    rim.addColorStop(0,'rgba(0,229,255,0)');rim.addColorStop(0.3,'rgba(0,229,255,.10)');rim.addColorStop(1,'rgba(0,229,255,0)');
    ctx.globalAlpha=g;ctx.fillStyle=rim;ctx.beginPath();ctx.arc(CX,CY,R*1.2,0,6.283);ctx.fill();

    // grid: front half only, brighter toward the centre of the face
    var buckets={};
    for(var L=0;L<LINES.length;L++){var pts=LINES[L],p=proj(pts[0]);
      for(var i=1;i<pts.length;i++){var q=proj(pts[i]),z=(p[2]+q[2])/2;
        if(z<0){var key=Math.round((0.05+0.42*Math.pow(-z,1.4))*g*40);(buckets[key]=buckets[key]||[]).push(p[0],p[1],q[0],q[1]);}
        p=q;}}
    ctx.strokeStyle='#00e5ff';ctx.lineWidth=0.8;
    for(var kk in buckets){var s=buckets[kk];ctx.globalAlpha=kk/40;ctx.beginPath();for(var j=0;j<s.length;j+=4){ctx.moveTo(s[j],s[j+1]);ctx.lineTo(s[j+2],s[j+3]);}ctx.stroke();}

    // crisp rim
    ctx.globalAlpha=0.55*g;ctx.lineWidth=1;ctx.shadowColor='#00e5ff';ctx.shadowBlur=16;
    ctx.beginPath();ctx.arc(CX,CY,R,0,6.283);ctx.stroke();ctx.shadowBlur=0;

    // HUD bezel: tick ring, slowly turning
    if(FULL){var R1=R*1.07;
      for(k=0;k<72;k++){var ang=k/72*6.283+t*0.05,L2=k%6===0?10:4;ctx.globalAlpha=(k%6===0?0.5:0.22)*g;
        ctx.beginPath();ctx.moveTo(CX+Math.cos(ang)*R1,CY+Math.sin(ang)*R1);ctx.lineTo(CX+Math.cos(ang)*(R1+L2),CY+Math.sin(ang)*(R1+L2));ctx.stroke();}
      ctx.globalAlpha=0.15*g;ctx.beginPath();ctx.arc(CX,CY,R1,0,6.283);ctx.stroke();}

    // nodes; find the one under the cursor
    var near=-1,best=60*60;
    for(i=0;i<P.length;i++){
      var h=hit[i]; hit[i]=h>0.01?h*0.975:0;
      var n=proj(P[i]); if(n[2]>=0) continue;
      if(FULL){var dx=n[0]-mx,dy=n[1]-my,d=dx*dx+dy*dy;if(n[2]<-0.05&&d<best){best=d;near=i;}}
      var sz=2.2+h*2; ctx.globalAlpha=Math.min(1,((0.3+(-n[2])*0.6)*0.8+h*0.6)*g); ctx.fillStyle=mix(h);
      ctx.fillRect(n[0]-sz/2,n[1]-sz/2,sz,sz);
    }
    if(!FULL) return;

    // arcs: cyan traffic, red attacks; the cursor fires red arcs from the locked node
    nextArc-=dt;
    if(nextArc<0&&!REDUCE){nextArc=0.18+Math.random()*0.3;arcs.push({a:(Math.random()*P.length)|0,b:(Math.random()*P.length)|0,k:0,red:Math.random()<0.25});}
    if(near>=0&&Math.random()<0.15){arcs.push({a:near,b:(Math.random()*P.length)|0,k:0,red:true});hit[near]=1;}
    arcs=arcs.filter(function(r){return r.k<1.6;});
    arcs.forEach(function(r){
      r.k+=dt*0.55; var A2=P[r.a],B2=P[r.b],col=r.red?'#ff3b4e':'#00e5ff',head=Math.min(1,r.k),tail=Math.max(0,r.k-0.6),pts=[];
      for(var s2=0;s2<=40;s2++){var u=tail+(head-tail)*s2/40,lift=1+Math.sin(u*Math.PI)*0.28,
        v=[A2[0]+(B2[0]-A2[0])*u,A2[1]+(B2[1]-A2[1])*u,A2[2]+(B2[2]-A2[2])*u],m=Math.sqrt(v[0]*v[0]+v[1]*v[1]+v[2]*v[2])||1;
        pts.push([v[0]/m*lift,v[1]/m*lift,v[2]/m*lift]);}
      var fade=(1-Math.max(0,r.k-1)/0.6)*g; ctx.shadowColor=col;ctx.shadowBlur=8;
      line3(pts,col,0.9*fade,0.2*fade,1.6); ctx.shadowBlur=0;
      if(r.k>=1&&!r.done){r.done=1;if(r.red)hit[r.b]=1;}
      if(r.k<=1){var e=proj(B2);if(e[2]<0){ctx.globalAlpha=0.5*(1-r.k)*g;ctx.strokeStyle=col;ctx.lineWidth=1;ctx.beginPath();ctx.arc(e[0],e[1],2+r.k*10,0,6.283);ctx.stroke();}}
    });

    // targeting reticle: locks onto the node under the cursor, otherwise scans random front nodes
    if(MOB) return; // touch screens can't hover, and on phones the globe sits behind the hero text
    var locked=near>=0; tgtT-=dt;
    if(locked) tgt=near;
    else if(tgtT<0||proj(P[tgt])[2]>-0.15){tgtT=2.6; // auto-scan keeps to the right of the globe so the label never covers page text
      for(var tries=0;tries<60;tries++){var c=(Math.random()*P.length)|0,cp=proj(P[c]);if(cp[2]<-0.3&&cp[0]>CX-R*0.1&&cp[0]<W-190){tgt=c;break;}}}
    var T=proj(P[tgt]); recX=recX==null?T[0]:recX+(T[0]-recX)*0.18; recY=recY==null?T[1]:recY+(T[1]-recY)*0.18;
    var X=recX,Y=recY,col2=locked?'#ff3b4e':'#00e5ff',rr=locked?11:15+Math.sin(t*4)*2;
    ctx.globalAlpha=0.9*g;ctx.strokeStyle=col2;ctx.lineWidth=1.2;ctx.shadowColor=col2;ctx.shadowBlur=10;
    ctx.beginPath();ctx.arc(X,Y,rr,0,6.283);ctx.stroke();
    for(k=0;k<4;k++){var aa=k*Math.PI/2+(locked?0:t*0.8);ctx.beginPath();ctx.moveTo(X+Math.cos(aa)*(rr+3),Y+Math.sin(aa)*(rr+3));ctx.lineTo(X+Math.cos(aa)*(rr+10),Y+Math.sin(aa)*(rr+10));ctx.stroke();}
    ctx.shadowBlur=0;
    if(locked) hit[tgt]=1;
    {
      var v3=P[tgt],lat=Math.asin(v3[1])*180/Math.PI,lon=Math.atan2(v3[2],v3[0])*180/Math.PI;
      var tag=(locked?'LOCKED':'SCANNING')+'  '+Math.abs(lat).toFixed(2)+'°'+(lat>=0?'N':'S')+' '+Math.abs(lon).toFixed(2)+'°'+(lon>=0?'E':'W');
      var lx=X+34,ly=Y-30; ctx.globalAlpha=0.6;ctx.beginPath();ctx.moveTo(X+rr*0.7,Y-rr*0.7);ctx.lineTo(lx-4,ly+6);ctx.lineTo(lx+150,ly+6);ctx.stroke();
      ctx.globalAlpha=0.95;ctx.fillStyle=col2;ctx.font='500 10px "JetBrains Mono",ui-monospace,monospace';ctx.fillText(tag,lx,ly);
      ctx.globalAlpha=0.5;ctx.fillText('NODE 0x'+((tgt*2654435761>>>20).toString(16).toUpperCase())+(locked?'  · exploit ready':'  · probing'),lx,ly+20);
    }
  }

  function loop(now){
    var dt=Math.min((now-last)/1000,0.05); last=now; t+=dt;
    frame(dt); ctx.globalAlpha=1;
    if(!REDUCE) requestAnimationFrame(loop);
  }
  layout();
  addEventListener('resize',function(){layout();if(REDUCE)frame(0);});
  requestAnimationFrame(loop);

  /* ---------- drift: sparse floating points in the page's accent colours (tool pages) ----------
     2D port of the original Three.js background: same box, wobble, slow spin and mouse parallax. */
  function drift(){
    var ctx=cv.getContext('2d'); if(!ctx) return;
    var cols=(me.getAttribute('data-colors')||'#00e5ff,#2f81f7').split(','), mixR=+(me.getAttribute('data-mix')||0.3);
    var nn=(me.getAttribute('data-n')||'120,55').split(','), op=+(me.getAttribute('data-opacity')||0.9);
    var W,H,F,DPR=Math.min(devicePixelRatio||1,2),N,base=[],spr=[],t=0,rot=0,cx=0,cy=0,mx=0,my=0,last=performance.now(),i;
    // soft round sprite per colour (white core -> colour -> transparent, as the original point texture)
    cols.forEach(function(c){var s=document.createElement('canvas');s.width=s.height=64;var x=s.getContext('2d'),g=x.createRadialGradient(32,32,0,32,32,32);
      g.addColorStop(0,c);g.addColorStop(.4,c+'80');g.addColorStop(1,c+'00');x.fillStyle=g;x.beginPath();x.arc(32,32,32,0,7);x.fill();spr.push(s);});
    function size(){
      W=innerWidth;H=innerHeight;cv.width=W*DPR;cv.height=H*DPR;ctx.setTransform(DPR,0,0,DPR,0,0);
      F=(H/2)/Math.tan(Math.PI/6); // 60 degree vertical field of view
      var n=W<760?+nn[1]:+nn[0];
      if(n!==N){N=n;base=[];for(i=0;i<N;i++)base.push([(Math.random()*2-1)*76,(Math.random()*2-1)*48,(Math.random()*2-1)*24,Math.random()<mixR?1:0]);}
    }
    addEventListener('mousemove',function(e){mx=(e.clientX/innerWidth)*2-1;my=-(e.clientY/innerHeight)*2+1;},{passive:true});
    function draw(dt){
      t+=dt*0.36; rot+=dt*0.054; cx+=(mx*6-cx)*0.03; cy+=(my*4-cy)*0.03;
      ctx.clearRect(0,0,W,H); ctx.globalCompositeOperation='lighter'; ctx.globalAlpha=op;
      var cr=Math.cos(rot),sr=Math.sin(rot);
      for(i=0;i<N;i++){var b=base[i],
        x=b[0]+Math.sin(t*0.6+i)*1.3, y=b[1]+Math.cos(t*0.5+i*1.3)*1.3, z=b[2]+Math.sin(t*0.4+i)*1.0,
        rx=x*cr+z*sr, rz=-x*sr+z*cr, d=60-rz; if(d<2) continue;
        var k=F/d, sx=W/2+(rx-cx)*k, sy=H/2-(y-cy)*k, r=0.75*(H/2)/d; // same point size maths as three.js PointsMaterial
        if(sx<-r||sx>W+r||sy<-r||sy>H+r) continue;
        ctx.drawImage(spr[b[3]]||spr[0],sx-r,sy-r,r*2,r*2);}
      ctx.globalCompositeOperation='source-over'; ctx.globalAlpha=1;
    }
    function tick(now){var dt=Math.min((now-last)/1000,0.05);last=now;draw(dt);if(!REDUCE)requestAnimationFrame(tick);}
    size(); addEventListener('resize',function(){size();if(REDUCE)draw(0);}); requestAnimationFrame(tick);
  }
})();
