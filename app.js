const STORAGE_KEY = "shepherding-journal-v1";

const activities = [
  {title:"A visit to the member’s house, school, or workplace during the week."},
  {title:"A significant interaction you had with the member OUTSIDE the church during the week", note:">30min"},
  {title:"Counseling", note:"on specific topics"},
  {title:"Any teaching from the scriptures", note:"includes teaching Converts"},
  {title:"Prayer Time With Member", note:"In-person"},
  {title:"Prayer For Member in the shepherd’s personal ‘Making Mention’ prayer time.", note:"Minimum of 5 mins per person"},
  {title:"Eat-in: An opportunity to share a meal or a drink with the member at home.", note:"All visits to members of the opposite sex must be in the company of others [with disciples]."},
  {title:"Eat-out: An opportunity to take the member out to eat", note:"e.g. at a KFC, buy waakye, Kenkey and fish, etc. All visits to members of the opposite sex must be in the company of others [with disciples]."},
  {title:"Member’s social event you’ve attended", note:"e.g. birthday visit, funeral of a loved one, outdooring of a baby, hospital visit"},
  {title:"Telepastoring", note:"Prayer and counselling over the phone"}
];

const weeklySections = [
  {title:"PRAYER", items:[
    ["Daily 3-hour prayer","check"],["Weekly long prayer","text","minimum of 9hrs"],["Saturday 3-hour prayer","check"]
  ]},
  {title:"THE WORD", items:[
    ["Daily quiet time","check"],["Scripture memorisation","check"],["Read in house books","check"],
    ["Teaching and preaching","text","the word of salvation and equipping programmes (e.g. discipleship meeting, new believers school, satellite church meeting, prayer meeting, church service, RCM/COG)"]
  ]},
  {title:"SOUL WINNING ACTIVITY", items:[
    ["Led weekly ACOM/FTC","check"],["Number of ACMs that did outreach","number"],["Number of souls won","number"],
    ["Number of New Souls brought to church","number"],["Visited New Converts","check"],["Visited Old Members","check"],
    ["Visited Backslidden souls","check"],["Did Deep Sea Fishing","check"],["Counselled members","check"],["Sunday Attendance","number"]
  ]}
];

const monthlySections = [
  {title:"PRAYER", items:[
    ["Monthly personal retreat","text","at least one day"],["Involvement in congregational prayer","check"]
  ]},
  {title:"SOAKING IN THE WORD", items:[
    ["Harmonised message","text","At least one complete message a month"],["Soaking in videos","text","At least one video a month"]
  ]},
  {title:"GOOD ADMINISTRATION", items:[
    ["Has membership database","check"],["New converts database","check"],["Database for all shepherds","check"]
  ]},
  {title:"TRAINING OF SHEPHERDS", items:[
    ["Has 12 'apostles'","check"],["Has 3 inner apostles","check"],["Has a training program","check"],["Grooms out new shepherds and potential shepherds","check"]
  ]},
  {title:"LOYALTY", items:[
    ["Loyalty Traits score","number"],["Faithful giver","check"],["Financial commitment","check"],["No moral issues","check"]
  ]}
];

const defaultState = {
  activeWeek: 1,
  activeMonth: "",
  shepherding: {},
  weekly: {},
  monthly: {}
};

let state = loadState();
let saveTimer;

function loadState(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if(!raw) return structuredClone(defaultState);
    return {...structuredClone(defaultState), ...JSON.parse(raw)};
  }catch(e){ return structuredClone(defaultState); }
}

function saveState(){
  clearTimeout(saveTimer);
  setSave("Saving…");
  saveTimer=setTimeout(()=>{
    try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); setSave("Saved"); }
    catch(e){ setSave("Storage full"); }
    updateDashboard();
  },120);
}

function setSave(text){
  const el=document.getElementById("saveText"); if(el) el.textContent=text;
}

function toast(msg){
  const el=document.getElementById("toast"); el.textContent=msg; el.classList.add("show");
  setTimeout(()=>el.classList.remove("show"),1800);
}

function weekKey(){ return String(state.activeWeek); }

function ensureShep(){
  const k=weekKey();
  if(!state.shepherding[k]) state.shepherding[k]={month:state.activeMonth||"",week:state.activeWeek,prayer:Array(12).fill(false),prayerNotes:Array(12).fill(""),activities:Array(10).fill(false),comments:Array(10).fill(""),attendance:Array.from({length:4},()=>({name:"",attended:false}))};
  return state.shepherding[k];
}
function ensureWeekly(){
  const k=weekKey();
  if(!state.weekly[k]) state.weekly[k]={month:state.activeMonth||"",week:state.activeWeek,values:{}};
  return state.weekly[k];
}
function ensureMonthly(){
  const k=state.activeMonth||"default";
  if(!state.monthly[k]) state.monthly[k]={month:state.activeMonth||"",values:{}};
  return state.monthly[k];
}

