import { useState, useMemo } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";

// ─── MOCK DATA ──────────────────────────────────────────────────────────────
let _n = 0;
const uid = () => `tx_${++_n}`;

const INIT_TX = [
  { id: uid(), date: "2024-12-28", desc: "Monthly Salary",     cat: "Salary",        type: "income",  amt: 85000 },
  { id: uid(), date: "2024-12-27", desc: "Zomato Delivery",    cat: "Food & Dining", type: "expense", amt: 450   },
  { id: uid(), date: "2024-12-26", desc: "Electricity Bill",   cat: "Bills",         type: "expense", amt: 2100  },
  { id: uid(), date: "2024-12-25", desc: "Amazon Purchase",    cat: "Shopping",      type: "expense", amt: 3200  },
  { id: uid(), date: "2024-12-24", desc: "Ola Cab",            cat: "Transport",     type: "expense", amt: 180   },
  { id: uid(), date: "2024-12-23", desc: "Netflix",            cat: "Entertainment", type: "expense", amt: 649   },
  { id: uid(), date: "2024-12-22", desc: "Freelance Project",  cat: "Freelance",     type: "income",  amt: 15000 },
  { id: uid(), date: "2024-12-21", desc: "Pharmacy",           cat: "Healthcare",    type: "expense", amt: 850   },
  { id: uid(), date: "2024-12-20", desc: "Mutual Fund SIP",    cat: "Investment",    type: "expense", amt: 10000 },
  { id: uid(), date: "2024-12-19", desc: "Restaurant Dinner",  cat: "Food & Dining", type: "expense", amt: 1800  },
  { id: uid(), date: "2024-12-18", desc: "Metro Recharge",     cat: "Transport",     type: "expense", amt: 500   },
  { id: uid(), date: "2024-12-17", desc: "Mobile Recharge",    cat: "Bills",         type: "expense", amt: 399   },
  { id: uid(), date: "2024-12-15", desc: "Swiggy Orders",      cat: "Food & Dining", type: "expense", amt: 780   },
  { id: uid(), date: "2024-12-14", desc: "Movie Tickets",      cat: "Entertainment", type: "expense", amt: 1200  },
  { id: uid(), date: "2024-12-12", desc: "Gym Membership",     cat: "Healthcare",    type: "expense", amt: 2500  },
  { id: uid(), date: "2024-12-10", desc: "Dividend Income",    cat: "Investment",    type: "income",  amt: 3200  },
  { id: uid(), date: "2024-12-08", desc: "Flipkart Order",     cat: "Shopping",      type: "expense", amt: 5600  },
  { id: uid(), date: "2024-12-05", desc: "Petrol Fill",        cat: "Transport",     type: "expense", amt: 2000  },
  { id: uid(), date: "2024-12-03", desc: "Internet Bill",      cat: "Bills",         type: "expense", amt: 999   },
  { id: uid(), date: "2024-12-01", desc: "Coffee Shop",        cat: "Food & Dining", type: "expense", amt: 320   },
  { id: uid(), date: "2024-11-30", desc: "Monthly Salary",     cat: "Salary",        type: "income",  amt: 85000 },
  { id: uid(), date: "2024-11-28", desc: "Weekend Outing",     cat: "Entertainment", type: "expense", amt: 3500  },
  { id: uid(), date: "2024-11-25", desc: "Grocery Shopping",   cat: "Food & Dining", type: "expense", amt: 4200  },
  { id: uid(), date: "2024-11-22", desc: "Cab Fare",           cat: "Transport",     type: "expense", amt: 650   },
  { id: uid(), date: "2024-11-20", desc: "Freelance Work",     cat: "Freelance",     type: "income",  amt: 20000 },
  { id: uid(), date: "2024-11-18", desc: "Clothing Purchase",  cat: "Shopping",      type: "expense", amt: 4800  },
  { id: uid(), date: "2024-11-15", desc: "Doctor Visit",       cat: "Healthcare",    type: "expense", amt: 1500  },
  { id: uid(), date: "2024-11-12", desc: "Electricity Bill",   cat: "Bills",         type: "expense", amt: 1900  },
  { id: uid(), date: "2024-11-10", desc: "Mutual Fund SIP",    cat: "Investment",    type: "expense", amt: 10000 },
  { id: uid(), date: "2024-11-05", desc: "Books",              cat: "Entertainment", type: "expense", amt: 890   },
];

const TREND = [
  { month: "Jul", balance: 142000, income: 95000, expense: 68000 },
  { month: "Aug", balance: 158000, income: 98000, expense: 72000 },
  { month: "Sep", balance: 149000, income: 88000, expense: 80000 },
  { month: "Oct", balance: 172000, income: 105000, expense: 65000 },
  { month: "Nov", balance: 195000, income: 110000, expense: 75000 },
  { month: "Dec", balance: 218000, income: 103200, expense: 55127 },
];

const ALL_CATS   = ["Salary","Freelance","Investment","Food & Dining","Transport","Entertainment","Shopping","Bills","Healthcare"];
const EXP_CATS   = ["Food & Dining","Transport","Entertainment","Shopping","Bills","Healthcare","Investment"];
const INC_CATS   = ["Salary","Freelance","Investment"];
const PIE_COLORS = ["#00d4a1","#4f8ef7","#f0b429","#a78bfa","#ff4060","#ff8c42","#00bcd4","#f472b6"];

