import * as THREE from "./lib/three.module.min.js";

let _stoneTex=null;
let _woodTex=null;
let _copperTex=null;
let _kawaraTex=null;
let _ropeTex=null;

function setShadow(g)
{
    g.traverse(function(c)
    {
        if(c.isMesh){
            c.castShadow=true;
            c.receiveShadow=true;
        }
    });
    return g;
}

function makeMat(color,rough,metal,map)
{
    const o={color:color,roughness:rough,metalness:metal||0};
    if(map){
        o.map=map;
    }
    return new THREE.MeshStandardMaterial(o);
}

function addMesh(g,geo,mat,x,y,z)
{
    const m=new THREE.Mesh(geo,mat);
    m.position.set(x||0,y||0,z||0);
    g.add(m);
    return m;
}

function addBox(g,w,h,d,mat,x,y,z)
{
    return addMesh(g,new THREE.BoxGeometry(w,h,d),mat,x,y,z);
}

function addCyl(g,rt,rb,h,seg,mat,x,y,z)
{
    return addMesh(g,new THREE.CylinderGeometry(rt,rb,h,seg),mat,x,y,z);
}

function makeCanvasTex(size,drawFn)
{
    const cv=document.createElement("canvas");
    cv.width=size;
    cv.height=size;
    const ctx=cv.getContext("2d");
    drawFn(ctx,size);
    const tex=new THREE.CanvasTexture(cv);
    tex.wrapS=THREE.RepeatWrapping;
    tex.wrapT=THREE.RepeatWrapping;
    tex.colorSpace=THREE.SRGBColorSpace;
    return tex;
}

function wrapOffsets(x,y,r,s)
{
    const xs=[0];
    const ys=[0];
    if(x<r){
        xs.push(s);
    }else if(x>s-r){
        xs.push(-s);
    }
    if(y<r){
        ys.push(s);
    }else if(y>s-r){
        ys.push(-s);
    }
    const out=[];
    for(let i=0;i<xs.length;i++){
        for(let j=0;j<ys.length;j++){
            out.push([x+xs[i],y+ys[j]]);
        }
    }
    return out;
}

//石テクスチャ
function getStoneTex()
{
    if(_stoneTex){
        return _stoneTex;
    }
    _stoneTex=makeCanvasTex(256,function(ctx,s)
    {
        ctx.fillStyle="#d0d0cc";
        ctx.fillRect(0,0,s,s);
        for(let i=0;i<2800;i++){
            const x=Math.random()*s;
            const y=Math.random()*s;
            const r=0.8+Math.random()*2.5;
            const v=155+Math.floor(Math.random()*85);
            ctx.fillStyle="rgba("+v+","+v+","+(v-3)+",0.45)";
            const pts=wrapOffsets(x,y,r,s);
            for(let k=0;k<pts.length;k++){
                ctx.beginPath();
                ctx.arc(pts[k][0],pts[k][1],r,0,Math.PI*2);
                ctx.fill();
            }
        }
        for(let i=0;i<60;i++){
            const x=Math.random()*s;
            const y=Math.random()*s;
            const r=8+Math.random()*22;
            const v=145+Math.floor(Math.random()*65);
            ctx.fillStyle="rgba("+v+","+v+","+v+",0.14)";
            const pts=wrapOffsets(x,y,r,s);
            for(let k=0;k<pts.length;k++){
                ctx.beginPath();
                ctx.arc(pts[k][0],pts[k][1],r,0,Math.PI*2);
                ctx.fill();
            }
        }
    });
    return _stoneTex;
}

//木目テクスチャ
function getWoodTex()
{
    if(_woodTex){
        return _woodTex;
    }
    _woodTex=makeCanvasTex(256,function(ctx,s)
    {
        ctx.fillStyle="#cbb89e";
        ctx.fillRect(0,0,s,s);
        for(let i=0;i<160;i++){
            const y=Math.random()*s;
            const h=1+Math.random()*3;
            const d=Math.random()>0.5?18:-24;
            const v=180+d+Math.floor(Math.random()*20);
            ctx.fillStyle="rgba("+v+","+Math.floor(v*0.88)+","+Math.floor(v*0.72)+",0.35)";
            ctx.fillRect(0,y,s,h);
        }
        for(let i=0;i<120;i++){
            const x=Math.random()*s;
            const y=Math.random()*s;
            const w=25+Math.random()*90;
            ctx.fillStyle="rgba(80,55,35,0.12)";
            ctx.fillRect(x,y,w,1.2);
            if(x+w>s){
                ctx.fillRect(x-s,y,w,1.2);
            }
        }
    });
    return _woodTex;
}

//銅板屋根テクスチャ
function getCopperTex()
{
    if(_copperTex){
        return _copperTex;
    }
    _copperTex=makeCanvasTex(256,function(ctx,s)
    {
        ctx.fillStyle="#4f7a6a";
        ctx.fillRect(0,0,s,s);
        for(let i=0;i<180;i++){
            const x=Math.random()*s;
            const y=Math.random()*s;
            const w=4+Math.random()*14;
            const h=18+Math.random()*60;
            const g=105+Math.floor(Math.random()*35);
            ctx.fillStyle="rgba("+(g-36)+","+g+","+(g-12)+",0.22)";
            ctx.fillRect(x,y,w,h);
        }
        const cols=8;
        const step=s/cols;
        for(let i=0;i<cols;i++){
            const x=i*step;
            ctx.fillStyle="rgba(22,42,35,0.45)";
            ctx.fillRect(x,0,3,s);
            ctx.fillStyle="rgba(130,175,158,0.32)";
            ctx.fillRect(x+3,0,2,s);
        }
    });
    return _copperTex;
}

