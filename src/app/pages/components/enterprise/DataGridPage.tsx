import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { ComponentPage, Showcase } from '../ComponentPage';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Badge } from '../../../components/ui/badge';
import {
  Search, ArrowUpDown, ArrowUp, ArrowDown, ChevronRight, ChevronLeft,
  Filter, Download, Columns3, EyeOff, Trash2, Copy, Check, X, SlidersHorizontal,
  ChevronsLeft, ChevronsRight, RefreshCcw, Pin, PinOff, Maximize2, Minimize2,
  BarChart3, Users, DollarSign, MapPin, Star, TrendingUp,
  Sigma, ListFilter, MoreVertical, Pencil, ExternalLink, Mail,
  Activity, Percent, Clock, Package, CheckCircle2, ArrowDownUp,
  SquareStack, Maximize, FileSpreadsheet, FileJson, Plus, PanelLeftClose,
  PanelRightClose, ArrowLeftRight, Rows3
} from 'lucide-react';

/* ===== TYPES ===== */
interface Emp {
  id: string; name: string; email: string; dept: string; role: string;
  level: string; salary: number; bonus: number; comp: number;
  status: string; location: string; country: string; startDate: string;
  perf: number; sat: number; projects: number; tickets: number;
  util: number; avatar: string;
}
type CK = keyof Emp;
type SD = 'asc' | 'desc' | null;
type FO = 'contains'|'equals'|'notEquals'|'startsWith'|'endsWith'|'gt'|'lt'|'gte'|'lte'|'empty'|'notEmpty';
type PD = 'left' | 'right' | null;
interface Col { key: CK; label: string; w: number; mw: number; type: string; edit?: boolean; pin?: boolean; grp?: boolean; agg?: string; }
interface CF { col: CK; op: FO; val: string; }
interface SI { col: CK; dir: SD; }

/* ===== DATA ===== */
const fn = ['Emma','Liam','Olivia','Noah','Ava','Ethan','Sophia','Mason','Isabella','William','Mia','James','Charlotte','Benjamin','Amelia','Lucas','Harper','Henry','Evelyn','Alexander','Luna','Daniel','Camila','Matthew','Gianna','Sebastian','Aria','Jack','Ella','Owen','Scarlett','Michael','Sofia','Aiden','Layla','Samuel','Chloe','Ryan','Penelope','David'];
const ln = ['Chen','Williams','Garcia','Martinez','Robinson','Clark','Rodriguez','Lewis','Lee','Walker','Hall','Allen','Young','King','Wright','Scott','Torres','Nguyen','Hill','Flores','Green','Adams','Nelson','Baker','Rivera','Campbell','Mitchell','Carter','Roberts','Gomez','Phillips','Evans','Turner','Diaz','Parker','Cruz','Edwards','Collins','Reyes','Stewart'];
const dp = ['Engineering','Design','Product','Marketing','Sales','Operations','Finance','HR','Legal','Data Science'];
const rl = ['Software Engineer','Product Designer','Product Manager','Marketing Lead','Sales Rep','Ops Manager','Financial Analyst','HR Specialist','Legal Counsel','Data Scientist','DevOps Engineer','QA Engineer','Frontend Dev','Backend Dev','UX Researcher'];
const lv = ['Junior','Mid','Senior','Lead','Principal','Director'];
const st = ['Active','On Leave','Remote','Contract','Terminated'];
const lo = ['San Francisco','New York','London','Berlin','Tokyo','Singapore','Sydney','Toronto','Paris','Amsterdam','Austin','Seattle','Chicago','Mumbai','Sao Paulo'];
const co = ['US','US','UK','DE','JP','SG','AU','CA','FR','NL','US','US','US','IN','BR'];
const sr = (s: number) => { const x = Math.sin(s)*10000; return x - Math.floor(x); };

const allData: Emp[] = Array.from({ length: 200 }, (_, i) => {
  const f = fn[i%fn.length], l = ln[(i*7+3)%ln.length], li = i%lo.length;
  const sal = Math.floor(sr(i*13+7)*120000)+60000, bon = Math.floor(sal*sr(i*17+11)*0.25);
  return { id:`EMP-${String(i+1).padStart(4,'0')}`, name:`${f} ${l}`,
    email:`${f.toLowerCase()}.${l.toLowerCase()}@cosmos.dev`, dept:dp[i%dp.length], role:rl[i%rl.length],
    level:lv[Math.floor(sr(i*19+3)*lv.length)], salary:sal, bonus:bon, comp:sal+bon,
    status:st[Math.floor(sr(i*29+1)*5)<3?0:Math.floor(sr(i*29+1)*5)],
    location:lo[li], country:co[li],
    startDate:new Date(2019+Math.floor(sr(i*31)*6),Math.floor(sr(i*37)*12),Math.floor(sr(i*41)*28)+1).toISOString().split('T')[0],
    perf:+(sr(i*23+5)*40+60).toFixed(0), sat:+(sr(i*53+7)*30+70).toFixed(0),
    projects:Math.floor(sr(i*59+2)*12)+1, tickets:Math.floor(sr(i*61+9)*150)+10,
    util:+(sr(i*67+4)*40+55).toFixed(0), avatar:`${f[0]}${l[0]}`,
  };
});

/* ===== COLUMNS ===== */
const cols: Col[] = [
  { key:'id', label:'ID', w:110, mw:80, type:'text', pin:true },
  { key:'name', label:'Name', w:180, mw:130, type:'avatar', edit:true, pin:true, grp:true },
  { key:'email', label:'Email', w:210, mw:140, type:'text', edit:true },
  { key:'dept', label:'Department', w:130, mw:100, type:'badge', grp:true },
  { key:'role', label:'Role', w:155, mw:110, type:'text', grp:true },
  { key:'level', label:'Level', w:95, mw:75, type:'badge', grp:true },
  { key:'salary', label:'Salary', w:110, mw:85, type:'currency', edit:true, agg:'avg' },
  { key:'bonus', label:'Bonus', w:95, mw:75, type:'currency', agg:'sum' },
  { key:'comp', label:'Total Comp', w:115, mw:85, type:'currency', agg:'sum' },
  { key:'status', label:'Status', w:110, mw:90, type:'badge', grp:true },
  { key:'location', label:'Office', w:130, mw:95, type:'text', grp:true },
  { key:'country', label:'Country', w:75, mw:55, type:'text' },
  { key:'startDate', label:'Start Date', w:105, mw:85, type:'date' },
  { key:'perf', label:'Performance', w:115, mw:95, type:'bar', agg:'avg' },
  { key:'sat', label:'Satisfaction', w:110, mw:85, type:'bar', agg:'avg' },
  { key:'projects', label:'Projects', w:85, mw:65, type:'number', agg:'sum' },
  { key:'tickets', label:'Tickets', w:85, mw:65, type:'number', agg:'sum' },
  { key:'util', label:'Util %', w:105, mw:85, type:'bar', agg:'avg' },
];

/* ===== STYLES ===== */
const stC: Record<string,{bg:string;tx:string;dt:string}> = {
  Active:{bg:'bg-emerald-500/10',tx:'text-emerald-600 dark:text-emerald-400',dt:'bg-emerald-500'},
  'On Leave':{bg:'bg-amber-500/10',tx:'text-amber-600 dark:text-amber-400',dt:'bg-amber-500'},
  Remote:{bg:'bg-blue-500/10',tx:'text-blue-600 dark:text-blue-400',dt:'bg-blue-500'},
  Contract:{bg:'bg-purple-500/10',tx:'text-purple-600 dark:text-purple-400',dt:'bg-purple-500'},
  Terminated:{bg:'bg-red-500/10',tx:'text-red-600 dark:text-red-400',dt:'bg-red-500'},
};
const lvC: Record<string,string> = {
  Junior:'bg-slate-500/10 text-slate-600 dark:text-slate-400',Mid:'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  Senior:'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',Lead:'bg-violet-500/10 text-violet-600 dark:text-violet-400',
  Principal:'bg-amber-500/10 text-amber-600 dark:text-amber-400',Director:'bg-rose-500/10 text-rose-600 dark:text-rose-400',
};
const dG: Record<string,string> = {
  Engineering:'from-blue-500 to-cyan-500',Design:'from-purple-500 to-pink-500',Product:'from-indigo-500 to-blue-500',
  Marketing:'from-amber-500 to-orange-500',Sales:'from-emerald-500 to-teal-500',Operations:'from-slate-500 to-gray-500',
  Finance:'from-green-500 to-emerald-500',HR:'from-rose-500 to-pink-500',Legal:'from-gray-500 to-slate-500','Data Science':'from-violet-500 to-indigo-500',
};
const $f = (n: number) => '$'+n.toLocaleString();
const $d = (d: string) => new Date(d).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'2-digit'});
const $k = (n: number) => n>=1000?`${(n/1000).toFixed(1)}K`:String(n);