const fmt  = (n) => `₹${Number(n).toLocaleString("en-IN")}`;
const fmtK = (v) => v >= 100000 ? `₹${(v/100000).toFixed(1)}L` : `₹${(v/1000).toFixed(0)}k`;

const CAT_EMOJI = {
  "Food & Dining":"🍽", Transport:"🚗", Entertainment:"🎬",
  Shopping:"🛍", Bills:"🔌", Healthcare:"💊", Investment:"📊",
  Salary:"💼", Freelance:"💻",
};

// ─── COMPONENT ───────────────────────────────────────────────────────────────
export default function FinanceDashboard() {
  const [role,    setRole]    = useState("viewer");
  const [tx,      setTx]      = useState(INIT_TX);
  const [tab,     setTab]     = useState("dashboard");
  const [filters, setFilters] = useState({ cat: "all", type: "all", search: "" });
  const [sort,    setSort]    = useState({ field: "date", dir: "desc" });
  const [modal,   setModal]   = useState(false);
  const [form,    setForm]    = useState({ date: "", desc: "", cat: "Food & Dining", type: "expense", amt: "" });

  const isAdmin = role === "admin";

  // ── Computed ─────────────────────────────────────────────────────────────
  const summary = useMemo(() => {
    const income  = tx.filter(t => t.type === "income").reduce((s,t) => s + t.amt, 0);
    const expense = tx.filter(t => t.type === "expense").reduce((s,t) => s + t.amt, 0);
    const rate    = income > 0 ? ((income - expense) / income * 100).toFixed(1) : 0;
    return { income, expense, balance: income - expense, rate };
  }, [tx]);

  const pieData = useMemo(() => {
    const map = {};
    tx.filter(t => t.type === "expense").forEach(t => { map[t.cat] = (map[t.cat] || 0) + t.amt; });
    return Object.entries(map).map(([name, value]) => ({ name, value })).sort((a,b) => b.value - a.value);
  }, [tx]);

  const filtered = useMemo(() => {
    let r = [...tx];
    if (filters.cat  !== "all") r = r.filter(t => t.cat  === filters.cat);
    if (filters.type !== "all") r = r.filter(t => t.type === filters.type);
    if (filters.search) {
      const q = filters.search.toLowerCase();
      r = r.filter(t => t.desc.toLowerCase().includes(q) || t.cat.toLowerCase().includes(q));
    }
    r.sort((a,b) => {
      const [va,vb] = sort.field === "amt"
        ? [a.amt, b.amt]
        : [new Date(a.date), new Date(b.date)];
      return sort.dir === "asc" ? (va > vb ? 1 : -1) : (va < vb ? 1 : -1);
    });
    return r;
  }, [tx, filters, sort]);

  const insights = useMemo(() => {
    const top    = pieData[0];
    const decExp = tx.filter(t => t.date.startsWith("2024-12") && t.type === "expense").reduce((s,t) => s+t.amt, 0);
    const novExp = tx.filter(t => t.date.startsWith("2024-11") && t.type === "expense").reduce((s,t) => s+t.amt, 0);
    const change = novExp > 0 ? (((decExp - novExp) / novExp) * 100).toFixed(1) : 0;
    return {
      top, topPct: top ? ((top.value / summary.expense) * 100).toFixed(0) : 0,
      decExp, novExp, change,
      avgInc:  (summary.income  / 2),
      avgExp:  (summary.expense / 2),
    };
  }, [pieData, tx, summary]);

  // ── Handlers ─────────────────────────────────────────────────────────────
  const addTx = () => {
    if (!form.date || !form.desc || !form.amt) return;
    setTx(prev => [{ ...form, id: uid(), amt: parseFloat(form.amt) }, ...prev]);
    setForm({ date: "", desc: "", cat: "Food & Dining", type: "expense", amt: "" });
    setModal(false);
  };
  const delTx       = (id) => setTx(prev => prev.filter(t => t.id !== id));
  const toggleSort  = (field) => setSort(prev =>
    prev.field === field ? { ...prev, dir: prev.dir === "asc" ? "desc" : "asc" } : { field, dir: "desc" }
  );
  const sortIcon    = (field) => sort.field === field ? (sort.dir === "desc" ? " ↓" : " ↑") : " ↕";

  // ── Custom Tooltips ───────────────────────────────────────────────────────
  const AreaTip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div style={{ background:"#0d1526", border:"1px solid #1e2d47", borderRadius:10, padding:"12px 16px", minWidth:160 }}>
        <p style={{ color:"#5a6e8a", fontSize:11, marginBottom:8, textTransform:"uppercase", letterSpacing:"0.5px" }}>{label} 2024</p>
        {payload.map(p => (
          <p key={p.name} style={{ color:p.color, fontSize:13, fontFamily:"'JetBrains Mono',monospace", marginBottom:3 }}>
            {p.name}: {fmt(p.value)}
          </p>
        ))}
      </div>
    );
  };

  const PieTip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    return (
      <div style={{ background:"#0d1526", border:"1px solid #1e2d47", borderRadius:10, padding:"10px 14px" }}>
        <p style={{ color:"#e2e8f5", fontSize:13, marginBottom:2 }}>{payload[0].name}</p>
        <p style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:14, fontWeight:600, color: PIE_COLORS[pieData.findIndex(d=>d.name===payload[0].name) % PIE_COLORS.length] }}>
          {fmt(payload[0].value)}
        </p>
      </div>
    );
  };

  // ── Shared card style ─────────────────────────────────────────────────────
  const card = { background:"#0d1526", border:"1px solid #1e2d47", borderRadius:16, boxShadow:"0 4px 24px rgba(0,0,0,0.25)" };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(160deg,#04080f 0%,#070d1a 100%)", color:"#e2e8f5", fontFamily:"'Outfit',sans-serif" }}>

      {/* ── Fonts + Global CSS ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&family=Syne:wght@700;800&display=swap');
        * { box-sizing:border-box; margin:0; padding:0; }
        ::-webkit-scrollbar { width:4px; height:4px; }
        ::-webkit-scrollbar-track { background:#07101f; }
        ::-webkit-scrollbar-thumb { background:#1e2d47; border-radius:4px; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
        .fi { animation: fadeUp 0.4s ease forwards; }
        .hov-card:hover { transform:translateY(-2px); box-shadow:0 14px 40px rgba(0,0,0,0.4) !important; transition:all 0.22s ease; }
        .hov-row:hover  { background:rgba(79,142,247,0.05) !important; }
        .hov-btn:hover  { filter:brightness(1.14); transform:translateY(-1px); transition:all 0.18s ease; }
        .hov-btn:active { transform:translateY(0); }
        input:focus, select:focus { border-color:#4f8ef7 !important; box-shadow:0 0 0 3px rgba(79,142,247,0.12) !important; }
        input, select { outline:none; transition:border-color 0.2s, box-shadow 0.2s; }
        @media(max-width:900px) {
          .g4   { grid-template-columns:1fr 1fr !important; }
          .crow { flex-direction:column !important; }
          .ig   { grid-template-columns:1fr !important; }
          .hmt  { display:none !important; }
          .mbt  { display:flex !important; }
          .tcols { grid-template-columns: 1fr 80px 70px auto !important; }
          .thide { display:none !important; }
        }
        .mbt { display:none; }
      `}</style>

      {/* ══ NAV ════════════════════════════════════════════════════════════ */}
      <nav style={{
        background:"rgba(7,13,26,0.92)", backdropFilter:"blur(20px)",
        borderBottom:"1px solid #1e2d47", height:60, padding:"0 20px",
        position:"sticky", top:0, zIndex:200,
        display:"flex", alignItems:"center", justifyContent:"space-between", gap:12
      }}>
        {/* Logo */}
        <div style={{ display:"flex", alignItems:"center", gap:10, flexShrink:0 }}>
          <div style={{ width:32, height:32, background:"linear-gradient(135deg,#00d4a1,#4f8ef7)", borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, fontWeight:700, color:"#04080f" }}>₹</div>
          <span style={{ fontFamily:"Syne", fontSize:19, fontWeight:800, letterSpacing:"-0.5px" }}>
            Fin<span style={{ color:"#00d4a1" }}>Lens</span>
          </span>
        </div>

        {/* Desktop tabs */}
        <div className="hmt" style={{ display:"flex", gap:4 }}>
          {[["dashboard","Dashboard"],["transactions","Transactions"],["insights","Insights"]].map(([v,label]) => (
            <button key={v} onClick={() => setTab(v)} style={{
              background: tab===v ? "rgba(79,142,247,0.14)" : "transparent",
              color:       tab===v ? "#4f8ef7" : "#5a6e8a",
              border:"none", borderBottom: `2px solid ${tab===v?"#4f8ef7":"transparent"}`,
              borderRadius:"8px 8px 0 0", padding:"0 18px", height:44,
              fontSize:14, fontWeight:500, cursor:"pointer", fontFamily:"Outfit",
              transition:"all 0.18s ease"
            }}>{label}</button>
          ))}
        </div>

        {/* Role switcher */}
        <div style={{ display:"flex", alignItems:"center", gap:10, flexShrink:0 }}>
          <span style={{ fontSize:12, color:"#5a6e8a", whiteSpace:"nowrap" }}>Role:</span>
          <select value={role} onChange={e=>setRole(e.target.value)} style={{
            background:"#0d1526", border:"1px solid #1e2d47", color:"#e2e8f5",
            borderRadius:8, padding:"5px 10px", fontSize:13, fontFamily:"Outfit", cursor:"pointer"
          }}>
            <option value="viewer">Viewer</option>
            <option value="admin">Admin</option>
          </select>
          {isAdmin && (
            <span style={{ background:"rgba(240,180,41,0.14)", color:"#f0b429", fontSize:11, fontWeight:700, padding:"3px 9px", borderRadius:20, border:"1px solid rgba(240,180,41,0.28)", whiteSpace:"nowrap" }}>
              ADMIN
            </span>
          )}
        </div>
      </nav>

      {/* Mobile bottom tabs */}
      <div className="mbt" style={{ position:"fixed", bottom:0, left:0, right:0, zIndex:200, background:"rgba(7,13,26,0.96)", backdropFilter:"blur(20px)", borderTop:"1px solid #1e2d47", justifyContent:"space-around", padding:"6px 0 10px" }}>
        {[["dashboard","📊","Overview"],["transactions","📋","Txns"],["insights","💡","Insights"]].map(([v,icon,label]) => (
          <button key={v} onClick={()=>setTab(v)} style={{ background:"transparent", border:"none", color: tab===v ? "#4f8ef7" : "#5a6e8a", fontSize:11, fontWeight: tab===v?600:400, cursor:"pointer", padding:"4px 20px", display:"flex", flexDirection:"column", alignItems:"center", gap:3 }}>
            <span style={{ fontSize:18 }}>{icon}</span>{label}
          </button>
        ))}
      </div>

      {/* ══ MAIN ═══════════════════════════════════════════════════════════ */}
      <main style={{ maxWidth:1300, margin:"0 auto", padding:"28px 20px 90px" }}>

        {/* ════════════════════════════════════ DASHBOARD TAB ════════════ */}
        {tab === "dashboard" && (
          <div className="fi">
            <div style={{ marginBottom:28 }}>
              <h1 style={{ fontFamily:"Syne", fontSize:28, fontWeight:800, letterSpacing:"-0.5px" }}>Financial Overview</h1>
              <p style={{ color:"#5a6e8a", fontSize:14, marginTop:4 }}>December 2024 · All accounts</p>
            </div>

            {/* Summary cards */}
            <div className="g4" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:24 }}>
              {[
                { label:"Net Balance",    val:fmt(summary.balance), color:"#00d4a1", bg:"rgba(0,212,161,0.08)",  icon:"💰", sub:"Total accumulated" },
                { label:"Total Income",   val:fmt(summary.income),  color:"#4f8ef7", bg:"rgba(79,142,247,0.08)", icon:"📈", sub:"All sources" },
                { label:"Total Expenses", val:fmt(summary.expense), color:"#ff4060", bg:"rgba(255,64,96,0.08)",  icon:"📉", sub:"All categories" },
                { label:"Savings Rate",   val:`${summary.rate}%`,   color:"#f0b429", bg:"rgba(240,180,41,0.08)", icon:"🎯", sub:"Of total income" },
              ].map(c => (
                <div key={c.label} className="hov-card" style={{ ...card, padding:20, position:"relative", overflow:"hidden", transition:"all 0.22s ease" }}>
                  <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:`linear-gradient(90deg,${c.color},transparent)` }} />
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                    <div>
                      <p style={{ color:"#5a6e8a", fontSize:11, fontWeight:600, marginBottom:8, textTransform:"uppercase", letterSpacing:"0.6px" }}>{c.label}</p>
                      <p style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:22, fontWeight:700, color:c.color, letterSpacing:"-0.5px" }}>{c.val}</p>
                      <p style={{ color:"#2e3f5a", fontSize:11, marginTop:5 }}>{c.sub}</p>
                    </div>
                    <span style={{ fontSize:22, background:c.bg, padding:"9px 10px", borderRadius:10 }}>{c.icon}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Charts row */}
            <div className="crow" style={{ display:"flex", gap:20, marginBottom:24 }}>

              {/* Balance Trend */}
              <div className="hov-card" style={{ ...card, flex:"1 1 60%", padding:22, transition:"all 0.22s ease" }}>
                <h3 style={{ fontFamily:"Syne", fontSize:15, fontWeight:700, marginBottom:4 }}>Balance Trend</h3>
                <p style={{ color:"#5a6e8a", fontSize:12, marginBottom:18 }}>Jul – Dec 2024</p>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={TREND} margin={{ top:5, right:8, left:0, bottom:0 }}>
                    <defs>
                      {[["bg","#00d4a1",0.28],["ig","#4f8ef7",0.18],["eg","#ff4060",0.18]].map(([id,c,o]) => (
                        <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%"  stopColor={c} stopOpacity={o} />
                          <stop offset="95%" stopColor={c} stopOpacity={0} />
                        </linearGradient>
                      ))}
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1a2540" />
                    <XAxis dataKey="month" stroke="#2e3f5a" tick={{ fill:"#5a6e8a", fontSize:12, fontFamily:"Outfit" }} />
                    <YAxis stroke="#2e3f5a" tick={{ fill:"#5a6e8a", fontSize:11, fontFamily:"'JetBrains Mono',monospace" }} tickFormatter={fmtK} />
                    <Tooltip content={<AreaTip />} />
                    <Area type="monotone" dataKey="balance" name="Balance" stroke="#00d4a1" strokeWidth={2.5} fill="url(#bg)" dot={{ fill:"#00d4a1", r:3 }} />
                    <Area type="monotone" dataKey="income"  name="Income"  stroke="#4f8ef7" strokeWidth={1.5} fill="url(#ig)" strokeDasharray="4 2" dot={false} />
                    <Area type="monotone" dataKey="expense" name="Expense" stroke="#ff4060" strokeWidth={1.5} fill="url(#eg)" strokeDasharray="4 2" dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
                {/* Legend */}
                <div style={{ display:"flex", gap:16, marginTop:12, flexWrap:"wrap" }}>
                  {[["Balance","#00d4a1"],["Income","#4f8ef7"],["Expense","#ff4060"]].map(([l,c]) => (
                    <span key={l} style={{ display:"flex", alignItems:"center", gap:6, fontSize:12, color:"#5a6e8a" }}>
                      <span style={{ width:10, height:10, borderRadius:2, background:c, display:"inline-block" }}></span>{l}
                    </span>
                  ))}
                </div>
              </div>

              {/* Spending Breakdown */}
              <div className="hov-card" style={{ ...card, flex:"1 1 38%", padding:22, transition:"all 0.22s ease" }}>
                <h3 style={{ fontFamily:"Syne", fontSize:15, fontWeight:700, marginBottom:4 }}>Spending Breakdown</h3>
                <p style={{ color:"#5a6e8a", fontSize:12, marginBottom:12 }}>By category</p>
                <ResponsiveContainer width="100%" height={165}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={48} outerRadius={76} paddingAngle={3} dataKey="value">
                      {pieData.map((_,i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                    </Pie>
                    <Tooltip content={<PieTip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ display:"flex", flexDirection:"column", gap:7, marginTop:10 }}>
                  {pieData.slice(0,5).map((d,i) => (
                    <div key={d.name} style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                        <div style={{ width:8, height:8, borderRadius:"50%", background:PIE_COLORS[i % PIE_COLORS.length], flexShrink:0 }} />
                        <span style={{ fontSize:12, color:"#8a9ab5" }}>{d.name}</span>
                      </div>
                      <span style={{ fontSize:12, fontFamily:"'JetBrains Mono',monospace", color:"#e2e8f5" }}>{fmt(d.value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Transactions preview */}
            <div className="hov-card" style={{ ...card, padding:22, transition:"all 0.22s ease" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
                <h3 style={{ fontFamily:"Syne", fontSize:15, fontWeight:700 }}>Recent Transactions</h3>
                <button className="hov-btn" onClick={() => setTab("transactions")} style={{
                  background:"rgba(79,142,247,0.1)", color:"#4f8ef7", border:"1px solid rgba(79,142,247,0.2)",
                  borderRadius:8, padding:"6px 14px", fontSize:12, fontWeight:500, cursor:"pointer", fontFamily:"Outfit"
                }}>View All →</button>
              </div>
              {tx.slice(0,6).map(t => (
                <div key={t.id} className="hov-row" style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"11px 8px", borderBottom:"1px solid #0e1c30", borderRadius:6 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                    <div style={{ width:36, height:36, borderRadius:10, background: t.type==="income"?"rgba(0,212,161,0.1)":"rgba(255,64,96,0.1)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>
                      {CAT_EMOJI[t.cat] || (t.type==="income"?"↑":"↓")}
                    </div>
                    <div>
                      <p style={{ fontSize:14, fontWeight:500 }}>{t.desc}</p>
                      <p style={{ fontSize:11, color:"#5a6e8a", marginTop:2 }}>{t.cat} · {t.date}</p>
                    </div>
                  </div>
                  <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:15, fontWeight:600, color: t.type==="income"?"#00d4a1":"#ff4060" }}>
                    {t.type==="income"?"+":"-"}{fmt(t.amt)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════ TRANSACTIONS TAB ══════════ */}
        {tab === "transactions" && (
          <div className="fi">
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:24, flexWrap:"wrap", gap:12 }}>
              <div>
                <h1 style={{ fontFamily:"Syne", fontSize:28, fontWeight:800 }}>Transactions</h1>
                <p style={{ color:"#5a6e8a", fontSize:14, marginTop:4 }}>{filtered.length} records found</p>
              </div>
              {isAdmin && (
                <button className="hov-btn" onClick={() => setModal(true)} style={{
                  background:"linear-gradient(135deg,#00d4a1,#4f8ef7)", color:"#04080f",
                  border:"none", borderRadius:10, padding:"10px 20px", fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:"Outfit"
                }}>+ Add Transaction</button>
              )}
            </div>

            {/* Filters */}
            <div style={{ ...card, padding:"16px 20px", marginBottom:16, display:"flex", gap:10, flexWrap:"wrap", alignItems:"center" }}>
              <input placeholder="🔍  Search descriptions, categories…" value={filters.search}
                onChange={e => setFilters(f => ({...f, search:e.target.value}))}
                style={{ flex:"1 1 200px", background:"#07101f", border:"1px solid #1e2d47", color:"#e2e8f5", borderRadius:8, padding:"8px 14px", fontSize:13, fontFamily:"Outfit" }} />
              <select value={filters.cat} onChange={e => setFilters(f => ({...f, cat:e.target.value}))}
                style={{ background:"#07101f", border:"1px solid #1e2d47", color:"#e2e8f5", borderRadius:8, padding:"8px 12px", fontSize:13, fontFamily:"Outfit", cursor:"pointer" }}>
                <option value="all">All Categories</option>
                {ALL_CATS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <select value={filters.type} onChange={e => setFilters(f => ({...f, type:e.target.value}))}
                style={{ background:"#07101f", border:"1px solid #1e2d47", color:"#e2e8f5", borderRadius:8, padding:"8px 12px", fontSize:13, fontFamily:"Outfit", cursor:"pointer" }}>
                <option value="all">All Types</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
              {(filters.cat!=="all" || filters.type!=="all" || filters.search) && (
                <button className="hov-btn" onClick={() => setFilters({ cat:"all", type:"all", search:"" })}
                  style={{ background:"rgba(255,64,96,0.1)", color:"#ff4060", border:"1px solid rgba(255,64,96,0.2)", borderRadius:8, padding:"8px 14px", fontSize:12, fontWeight:500, cursor:"pointer", fontFamily:"Outfit" }}>
                  Clear ×
                </button>
              )}
            </div>

            {/* Sort row */}
            <div style={{ display:"flex", gap:8, marginBottom:14 }}>
              <span style={{ fontSize:12, color:"#5a6e8a", alignSelf:"center", marginRight:4 }}>Sort by:</span>
              {[["date","Date"],["amt","Amount"]].map(([f,l]) => (
                <button key={f} className="hov-btn" onClick={() => toggleSort(f)} style={{
                  background: sort.field===f ? "rgba(79,142,247,0.14)" : "#0d1526",
                  color:      sort.field===f ? "#4f8ef7" : "#5a6e8a",
                  border:`1px solid ${sort.field===f ? "rgba(79,142,247,0.3)" : "#1e2d47"}`,
                  borderRadius:8, padding:"6px 14px", fontSize:12, fontWeight:500, cursor:"pointer", fontFamily:"Outfit"
                }}>{l}{sortIcon(f)}</button>
              ))}
            </div>

            {/* Table */}
            <div style={{ ...card, overflow:"hidden" }}>
              {/* Header */}
              <div className="tcols" style={{ display:"grid", gridTemplateColumns:`1fr 1fr 100px 130px${isAdmin?" 80px":""}`, gap:0, padding:"11px 20px", background:"#071020", borderBottom:"1px solid #1e2d47" }}>
                {["Description","Category","Type","Amount", isAdmin?"Actions":""].map(h => (
                  <span key={h} style={{ fontSize:11, color:"#3d4a5c", textTransform:"uppercase", letterSpacing:"0.8px", fontWeight:600 }}>{h}</span>
                ))}
              </div>

              {filtered.length === 0 ? (
                <div style={{ padding:"60px 20px", textAlign:"center" }}>
                  <div style={{ fontSize:44, marginBottom:12 }}>🔍</div>
                  <p style={{ color:"#5a6e8a", fontSize:15, marginBottom:6 }}>No transactions match your filters</p>
                  <p style={{ color:"#3d4a5c", fontSize:13 }}>Try adjusting search or filter criteria</p>
                </div>
              ) : filtered.map(t => (
                <div key={t.id} className="hov-row tcols" style={{ display:"grid", gridTemplateColumns:`1fr 1fr 100px 130px${isAdmin?" 80px":""}`, gap:0, padding:"13px 20px", borderBottom:"1px solid #0d1a2e", alignItems:"center" }}>
                  <div>
                    <p style={{ fontSize:14, fontWeight:500 }}>{t.desc}</p>
                    <p style={{ fontSize:11, color:"#5a6e8a", marginTop:2 }}>{t.date}</p>
                  </div>
                  <div className="thide" style={{ display:"flex", alignItems:"center", gap:6 }}>
                    <span style={{ fontSize:14 }}>{CAT_EMOJI[t.cat] || "📌"}</span>
                    <span style={{ fontSize:12, color:"#8a9ab5", background:"#091020", padding:"3px 9px", borderRadius:6 }}>{t.cat}</span>
                  </div>
                  <span style={{
                    fontSize:11, fontWeight:600, padding:"3px 10px", borderRadius:20, display:"inline-block", width:"fit-content",
                    background: t.type==="income"?"rgba(0,212,161,0.1)":"rgba(255,64,96,0.1)",
                    color:      t.type==="income"?"#00d4a1":"#ff4060",
                    border:`1px solid ${t.type==="income"?"rgba(0,212,161,0.22)":"rgba(255,64,96,0.22)"}`,
                    textTransform:"capitalize"
                  }}>{t.type}</span>
                  <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:14, fontWeight:600, color: t.type==="income"?"#00d4a1":"#ff4060" }}>
                    {t.type==="income"?"+":"-"}{fmt(t.amt)}
                  </span>
                  {isAdmin && (
                    <button className="hov-btn" onClick={() => delTx(t.id)} style={{
                      background:"rgba(255,64,96,0.08)", color:"#ff4060", border:"1px solid rgba(255,64,96,0.15)",
                      borderRadius:6, padding:"4px 10px", fontSize:12, cursor:"pointer", fontFamily:"Outfit"
                    }}>Delete</button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════ INSIGHTS TAB ═══════════ */}
        {tab === "insights" && (
          <div className="fi">
            <div style={{ marginBottom:28 }}>
              <h1 style={{ fontFamily:"Syne", fontSize:28, fontWeight:800 }}>Insights</h1>
              <p style={{ color:"#5a6e8a", fontSize:14, marginTop:4 }}>AI-powered financial analysis</p>
            </div>

            <div className="ig" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20, marginBottom:24 }}>

              {/* Top spending category */}
              <div className="hov-card" style={{ ...card, padding:24, transition:"all 0.22s ease" }}>
                <p style={{ fontSize:11, color:"#5a6e8a", textTransform:"uppercase", letterSpacing:"0.7px", marginBottom:16 }}>🏆 Top Spending Category</p>
                {insights.top ? (<>
                  <p style={{ fontFamily:"Syne", fontSize:26, fontWeight:800, color:"#f0b429", marginBottom:4 }}>{insights.top.name}</p>
                  <p style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:20, color:"#ff4060", marginBottom:14 }}>{fmt(insights.top.value)}</p>
                  <div style={{ background:"#091020", borderRadius:8, height:8, overflow:"hidden" }}>
                    <div style={{ width:`${insights.topPct}%`, height:"100%", background:"linear-gradient(90deg,#f0b429,#ff4060)", borderRadius:8, transition:"width 0.7s ease" }} />
                  </div>
                  <p style={{ fontSize:12, color:"#5a6e8a", marginTop:6 }}>{insights.topPct}% of total expenses</p>
                </>) : <p style={{ color:"#5a6e8a" }}>No data available</p>}
              </div>

              {/* Monthly comparison */}
              <div className="hov-card" style={{ ...card, padding:24, transition:"all 0.22s ease" }}>
                <p style={{ fontSize:11, color:"#5a6e8a", textTransform:"uppercase", letterSpacing:"0.7px", marginBottom:16 }}>📊 Monthly Comparison</p>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:20 }}>
                  <div>
                    <p style={{ fontSize:12, color:"#5a6e8a", marginBottom:5 }}>November</p>
                    <p style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:20 }}>{fmt(insights.novExp)}</p>
                  </div>
                  <div style={{ textAlign:"right" }}>
                    <p style={{ fontSize:12, color:"#5a6e8a", marginBottom:5 }}>December</p>
                    <p style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:20 }}>{fmt(insights.decExp)}</p>
                  </div>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <span style={{ fontSize:22 }}>{Number(insights.change)<0?"📉":"📈"}</span>
                  <div>
                    <p style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:20, fontWeight:700, color: Number(insights.change)<0?"#00d4a1":"#ff4060" }}>
                      {insights.change>0?"+":""}{insights.change}%
                    </p>
                    <p style={{ fontSize:12, color:"#5a6e8a" }}>{Number(insights.change)<0?"Lower":"Higher"} vs last month</p>
                  </div>
                </div>
              </div>

              {/* Monthly averages */}
              <div className="hov-card" style={{ ...card, padding:24, transition:"all 0.22s ease" }}>
                <p style={{ fontSize:11, color:"#5a6e8a", textTransform:"uppercase", letterSpacing:"0.7px", marginBottom:16 }}>📅 Avg Monthly Breakdown</p>
                <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                  {[
                    { label:"Avg Income",  val:insights.avgInc,                  color:"#4f8ef7" },
                    { label:"Avg Expense", val:insights.avgExp,                   color:"#ff4060" },
                    { label:"Avg Savings", val:insights.avgInc-insights.avgExp,   color:"#00d4a1" },
                  ].map(r => (
                    <div key={r.label} style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                        <div style={{ width:10, height:10, borderRadius:"50%", background:r.color }} />
                        <span style={{ fontSize:13, color:"#8a9ab5" }}>{r.label}</span>
                      </div>
                      <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:14, fontWeight:600, color:r.color }}>{fmt(r.val)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Financial health */}
              <div className="hov-card" style={{ ...card, padding:24, transition:"all 0.22s ease" }}>
                <p style={{ fontSize:11, color:"#5a6e8a", textTransform:"uppercase", letterSpacing:"0.7px", marginBottom:16 }}>🎯 Financial Health Score</p>
                <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
                  <div>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                      <span style={{ fontSize:13, color:"#8a9ab5" }}>Savings Rate</span>
                      <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:13, color:"#00d4a1", fontWeight:600 }}>{summary.rate}%</span>
                    </div>
                    <div style={{ background:"#091020", borderRadius:8, height:8, overflow:"hidden" }}>
                      <div style={{ width:`${Math.min(summary.rate,100)}%`, height:"100%", background: Number(summary.rate)>=20?"linear-gradient(90deg,#00d4a1,#4f8ef7)":"linear-gradient(90deg,#f0b429,#ff4060)", borderRadius:8, transition:"width 0.7s ease" }} />
                    </div>
                    <p style={{ fontSize:11, color:"#2e3f5a", marginTop:4 }}>Target: 20%+ recommended</p>
                  </div>
                  <div style={{
                    background: Number(summary.rate)>=20?"rgba(0,212,161,0.08)":"rgba(240,180,41,0.08)",
                    borderRadius:10, padding:"12px 14px",
                    border:`1px solid ${Number(summary.rate)>=20?"rgba(0,212,161,0.15)":"rgba(240,180,41,0.15)"}`
                  }}>
                    <p style={{ fontSize:13, color: Number(summary.rate)>=20?"#00d4a1":"#f0b429", fontWeight:500, lineHeight:1.5 }}>
                      {Number(summary.rate)>=30 ? "🌟 Excellent! You're saving well above target." :
                       Number(summary.rate)>=20 ? "✅ Good rate. On track for financial goals." :
                       Number(summary.rate)>=10 ? "⚠️ Below target. Consider cutting discretionary spend." :
                                                  "🔴 Low savings. Review and reduce expenses urgently."}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Full category breakdown */}
            <div className="hov-card" style={{ ...card, padding:24, transition:"all 0.22s ease" }}>
              <h3 style={{ fontFamily:"Syne", fontSize:16, fontWeight:700, marginBottom:18 }}>Full Category Breakdown</h3>
              {pieData.length === 0 ? (
                <p style={{ color:"#5a6e8a", textAlign:"center", padding:"20px 0" }}>No expense data available</p>
              ) : pieData.map((d,i) => {
                const pct = (d.value / summary.expense * 100).toFixed(1);
                return (
                  <div key={d.name} style={{ marginBottom:14 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                        <span style={{ fontSize:14 }}>{CAT_EMOJI[d.name] || "📌"}</span>
                        <span style={{ fontSize:13, color:"#e2e8f5" }}>{d.name}</span>
                      </div>
                      <div style={{ display:"flex", gap:16, alignItems:"center" }}>
                        <span style={{ fontSize:12, color:"#5a6e8a" }}>{pct}%</span>
                        <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:13, fontWeight:600, color:PIE_COLORS[i%PIE_COLORS.length] }}>{fmt(d.value)}</span>
                      </div>
                    </div>
                    <div style={{ background:"#091020", borderRadius:6, height:6, overflow:"hidden" }}>
                      <div style={{ width:`${pct}%`, height:"100%", background:PIE_COLORS[i%PIE_COLORS.length], borderRadius:6, transition:"width 0.7s ease" }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* ══ ADD TRANSACTION MODAL (Admin only) ═════════════════════════════ */}
      {modal && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.72)", backdropFilter:"blur(10px)", zIndex:300, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
          <div className="fi" style={{ ...card, padding:28, width:"100%", maxWidth:440, boxShadow:"0 24px 70px rgba(0,0,0,0.6)" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
              <h2 style={{ fontFamily:"Syne", fontSize:20, fontWeight:800 }}>Add Transaction</h2>
              <button className="hov-btn" onClick={() => setModal(false)} style={{ background:"#091020", color:"#5a6e8a", border:"1px solid #1e2d47", borderRadius:8, width:32, height:32, fontSize:18, cursor:"pointer" }}>×</button>
            </div>

            {[
              { label:"Date",           key:"date", type:"date"   },
              { label:"Description",    key:"desc", type:"text",   ph:"e.g. Grocery Shopping" },
              { label:"Amount (₹)",     key:"amt",  type:"number", ph:"0.00" },
            ].map(f => (
              <div key={f.key} style={{ marginBottom:16 }}>
                <label style={{ fontSize:11, color:"#5a6e8a", textTransform:"uppercase", letterSpacing:"0.5px", display:"block", marginBottom:6 }}>{f.label}</label>
                <input type={f.type} placeholder={f.ph} value={form[f.key]}
                  onChange={e => setForm(p => ({...p, [f.key]:e.target.value}))}
                  style={{ width:"100%", background:"#070d1a", border:"1px solid #1e2d47", color:"#e2e8f5", borderRadius:8, padding:"10px 14px", fontSize:14, fontFamily:"Outfit" }} />
              </div>
            ))}

            <div style={{ marginBottom:16 }}>
              <label style={{ fontSize:11, color:"#5a6e8a", textTransform:"uppercase", letterSpacing:"0.5px", display:"block", marginBottom:6 }}>Type</label>
              <div style={{ display:"flex", gap:8 }}>
                {["income","expense"].map(t => (
                  <button key={t} className="hov-btn" onClick={() => setForm(p => ({...p, type:t, cat: t==="income"?"Salary":"Food & Dining"}))} style={{
                    flex:1, background: form.type===t ? (t==="income"?"rgba(0,212,161,0.14)":"rgba(255,64,96,0.14)") : "#091020",
                    color:      form.type===t ? (t==="income"?"#00d4a1":"#ff4060") : "#5a6e8a",
                    border:`1px solid ${form.type===t ? (t==="income"?"rgba(0,212,161,0.28)":"rgba(255,64,96,0.28)") : "#1e2d47"}`,
                    borderRadius:8, padding:"9px", fontSize:13, fontWeight:500, cursor:"pointer", textTransform:"capitalize", fontFamily:"Outfit"
                  }}>{t}</button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom:24 }}>
              <label style={{ fontSize:11, color:"#5a6e8a", textTransform:"uppercase", letterSpacing:"0.5px", display:"block", marginBottom:6 }}>Category</label>
              <select value={form.cat} onChange={e => setForm(p => ({...p, cat:e.target.value}))} style={{
                width:"100%", background:"#070d1a", border:"1px solid #1e2d47", color:"#e2e8f5",
                borderRadius:8, padding:"10px 14px", fontSize:14, fontFamily:"Outfit", cursor:"pointer"
              }}>
                {(form.type==="income" ? INC_CATS : EXP_CATS).map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div style={{ display:"flex", gap:12 }}>
              <button className="hov-btn" onClick={() => setModal(false)} style={{
                flex:1, background:"#091020", color:"#5a6e8a", border:"1px solid #1e2d47",
                borderRadius:10, padding:"12px", fontSize:14, fontWeight:500, cursor:"pointer", fontFamily:"Outfit"
              }}>Cancel</button>
              <button className="hov-btn" onClick={addTx} style={{
                flex:2, background:"linear-gradient(135deg,#00d4a1,#4f8ef7)", color:"#04080f",
                border:"none", borderRadius:10, padding:"12px", fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:"Outfit"
              }}>Add Transaction ✓</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}