//瓦屋根テクスチャ
function getKawaraTex()
{
    if(_kawaraTex){
        return _kawaraTex;
    }
    _kawaraTex=makeCanvasTex(256,function(ctx,s)
    {
        ctx.fillStyle="#42454a";
        ctx.fillRect(0,0,s,s);
        const cols=8;
        const rows=8;
        const cw=s/cols;
        const ch=s/rows;
        for(let c=0;c<cols;c++){
            const x=c*cw;
            const grad=ctx.createLinearGradient(x,0,x+cw,0);
            grad.addColorStop(0,"#292b2f");
            grad.addColorStop(0.28,"#52565c");
            grad.addColorStop(0.55,"#3f4349");
            grad.addColorStop(0.85,"#585c63");
            grad.addColorStop(1,"#26282c");
            ctx.fillStyle=grad;
            ctx.fillRect(x,0,cw,s);
        }
        for(let r=0;r<rows;r++){
            const y=r*ch;
            ctx.fillStyle="rgba(15,17,20,0.52)";
            ctx.fillRect(0,y,s,3.5);
            ctx.fillStyle="rgba(130,136,144,0.18)";
            ctx.fillRect(0,y+3.5,s,2);
        }
        for(let i=0;i<500;i++){
            const v=50+Math.floor(Math.random()*45);
            ctx.fillStyle="rgba("+v+","+v+","+(v+4)+",0.22)";
            ctx.fillRect(Math.random()*s,Math.random()*s,2,2);
        }
    });
    return _kawaraTex;
}

//しめ縄テクスチャ
function getRopeTex()
{
    if(_ropeTex){
        return _ropeTex;
    }
    _ropeTex=makeCanvasTex(128,function(ctx,s)
    {
        ctx.fillStyle="#b89d68";
        ctx.fillRect(0,0,s,s);
        ctx.lineWidth=7;
        for(let i=-s;i<s*2;i+=16){
            ctx.strokeStyle="rgba(120,95,50,0.45)";
            ctx.beginPath();
            ctx.moveTo(i,0);
            ctx.lineTo(i+s,s);
            ctx.stroke();
            ctx.strokeStyle="rgba(220,200,145,0.35)";
            ctx.beginPath();
            ctx.moveTo(i+5,0);
            ctx.lineTo(i+s+5,s);
            ctx.stroke();
        }
    });
    _ropeTex.repeat.set(6,1);
    return _ropeTex;
}

//反りのある梁
function makeCurvedBeamGeo(halfW,h,d,rise,flare)
{
    const seg=16;
    const sh=new THREE.Shape();
    for(let i=0;i<=seg;i++){
        const t=-1+2*i/seg;
        const x=t*halfW;
        const y=rise*Math.pow(Math.abs(t),2.4);
        if(i===0){
            sh.moveTo(x,y);
        }else{
            sh.lineTo(x,y);
        }
    }
    for(let i=seg;i>=0;i--){
        const t=-1+2*i/seg;
        const x=t*halfW*(1+flare);
        const y=rise*Math.pow(Math.abs(t),2.4)+h*(1+0.18*Math.pow(Math.abs(t),2));
        sh.lineTo(x,y);
    }
    sh.closePath();
    const geo=new THREE.ExtrudeGeometry(sh,{depth:d,bevelEnabled:false});
    geo.translate(0,0,-d*0.5);
    return geo;
}

//反りのある切妻屋根
function makeCurvedGableRoofGeo(w,d,h,curve,tipLift,thick,uvScale)
{
    const nx=10;
    const ny=7;
    const pos=[];
    const uvs=[];
    const idx=[];
    const sc=uvScale||1.5;

    function pushQuad(a,b,c,e)
    {
        idx.push(a,c,b,b,c,e);
    }

    function addSlope(sign,flip)
    {
        const base=pos.length/3;
        const dy=flip?-thick:0;
        for(let j=0;j<=ny;j++){
            const v=j/ny;
            for(let i=0;i<=nx;i++){
                const u=-1+2*i/nx;
                const x=sign*u*w*0.5;
                const z=sign*v*d*0.5;
                const lift=tipLift*u*u*v*v;
                const y=h*Math.pow(1-v,curve)+lift+dy;
                pos.push(x,y,z);
                uvs.push((u*0.5+0.5)*w/sc,v*Math.hypot(d*0.5,h)/sc);
            }
        }
        for(let j=0;j<ny;j++){
            for(let i=0;i<nx;i++){
                const a=base+j*(nx+1)+i;
                const b=a+1;
                const c=a+(nx+1);
                const e=c+1;
                if(flip){
                    idx.push(a,b,c,b,e,c);
                }else{
                    pushQuad(a,b,c,e);
                }
            }
        }
        return base;
    }

    const fTop=addSlope(1,false);
    const fBot=addSlope(1,true);
    const bTop=addSlope(-1,false);
    const bBot=addSlope(-1,true);

    //軒先の厚み
    function addEdgeStrip(topBase,botBase)
    {
        const row=ny*(nx+1);
        for(let i=0;i<nx;i++){
            const t0=topBase+row+i;
            const t1=t0+1;
            const b0=botBase+row+i;
            const b1=b0+1;
            idx.push(t0,b0,t1,t1,b0,b1);
        }
    }
    addEdgeStrip(fTop,fBot);
    addEdgeStrip(bTop,bBot);

    //破風の厚み
    function addSideEdge(topBase,botBase,col,rev)
    {
        for(let j=0;j<ny;j++){
            const t0=topBase+j*(nx+1)+col;
            const t1=topBase+(j+1)*(nx+1)+col;
            const b0=botBase+j*(nx+1)+col;
            const b1=botBase+(j+1)*(nx+1)+col;
            if(rev){
                idx.push(t0,t1,b0,t1,b1,b0);
            }else{
                idx.push(t0,b0,t1,t1,b0,b1);
            }
        }
    }
    addSideEdge(fTop,fBot,0,false);
    addSideEdge(fTop,fBot,nx,true);
    addSideEdge(bTop,bBot,0,false);
    addSideEdge(bTop,bBot,nx,true);

    const geo=new THREE.BufferGeometry();
    geo.setAttribute("position",new THREE.Float32BufferAttribute(pos,3));
    geo.setAttribute("uv",new THREE.Float32BufferAttribute(uvs,2));
    geo.setIndex(idx);
    geo.computeVertexNormals();
    return geo;
}

