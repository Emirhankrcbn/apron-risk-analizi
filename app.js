const ACT=["Pushback / çekme","Bagaj operasyonu","Yakıt ikmali","Apron araç hareketleri","Yer destek ekipmanı (GSE)","Diğer"];
const HF=["Yorgunluk","İletişim hatası","Zaman baskısı","Eğitim eksikliği","Durumsal farkındalık eksikliği","Prosedüre uyumsuzluk"];
const OWN=["Alara","Kiyan","Emirhan","Denizhan","Aysema"];
const LIK=["Çok düşük","Düşük","Orta","Yüksek","Çok yüksek"],SEV=["Önemsiz","Hafif","Orta","Ciddi","Çok ciddi"];
const LV=[[4,"Düşük",1],[9,"Orta",2],[16,"Yüksek",3],[25,"Çok yüksek",4]];
const lvl=s=>LV.find(x=>s<=x[0]);
const KEY="yh-risk-v1",$=id=>document.getElementById(id);
const E=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const ex=(id,a,h,c,f,k,l,v,i,o)=>({id,a,h,c,f,k,l,v,i,o});
let S={risks:[
ex(1,ACT[0],"Uçak ile araç/ekipman arasında sıkışma veya çarpışma","Yaralanma, hasar",HF[1],"Telsiz, prosedür",3,5,"Standart iletişim teyidi, kontrol listesi","Alara"),
ex(2,ACT[1],"Ağır ve tekrarlı kaldırma","Kas-iskelet yaralanması",HF[2],"Eğitim",4,3,"İş rotasyonu, mekanik yardımcı","Kiyan"),
ex(3,ACT[2],"Yakıt sızıntısı ve tutuşma kaynağı","Yangın, yanık",HF[5],"Yakıt ikmal prosedürü",2,5,"Topraklama kontrolü, müdahale planı","Aysema"),
ex(4,ACT[3],"Araç–yaya çarpışması","Ağır yaralanma",HF[4],"Trafik kuralları",3,5,"Hız kontrolü, ayrılmış güzergâh","Alara"),
ex(5,ACT[4],"Arızalı ekipman kullanımı","Sıkışma, düşme",HF[3],"Bakım prosedürü",3,3,"Kullanım öncesi kontrol, dijital takip","Emirhan")],reports:[]};
try{const j=localStorage.getItem(KEY);if(j)S=JSON.parse(j)}catch(e){}
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}};
const opt=a=>a.map(x=>`<option>${x}</option>`).join("");
const optn=a=>a.map((x,i)=>`<option value="${i+1}">${i+1} – ${x}</option>`).join("");
$("act").innerHTML=opt(ACT);$("ract").innerHTML=opt(ACT);$("hf").innerHTML=opt(HF);$("own").innerHTML=opt(OWN);
$("lik").innerHTML=optn(LIK);$("sev").innerHTML=optn(SEV);$("lik").value=3;$("sev").value=3;
$("rd").value=new Date().toISOString().slice(0,10);
function prev(){const s=$("lik").value*$("sev").value,l=lvl(s);$("pv").innerHTML=`Skor: <b>${s}</b> <span class="bd b${l[2]}">${l[1]}</span>`}
function render(){
const R=S.risks.map(r=>({...r,s:r.l*r.v})),n=R.length,hi=R.filter(r=>r.s>=10).length,av=n?(R.reduce((a,r)=>a+r.s,0)/n).toFixed(1):"–";
$("stats").innerHTML=[["Toplam kayıt",n],["Yüksek / çok yüksek",hi],["Ortalama skor",av],["Bildirim",S.reports.length]].map(x=>`<div class="card stat"><span class="mut">${x[0]}</span><b>${x[1]}</b></div>`).join("");
let m=`<div></div>`+[1,2,3,4,5].map(l=>`<div class="ax">O${l}</div>`).join("");
for(let v=5;v>=1;v--){m+=`<div class="ax">Ş${v}</div>`;for(let l=1;l<=5;l++){const c=R.filter(r=>r.l==l&&r.v==v).length;m+=`<div class="b${lvl(l*v)[2]}" title="Skor ${l*v}">${c?`<b>${c}</b>`:`<span class="mut">${l*v}</span>`}</div>`}}
$("mx").innerHTML=m;
const D=[...R].sort((a,b)=>b.s-a.s);
$("bars").innerHTML=D.length?D.map(r=>`<div class="br"><span>${E(r.a)}: ${E(r.h.slice(0,34))}</span><span style="background:var(--line);border-radius:7px;display:block"><span class="t" style="width:${r.s*4}%;background:var(--b${lvl(r.s)[2]})"></span></span><b>${r.s}</b></div>`).join(""):`<p class="mut">Kayıt yok.</p>`;
$("tb").innerHTML=D.map(r=>`<tr><td>${E(r.a)}</td><td>${E(r.h)}<div class="mut">${E(r.c)}</div></td><td>${E(r.f)}</td><td>${r.l}</td><td>${r.v}</td><td><b>${r.s}</b> <span class="bd b${lvl(r.s)[2]}">${lvl(r.s)[1]}</span></td><td>${E(r.k)}</td><td>${E(r.i)}</td><td>${E(r.o)}</td><td><button class="x" data-del="${r.id}" title="Sil">✕</button></td></tr>`).join("");
$("rb").innerHTML=S.reports.length?S.reports.map(r=>`<tr><td>${E(r.d)}</td><td>${E(r.t)}</td><td>${E(r.a)}</td><td>${E(r.x)}</td><td><button class="btn sec" data-conv="${r.id}">Risk kaydına çevir</button> <button class="x" data-rdel="${r.id}" title="Sil">✕</button></td></tr>`).join(""):`<tr><td colspan="5" class="mut">Bildirim yok.</td></tr>`;
save()}
function tab(t){["r","b"].forEach(k=>{$("tab-"+k).hidden=k!=t});document.querySelectorAll(".tabs .btn").forEach(b=>b.classList.toggle("on",b.dataset.tab==t))}
document.querySelectorAll(".tabs .btn").forEach(b=>b.onclick=()=>tab(b.dataset.tab));
["lik","sev"].forEach(i=>$(i).onchange=prev);prev();
$("add").onclick=()=>{const h=$("hz").value.trim();if(!h){$("hz").focus();return}
S.risks.push(ex(Date.now(),$("act").value,h,$("cs").value,$("hf").value,$("ct").value,+$("lik").value,+$("sev").value,$("ex").value,$("own").value));
["hz","cs","ct","ex"].forEach(i=>$(i).value="");render()};
$("radd").onclick=()=>{const x=$("rdsc").value.trim();if(!x){$("rdsc").focus();return}
S.reports.push({id:Date.now(),d:$("rd").value,t:$("rt").value,a:$("ract").value,x});$("rdsc").value="";render()};
$("clr").onclick=()=>{if($("clr").dataset.ok){S.risks=[];$("clr").dataset.ok="";$("clr").textContent="Tümünü temizle";render()}else{$("clr").dataset.ok=1;$("clr").textContent="Emin misiniz? Tekrar tıklayın"}};
$("csv").onclick=async()=>{const q=v=>`"${String(v).replace(/"/g,'""')}"`,rows=[["Faaliyet","Tehlike","Sonuç","İnsan faktörü","Kontrol","Olasılık","Şiddet","Skor","Seviye","İlave önlem","Sorumlu"]];
S.risks.forEach(r=>rows.push([r.a,r.h,r.c,r.f,r.k,r.l,r.v,r.l*r.v,lvl(r.l*r.v)[1],r.i,r.o]));
const t=rows.map(r=>r.map(q).join(",")).join("\n");
try{await navigator.clipboard.writeText(t);$("csv").textContent="Kopyalandı ✓"}catch(e){$("csvt").hidden=false;$("csvt").value=t;$("csvt").select()}};
$("impf").onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{$("imp").value=r.result;$("impb").click();e.target.value=""};r.readAsText(f)};
$("impb").onclick=()=>{try{const a=JSON.parse($("imp").value);if(!Array.isArray(a))throw 0;let n=0;a.forEach((x,i)=>{if(!x.h||!x.l||!x.v)return;const l=Math.min(5,Math.max(1,+x.l)),v=Math.min(5,Math.max(1,+x.v));S.risks.push(ex(Date.now()+i,ACT.includes(x.a)?x.a:ACT[5],x.h,x.c||"",HF.includes(x.f)?x.f:HF[4],x.k||"",l,v,x.i||"",OWN.includes(x.o)?x.o:"Emirhan"));n++});$("impm").textContent=n+" kayıt eklendi";$("imp").value="";render()}catch(e){$("impm").textContent="Geçersiz JSON"}};
document.addEventListener("click",e=>{const d=e.target.dataset;
if(d.del){S.risks=S.risks.filter(r=>r.id!=d.del);render()}
if(d.rdel){S.reports=S.reports.filter(r=>r.id!=d.rdel);render()}
if(d.conv){const r=S.reports.find(r=>r.id==d.conv);if(r){tab("r");$("act").value=r.a;$("hz").value=r.x;$("hz").focus()}}});
render();