/* ===== FILTER ===== */
const fOps: {v:FO;l:string}[] = [{v:'contains',l:'Contains'},{v:'equals',l:'Equals'},{v:'notEquals',l:'Not Equals'},{v:'startsWith',l:'Starts With'},{v:'endsWith',l:'Ends With'},{v:'gt',l:'>'},{v:'lt',l:'<'},{v:'gte',l:'>='},{v:'lte',l:'<='},{v:'empty',l:'Empty'},{v:'notEmpty',l:'Not Empty'}];
function filt(val:any,f:CF):boolean{const v=String(val).toLowerCase(),fv=f.val.toLowerCase(),nv=Number(val),nfv=Number(f.val);switch(f.op){case'contains':return v.includes(fv);case'equals':return v===fv;case'notEquals':return v!==fv;case'startsWith':return v.startsWith(fv);case'endsWith':return v.endsWith(fv);case'gt':return nv>nfv;case'lt':return nv<nfv;case'gte':return nv>=nfv;case'lte':return nv<=nfv;case'empty':return v==='';case'notEmpty':return v!=='';default:return true;}}

/* ===== MINI BAR ===== */
function Bar({value,color}:{value:number;color:string}){return(<div className="flex items-center gap-2 w-full"><div className="flex-1 h-2 bg-muted/50 rounded-full overflow-hidden"><motion.div initial={{width:0}} animate={{width:`${Math.min(value,100)}%`}} transition={{duration:0.5,ease:[0.22,1,0.36,1]}} className={`h-full rounded-full ${color}`}/></div><span className="text-[10px] tabular-nums text-muted-foreground w-8 text-right" style={{fontWeight:600}}>{value}%</span></div>);}

/* ===== HEATMAP ===== */
function hC(v:number,lo:number,hi:number):string{const p=(v-lo)/(hi-lo||1);if(p>=.8)return'bg-emerald-500/10';if(p>=.6)return'bg-green-500/8';if(p>=.4)return'bg-yellow-500/8';if(p>=.2)return'bg-orange-500/8';return'bg-red-500/10';}

/* ===== HEADER MENU ===== */
function HMenu({col,onClose,onSort,onPin,onHide,onGrp,pD,sD}:{col:Col;onClose:()=>void;onSort:(d:SD)=>void;onPin:(d:PD)=>void;onHide:()=>void;onGrp:()=>void;pD:PD;sD:SD;}){
  return(<motion.div initial={{opacity:0,y:-4,scale:.95}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:-4,scale:.95}} transition={{duration:.12}} className="absolute right-0 top-full mt-1 w-48 bg-card border border-border rounded-xl shadow-2xl py-1 z-30" onClick={e=>e.stopPropagation()}>
    <button onClick={()=>{onSort('asc');onClose();}} className={`flex items-center gap-2 w-full px-3 py-1.5 text-[11px] hover:bg-accent/50 cursor-pointer ${sD==='asc'?'text-primary':''}`}><ArrowUp className="w-3 h-3"/>Sort Asc{sD==='asc'&&<Check className="w-3 h-3 ml-auto"/>}</button>
    <button onClick={()=>{onSort('desc');onClose();}} className={`flex items-center gap-2 w-full px-3 py-1.5 text-[11px] hover:bg-accent/50 cursor-pointer ${sD==='desc'?'text-primary':''}`}><ArrowDown className="w-3 h-3"/>Sort Desc{sD==='desc'&&<Check className="w-3 h-3 ml-auto"/>}</button>
    {sD&&<button onClick={()=>{onSort(null);onClose();}} className="flex items-center gap-2 w-full px-3 py-1.5 text-[11px] hover:bg-accent/50 text-muted-foreground cursor-pointer"><X className="w-3 h-3"/>Clear Sort</button>}
    <div className="h-px bg-border mx-2 my-0.5"/>
    {col.pin&&<div className="contents"><button onClick={()=>{onPin(pD==='left'?null:'left');onClose();}} className={`flex items-center gap-2 w-full px-3 py-1.5 text-[11px] hover:bg-accent/50 cursor-pointer ${pD==='left'?'text-primary':''}`}><PanelLeftClose className="w-3 h-3"/>Pin Left</button>
    <button onClick={()=>{onPin(pD==='right'?null:'right');onClose();}} className={`flex items-center gap-2 w-full px-3 py-1.5 text-[11px] hover:bg-accent/50 cursor-pointer ${pD==='right'?'text-primary':''}`}><PanelRightClose className="w-3 h-3"/>Pin Right</button>
    {pD&&<button onClick={()=>{onPin(null);onClose();}} className="flex items-center gap-2 w-full px-3 py-1.5 text-[11px] hover:bg-accent/50 text-muted-foreground cursor-pointer"><PinOff className="w-3 h-3"/>Unpin</button>}
    <div className="h-px bg-border mx-2 my-0.5"/></div>}
    {col.grp&&<div className="contents"><button onClick={()=>{onGrp();onClose();}} className="flex items-center gap-2 w-full px-3 py-1.5 text-[11px] hover:bg-accent/50 cursor-pointer"><SquareStack className="w-3 h-3"/>Group by {col.label}</button><div className="h-px bg-border mx-2 my-0.5"/></div>}
    <button onClick={()=>{onHide();onClose();}} className="flex items-center gap-2 w-full px-3 py-1.5 text-[11px] hover:bg-accent/50 text-muted-foreground cursor-pointer"><EyeOff className="w-3 h-3"/>Hide</button>
  </motion.div>);
}

/* ===== CONTEXT MENU ===== */
function CMenu({x,y,row,onClose,onEdit,onCopy,onDel,onExp}:{x:number;y:number;row:Emp;onClose:()=>void;onEdit:()=>void;onCopy:()=>void;onDel:()=>void;onExp:()=>void;}){
  const ref=useRef<HTMLDivElement>(null);
  useEffect(()=>{const h=(e:MouseEvent)=>{if(ref.current&&!ref.current.contains(e.target as Node))onClose();};document.addEventListener('mousedown',h);return()=>document.removeEventListener('mousedown',h);},[onClose]);
  return(<motion.div ref={ref} initial={{opacity:0,scale:.92}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:.92}} className="fixed z-50 w-48 bg-card border border-border rounded-xl shadow-2xl py-1" style={{left:Math.min(x,window.innerWidth-200),top:Math.min(y,window.innerHeight-280)}}>
    <div className="px-3 py-1.5 border-b border-border mb-1"><p className="text-[11px]" style={{fontWeight:600}}>{row.name}</p><p className="text-[10px] text-muted-foreground">{row.id}</p></div>
    <button onClick={()=>{onExp();onClose();}} className="flex items-center gap-2 w-full px-3 py-1.5 text-[11px] hover:bg-accent/50 cursor-pointer"><Maximize className="w-3 h-3"/>View Details</button>
    <button onClick={()=>{onEdit();onClose();}} className="flex items-center gap-2 w-full px-3 py-1.5 text-[11px] hover:bg-accent/50 cursor-pointer"><Pencil className="w-3 h-3"/>Edit</button>
    <button onClick={()=>{onCopy();onClose();}} className="flex items-center gap-2 w-full px-3 py-1.5 text-[11px] hover:bg-accent/50 cursor-pointer"><Copy className="w-3 h-3"/>Copy Data</button>
    <div className="h-px bg-border mx-2 my-0.5"/>
    <button onClick={()=>{onClose();}} className="flex items-center gap-2 w-full px-3 py-1.5 text-[11px] hover:bg-accent/50 cursor-pointer"><Mail className="w-3 h-3"/>Email</button>
    <button onClick={()=>{onClose();}} className="flex items-center gap-2 w-full px-3 py-1.5 text-[11px] hover:bg-accent/50 cursor-pointer"><ExternalLink className="w-3 h-3"/>Profile</button>
    <div className="h-px bg-border mx-2 my-0.5"/>
    <button onClick={()=>{onDel();onClose();}} className="flex items-center gap-2 w-full px-3 py-1.5 text-[11px] hover:bg-accent/50 text-red-500 cursor-pointer"><Trash2 className="w-3 h-3"/>Delete</button>
  </motion.div>);
}