//反りのある寄棟屋根
function makeCurvedHipRoofGeo(topW,topD,botW,botD,h,curve,tipLift,thick,uvScale)
{
    const nx=8;
    const ny=6;
    const pos=[];
    const uvs=[];
    const idx=[];
    const sc=uvScale||1.5;

    function sidePt(side,u,v,dy)
    {
        const hw=(topW+(botW-topW)*v)*0.5;
        const hd=(topD+(botD-topD)*v)*0.5;
        const flare=1+0.04*u*u*v*v;
        const lift=tipLift*Math.pow(Math.abs(u),2.4)*v*v;
        const y=h*Math.pow(1-v,curve)+lift+dy;
        let x=0;
        let z=0;
        if(side===0){
            x=u*hw*flare;
            z=hd*flare;
        }else if(side===1){
            x=hw*flare;
            z=-u*hd*flare;
        }else if(side===2){
            x=-u*hw*flare;
            z=-hd*flare;
        }else{
            x=-hw*flare;
            z=u*hd*flare;
        }
        return [x,y,z];
    }

    function buildSide(side,flip)
    {
        const base=pos.length/3;
        const dy=flip?-thick:0;
        const sideW=(side%2===0)?botW:botD;
        const slopeL=Math.hypot((botD-topD)*0.5,h);
        for(let j=0;j<=ny;j++){
            const v=j/ny;
            for(let i=0;i<=nx;i++){
                const u=-1+2*i/nx;
                const p=sidePt(side,u,v,dy);
                pos.push(p[0],p[1],p[2]);
                uvs.push((u*0.5+0.5)*sideW/sc,v*slopeL/sc);
            }
        }
        for(let j=0;j<ny;j++){
            for(let i=0;i<nx;i++){
                const a=base+j*(nx+1)+i;
                const b=a+1;
                const c=a+(nx+1);
                const e=c+1;
                if(flip){
                    idx.push(a,b,c,b,e,c);
                }else{
                    idx.push(a,c,b,b,c,e);
                }
            }
        }
        return base;
    }

    for(let s=0;s<4;s++){
        const tb=buildSide(s,false);
        const bb=buildSide(s,true);
        const row=ny*(nx+1);
        for(let i=0;i<nx;i++){
            const t0=tb+row+i;
            const t1=t0+1;
            const b0=bb+row+i;
            const b1=b0+1;
            idx.push(t0,b0,t1,t1,b0,b1);
        }
    }

    const geo=new THREE.BufferGeometry();
    geo.setAttribute("position",new THREE.Float32BufferAttribute(pos,3));
    geo.setAttribute("uv",new THREE.Float32BufferAttribute(uvs,2));
    geo.setIndex(idx);
    geo.computeVertexNormals();
    return geo;
}

//妻壁の曲面パネル
function makeGableWallGeo(halfZ,roofHalfZ,roofH,curve,baseY,roofY,thick)
{
    const seg=12;
    const sh=new THREE.Shape();
    sh.moveTo(-halfZ,0);
    sh.lineTo(halfZ,0);
    for(let i=seg;i>=0;i--){
        const z=-halfZ+2*halfZ*i/seg;
        const v=Math.min(1,Math.abs(z)/roofHalfZ);
        const y=roofY+roofH*Math.pow(1-v,curve)-baseY;
        sh.lineTo(z,Math.max(0.05,y));
    }
    sh.closePath();
    const geo=new THREE.ExtrudeGeometry(sh,{depth:thick,bevelEnabled:false});
    geo.translate(0,0,-thick*0.5);
    geo.rotateY(Math.PI*0.5);
    return geo;
}

//鳥居
export function makeTorii()
{
    const g=new THREE.Group();
    const redMat=makeMat(0xdc402c,0.58,0.04,getWoodTex());
    const blackMat=makeMat(0x222326,0.72,0.08);
    const goldMat=makeMat(0xc8a245,0.35,0.75);

    //柱と根元の台輪
    const halfSpan=2.1;
    for(let i=0;i<2;i++){
        const s=i===0?-1:1;
        const p=addCyl(g,0.185,0.22,4.95,16,redMat,s*(halfSpan-0.085),2.48,0);
        p.rotation.z=s*0.036;
        addCyl(g,0.27,0.31,0.42,16,blackMat,s*halfSpan,0.21,0);
        addCyl(g,0.22,0.265,0.22,16,blackMat,s*(halfSpan-0.01),0.53,0);
        addCyl(g,0.215,0.215,0.14,16,blackMat,s*(halfSpan-0.17),4.82,0);
    }

    //貫と楔
    addBox(g,5.55,0.26,0.16,redMat,0,3.95,0);
    for(let i=0;i<2;i++){
        const s=i===0?-1:1;
        addBox(g,0.12,0.36,0.2,blackMat,s*1.72,3.95,0);
        addBox(g,0.12,0.36,0.2,blackMat,s*2.2,3.95,0);
    }

    //島木と笠木
    addMesh(g,makeCurvedBeamGeo(2.92,0.22,0.34,0.24,0.03),redMat,0,4.9,0);
    addMesh(g,makeCurvedBeamGeo(3.26,0.24,0.46,0.28,0.05),blackMat,0,5.12,0);

    //額束と扁額
    addBox(g,0.24,0.92,0.18,redMat,0,4.45,0);
    addBox(g,0.54,0.76,0.06,blackMat,0,4.46,0.11);
    addBox(g,0.46,0.68,0.02,goldMat,0,4.46,0.14);
    addBox(g,0.38,0.6,0.025,blackMat,0,4.46,0.15);
    addBox(g,0.08,0.42,0.02,goldMat,0,4.46,0.165);

    return setShadow(g);
}