function nav(view){
  document.querySelectorAll(".view").forEach(v=>v.classList.toggle("active",v.id===view));
  document.querySelectorAll("[data-nav]").forEach(b=>b.classList.toggle("active",b.dataset.nav===view));
  window.scrollTo({top:0,behavior:"smooth"});
  if(view==="dashboard") updateDashboard();
}

document.addEventListener("click", e=>{
  const btn=e.target.closest("[data-nav]");
  if(btn){ e.preventDefault(); nav(btn.dataset.nav); }
});

function renderShepherding(){
  const s=ensureShep();
  document.getElementById("shepMonth").value=s.month||"";
  document.getElementById("shepWeek").value=state.activeWeek;
  const prayer=document.getElementById("prayerRows");
  prayer.innerHTML="";
  s.prayer.forEach((done,i)=>{
    const row=document.createElement("div"); row.className="prayer-row";
    row.innerHTML=`<input class="check" type="checkbox" ${done?"checked":""} aria-label="Hour ${String(i+1).padStart(2,"0")}"><label>HOUR NO. ${String(i+1).padStart(2,"0")}</label><input class="comment-input" value="${esc(s.prayerNotes[i])}" placeholder="Comment">`;
    const cb=row.querySelector(".check"), note=row.querySelector(".comment-input");
    cb.addEventListener("change",()=>{s.prayer[i]=cb.checked; saveState(); renderProgressOnly();});
    note.addEventListener("input",()=>{s.prayerNotes[i]=note.value; saveState();});
    prayer.appendChild(row);
  });

  const list=document.getElementById("activityList"); list.innerHTML="";
  activities.forEach((a,i)=>{
    const item=document.createElement("div"); item.className="activity-item"+(s.activities[i]?" done":"");
    item.innerHTML=`<div class="activity-main"><input class="check" type="checkbox" ${s.activities[i]?"checked":""} aria-label="Activity ${i+1}"><span class="activity-num">${String(i+1).padStart(2,"0")}</span><div class="activity-title">${esc(a.title)}${a.note?`<small>${esc(a.note)}</small>`:""}</div></div><div class="activity-comment"><input class="comment-input" value="${esc(s.comments[i])}" placeholder="COMMENTS"></div>`;
    const cb=item.querySelector(".check"), note=item.querySelector(".comment-input");
    cb.addEventListener("change",()=>{s.activities[i]=cb.checked;item.classList.toggle("done",cb.checked);saveState();renderProgressOnly();});
    note.addEventListener("input",()=>{s.comments[i]=note.value;saveState();});
    list.appendChild(item);
  });

  const att=document.getElementById("attendanceList"); att.innerHTML="";
  s.attendance.forEach((a,i)=>{
    const row=document.createElement("div"); row.className="attendance-row";
    row.innerHTML=`<span class="attendance-num">${i+1}</span><input class="comment-input" value="${esc(a.name)}" placeholder="NAME OF SERVICE OR MEETING"><label class="attendance-check"><input class="check" type="checkbox" ${a.attended?"checked":""}> Attended</label>`;
    const name=row.querySelector("input.comment-input"), cb=row.querySelector("input.check");
    name.addEventListener("input",()=>{a.name=name.value;saveState();});
    cb.addEventListener("change",()=>{a.attended=cb.checked;saveState();});
    att.appendChild(row);
  });
  renderProgressOnly();
}

function renderProgressOnly(){
  const s=ensureShep();
  const p=s.prayer.filter(Boolean).length, a=s.activities.filter(Boolean).length;
  document.getElementById("prayerProgress").textContent=`${p} / 12`;
  document.getElementById("activityProgress").textContent=`${a} / 10`;
  document.getElementById("dashPrayer").textContent=`${p} / 12`;
  document.getElementById("dashProgress").textContent=`${a} / 10`;
  document.getElementById("dashWeek").textContent=`Week ${state.activeWeek}`;
}

function renderWeekly(){
  const w=ensureWeekly();
  document.getElementById("weeklyMonth").value=w.month||"";
  document.getElementById("weeklyWeek").value=state.activeWeek;
  const root=document.getElementById("weeklyForm"); root.innerHTML="";
  weeklySections.forEach((sec,si)=>{
    const card=document.createElement("div"); card.className="report-section";
    card.innerHTML=`<div class="report-title">${esc(sec.title)}</div><div class="report-items"></div>`;
    const items=card.querySelector(".report-items");
    sec.items.forEach((it,ii)=>{
      const key=`${si}-${ii}`, val=w.values[key] ?? "";
      const row=document.createElement("div"); row.className="report-row";
      let control="";
      if(it[1]==="check") control=`<div class="report-check-wrap"><label><input class="check" type="checkbox" ${val===true?"checked":""}> Done</label></div>`;
      else control=`<input class="report-input" type="${it[1]==="number"?"number":"text"}" value="${esc(String(val===true?"":val))}" placeholder="${it[2]||""}">`;
      row.innerHTML=`<div class="report-label">${esc(it[0])}${it[2]&&it[1]==="check"?`<small>${esc(it[2])}</small>`:""}</div>${control}`;
      const input=row.querySelector("input");
      input.addEventListener("change",()=>{w.values[key]=it[1]==="check"?input.checked:input.value;saveState();});
      input.addEventListener("input",()=>{if(it[1]!=="check"){w.values[key]=input.value;saveState();}});
      items.appendChild(row);
    });
    root.appendChild(card);
  });
}