/* ===== DETAIL PANEL ===== */
function Detail({row,onClose}:{row:Emp;onClose:()=>void}){
  const m=[{l:'Performance',v:`${row.perf}%`,i:Activity,c:row.perf>=80?'text-emerald-500':'text-amber-500'},{l:'Satisfaction',v:`${row.sat}%`,i:Star,c:'text-amber-500'},{l:'Projects',v:row.projects,i:Package,c:'text-blue-500'},{l:'Tickets',v:row.tickets,i:CheckCircle2,c:'text-emerald-500'},{l:'Utilization',v:`${row.util}%`,i:Percent,c:'text-purple-500'},{l:'Tenure',v:`${Math.floor((Date.now()-new Date(row.startDate).getTime())/(365.25*86400000))}y`,i:Clock,c:'text-indigo-500'}];
  return(<motion.tr initial={{opacity:0,height:0}} animate={{opacity:1,height:'auto'}} exit={{opacity:0,height:0}} transition={{duration:.2}}>
    <td colSpan={100} className="p-0 border-b border-primary/20">
      <div className="bg-gradient-to-r from-primary/[0.03] via-card to-primary/[0.03] p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${dG[row.dept]||'from-gray-500 to-slate-500'} flex items-center justify-center text-white text-[13px] shadow-lg`} style={{fontWeight:700}}>{row.avatar}</div>
            <div><h4 className="text-[14px]" style={{fontWeight:700}}>{row.name}</h4><p className="text-[11px] text-muted-foreground">{row.role} &middot; {row.level} &middot; {row.dept}</p><p className="text-[10px] text-muted-foreground mt-0.5">{row.email} &middot; {row.location}, {row.country}</p></div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-accent/50 cursor-pointer"><X className="w-4 h-4 text-muted-foreground"/></button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {m.map(x=>(<div key={x.l} className="px-3 py-2.5 rounded-xl border border-border/60 bg-card/80"><div className="flex items-center gap-1.5 mb-1"><x.i className={`w-3 h-3 ${x.c}`}/><span className="text-[9px] text-muted-foreground uppercase tracking-wider" style={{fontWeight:600}}>{x.l}</span></div><p className="text-[15px]" style={{fontWeight:700}}>{x.v}</p></div>))}
        </div>
        <div className="grid sm:grid-cols-2 gap-3 mt-3">
          <div className="px-4 py-3 rounded-xl border border-border/60 bg-card/80">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider" style={{fontWeight:600}}>Compensation</span>
            <div className="flex gap-2 mt-2">
              <div className="flex-1"><div className="flex justify-between text-[10px] mb-1"><span className="text-muted-foreground">Base</span><span style={{fontWeight:600}}>{$f(row.salary)}</span></div><div className="h-2 bg-muted/50 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full" style={{width:`${(row.salary/row.comp)*100}%`}}/></div></div>
              <div className="flex-1"><div className="flex justify-between text-[10px] mb-1"><span className="text-muted-foreground">Bonus</span><span style={{fontWeight:600}}>{$f(row.bonus)}</span></div><div className="h-2 bg-muted/50 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" style={{width:`${(row.bonus/row.comp)*100}%`}}/></div></div>
            </div>
            <div className="flex justify-between mt-2 pt-2 border-t border-border/50 text-[11px]"><span className="text-muted-foreground">Total</span><span className="text-primary" style={{fontWeight:700}}>{$f(row.comp)}</span></div>
          </div>
          <div className="px-4 py-3 rounded-xl border border-border/60 bg-card/80">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider" style={{fontWeight:600}}>Performance (6mo)</span>
            <div className="flex items-end gap-1 mt-3 h-12">{Array.from({length:6},(_,i)=>{const v=Math.max(40,row.perf+Math.floor(sr(row.tickets+i*7)*20-10));const barColor=v>=75?'rgba(16,185,129,0.4)':v>=50?'rgba(245,158,11,0.4)':'rgba(239,68,68,0.4)';return<motion.div key={i} initial={{height:0}} animate={{height:`${v}%`}} transition={{delay:i*.05,duration:.4}} className="flex-1 rounded-sm" style={{backgroundColor:barColor}}/>;})}</div>
            <div className="flex justify-between text-[9px] text-muted-foreground mt-1"><span>Oct</span><span>Nov</span><span>Dec</span><span>Jan</span><span>Feb</span><span>Mar</span></div>
          </div>
        </div>
      </div>
    </td>
  </motion.tr>);
}

/* ===== INLINE EDITOR ===== */
function CEdit({value,onSave,onCancel,type}:{value:string;onSave:(v:string)=>void;onCancel:()=>void;type:string}){
  const[v,setV]=useState(value);const ref=useRef<HTMLInputElement>(null);
  useEffect(()=>{ref.current?.focus();ref.current?.select();},[]);
  return<input ref={ref} value={v} onChange={e=>setV(e.target.value)} onKeyDown={e=>{if(e.key==='Enter')onSave(v);if(e.key==='Escape')onCancel();}} onBlur={()=>onSave(v)} className="w-full bg-primary/5 border border-primary/30 rounded px-1.5 py-0.5 text-[12px] outline-none focus:border-primary focus:ring-1 focus:ring-primary/20" type={type==='currency'||type==='number'?'number':'text'}/>;
}