//石灯籠
export function makeToro()
{
    const g=new THREE.Group();
    const stoneMat=makeMat(0x888b87,0.92,0.02,getStoneTex());
    const darkStone=makeMat(0x6e716d,0.95,0.02,getStoneTex());
    const lightMat=new THREE.MeshStandardMaterial({
        color:0xfff0c8,
        emissive:0xffa63d,
        emissiveIntensity:2.0,
        roughness:0.35,
        metalness:0
    });

    //基礎
    addCyl(g,0.38,0.44,0.16,6,darkStone,0,0.08,0);
    addCyl(g,0.28,0.36,0.12,6,stoneMat,0,0.22,0);
    addCyl(g,0.15,0.24,0.08,6,stoneMat,0,0.32,0);

    //竿と節
    addCyl(g,0.105,0.115,0.78,12,stoneMat,0,0.75,0);
    addCyl(g,0.135,0.135,0.06,12,darkStone,0,0.75,0);

    //中台
    addCyl(g,0.32,0.14,0.14,6,stoneMat,0,1.21,0);
    addCyl(g,0.35,0.33,0.07,6,darkStone,0,1.315,0);

    //火袋
    addCyl(g,0.23,0.25,0.05,6,stoneMat,0,1.375,0);
    addCyl(g,0.24,0.23,0.05,6,stoneMat,0,1.655,0);
    for(let i=0;i<6;i++){
        const a=i*Math.PI/3;
        addCyl(g,0.026,0.026,0.26,6,stoneMat,Math.cos(a)*0.195,1.515,Math.sin(a)*0.195);
    }

    //火袋の灯り
    const light=addCyl(g,0.08,0.09,0.16,8,lightMat,0,1.51,0);
    light.name="light";

    //笠
    addCyl(g,0.12,0.45,0.22,6,stoneMat,0,1.79,0);
    for(let i=0;i<6;i++){
        const a=i*Math.PI/3+Math.PI/6;
        addMesh(g,new THREE.SphereGeometry(0.036,6,5),darkStone,Math.cos(a)*0.41,1.71,Math.sin(a)*0.41);
    }

    //宝珠
    addCyl(g,0.09,0.13,0.05,8,stoneMat,0,1.92,0);
    addMesh(g,new THREE.SphereGeometry(0.065,8,6),stoneMat,0,1.975,0);
    addMesh(g,new THREE.ConeGeometry(0.045,0.09,8),stoneMat,0,2.045,0);

    return setShadow(g);
}

//しめ縄
function makeShimenawaMesh(span,sag,mat)
{
    const pts=[];
    for(let i=0;i<=8;i++){
        const t=i/8;
        const x=-span*0.5+span*t;
        const y=sag*4*(t-0.5)*(t-0.5);
        pts.push(new THREE.Vector3(x,y,0));
    }
    const curve=new THREE.CatmullRomCurve3(pts);
    const tSeg=24;
    const rSeg=10;
    const geo=new THREE.TubeGeometry(curve,tSeg,0.15,rSeg,false);
    const pa=geo.attributes.position;
    for(let i=0;i<=tSeg;i++){
        const t=i/tSeg;
        const c=curve.getPointAt(t);
        const sc=0.32+0.92*Math.sin(t*Math.PI);
        for(let j=0;j<=rSeg;j++){
            const k=i*(rSeg+1)+j;
            pa.setXYZ(
                k,
                c.x+(pa.getX(k)-c.x)*sc,
                c.y+(pa.getY(k)-c.y)*sc,
                c.z+(pa.getZ(k)-c.z)*sc
            );
        }
    }
    geo.computeVertexNormals();
    return new THREE.Mesh(geo,mat);
}

//神社の拝殿
export function makeHaiden()
{
    const g=new THREE.Group();
    const stoneMat=makeMat(0x949690,0.92,0.02,getStoneTex());
    const woodMat=makeMat(0x664832,0.82,0.04,getWoodTex());
    const darkWood=makeMat(0x473122,0.84,0.04,getWoodTex());
    const wallMat=makeMat(0xebe8de,0.88,0.02);
    const roofMat=makeMat(0xffffff,0.58,0.22,getCopperTex());
    const roofRidgeMat=makeMat(0x3f6457,0.52,0.28);
    const ropeMat=makeMat(0xffffff,0.95,0.0,getRopeTex());
    const paperMat=makeMat(0xf5f5f0,0.8,0.0);
    const goldMat=makeMat(0xc49c3f,0.35,0.7);

    //石の基壇と階段
    addBox(g,10.4,0.65,7.4,stoneMat,0,0.325,0);
    for(let i=0;i<4;i++){
        addBox(g,3.2,0.16,0.32,stoneMat,0,0.08+i*0.16,4.66-i*0.3);
    }
    addBox(g,0.22,0.55,1.3,stoneMat,-1.7,0.275,4.15);
    addBox(g,0.22,0.55,1.3,stoneMat,1.7,0.275,4.15);

    //縁側と高欄
    addBox(g,10.0,0.12,7.0,woodMat,0,0.71,0);
    for(let i=0;i<2;i++){
        const s=i===0?-1:1;
        addBox(g,3.2,0.08,0.08,darkWood,s*3.3,1.32,3.38);
        addBox(g,0.08,0.08,6.76,darkWood,s*4.88,1.32,0);
        addBox(g,0.1,0.62,0.1,darkWood,s*1.75,1.04,3.38);
        addBox(g,0.1,0.62,0.1,darkWood,s*4.88,1.04,3.38);
        addBox(g,0.1,0.62,0.1,darkWood,s*4.88,1.04,-3.38);
    }

    //本体と白壁
    addBox(g,8.6,2.95,5.4,wallMat,0,2.24,0);
    addBox(g,8.66,1.15,5.46,woodMat,0,1.34,0);
    addBox(g,8.74,0.18,5.54,darkWood,0,2.95,0);
    addBox(g,8.74,0.16,5.54,darkWood,0,3.62,0);

    //正面の格子戸
    addBox(g,2.9,2.15,0.12,darkWood,0,1.85,2.72);
    for(let i=-2;i<=2;i++){
        addBox(g,0.06,2.05,0.15,woodMat,i*0.58,1.85,2.74);
    }

    //木の柱
    const px=[-4.3,-1.65,1.65,4.3];
    const pz=[-2.7,2.7];
    for(let i=0;i<px.length;i++){
        for(let j=0;j<pz.length;j++){
            addCyl(g,0.13,0.14,3.0,10,darkWood,px[i],2.25,pz[j]);
        }
    }
    addCyl(g,0.12,0.13,2.9,10,darkWood,-4.3,2.2,0);
    addCyl(g,0.12,0.13,2.9,10,darkWood,4.3,2.2,0);

    //銅板の大屋根
    const roofW=12.6;
    const roofD=9.4;
    const roofH=2.95;
    const roofY=3.25;
    addMesh(g,makeCurvedGableRoofGeo(roofW,roofD,roofH,1.45,0.22,0.22,1.6),roofMat,0,roofY,0);
    addBox(g,roofW+0.2,0.34,0.34,roofRidgeMat,0,roofY+roofH+0.12,0);

    //妻壁
    const gableGeo=makeGableWallGeo(2.7,roofD*0.5,roofH,1.45,3.6,roofY,0.18);
    addMesh(g,gableGeo,wallMat,-4.25,3.6,0);
    addMesh(g,gableGeo,wallMat,4.25,3.6,0);

    //向拝の庇と柱
    const kohai=addMesh(g,makeCurvedGableRoofGeo(2.8,4.0,0.95,1.35,0.08,0.16,1.4),roofMat,0,3.25,4.0);
    kohai.rotation.y=Math.PI*0.5;
    addBox(g,0.34,0.18,0.34,stoneMat,-1.7,0.09,4.75);
    addBox(g,0.34,0.18,0.34,stoneMat,1.7,0.09,4.75);
    addCyl(g,0.13,0.14,3.08,10,darkWood,-1.7,1.72,4.75);
    addCyl(g,0.13,0.14,3.08,10,darkWood,1.7,1.72,4.75);
    addBox(g,3.6,0.22,0.2,darkWood,0,3.26,4.75);

    //しめ縄と紙垂
    const shime=makeShimenawaMesh(3.2,0.28,ropeMat);
    shime.position.set(0,2.85,4.82);
    g.add(shime);
    const shideSh=new THREE.Shape();
    shideSh.moveTo(0,0);
    shideSh.lineTo(0.08,0);
    shideSh.lineTo(0.08,-0.12);
    shideSh.lineTo(0.14,-0.12);
    shideSh.lineTo(0.14,-0.24);
    shideSh.lineTo(0.06,-0.24);
    shideSh.lineTo(0.06,-0.36);
    shideSh.lineTo(-0.02,-0.36);
    shideSh.lineTo(-0.02,-0.2);
    shideSh.lineTo(0.04,-0.2);
    shideSh.lineTo(0.04,-0.08);
    shideSh.lineTo(0,-0.08);
    shideSh.closePath();
    const shideGeo=new THREE.ExtrudeGeometry(shideSh,{depth:0.012,bevelEnabled:false});
    for(let i=0;i<4;i++){
        const x=-0.9+i*0.6;
        const y=2.76+Math.abs(x)*0.07;
        addMesh(g,shideGeo,paperMat,x-0.04,y,4.86);
    }

    //さい銭箱
    addBox(g,1.75,0.78,0.72,woodMat,0,1.16,3.28);
    addBox(g,1.82,0.08,0.78,darkWood,0,1.56,3.28);
    for(let i=-3;i<=3;i++){
        addBox(g,0.06,0.05,0.68,darkWood,i*0.23,1.61,3.28);
    }
    addBox(g,0.42,0.22,0.04,goldMat,0,1.28,3.65);

    return setShadow(g);
}