function renderMonthly(){
  const m=ensureMonthly();
  document.getElementById("monthlyMonth").value=m.month||"";
  const root=document.getElementById("monthlyForm"); root.innerHTML="";
  monthlySections.forEach((sec,si)=>{
    const card=document.createElement("div"); card.className="report-section";
    card.innerHTML=`<div class="report-title">${esc(sec.title)}</div><div class="report-items"></div>`;
    const items=card.querySelector(".report-items");
    sec.items.forEach((it,ii)=>{
      const key=`${si}-${ii}`, val=m.values[key] ?? "";
      const row=document.createElement("div"); row.className="report-row";
      let control="";
      if(it[1]==="check") control=`<div class="report-check-wrap"><label><input class="check" type="checkbox" ${val===true?"checked":""}> Done</label></div>`;
      else control=`<input class="report-input" type="${it[1]==="number"?"number":"text"}" value="${esc(String(val===true?"":val))}" placeholder="${it[2]||""}">`;
      row.innerHTML=`<div class="report-label">${esc(it[0])}${it[2]&&it[1]==="number"?`<small>${esc(it[2])}</small>`:""}</div>${control}`;
      const input=row.querySelector("input");
      input.addEventListener("change",()=>{m.values[key]=it[1]==="check"?input.checked:input.value;saveState();});
      input.addEventListener("input",()=>{if(it[1]!=="check"){m.values[key]=input.value;saveState();}});
      items.appendChild(row);
    });
    root.appendChild(card);
  });
}

function esc(v){
  return String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
}

function bindSimple(){
  const shepMonth=document.getElementById("shepMonth"), weeklyMonth=document.getElementById("weeklyMonth"), monthlyMonth=document.getElementById("monthlyMonth");
  shepMonth.addEventListener("input",()=>{ensureShep().month=shepMonth.value;state.activeMonth=shepMonth.value;saveState();});
  weeklyMonth.addEventListener("input",()=>{ensureWeekly().month=weeklyMonth.value;state.activeMonth=weeklyMonth.value;saveState();});
  monthlyMonth.addEventListener("input",()=>{const m=ensureMonthly();m.month=monthlyMonth.value;state.activeMonth=monthlyMonth.value;saveState();});
  document.getElementById("shepWeek").addEventListener("change",e=>{state.activeWeek=Number(e.target.value);renderShepherding();renderWeekly();});
  document.getElementById("weeklyWeek").addEventListener("change",e=>{state.activeWeek=Number(e.target.value);renderWeekly();renderShepherding();});
}

document.getElementById("exportBtn").addEventListener("click",()=>{
  const blob=new Blob([JSON.stringify(state,null,2)],{type:"application/json"});
  const url=URL.createObjectURL(blob), a=document.createElement("a");
  a.href=url;a.download=`shepherding-journal-backup-${new Date().toISOString().slice(0,10)}.json`;a.click();URL.revokeObjectURL(url);toast("Backup exported");
});
document.getElementById("importInput").addEventListener("change",e=>{
  const file=e.target.files[0]; if(!file)return;
  const r=new FileReader(); r.onload=()=>{
    try{const imported=JSON.parse(r.result); if(!imported.shepherding||!imported.weekly||!imported.monthly)throw new Error(); state={...structuredClone(defaultState),...imported}; localStorage.setItem(STORAGE_KEY,JSON.stringify(state)); renderAll(); toast("Backup imported");}
    catch(err){toast("That backup could not be imported");}
  }; r.readAsText(file); e.target.value="";
});
document.getElementById("clearBtn").addEventListener("click",()=>{
  if(confirm("Clear all saved Shepherding Journal entries from this device?")){localStorage.removeItem(STORAGE_KEY);state=structuredClone(defaultState);renderAll();toast("All saved entries cleared");}
});

function updateDashboard(){renderProgressOnly();}

function renderAll(){
  ensureShep();ensureWeekly();ensureMonthly();
  renderShepherding();renderWeekly();renderMonthly();renderProgressOnly();
}
bindSimple();
renderAll();

if("serviceWorker" in navigator && location.protocol!=="file:"){
  window.addEventListener("load",()=>navigator.serviceWorker.register("./service-worker.js").catch(()=>{}));
}