/* ===== MAIN ===== */
export function DataGridPage() {
  const [data,setData]=useState<Emp[]>(allData);
  const [search,setSearch]=useState('');
  const [pg,setPg]=useState(0);
  const [pgSz,setPgSz]=useState(15);
  const [sel,setSel]=useState<Set<string>>(new Set());
  const [compact,setCompact]=useState(false);
  const [sm,setSm]=useState<SI[]>([{col:'id',dir:'asc'}]);
  const [vc,setVc]=useState<Set<CK>>(new Set(cols.map(c=>c.key)));
  const [cw,setCw]=useState<Record<string,number>>(Object.fromEntries(cols.map(c=>[c.key,c.w])));
  const [pins,setPins]=useState<Record<string,PD>>({id:'left',name:'left'});
  const [cf,setCf]=useState<CF[]>([]);
  const [ff,setFf]=useState<Record<string,string>>({});
  const [sF,setSF]=useState(true);
  const [sAF,setSAF]=useState(false);
  const [grp,setGrp]=useState<CK|null>(null);
  const [eG,setEG]=useState<Set<string>>(new Set());
  const [sCP,setSCP]=useState(false);
  const [hm,setHm]=useState<CK|null>(null);
  const [ctx,setCtx]=useState<{x:number;y:number;row:Emp}|null>(null);
  const [eR,setER]=useState<Set<string>>(new Set());
  const [ed,setEd]=useState<{r:string;c:CK}|null>(null);
  const [heat,setHeat]=useState(false);
  const [flash,setFlash]=useState<Set<string>>(new Set());
  const [cpd,setCpd]=useState(false);
  const [sAg,setSAg]=useState(true);
  const rsX=useRef(0),rsW=useRef(0);

  const oc=useMemo(()=>{const v=cols.filter(c=>vc.has(c.key));return{l:v.filter(c=>pins[c.key]==='left'),c:v.filter(c=>!pins[c.key]),r:v.filter(c=>pins[c.key]==='right'),a:v};},[vc,pins]);
  const po=useMemo(()=>{const o:Record<string,number>={};let cum=52;oc.l.forEach(c=>{o[c.key]=cum;cum+=cw[c.key];});return o;},[oc.l,cw]);

  const filtered=useMemo(()=>{let r=data;if(search){const q=search.toLowerCase();r=r.filter(x=>Object.values(x).some(v=>String(v).toLowerCase().includes(q)));}cf.forEach(f=>{if(f.val||f.op==='empty'||f.op==='notEmpty')r=r.filter(x=>filt(x[f.col],f));});Object.entries(ff).forEach(([c,v])=>{if(v)r=r.filter(x=>String(x[c as CK]).toLowerCase().includes(v.toLowerCase()));});return r;},[data,search,cf,ff]);
  const sorted=useMemo(()=>{const r=[...filtered];r.sort((a,b)=>{for(const s of sm){if(!s.dir)continue;const av=a[s.col],bv=b[s.col];let c=typeof av==='number'&&typeof bv==='number'?av-bv:String(av).localeCompare(String(bv));if(c!==0)return s.dir==='asc'?c:-c;}return 0;});return r;},[filtered,sm]);
  const tP=Math.ceil(sorted.length/pgSz);
  const paged=sorted.slice(pg*pgSz,(pg+1)*pgSz);
  const grouped=useMemo(()=>{if(!grp)return null;const m:Record<string,Emp[]>={};paged.forEach(r=>{const k=String(r[grp]);(m[k]??=[]).push(r);});return m;},[paged,grp]);
  const aggs=useMemo(()=>{const a:Record<string,string>={};cols.forEach(c=>{if(!c.agg)return;const vs=filtered.map(r=>Number(r[c.key])).filter(v=>!isNaN(v));if(!vs.length)return;switch(c.agg){case'sum':a[c.key]=c.type==='currency'?$f(vs.reduce((a,b)=>a+b,0)):String(vs.reduce((a,b)=>a+b,0));break;case'avg':a[c.key]=c.type==='currency'?$f(Math.round(vs.reduce((a,b)=>a+b,0)/vs.length)):(vs.reduce((a,b)=>a+b,0)/vs.length).toFixed(1);break;}});return a;},[filtered]);

  const tComp=useMemo(()=>filtered.reduce((s,o)=>s+o.comp,0),[filtered]);
  const avgSal=useMemo(()=>filtered.length?Math.round(filtered.reduce((s,o)=>s+o.salary,0)/filtered.length):0,[filtered]);
  const avgPerf=useMemo(()=>filtered.length?Math.round(filtered.reduce((s,o)=>s+o.perf,0)/filtered.length):0,[filtered]);

  const tgSort=useCallback((c:CK)=>setSm(p=>{const e=p.find(s=>s.col===c);if(!e)return[{col:c,dir:'asc' as SD}];if(e.dir==='asc')return p.map(s=>s.col===c?{...s,dir:'desc' as SD}:s);return p.filter(s=>s.col!==c);}),[]);
  const hSort=useCallback((c:CK,d:SD)=>setSm(p=>{if(d===null)return p.filter(s=>s.col!==c);const e=p.find(s=>s.col===c);if(e)return p.map(s=>s.col===c?{...s,dir:d}:s);return[...p,{col:c,dir:d}];}),[]);
  const tgSel=useCallback((id:string)=>setSel(p=>{const n=new Set(p);n.has(id)?n.delete(id):n.add(id);return n;}),[]);
  const tgAll=useCallback(()=>setSel(p=>p.size===paged.length&&paged.every(r=>p.has(r.id))?new Set():new Set(paged.map(o=>o.id))),[paged]);
  const tgGrp=useCallback((g:string)=>setEG(p=>{const n=new Set(p);n.has(g)?n.delete(g):n.add(g);return n;}),[]);
  const tgExp=useCallback((id:string)=>setER(p=>{const n=new Set(p);n.has(id)?n.delete(id):n.add(id);return n;}),[]);
  const doEdit=useCallback((r:string,c:CK,v:string)=>{setData(p=>p.map(x=>{if(x.id!==r)return x;const u={...x,[c]:c==='salary'||c==='bonus'?Number(v):v};if(c==='salary'||c==='bonus')u.comp=u.salary+u.bonus;return u;}));setEd(null);const k=`${r}-${c}`;setFlash(p=>new Set(p).add(k));setTimeout(()=>setFlash(p=>{const n=new Set(p);n.delete(k);return n;}),1200);},[]);
  const cpRow=useCallback((row:Emp)=>{navigator.clipboard.writeText(Object.entries(row).map(([k,v])=>`${k}: ${v}`).join('\n'));setCpd(true);setTimeout(()=>setCpd(false),2000);},[]);
  const exCSV=useCallback(()=>{const h=oc.a.map(c=>c.label);const rs=sorted.map(r=>oc.a.map(c=>String(r[c.key])));const csv=[h,...rs].map(r=>r.join(',')).join('\n');const b=new Blob([csv],{type:'text/csv'});const u=URL.createObjectURL(b);const a=document.createElement('a');a.href=u;a.download='cosmos-grid.csv';a.click();URL.revokeObjectURL(u);},[sorted,oc]);
  const exJSON=useCallback(()=>{const b=new Blob([JSON.stringify(sorted,null,2)],{type:'application/json'});const u=URL.createObjectURL(b);const a=document.createElement('a');a.href=u;a.download='cosmos-grid.json';a.click();URL.revokeObjectURL(u);},[sorted]);
  const doResize=useCallback((e:React.MouseEvent,col:CK)=>{e.preventDefault();e.stopPropagation();rsX.current=e.clientX;rsW.current=cw[col];const mv=(ev:MouseEvent)=>{const d=cols.find(c=>c.key===col);setCw(p=>({...p,[col]:Math.max(d?.mw||60,rsW.current+ev.clientX-rsX.current)}));};const up=()=>{document.removeEventListener('mousemove',mv);document.removeEventListener('mouseup',up);};document.addEventListener('mousemove',mv);document.addEventListener('mouseup',up);},[cw]);

  const aF=cf.filter(f=>f.val||f.op==='empty'||f.op==='notEmpty').length+Object.values(ff).filter(Boolean).length;
  const py=compact?'py-1':'py-2.5';
  const ts=compact?'text-[10px]':'text-[11px]';

  const rCell=(row:Emp,col:Col)=>{
    const isEd=ed?.r===row.id&&ed?.c===col.key;const fl=flash.has(`${row.id}-${col.key}`);
    if(isEd&&col.edit)return<CEdit value={String(row[col.key])} type={col.type} onSave={v=>doEdit(row.id,col.key,v)} onCancel={()=>setEd(null)}/>;
    const w=(ch:React.ReactNode)=><div className={`transition-all duration-300 ${fl?'bg-primary/20 rounded px-1 -mx-1':''} ${col.edit?'cursor-text':''}`} onDoubleClick={col.edit?()=>setEd({r:row.id,c:col.key}):undefined}>{ch}</div>;
    switch(col.key){
      case'id':return w(<span className={`font-mono ${ts} text-muted-foreground`}>{row.id}</span>);
      case'name':return w(<div className="flex items-center gap-2.5"><div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${dG[row.dept]||'from-gray-500 to-slate-500'} flex items-center justify-center text-white text-[9px] flex-shrink-0 shadow-sm`} style={{fontWeight:700}}>{row.avatar}</div><div className="min-w-0"><span className={`${ts} truncate block`} style={{fontWeight:600}}>{row.name}</span><span className="text-[9px] text-muted-foreground truncate block">{row.role}</span></div></div>);
      case'email':return w(<span className={`${ts} text-muted-foreground truncate block`}>{row.email}</span>);
      case'dept':return w(<span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] border border-border/50" style={{fontWeight:600}}><span className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${dG[row.dept]||'from-gray-500 to-slate-500'}`}/>{row.dept}</span>);
      case'role':return w(<span className={ts}>{row.role}</span>);
      case'level':return w(<span className={`inline-flex px-2 py-0.5 rounded-md text-[10px] ${lvC[row.level]||''}`} style={{fontWeight:600}}>{row.level}</span>);
      case'salary':case'bonus':case'comp':{const v=Number(row[col.key]);const hcl=heat&&(col.key==='salary'||col.key==='comp')?hC(v,col.key==='salary'?60000:70000,col.key==='salary'?180000:220000):'';return w(<span className={`${ts} tabular-nums ${hcl} ${hcl?'px-1.5 py-0.5 rounded':''}`} style={{fontWeight:col.key==='comp'?700:500}}>{$f(v)}</span>);}
      case'status':{const s=stC[row.status]||stC.Active;return w(<span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] ${s.bg} ${s.tx}`} style={{fontWeight:500}}><span className={`w-1.5 h-1.5 rounded-full ${s.dt} ${row.status==='Active'?'animate-pulse':''}`}/>{row.status}</span>);}
      case'location':return w(<span className={`${ts} flex items-center gap-1.5`}><MapPin className="w-3 h-3 text-muted-foreground/50 flex-shrink-0"/>{row.location}</span>);
      case'country':return w(<span className={`${ts} font-mono`}>{row.country}</span>);
      case'startDate':return w(<span className={`${ts} text-muted-foreground tabular-nums`}>{$d(row.startDate)}</span>);
      case'perf':return w(<Bar value={row.perf} color={row.perf>=80?'bg-emerald-500':row.perf>=60?'bg-amber-500':'bg-red-500'}/>);
      case'sat':return w(<Bar value={row.sat} color="bg-blue-500"/>);
      case'util':return w(<Bar value={row.util} color={row.util>=85?'bg-red-500':row.util>=70?'bg-amber-500':'bg-emerald-500'}/>);
      case'projects':case'tickets':return w(<span className={`${ts} tabular-nums text-center block`}>{String(row[col.key])}</span>);
      default:return w(<span className={ts}>{String(row[col.key])}</span>);
    }
  };

  const rHead=(col:Col,sty?:{left?:number})=>{
    const si=sm.find(s=>s.col===col.key);const sx=sm.filter(s=>s.dir).findIndex(s=>s.col===col.key);
    const sc=sty?`sticky z-[3] ${sty.left!==undefined?'border-r border-border/30':'border-l border-border/30'}`:'';
    const ss=sty?.left!==undefined?{left:sty.left}:sty?{right:0}:{};
    return(<th key={col.key} className={`px-3 ${py} bg-muted/40 select-none relative ${sc}`} style={{width:cw[col.key],minWidth:cw[col.key],...ss}}>
      <div className="flex items-center gap-1 group/h">
        <button onClick={()=>tgSort(col.key)} className="flex items-center gap-1 cursor-pointer hover:text-foreground transition-colors text-[10px] uppercase tracking-wider text-muted-foreground flex-1" style={{fontWeight:600}}>
          {pins[col.key]&&<Pin className="w-2.5 h-2.5 text-primary/50"/>}{col.label}
          {si?.dir==='asc'&&<ArrowUp className="w-3 h-3 text-primary"/>}{si?.dir==='desc'&&<ArrowDown className="w-3 h-3 text-primary"/>}
          {!si?.dir&&<ArrowUpDown className="w-3 h-3 opacity-0 group-hover/h:opacity-40 transition-opacity"/>}
          {sx>=0&&sm.filter(s=>s.dir).length>1&&<span className="w-3.5 h-3.5 rounded-full bg-primary/20 text-primary text-[8px] flex items-center justify-center" style={{fontWeight:700}}>{sx+1}</span>}
        </button>
        <button onClick={e=>{e.stopPropagation();setHm(hm===col.key?null:col.key);}} className="p-0.5 rounded opacity-0 group-hover/h:opacity-100 hover:bg-accent/50 transition-all cursor-pointer"><MoreVertical className="w-3 h-3 text-muted-foreground"/></button>
        <div className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-primary/40 transition-colors" onMouseDown={e=>doResize(e,col.key)}/>
        <AnimatePresence>{hm===col.key&&<HMenu col={col} onClose={()=>setHm(null)} onSort={d=>hSort(col.key,d)} onPin={d=>setPins(p=>({...p,[col.key]:d}))} onHide={()=>setVc(p=>{const n=new Set(p);n.delete(col.key);return n;})} onGrp={()=>{setGrp(col.key);setEG(new Set());}} pD={pins[col.key]||null} sD={si?.dir||null}/>}</AnimatePresence>
      </div>
    </th>);
  };

  const rRow=(row:Emp,i:number)=>{
    const iS=sel.has(row.id),iE=eR.has(row.id);
    return[<motion.tr key={row.id} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:i*.008,duration:.15}} className={`border-b border-border/40 transition-colors group/r ${iS?'bg-primary/[0.06]':'hover:bg-muted/30'}`} onContextMenu={e=>{e.preventDefault();setCtx({x:e.clientX,y:e.clientY,row});}}>
        <td className={`px-1.5 ${py} sticky left-0 z-[1] bg-card group-hover/r:bg-muted/30 ${iS?'!bg-primary/[0.06]':''} transition-colors`}><div className="flex items-center gap-0.5"><input type="checkbox" checked={iS} onChange={()=>tgSel(row.id)} className="rounded accent-primary cursor-pointer w-3.5 h-3.5"/><button onClick={()=>tgExp(row.id)} className="p-0.5 rounded hover:bg-accent/50 cursor-pointer"><motion.div animate={{rotate:iE?90:0}} transition={{duration:.15}}><ChevronRight className="w-3 h-3 text-muted-foreground/50"/></motion.div></button></div></td>
        {oc.l.map(c=><td key={c.key} className={`px-3 ${py} sticky z-[1] bg-card group-hover/r:bg-muted/30 ${iS?'!bg-primary/[0.06]':''} transition-colors border-r border-border/30`} style={{width:cw[c.key],minWidth:cw[c.key],left:po[c.key]??52}}>{rCell(row,c)}</td>)}
        {oc.c.map(c=><td key={c.key} className={`px-3 ${py}`} style={{width:cw[c.key],minWidth:cw[c.key]}}>{rCell(row,c)}</td>)}
        {oc.r.map(c=><td key={c.key} className={`px-3 ${py} sticky right-0 z-[1] bg-card group-hover/r:bg-muted/30 ${iS?'!bg-primary/[0.06]':''} transition-colors border-l border-border/30`} style={{width:cw[c.key],minWidth:cw[c.key]}}>{rCell(row,c)}</td>)}
        <td className={`px-2 ${py}`}><button onClick={e=>{e.preventDefault();setCtx({x:e.clientX,y:e.clientY,row});}} className="p-1 rounded hover:bg-accent/50 cursor-pointer opacity-0 group-hover/r:opacity-100"><MoreVertical className="w-3.5 h-3.5 text-muted-foreground"/></button></td>
      </motion.tr>,
      <AnimatePresence key={`${row.id}-det`}>{iE&&<Detail row={row} onClose={()=>tgExp(row.id)}/>}</AnimatePresence>
    ];
  };

  return(
    <ComponentPage title="Data Grid" description="Enterprise-grade data grid with AG-Grid-level functionality: multi-column sorting, column resizing & pinning, row grouping with aggregation, inline editing, master/detail expansion, floating filters, advanced filter builder, heatmap mode, context menus, CSV/JSON export, and 200-row dataset.">
      <Showcase title="Enterprise Data Grid" delay={0.03} code={`import {
  useDataTableSort,
  useDataTableFilter,
  useDataTablePagination,
  useDataTableSelection,
  useDataTableColumns,
  DataTableHeaderMenu,
  DataTableInlineEditor,
  DataTableMiniBar,
  DataTableFilterBuilder,
  DataTableEmptyState,
  DataTableAggregationFooter,
  heatmapColor,
  formatCurrency,
} from '@cosmos-ds/react';

// Initialize hooks
const sort = useDataTableSort([{ column: 'id', direction: 'asc' }]);
const filter = useDataTableFilter(data);
const pagination = useDataTablePagination(filter.filteredData.length, 15);
const selection = useDataTableSelection();
const columns = useDataTableColumns(columnDefs);

// Compose: filter → sort → paginate
const sorted = sort.sortData(filter.filteredData);
const paged = pagination.paginate(sorted);

<table>
  <thead>...</thead>
  <tbody>
    {paged.map(row => (
      <tr key={row.id}>
        {columns.visibleColumns.map(col => (
          <td key={col.key}>{renderCell(row, col)}</td>
        ))}
      </tr>
    ))}
  </tbody>
  {showAgg && <DataTableAggregationFooter ... />}
</table>`}>
        <div className="space-y-3" onKeyDown={e=>{if(e.key==='Escape'){setEd(null);setCtx(null);setHm(null);}}} tabIndex={0}>
          {/* KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[{l:'Employees',v:filtered.length,s:`of ${data.length}`,i:Users,c:'text-blue-500 bg-blue-500/10'},{l:'Total Comp',v:$k(tComp),s:'aggregate',i:DollarSign,c:'text-emerald-500 bg-emerald-500/10'},{l:'Avg Salary',v:$f(avgSal),s:'per employee',i:TrendingUp,c:'text-purple-500 bg-purple-500/10'},{l:'Avg Performance',v:`${avgPerf}%`,s:`${filtered.filter(o=>o.status==='Active').length} active`,i:Activity,c:'text-amber-500 bg-amber-500/10'}].map((m,i)=>(
              <motion.div key={m.l} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:i*.05}} className="flex items-center gap-3 px-4 py-3 rounded-xl border border-border bg-card hover:shadow-md transition-shadow">
                <div className={`w-10 h-10 rounded-xl ${m.c} flex items-center justify-center`}><m.i className="w-4.5 h-4.5"/></div>
                <div><p className="text-[10px] text-muted-foreground">{m.l}</p><p className="text-[17px]" style={{fontWeight:700}}>{m.v}</p><p className="text-[9px] text-muted-foreground">{m.s}</p></div>
              </motion.div>))}
          </div>
          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[180px] max-w-xs"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground"/><Input className="pl-8 h-8 text-[12px]" placeholder="Global search..." value={search} onChange={e=>{setSearch(e.target.value);setPg(0);}}/>{search&&<button onClick={()=>setSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded hover:bg-accent/50 cursor-pointer"><X className="w-3 h-3 text-muted-foreground"/></button>}</div>
            <Button variant="outline" size="sm" className="h-8 gap-1.5 text-[11px]" onClick={()=>setSF(!sF)}><ListFilter className="w-3 h-3"/>Quick Filters{sF&&<div className="w-1.5 h-1.5 rounded-full bg-primary"/>}</Button>
            <Button variant="outline" size="sm" className="h-8 gap-1.5 text-[11px]" onClick={()=>setSAF(!sAF)}><SlidersHorizontal className="w-3 h-3"/>Advanced{aF>0&&<span className="w-4 h-4 rounded-full bg-primary text-primary-foreground text-[9px] flex items-center justify-center" style={{fontWeight:700}}>{aF}</span>}</Button>
            <div className="relative">
              <Button variant="outline" size="sm" className="h-8 gap-1.5 text-[11px]" onClick={()=>setSCP(!sCP)}><Columns3 className="w-3 h-3"/>Columns <span className="text-[9px] text-muted-foreground">{vc.size}/{cols.length}</span></Button>
              <AnimatePresence>{sCP&&(<motion.div initial={{opacity:0,y:-4}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-4}} className="absolute right-0 top-full mt-1 w-56 bg-card border border-border rounded-xl shadow-2xl py-2 z-30 max-h-80 overflow-y-auto">
                <div className="px-3 pb-2 border-b border-border mb-1"><p className="text-[10px] text-muted-foreground uppercase tracking-wider" style={{fontWeight:600}}>Columns</p></div>
                {cols.map(c=>(<div key={c.key} className="flex items-center gap-2 px-3 py-1.5 text-[11px] hover:bg-accent/30 cursor-pointer" onClick={()=>setVc(p=>{const n=new Set(p);n.has(c.key)?n.delete(c.key):n.add(c.key);return n;})}>
                  <div className={`w-4 h-4 rounded border ${vc.has(c.key)?'bg-primary border-primary':'border-border'} flex items-center justify-center`}>{vc.has(c.key)&&<Check className="w-2.5 h-2.5 text-primary-foreground"/>}</div>
                  <span className={vc.has(c.key)?'':'text-muted-foreground'}>{c.label}</span><span className="text-[9px] text-muted-foreground ml-auto">{c.type}</span>
                </div>))}
                <div className="px-3 pt-2 mt-1 border-t border-border flex gap-2"><button onClick={()=>setVc(new Set(cols.map(c=>c.key)))} className="text-[10px] text-primary hover:underline cursor-pointer">All</button><button onClick={()=>setVc(new Set(['id','name','dept','status','salary','perf'] as CK[]))} className="text-[10px] text-muted-foreground hover:underline cursor-pointer">Minimal</button></div>
              </motion.div>)}</AnimatePresence>
            </div>
            <select value={grp??''} onChange={e=>{setGrp((e.target.value||null) as CK|null);setEG(new Set());}} className="h-8 px-2 rounded-lg border border-border bg-card text-[11px] cursor-pointer"><option value="">No grouping</option>{cols.filter(c=>c.grp).map(c=><option key={c.key} value={c.key}>{c.label}</option>)}</select>
            <button onClick={()=>setCompact(!compact)} className="h-8 px-2 rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground transition-colors cursor-pointer">{compact?<Maximize2 className="w-3.5 h-3.5"/>:<Minimize2 className="w-3.5 h-3.5"/>}</button>
            <button onClick={()=>setHeat(!heat)} className={`h-8 px-2 rounded-lg border border-border bg-card transition-colors cursor-pointer ${heat?'text-primary border-primary/30':'text-muted-foreground hover:text-foreground'}`}><BarChart3 className="w-3.5 h-3.5"/></button>
            <button onClick={()=>setSAg(!sAg)} className={`h-8 px-2 rounded-lg border border-border bg-card transition-colors cursor-pointer ${sAg?'text-primary border-primary/30':'text-muted-foreground hover:text-foreground'}`}><Sigma className="w-3.5 h-3.5"/></button>
            <div className="ml-auto flex gap-1.5"><Button variant="outline" size="sm" className="h-8 gap-1.5 text-[11px]" onClick={exCSV}><FileSpreadsheet className="w-3 h-3"/>CSV</Button><Button variant="outline" size="sm" className="h-8 gap-1.5 text-[11px]" onClick={exJSON}><FileJson className="w-3 h-3"/>JSON</Button></div>
          </div>
          {/* Advanced Filters */}
          <AnimatePresence>{sAF&&(<motion.div initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}} className="overflow-hidden"><div className="px-4 py-3 rounded-xl bg-muted/20 border border-border/50 space-y-2">
            <div className="flex items-center justify-between"><span className="text-[10px] text-muted-foreground uppercase tracking-wider" style={{fontWeight:600}}>Filter Builder</span><div className="flex gap-2"><button onClick={()=>setCf(p=>[...p,{col:'name',op:'contains',val:''}])} className="text-[10px] text-primary hover:underline flex items-center gap-1 cursor-pointer"><Plus className="w-3 h-3"/>Add Rule</button>{cf.length>0&&<button onClick={()=>setCf([])} className="text-[10px] text-muted-foreground hover:text-foreground flex items-center gap-1 cursor-pointer"><RefreshCcw className="w-3 h-3"/>Clear</button>}</div></div>
            {cf.map((f,i)=>(<motion.div key={i} initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} className="flex items-center gap-2 flex-wrap">{i>0&&<span className="text-[10px] text-muted-foreground px-2 py-0.5 rounded bg-muted" style={{fontWeight:600}}>AND</span>}<select value={f.col} onChange={e=>setCf(p=>p.map((x,j)=>j===i?{...x,col:e.target.value as CK}:x))} className="h-7 px-2 rounded-md border border-border bg-card text-[10px] cursor-pointer">{cols.map(c=><option key={c.key} value={c.key}>{c.label}</option>)}</select><select value={f.op} onChange={e=>setCf(p=>p.map((x,j)=>j===i?{...x,op:e.target.value as FO}:x))} className="h-7 px-2 rounded-md border border-border bg-card text-[10px] cursor-pointer">{fOps.map(op=><option key={op.v} value={op.v}>{op.l}</option>)}</select>{f.op!=='empty'&&f.op!=='notEmpty'&&<input value={f.val} onChange={e=>setCf(p=>p.map((x,j)=>j===i?{...x,val:e.target.value}:x))} placeholder="Value..." className="h-7 px-2 rounded-md border border-border bg-card text-[10px] w-32"/>}<button onClick={()=>setCf(p=>p.filter((_,j)=>j!==i))} className="p-1 rounded hover:bg-accent/50 cursor-pointer"><X className="w-3 h-3 text-muted-foreground"/></button></motion.div>))}
            {cf.length===0&&<p className="text-[11px] text-muted-foreground py-2">No filters. Click "Add Rule" to create one.</p>}
          </div></motion.div>)}</AnimatePresence>
          {/* Bulk Actions */}
          <AnimatePresence>{sel.size>0&&(<motion.div initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}} className="overflow-hidden"><div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-primary/5 border border-primary/20">
            <div className="flex items-center gap-2"><div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center"><Check className="w-3.5 h-3.5 text-primary"/></div><span className="text-[12px] text-primary" style={{fontWeight:600}}>{sel.size} selected</span></div>
            <div className="flex gap-1.5 ml-auto"><Button variant="ghost" size="sm" className="h-7 text-[10px] gap-1"><Copy className="w-3 h-3"/>Copy</Button><Button variant="ghost" size="sm" className="h-7 text-[10px] gap-1"><Download className="w-3 h-3"/>Export</Button><Button variant="ghost" size="sm" className="h-7 text-[10px] gap-1 text-destructive"><Trash2 className="w-3 h-3"/>Delete</Button><div className="w-px h-5 bg-border mx-1"/><Button variant="ghost" size="sm" className="h-7 text-[10px] gap-1" onClick={()=>setSel(new Set())}><X className="w-3 h-3"/>Clear</Button></div>
          </div></motion.div>)}</AnimatePresence>
          {/* TABLE */}
          <div className="rounded-xl border border-border overflow-hidden"><div className="overflow-x-auto">
            <table className="w-full text-left" style={{minWidth:oc.a.reduce((s,c)=>s+cw[c.key],0)+100}}>
              <thead>
                <tr className="bg-muted/40 border-b border-border">
                  <th className={`px-1.5 ${py} sticky left-0 z-[3] bg-muted/40 w-[52px]`}><input type="checkbox" checked={sel.size===paged.length&&paged.length>0} onChange={tgAll} className="rounded accent-primary cursor-pointer w-3.5 h-3.5"/></th>
                  {oc.l.map(c=>rHead(c,{left:po[c.key]??52}))}
                  {oc.c.map(c=>rHead(c))}
                  {oc.r.map(c=>rHead(c,{}))}
                  <th className={`px-2 ${py} w-10`}/>
                </tr>
                {sF&&(<tr className="bg-muted/20 border-b border-border/50">
                  <th className="px-1.5 py-1 sticky left-0 z-[3] bg-muted/20"/>
                  {oc.l.map(c=><th key={c.key} className="px-2 py-1 sticky z-[3] bg-muted/20 border-r border-border/30" style={{left:po[c.key]??52}}><input value={ff[c.key]||''} onChange={e=>setFf(p=>({...p,[c.key]:e.target.value}))} placeholder="Filter..." className="w-full bg-background/80 border border-border/60 rounded-md px-2 py-1 text-[10px] outline-none focus:border-primary/50 placeholder:text-muted-foreground/40"/></th>)}
                  {oc.c.map(c=><th key={c.key} className="px-2 py-1"><input value={ff[c.key]||''} onChange={e=>setFf(p=>({...p,[c.key]:e.target.value}))} placeholder="Filter..." className="w-full bg-background/80 border border-border/60 rounded-md px-2 py-1 text-[10px] outline-none focus:border-primary/50 placeholder:text-muted-foreground/40"/></th>)}
                  {oc.r.map(c=><th key={c.key} className="px-2 py-1 sticky right-0 z-[3] bg-muted/20 border-l border-border/30"><input value={ff[c.key]||''} onChange={e=>setFf(p=>({...p,[c.key]:e.target.value}))} placeholder="Filter..." className="w-full bg-background/80 border border-border/60 rounded-md px-2 py-1 text-[10px] outline-none focus:border-primary/50 placeholder:text-muted-foreground/40"/></th>)}
                  <th className="px-2 py-1 w-10"/>
                </tr>)}
              </thead>
              <tbody>
                {paged.length===0?(<tr><td colSpan={oc.a.length+2} className="text-center py-16"><div className="flex flex-col items-center gap-3"><div className="w-12 h-12 rounded-2xl bg-muted/30 flex items-center justify-center"><Search className="w-6 h-6 text-muted-foreground/30"/></div><p className="text-[13px]" style={{fontWeight:600}}>No results</p><p className="text-[11px] text-muted-foreground">Adjust search or filters</p><Button variant="outline" size="sm" className="text-[11px] mt-2" onClick={()=>{setSearch('');setCf([]);setFf({});}}><RefreshCcw className="w-3 h-3 mr-1.5"/>Reset</Button></div></td></tr>
                ):grouped?(Object.entries(grouped).flatMap(([g,rows])=>{const iE=eG.has(g);const gT=rows.reduce((s,r)=>s+r.comp,0);return[<tr key={`grp-${g}`} className="bg-muted/20 border-b border-border/50 cursor-pointer hover:bg-muted/30 transition-colors" onClick={()=>tgGrp(g)}><td colSpan={oc.a.length+2} className={`px-3 ${py}`}><div className="flex items-center gap-2.5"><motion.div animate={{rotate:iE?90:0}} transition={{duration:.15}}><ChevronRight className="w-3.5 h-3.5 text-muted-foreground"/></motion.div><span className="text-[12px]" style={{fontWeight:700}}>{g}</span><Badge variant="secondary" className="text-[9px] px-1.5">{rows.length}</Badge><span className="text-[10px] text-muted-foreground ml-2">Total: <span style={{fontWeight:600}}>{$f(gT)}</span></span><span className="text-[10px] text-muted-foreground">&middot; Avg: <span style={{fontWeight:600}}>{$f(Math.round(gT/rows.length))}</span></span></div></td></tr>,<AnimatePresence key={`grp-ap-${g}`}>{iE&&rows.map((r,i)=>rRow(r,i))}</AnimatePresence>];}))
                :paged.map((r,i)=>rRow(r,i))}
              </tbody>
              {sAg&&paged.length>0&&(<tfoot><tr className="bg-muted/30 border-t-2 border-border">
                <td className={`px-1.5 ${py} sticky left-0 z-[1] bg-muted/30`}><Sigma className="w-3 h-3 text-muted-foreground"/></td>
                {oc.l.map(c=><td key={c.key} className={`px-3 ${py} sticky z-[1] bg-muted/30 border-r border-border/30`} style={{left:po[c.key]??52}}>{aggs[c.key]?<div><span className="text-[9px] text-muted-foreground uppercase tracking-wider">{c.agg}</span><span className={`block ${ts} text-primary`} style={{fontWeight:700}}>{aggs[c.key]}</span></div>:c.key==='id'?<span className="text-[10px] text-muted-foreground" style={{fontWeight:600}}>{filtered.length} rows</span>:null}</td>)}
                {oc.c.map(c=><td key={c.key} className={`px-3 ${py}`}>{aggs[c.key]?<div><span className="text-[9px] text-muted-foreground uppercase tracking-wider">{c.agg}</span><span className={`block ${ts} text-primary`} style={{fontWeight:700}}>{aggs[c.key]}</span></div>:null}</td>)}
                {oc.r.map(c=><td key={c.key} className={`px-3 ${py} sticky right-0 z-[1] bg-muted/30 border-l border-border/30`}>{aggs[c.key]?<div><span className="text-[9px] text-muted-foreground uppercase tracking-wider">{c.agg}</span><span className={`block ${ts} text-primary`} style={{fontWeight:700}}>{aggs[c.key]}</span></div>:null}</td>)}
                <td className={`px-2 ${py}`}/>
              </tr></tfoot>)}
            </table>
          </div></div>
          {/* Status + Pagination */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1"><Rows3 className="w-3 h-3"/>{filtered.length} rows</span>
              {sel.size>0&&<span className="flex items-center gap-1 text-primary"><Check className="w-3 h-3"/>{sel.size} selected</span>}
              {sm.filter(s=>s.dir).length>0&&<span className="flex items-center gap-1"><ArrowDownUp className="w-3 h-3"/>{sm.filter(s=>s.dir).length} sort{sm.filter(s=>s.dir).length>1?'s':''}</span>}
              {aF>0&&<span className="flex items-center gap-1"><Filter className="w-3 h-3"/>{aF} filter{aF>1?'s':''}</span>}
              {grp&&<span className="flex items-center gap-1"><SquareStack className="w-3 h-3"/>Grouped by {grp}</span>}
              {heat&&<span className="flex items-center gap-1 text-primary"><BarChart3 className="w-3 h-3"/>Heatmap</span>}
              <span>Showing {Math.min(pg*pgSz+1,sorted.length)}-{Math.min((pg+1)*pgSz,sorted.length)} of {sorted.length}</span>
            </div>
            <div className="flex items-center gap-1">
              <select value={pgSz} onChange={e=>{setPgSz(+e.target.value);setPg(0);}} className="h-7 px-2 rounded-md border border-border bg-card text-[10px] cursor-pointer mr-2">{[10,15,25,50,100].map(s=><option key={s} value={s}>{s}/page</option>)}</select>
              <Button variant="ghost" size="icon" className="h-7 w-7" disabled={pg===0} onClick={()=>setPg(0)}><ChevronsLeft className="w-3 h-3"/></Button>
              <Button variant="ghost" size="icon" className="h-7 w-7" disabled={pg===0} onClick={()=>setPg(p=>p-1)}><ChevronLeft className="w-3 h-3"/></Button>
              {Array.from({length:Math.min(tP,7)},(_,i)=>{let p=i;if(tP>7){const s=Math.max(0,Math.min(pg-3,tP-7));p=s+i;}return<button key={p} onClick={()=>setPg(p)} className={`w-7 h-7 rounded-md text-[10px] cursor-pointer transition-all ${pg===p?'bg-primary text-primary-foreground shadow-sm':'hover:bg-accent/50 text-muted-foreground'}`} style={{fontWeight:pg===p?600:400}}>{p+1}</button>;})}
              <Button variant="ghost" size="icon" className="h-7 w-7" disabled={pg>=tP-1} onClick={()=>setPg(p=>p+1)}><ChevronRight className="w-3 h-3"/></Button>
              <Button variant="ghost" size="icon" className="h-7 w-7" disabled={pg>=tP-1} onClick={()=>setPg(tP-1)}><ChevronsRight className="w-3 h-3"/></Button>
            </div>
          </div>
        </div>
      </Showcase>
      {/* Feature Reference */}
      <Showcase title="Feature Reference" description="All enterprise capabilities in the Cosmos Data Grid." delay={0.1} code={`const features = { multiColumnSort:true, columnResizing:true, columnPinning:'left|right', floatingFilters:true, advancedFilterBuilder:true, inlineCellEditing:true, rowGrouping:true, aggregationFooter:true, masterDetail:true, contextMenu:true, heatmapMode:true, export:['csv','json'] };`}>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[{i:ArrowDownUp,t:'Multi-Column Sort',d:'Click headers. Priority badges show sort order.',c:'text-blue-500 bg-blue-500/10'},{i:ArrowLeftRight,t:'Column Resize',d:'Drag right edge of any header to resize.',c:'text-purple-500 bg-purple-500/10'},{i:Pin,t:'Column Pinning',d:'Pin columns left or right. Fixed on scroll.',c:'text-indigo-500 bg-indigo-500/10'},{i:ListFilter,t:'Floating Filters',d:'Per-column quick filter inputs below headers.',c:'text-cyan-500 bg-cyan-500/10'},{i:SlidersHorizontal,t:'Advanced Filters',d:'Multi-rule AND chains with 11 operators.',c:'text-emerald-500 bg-emerald-500/10'},{i:Pencil,t:'Inline Editing',d:'Double-click editable cells. Flash on save.',c:'text-amber-500 bg-amber-500/10'},{i:SquareStack,t:'Row Grouping',d:'Group by any column with aggregation.',c:'text-violet-500 bg-violet-500/10'},{i:Sigma,t:'Aggregation Footer',d:'Live sum, avg calculations per column.',c:'text-teal-500 bg-teal-500/10'},{i:Maximize,t:'Master/Detail',d:'Expand rows for metrics, charts, breakdown.',c:'text-rose-500 bg-rose-500/10'},{i:MoreVertical,t:'Context Menu',d:'Right-click: View, Edit, Copy, Email, Delete.',c:'text-orange-500 bg-orange-500/10'},{i:BarChart3,t:'Heatmap Mode',d:'Conditional color formatting on salary cols.',c:'text-pink-500 bg-pink-500/10'},{i:FileSpreadsheet,t:'CSV + JSON Export',d:'Export filtered data with one click.',c:'text-green-500 bg-green-500/10'}].map((f,i)=>(
            <motion.div key={f.t} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:.1+i*.04}} className="flex items-start gap-3 p-4 rounded-xl border border-border bg-card/50 hover:border-primary/20 hover:shadow-sm transition-all">
              <div className={`w-8 h-8 rounded-lg ${f.c} flex items-center justify-center flex-shrink-0`}><f.i className="w-4 h-4"/></div>
              <div><p className="text-[12px]" style={{fontWeight:600}}>{f.t}</p><p className="text-[11px] text-muted-foreground leading-relaxed mt-0.5">{f.d}</p></div>
            </motion.div>))}
        </div>
      </Showcase>
      {/* Keyboard Shortcuts */}
      <Showcase title="Keyboard Shortcuts" delay={0.15} code={`// Double-click->edit | Enter->save | Escape->cancel | Click header->sort | Right-click->context menu`}>
        <div className="grid sm:grid-cols-2 gap-2">
          {[{k:['Double-click'],a:'Enter inline edit on editable cells'},{k:['Enter'],a:'Confirm and save cell edit'},{k:['Escape'],a:'Cancel editing, close menus'},{k:['Click header'],a:'Cycle sort: asc -> desc -> none'},{k:['Right-click'],a:'Open contextual row menu'},{k:['Checkbox'],a:'Toggle selection for bulk actions'}].map(s=>(
            <div key={s.a} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-muted/20 border border-border/50">
              <div className="flex gap-1">{s.k.map(k=><kbd key={k} className="px-2 py-0.5 rounded-md bg-card border border-border text-[10px] font-mono shadow-sm" style={{fontWeight:500}}>{k}</kbd>)}</div>
              <span className="text-[11px] text-muted-foreground">{s.a}</span>
            </div>))}
        </div>
      </Showcase>
      {/* Portals */}
      <AnimatePresence>{ctx&&<CMenu x={ctx.x} y={ctx.y} row={ctx.row} onClose={()=>setCtx(null)} onEdit={()=>setEd({r:ctx.row.id,c:'name'})} onCopy={()=>cpRow(ctx.row)} onDel={()=>setData(p=>p.filter(r=>r.id!==ctx.row.id))} onExp={()=>tgExp(ctx.row.id)}/>}</AnimatePresence>
      <AnimatePresence>{cpd&&(<motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0,y:20}} className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-card border border-border shadow-2xl"><Check className="w-4 h-4 text-emerald-500"/><span className="text-[12px]" style={{fontWeight:500}}>Copied to clipboard</span></motion.div>)}</AnimatePresence>
    </ComponentPage>
  );
}