//公園のベンチ
export function makeBench()
{
    const g=new THREE.Group();
    const woodMat=makeMat(0xb68452,0.78,0.02,getWoodTex());
    const ironMat=makeMat(0x232629,0.52,0.68);

    //座面の板
    for(let i=0;i<4;i++){
        const z=-0.165+i*0.115;
        const y=0.425+(i===0?-0.008:i===3?-0.006:0.004);
        addBox(g,1.8,0.032,0.092,woodMat,0,y,z);
    }

    //背もたれの板
    for(let i=0;i<3;i++){
        const y=0.56+i*0.115;
        const z=-0.245-i*0.032;
        const slat=addBox(g,1.8,0.088,0.028,woodMat,0,y,z);
        slat.rotation.x=-0.24;
    }

    //黒い鉄の脚
    for(let i=0;i<2;i++){
        const x=i===0?-0.72:0.72;
        addBox(g,0.045,0.42,0.045,ironMat,x,0.21,0.18);
        const backLeg=addBox(g,0.045,0.44,0.045,ironMat,x,0.21,-0.2);
        backLeg.rotation.x=0.1;
        addBox(g,0.045,0.042,0.45,ironMat,x,0.395,-0.01);
        const backPost=addBox(g,0.04,0.46,0.04,ironMat,x,0.63,-0.28);
        backPost.rotation.x=-0.24;
        addBox(g,0.04,0.035,0.42,ironMat,x,0.58,-0.02);
        addBox(g,0.035,0.18,0.035,ironMat,x,0.49,0.18);
    }
    addBox(g,1.42,0.032,0.032,ironMat,0,0.35,-0.02);

    return setShadow(g);
}

//公園の街灯
export function makeLamp()
{
    const g=new THREE.Group();
    const ironMat=makeMat(0x202326,0.48,0.72);
    const lightMat=new THREE.MeshStandardMaterial({
        color:0xfff4d6,
        emissive:0xffcc70,
        emissiveIntensity:1.8,
        roughness:0.25,
        metalness:0.05
    });

    //台座と柱
    addCyl(g,0.12,0.16,0.16,8,ironMat,0,0.08,0);
    addCyl(g,0.075,0.115,0.42,10,ironMat,0,0.37,0);
    addCyl(g,0.042,0.058,2.42,10,ironMat,0,1.79,0);
    addCyl(g,0.068,0.068,0.05,10,ironMat,0,0.6,0);
    addCyl(g,0.07,0.05,0.08,10,ironMat,0,2.98,0);

    //ランタン枠
    addCyl(g,0.13,0.07,0.06,6,ironMat,0,3.04,0);
    for(let i=0;i<4;i++){
        const a=i*Math.PI*0.5+Math.PI*0.25;
        const strut=addCyl(g,0.012,0.012,0.28,6,ironMat,Math.cos(a)*0.125,3.19,Math.sin(a)*0.125);
        strut.rotation.z=-Math.cos(a)*0.14;
        strut.rotation.x=Math.sin(a)*0.14;
    }

    //ランタンの灯り
    const light=addCyl(g,0.125,0.095,0.25,6,lightMat,0,3.19,0);
    light.name="light";

    //笠と頂部
    addCyl(g,0.05,0.2,0.12,6,ironMat,0,3.38,0);
    addMesh(g,new THREE.SphereGeometry(0.032,8,6),ironMat,0,3.47,0);

    return setShadow(g);
}

//五重塔
export function makePagoda()
{
    const g=new THREE.Group();
    const stoneMat=makeMat(0x949692,0.92,0.02,getStoneTex());
    const redMat=makeMat(0xd4402c,0.62,0.04,getWoodTex());
    const darkWood=makeMat(0x4f3524,0.82,0.04,getWoodTex());
    const wallMat=makeMat(0xe8e4d8,0.88,0.02);
    const roofMat=makeMat(0xc8ccd2,0.72,0.08,getKawaraTex());
    const goldMat=makeMat(0xd4af46,0.3,0.82);

    //石の基壇と階段
    addBox(g,7.4,1.2,7.4,stoneMat,0,0.6,0);
    addBox(g,2.2,0.6,1.1,stoneMat,0,0.3,4.2);
    addBox(g,2.2,0.3,0.6,stoneMat,0,0.15,4.9);

    //5層の胴と屋根
    let y=1.2;
    let apexY=18.8;
    for(let i=0;i<5;i++){
        const s=1-i*0.11;
        const cw=4.6*s;
        const ch=3.1-i*0.18;
        const rBot=8.2*s;
        const rTop=i<4?4.6*(1-(i+1)*0.11)*0.96:0.42;
        const rH=i<4?1.45*s:2.15;

        addBox(g,cw,ch,cw,redMat,0,y+ch*0.5,0);
        addBox(g,cw+0.04,ch*0.26,cw+0.04,wallMat,0,y+ch*0.72,0);
        addBox(g,cw+0.42,0.28,cw+0.42,darkWood,0,y+ch-0.22,0);
        addBox(g,cw+0.56,0.18,cw+0.56,redMat,0,y+0.34,0);

        const roofY=y+ch-0.35;
        addMesh(g,makeCurvedHipRoofGeo(rTop,rTop,rBot,rBot,rH,1.4,0.26*s,0.22,1.6),roofMat,0,roofY,0);
        if(i<4){
            y=roofY+rH*0.72;
        }else{
            apexY=roofY+rH;
        }
    }

    //相輪
    const sy=apexY-0.12;
    addBox(g,0.72,0.32,0.72,goldMat,0,sy+0.16,0);
    addMesh(g,new THREE.SphereGeometry(0.28,10,8),goldMat,0,sy+0.46,0);
    addCyl(g,0.055,0.095,5.6,10,goldMat,0,sy+3.25,0);
    for(let i=0;i<9;i++){
        const r=0.28-i*0.008;
        const ring=addMesh(g,new THREE.TorusGeometry(r,0.034,6,14),goldMat,0,sy+1.1+i*0.33,0);
        ring.rotation.x=Math.PI*0.5;
    }
    addMesh(g,new THREE.TorusGeometry(0.28,0.025,6,12),goldMat,0,sy+4.55,0);
    const suien2=addMesh(g,new THREE.TorusGeometry(0.28,0.025,6,12),goldMat,0,sy+4.55,0);
    suien2.rotation.y=Math.PI*0.5;
    addMesh(g,new THREE.SphereGeometry(0.14,10,8),goldMat,0,sy+5.92,0);
    addMesh(g,new THREE.ConeGeometry(0.08,0.28,8),goldMat,0,sy+6.16,0);

    return setShadow(g);
}

//お寺の本堂
export function makeTempleHall()
{
    const g=new THREE.Group();
    const stoneMat=makeMat(0x90928d,0.92,0.02,getStoneTex());
    const woodMat=makeMat(0x74553c,0.82,0.03,getWoodTex());
    const darkWood=makeMat(0x4d3625,0.84,0.04,getWoodTex());
    const wallMat=makeMat(0xe8e4da,0.88,0.02);
    const roofMat=makeMat(0xd4d8de,0.74,0.08,getKawaraTex());
    const ridgeMat=makeMat(0x383b40,0.68,0.1);

    //基壇と階段
    addBox(g,14.4,0.85,10.4,stoneMat,0,0.425,0);
    for(let i=0;i<4;i++){
        addBox(g,4.0,0.21,0.36,stoneMat,0,0.105+i*0.21,6.32-i*0.34);
    }
    addBox(g,0.26,0.72,1.5,stoneMat,-2.12,0.36,5.8);
    addBox(g,0.26,0.72,1.5,stoneMat,2.12,0.36,5.8);

    //縁側と高欄
    addBox(g,14.0,0.14,10.0,woodMat,0,0.92,0);
    for(let i=0;i<2;i++){
        const s=i===0?-1:1;
        addBox(g,4.7,0.09,0.09,darkWood,s*4.55,1.62,4.88);
        addBox(g,0.09,0.09,9.76,darkWood,s*6.88,1.62,0);
        addBox(g,0.11,0.68,0.11,darkWood,s*2.25,1.3,4.88);
        addBox(g,0.11,0.68,0.11,darkWood,s*6.88,1.3,4.88);
        addBox(g,0.11,0.68,0.11,darkWood,s*6.88,1.3,-4.88);
    }

    //木造の本体
    addBox(g,11.2,3.65,7.2,woodMat,0,2.8,0);
    addBox(g,11.28,0.95,7.28,wallMat,0,3.95,0);
    addBox(g,11.4,0.22,7.4,darkWood,0,3.45,0);
    addBox(g,11.4,0.24,7.4,darkWood,0,4.55,0);

    //正面の扉と柱
    addBox(g,3.8,2.45,0.14,darkWood,0,2.22,3.62);
    for(let i=-2;i<=2;i++){
        addBox(g,0.08,2.35,0.18,woodMat,i*0.76,2.22,3.65);
    }
    const px=[-5.6,-2.8,2.8,5.6];
    const pz=[-3.6,3.6];
    for(let i=0;i<px.length;i++){
        for(let j=0;j<pz.length;j++){
            addCyl(g,0.16,0.17,3.65,10,darkWood,px[i],2.8,pz[j]);
        }
    }
    addCyl(g,0.15,0.16,3.65,10,darkWood,-5.6,2.8,0);
    addCyl(g,0.15,0.16,3.65,10,darkWood,5.6,2.8,0);

    //入母屋の瓦屋根
    addMesh(g,makeCurvedHipRoofGeo(10.4,5.4,16.6,12.6,2.25,1.35,0.34,0.28,1.7),roofMat,0,4.1,0);
    addMesh(g,makeCurvedGableRoofGeo(11.4,6.2,2.65,1.4,0.18,0.26,1.7),roofMat,0,6.2,0);
    addBox(g,11.7,0.44,0.44,ridgeMat,0,9.02,0);
    addBox(g,0.32,0.72,0.58,ridgeMat,-5.82,9.2,0);
    addBox(g,0.32,0.72,0.58,ridgeMat,5.82,9.2,0);

    //妻壁
    const gableGeo=makeGableWallGeo(2.7,3.1,2.65,1.4,6.25,6.2,0.22);
    addMesh(g,gableGeo,wallMat,-5.1,6.25,0);
    addMesh(g,gableGeo,wallMat,5.1,6.25,0);

    //向拝
    const kohai=addMesh(g,makeCurvedGableRoofGeo(3.2,4.8,1.1,1.35,0.1,0.18,1.5),roofMat,0,3.95,5.5);
    kohai.rotation.y=Math.PI*0.5;
    addBox(g,0.4,0.22,0.4,stoneMat,-2.12,0.11,6.45);
    addBox(g,0.4,0.22,0.4,stoneMat,2.12,0.11,6.45);
    addCyl(g,0.16,0.17,3.74,10,darkWood,-2.12,2.09,6.45);
    addCyl(g,0.16,0.17,3.74,10,darkWood,2.12,2.09,6.45);
    addBox(g,4.5,0.26,0.24,darkWood,0,3.96,6.45);

    return setShadow(g);
}

//庭石
export function makeGardenRock()
{
    const g=new THREE.Group();
    const d=0.6+Math.random()*1.0;
    const r=d*0.5;
    const geo=new THREE.IcosahedronGeometry(r,3);
    const pos=geo.attributes.position;

    const sx=0.85+Math.random()*0.3;
    const sz=0.82+Math.random()*0.32;
    const sy=0.52+Math.random()*0.32;
    const p1=Math.random()*6.28;
    const p2=Math.random()*6.28;
    const p3=Math.random()*6.28;
    const p4=Math.random()*6.28;

    let minY=999;
    for(let i=0;i<pos.count;i++){
        const vx=pos.getX(i);
        const vy=pos.getY(i);
        const vz=pos.getZ(i);
        const nx=vx/r;
        const ny=vy/r;
        const nz=vz/r;
        const n1=Math.sin(nx*2.3+p1)*Math.cos(ny*2.1+p2)*Math.sin(nz*2.4+p3);
        const n2=Math.sin(nx*5.1+p2)*sinCos(ny*4.7+p3,nz*5.3+p4);
        const disp=1+0.22*n1+0.08*n2;
        const x=vx*sx*disp;
        let y=vy*sy*disp;
        const z=vz*sz*disp;
        if(y<-r*sy*0.5){
            y=-r*sy*0.5+(y+r*sy*0.5)*0.2;
        }
        if(y<minY){
            minY=y;
        }
        pos.setXYZ(i,x,y,z);
    }
    for(let i=0;i<pos.count;i++){
        pos.setY(i,pos.getY(i)-minY-0.02);
    }
    geo.computeVertexNormals();

    //灰色と苔の頂点色
    const norm=geo.attributes.normal;
    const cols=new Float32Array(pos.count*3);
    for(let i=0;i<pos.count;i++){
        const px=pos.getX(i);
        const pz=pos.getZ(i);
        const ny=norm.getY(i);
        const vNoise=Math.sin(px*5.2+p1)*Math.cos(pz*4.8+p4)*0.06;
        const mNoise=Math.sin(px*3.7+p2)+Math.cos(pz*4.1+p3)+Math.sin((px+pz)*2.5+p4);
        let moss=0;
        if(ny>0.28&&mNoise>0.2){
            moss=Math.min(0.75,(ny-0.28)*1.1*(mNoise-0.2)*0.45);
        }
        const gr=0.56+vNoise;
        const cr=gr*(1-moss)+0.34*moss;
        const cg=(gr+0.01)*(1-moss)+0.48*moss;
        const cb=(gr-0.01)*(1-moss)+0.24*moss;
        cols[i*3]=cr;
        cols[i*3+1]=cg;
        cols[i*3+2]=cb;
    }
    geo.setAttribute("color",new THREE.BufferAttribute(cols,3));

    const mat=new THREE.MeshStandardMaterial({
        vertexColors:true,
        map:getStoneTex(),
        roughness:0.93,
        metalness:0.02
    });
    addMesh(g,geo,mat,0,0,0);
    return setShadow(g);
}

function sinCos(a,b)
{
    return Math.sin(a)*Math.cos(b);
}

//秋の芝生テクスチャ
export function makeLawnTexture()
{
    return makeCanvasTex(512,function(ctx,s)
    {
        ctx.fillStyle="#6c693d";
        ctx.fillRect(0,0,s,s);

        const patches=["rgba(138,122,70,0.22)","rgba(86,98,48,0.24)","rgba(104,88,52,0.2)","rgba(72,88,42,0.22)"];
        for(let i=0;i<90;i++){
            const x=Math.random()*s;
            const y=Math.random()*s;
            const r=28+Math.random()*64;
            const col=patches[Math.floor(Math.random()*patches.length)];
            const pts=wrapOffsets(x,y,r,s);
            for(let k=0;k<pts.length;k++){
                const gr=ctx.createRadialGradient(pts[k][0],pts[k][1],2,pts[k][0],pts[k][1],r);
                gr.addColorStop(0,col);
                gr.addColorStop(1,"rgba(0,0,0,0)");
                ctx.fillStyle=gr;
                ctx.beginPath();
                ctx.arc(pts[k][0],pts[k][1],r,0,Math.PI*2);
                ctx.fill();
            }
        }

        //細い草の線
        const blades=["#a99552","#8e8244","#6c7538","#526630","#3f5026","#7d683b","#bca965"];
        for(let i=0;i<5600;i++){
            const x=Math.random()*s;
            const y=Math.random()*s;
            const len=7+Math.random()*12;
            const ang=-Math.PI*0.5+(Math.random()-0.5)*1.4;
            const dx=Math.cos(ang)*len;
            const dy=Math.sin(ang)*len;
            ctx.strokeStyle=blades[Math.floor(Math.random()*blades.length)];
            ctx.lineWidth=0.7+Math.random()*1.1;
            const pts=wrapOffsets(x,y,len+2,s);
            for(let k=0;k<pts.length;k++){
                ctx.beginPath();
                ctx.moveTo(pts[k][0],pts[k][1]);
                ctx.lineTo(pts[k][0]+dx,pts[k][1]+dy);
                ctx.stroke();
            }
        }
    });
}

//苔の地面テクスチャ
export function makeMossTexture()
{
    return makeCanvasTex(512,function(ctx,s)
    {
        ctx.fillStyle="#2e441e";
        ctx.fillRect(0,0,s,s);

        const patches=["rgba(68,98,38,0.32)","rgba(94,126,48,0.26)","rgba(40,62,24,0.35)","rgba(44,46,28,0.24)"];
        for(let i=0;i<120;i++){
            const x=Math.random()*s;
            const y=Math.random()*s;
            const r=22+Math.random()*58;
            const col=patches[Math.floor(Math.random()*patches.length)];
            const pts=wrapOffsets(x,y,r,s);
            for(let k=0;k<pts.length;k++){
                const gr=ctx.createRadialGradient(pts[k][0],pts[k][1],2,pts[k][0],pts[k][1],r);
                gr.addColorStop(0,col);
                gr.addColorStop(1,"rgba(0,0,0,0)");
                ctx.fillStyle=gr;
                ctx.beginPath();
                ctx.arc(pts[k][0],pts[k][1],r,0,Math.PI*2);
                ctx.fill();
            }
        }

        const tufts=["#3c5a24","#4f712d","#638537","#273b19","#769642","#354a22"];
        for(let i=0;i<6800;i++){
            const x=Math.random()*s;
            const y=Math.random()*s;
            const r=1.0+Math.random()*2.6;
            ctx.fillStyle=tufts[Math.floor(Math.random()*tufts.length)];
            const pts=wrapOffsets(x,y,r+1,s);
            for(let k=0;k<pts.length;k++){
                ctx.beginPath();
                ctx.arc(pts[k][0],pts[k][1],r,0,Math.PI*2);
                ctx.fill();
            }
        }
    });
}

//枯山水の砂紋テクスチャ
export function makeRakedGravelTexture()
{
    return makeCanvasTex(512,function(ctx,s)
    {
        const ridges=16;
        const img=ctx.createImageData(s,s);
        const data=img.data;

        //砂紋の筋
        for(let y=0;y<s;y++){
            const ph=(y/s)*Math.PI*2*ridges;
            const wave=Math.sin(ph)*20+Math.cos(ph)*13+Math.sin(ph*2)*4;
            const micro=Math.sin((y/s)*Math.PI*2*64)*2;
            const base=210+wave+micro;
            for(let x=0;x<s;x++){
                const idx=(y*s+x)*4;
                const n=(Math.random()-0.5)*16;
                const v=Math.max(120,Math.min(248,base+n));
                data[idx]=v;
                data[idx+1]=v-1;
                data[idx+2]=v-4;
                data[idx+3]=255;
            }
        }
        ctx.putImageData(img,0,0);

        //細かい砂利粒
        for(let i=0;i<7500;i++){
            const x=Math.random()*s;
            const y=Math.random()*s;
            const ph=(y/s)*Math.PI*2*ridges;
            const sh=Math.sin(ph)*18+Math.cos(ph)*10;
            const pick=Math.random();
            let v=210;
            if(pick<0.18){
                v=115+Math.random()*35;
            }else if(pick<0.65){
                v=175+Math.random()*35;
            }else{
                v=225+Math.random()*25;
            }
            v=Math.max(70,Math.min(252,Math.floor(v+sh*0.6)));
            const r=0.8+Math.random()*1.5;
            ctx.fillStyle="rgb("+v+","+(v-1)+","+(v-3)+")";
            const pts=wrapOffsets(x,y,r+1,s);
            for(let k=0;k<pts.length;k++){
                ctx.fillRect(pts[k][0],pts[k][1],r*1.4,r);
            }
        }
    });
}

//石畳舗装テクスチャ
export function makePavingTexture()
{
    return makeCanvasTex(512,function(ctx,s)
    {
        ctx.fillStyle="#45443f";
        ctx.fillRect(0,0,s,s);

        const rows=8;
        const cols=4;
        const rh=s/rows;
        const cw=s/cols;
        const gap=3;

        function drawSlab(x,y,w,h,baseR,baseG,baseB,seed)
        {
            ctx.fillStyle="rgb("+baseR+","+baseG+","+baseB+")";
            ctx.fillRect(x,y,w,h);

            //石の粒感
            let st=seed;
            for(let i=0;i<85;i++){
                st=(st*1664525+1013904223)>>>0;
                const rx=(st%1000)/1000;
                st=(st*1664525+1013904223)>>>0;
                const ry=(st%1000)/1000;
                st=(st*1664525+1013904223)>>>0;
                const d=(st%34)-17;
                ctx.fillStyle="rgba("+(baseR+d)+","+(baseG+d)+","+(baseB+d)+",0.45)";
                ctx.fillRect(x+rx*(w-3),y+ry*(h-3),2.5,2.5);
            }

            //縁の陰影
            ctx.fillStyle="rgba(255,255,255,0.16)";
            ctx.fillRect(x,y,w,2.5);
            ctx.fillRect(x,y,2.5,h);
            ctx.fillStyle="rgba(0,0,0,0.22)";
            ctx.fillRect(x,y+h-2.5,w,2.5);
            ctx.fillRect(x+w-2.5,y,2.5,h);
        }

        for(let r=0;r<rows;r++){
            const off=(r%2===1)?cw*0.5:0;
            for(let c=0;c<cols;c++){
                const tone=132+Math.floor(Math.random()*28);
                const warm=Math.floor(Math.random()*9)-4;
                const br=tone+warm;
                const bg=tone;
                const bb=tone-warm;
                const seed=Math.floor(Math.random()*1e9);
                const sx=c*cw+off+gap*0.5;
                const sy=r*rh+gap*0.5;
                const sw=cw-gap;
                const sh=rh-gap;
                drawSlab(sx,sy,sw,sh,br,bg,bb,seed);
                if(sx+sw>s){
                    drawSlab(sx-s,sy,sw,sh,br,bg,bb,seed);
                }
            }
        }
    });
}
