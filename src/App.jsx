import { useState, useMemo, useEffect, useRef } from "react";

/* ── Palette ── */
const C = {
  pri: "#8B1A2B", priDark: "#6b0f1e", priLight: "#a93545",
  priSoft: "#f5dde2", priTint: "rgba(139,26,43,0.06)",
  text: "#3c2025", textSec: "#7a4a52", textMuted: "#a8757e",
  border: "#e8d0d5", bg: "#fff", bgSub: "#fff",
  free: "rgba(34,197,94,0.08)", freeBorder: "rgba(34,197,94,0.2)",
  kyle: "#89CFF0", kyleBg: "rgba(137,207,240,0.18)",
  luka: "#8B1A2B", lukaBg: "rgba(139,26,43,0.12)",
  // Nav drawer (dark like Google Calendar)
  nav: "#2d2d2d", navText: "#e0e0e0", navMuted: "#999",
  navHover: "#3a3a3a", navActive: "#1a73e8",
};

const PERSON_COLORS = {
  kyle: { chip: C.kyle, soft: C.kyleBg, label: "Kyle" },
  luka: { chip: C.luka, soft: C.lukaBg, label: "Luka" },
};

const EVENTS = [
  { date: "2026-02-02", title: "KT / Dr. Arthur", venue: "USC", status: "confirmed", time: "12:30pm", person: "kyle" },
  { date: "2026-02-02", title: "Tutoring - Noah", venue: "USC", status: "confirmed", time: "5:00pm", person: "kyle" },
  { date: "2026-02-03", title: "WRIT 340: Submit Student Profile", venue: "USC", status: "confirmed", time: "11:45pm", person: "kyle" },
  { date: "2026-02-04", title: "USC HOLD - TRE", venue: "USC", status: "confirmed", time: "2:00pm", person: "kyle" },
  { date: "2026-02-04", title: "Tutoring - Kenne", venue: "USC", status: "confirmed", time: "5:00pm", person: "kyle" },
  { date: "2026-02-05", title: "KT / Devon - Therapy", venue: "USC", status: "confirmed", time: "1:00pm", person: "kyle" },
  { date: "2026-02-05", title: "WRIT 340: Email Illumin Topics", venue: "USC", status: "confirmed", time: "11:45pm", person: "kyle" },
  { date: "2026-02-05", title: "Illumin Oral Pres", venue: "USC", status: "confirmed", time: "11:59pm", person: "kyle" },
  { date: "2026-02-06", title: "RED 469: Mix", venue: "USC", status: "confirmed", time: "9:00am", person: "kyle" },
  { date: "2026-02-06", title: "Tutoring - Erwin", venue: "USC", status: "confirmed", time: "1:00pm", person: "kyle" },
  { date: "2026-02-08", title: "Tiki Disco Winter", venue: "Knockdown Center, BK", status: "confirmed", time: "10:00pm", person: "kyle" },
  { date: "2026-02-09", title: "KT / Meina", venue: "USC", status: "confirmed", time: "2:00pm", person: "kyle" },
  { date: "2026-02-10", title: "KT / SkinFX", venue: "USC", status: "confirmed", time: "10:30am", person: "kyle" },
  { date: "2026-02-12", title: "RawCuts", venue: "Secret Location, BK", status: "confirmed", time: "10:00pm", person: "kyle" },
  { date: "2026-02-12", title: "WRIT 340: Submit Illumin Rough Draft", venue: "USC", status: "confirmed", time: "11:45pm", person: "kyle" },
  { date: "2026-02-13", title: "RED 469: Mix", venue: "USC", status: "confirmed", time: "9:00am", person: "kyle" },
  { date: "2026-02-13", title: "Spring 26 Commencement", venue: "USC", status: "confirmed", time: "10:00pm", person: "luka" },
  { date: "2026-02-13", title: "Observational Analysis", venue: "USC", status: "confirmed", time: "11:59pm", person: "kyle" },
  { date: "2026-02-14", title: "Valentine's Day", venue: "", status: "confirmed", time: "All day", person: "luka" },
  { date: "2026-02-16", title: "Presidents' Day", venue: "", status: "confirmed", time: "All day", person: "luka" },
  { date: "2026-02-16", title: "TREA E-Board Meeting", venue: "USC", status: "confirmed", time: "3:00pm", person: "kyle" },
  { date: "2026-02-17", title: "WRIT 340: Illumin Oral Pres", venue: "USC", status: "confirmed", time: "5:00pm", person: "kyle" },
  { date: "2026-02-18", title: "Dining Society Dinner", venue: "USC", status: "confirmed", time: "6:30pm", person: "luka" },
  { date: "2026-02-18", title: "Final Draft Illumin", venue: "USC", status: "confirmed", time: "11:59pm", person: "kyle" },
  { date: "2026-02-19", title: "KT / Ray", venue: "USC", status: "confirmed", time: "10:30am", person: "kyle" },
  { date: "2026-02-19", title: "WRIT 340: Submit Illumin Final Draft", venue: "USC", status: "confirmed", time: "11:45pm", person: "kyle" },
  { date: "2026-02-20", title: "Bedouin", venue: "Capitale, NY", status: "tentative", time: "10:00pm", person: "luka" },
  { date: "2026-02-20", title: "RED 469: Mix", venue: "USC", status: "confirmed", time: "9:00am", person: "kyle" },
  { date: "2026-02-21", title: "Cassion", venue: "Navy Yard, BK", status: "confirmed", time: "10:00pm", person: "luka" },
  { date: "2026-02-22", title: "Project Angel Food", venue: "USC", status: "confirmed", time: "12:45pm", person: "luka" },
  { date: "2026-02-24", title: "Resume Review", venue: "USC", status: "tentative", time: "6:30pm", person: "kyle" },
  { date: "2026-02-25", title: "Dining Society Dinner", venue: "USC", status: "confirmed", time: "6:30pm", person: "luka" },
  { date: "2026-02-26", title: "Lever Friends Hangout", venue: "USC", status: "confirmed", time: "6:00pm", person: "luka" },
  { date: "2026-02-27", title: "RED 469: Mix", venue: "USC", status: "confirmed", time: "9:00am", person: "kyle" },
  { date: "2026-03-01", title: "Tiki Disco Winter", venue: "Knockdown Center, BK", status: "confirmed", time: "10:00pm", person: "kyle" },
  { date: "2026-03-20", title: "Prospa b2b Josh Baker", venue: "Navy Yard, BK", status: "tentative", time: "10:00pm", person: "luka" },
  { date: "2026-03-21", title: "Carl Cox", venue: "Navy Yard, BK", status: "tentative", time: "10:00pm", person: "luka" },
  { date: "2026-04-03", title: "SiDEPiECE", venue: "Navy Yard, BK", status: "tentative", time: "10:00pm", person: "luka" },
  { date: "2026-04-20", title: "Hot Since 82", venue: "House of Yes, BK", status: "confirmed", time: "10:00pm", person: "luka" },
  { date: "2026-04-25", title: "CID", venue: "99 Scott, BK", status: "confirmed", time: "10:00pm", person: "kyle" },
  { date: "2026-05-23", title: "Solomun", venue: "Fulton Fish Market, QE", status: "confirmed", time: "10:00pm", person: "luka" },
  { date: "2026-06-20", title: "Beltran", venue: "Navy Yard, BK", status: "tentative", time: "10:00pm", person: "luka" },
  { date: "2026-07-25", title: "Klangkunsler", venue: "Monegros Desert Festival, Frogo, SP", status: "confirmed", time: "All day", person: "luka" },
];

const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAY_HEADERS = ["SUN","MON","TUE","WED","THU","FRI","SAT"];
const MINI_DAYS = ["S","M","T","W","T","F","S"];
const SHORT_MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const VIEW_OPTIONS = [
  { key: "schedule", label: "Schedule", icon: "M3 4h18v2H3zm0 7h12v2H3zm0 7h18v2H3z" },
  { key: "day", label: "Day", icon: "M4 4h4v4H4zm0 6h4v4H4zm0 6h4v4H4z" },
  { key: "3day", label: "3 Day", icon: "M4 4h4v16H4zm6 0h4v16h-4zm6 0h4v16h-4z" },
  { key: "week", label: "Week", icon: "M3 4h2v16H3zm4 0h2v16H7zm4 0h2v16h-2zm4 0h2v16h-2zm4 0h2v16h-2z" },
  { key: "month", label: "Month", icon: "M4 5h16v14H4zm0 4h16M8 5v14m4-14v14" },
];

function getDaysInMonth(y, m) { return new Date(y, m + 1, 0).getDate(); }
function getFirstDay(y, m) { return new Date(y, m, 1).getDay(); }
function fmtKey(y, m, d) { return `${y}-${String(m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`; }

const eventMap = {};
EVENTS.forEach(e => { if (!eventMap[e.date]) eventMap[e.date] = []; eventMap[e.date].push(e); });

export default function App() {
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(1);
  const [selected, setSelected] = useState(null);
  const [hovered, setHovered] = useState(null);
  const [personFilter, setPersonFilter] = useState({ kyle: true, luka: true });
  const [navOpen, setNavOpen] = useState(false);
  const [mobileView, setMobileView] = useState("month");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const navRef = useRef(null);

  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  // Close nav on outside tap
  useEffect(() => {
    if (!navOpen) return;
    const h = (e) => { if (navRef.current && !navRef.current.contains(e.target)) setNavOpen(false); };
    document.addEventListener('mousedown', h);
    document.addEventListener('touchstart', h);
    return () => { document.removeEventListener('mousedown', h); document.removeEventListener('touchstart', h); };
  }, [navOpen]);

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDay(year, month);
  const prevMonthDays = getDaysInMonth(year, month === 0 ? 11 : month - 1);
  const prev = () => { if (month === 0) { setMonth(11); setYear(y=>y-1); } else setMonth(m=>m-1); setSelected(null); };
  const next = () => { if (month === 11) { setMonth(0); setYear(y=>y+1); } else setMonth(m=>m+1); setSelected(null); };
  const today = new Date();
  const isToday = (d) => today.getFullYear() === year && today.getMonth() === month && today.getDate() === d;
  const todayCol = today.getFullYear() === year && today.getMonth() === month ? today.getDay() : -1;

  const cells = useMemo(() => {
    const c = [];
    for (let i = 0; i < firstDay; i++) c.push({ day: prevMonthDays - firstDay + 1 + i, current: false });
    for (let d = 1; d <= daysInMonth; d++) c.push({ day: d, current: true });
    // Only pad to fill the last row, not always 42
    const rowsNeeded = Math.ceil(c.length / 7);
    const total = rowsNeeded * 7;
    const rem = total - c.length;
    for (let i = 1; i <= rem; i++) c.push({ day: i, current: false });
    return c;
  }, [firstDay, daysInMonth, prevMonthDays]);
  const gridRows = Math.ceil(cells.length / 7);

  const miniCells = useMemo(() => {
    const c = []; for (let i = 0; i < firstDay; i++) c.push(null);
    for (let d = 1; d <= daysInMonth; d++) c.push(d); return c;
  }, [firstDay, daysInMonth]);

  const getFilteredEvents = (key) => {
    const evs = eventMap[key] || [];
    return evs.filter(e => personFilter[e.person]);
  };
  const hasEvent = (d) => getFilteredEvents(fmtKey(year, month, d)).length > 0;

  const togglePerson = (p) => setPersonFilter(prev => ({ ...prev, [p]: !prev[p] }));

  const kyleCount = EVENTS.filter(e => e.person === "kyle").length;
  const lukaCount = EVENTS.filter(e => e.person === "luka").length;
  const confirmed = EVENTS.filter(e => e.status === "confirmed").length;
  const tentative = EVENTS.filter(e => e.status === "tentative").length;

  // Schedule view: sorted list of events for current month
  const scheduleEvents = useMemo(() => {
    const evs = [];
    for (let d = 1; d <= daysInMonth; d++) {
      const key = fmtKey(year, month, d);
      const filtered = getFilteredEvents(key);
      filtered.forEach(e => evs.push({ ...e, dayNum: d }));
    }
    return evs;
  }, [year, month, daysInMonth, personFilter]);

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;700&family=Roboto:wght@300;400;500&display=swap" rel="stylesheet" />
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
        body { overflow-x: hidden; }
        .nav-overlay {
          position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 200;
          background: rgba(0,0,0,${navOpen ? 0.5 : 0}); transition: background 0.3s;
          pointer-events: ${navOpen ? 'auto' : 'none'};
        }
        .nav-drawer {
          position: fixed; top: 0; left: 0; bottom: 0; width: 280px; z-index: 201;
          background: ${C.nav}; transform: translateX(${navOpen ? 0 : -280}px);
          transition: transform 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
          display: flex; flex-direction: column; overflow-y: auto;
          box-shadow: ${navOpen ? '4px 0 24px rgba(0,0,0,0.4)' : 'none'};
        }
        .nav-item {
          display: flex; align-items: center; gap: 20px; padding: 14px 24px;
          font-size: 14px; font-weight: 500; color: ${C.navText}; cursor: pointer;
          border: none; background: none; width: 100%; text-align: left;
          font-family: 'Google Sans', sans-serif; transition: background 0.15s;
          border-radius: 0 24px 24px 0; margin-right: 8px;
        }
        .nav-item:hover, .nav-item:active { background: ${C.navHover}; }
        .nav-item.active { background: rgba(26,115,232,0.2); color: #8ab4f8; }
        .nav-sep { height: 1px; background: #444; margin: 8px 0; }
        .nav-check {
          width: 18px; height: 18px; border-radius: 3px; display: flex;
          align-items: center; justify-content: center; flex-shrink: 0; cursor: pointer;
        }
        .nav-check svg { width: 12px; height: 12px; }
        .hamburger, .top-btn {
          cursor: pointer; border: none; background: none; color: ${C.textSec}; padding: 8px; border-radius: 50%; transition: background 0.15s;
        }
        .hamburger:active, .top-btn:active { background: ${C.priSoft}; }
        .month-tabs { display: flex; gap: 8px; padding: 4px 16px 8px; overflow-x: auto; scrollbar-width: none; }
        .month-tabs::-webkit-scrollbar { display: none; }
        .month-tab {
          font-family: 'Google Sans', sans-serif; font-size: 13px; font-weight: 500;
          padding: 5px 14px; border-radius: 20px; border: 1px solid ${C.border};
          background: #fff; color: ${C.textSec}; cursor: pointer; white-space: nowrap; transition: all 0.15s;
        }
        .month-tab.active { background: ${C.pri}; color: #fff; border-color: ${C.pri}; }
        .person-chip {
          font-family: 'Google Sans', sans-serif; font-size: 12px; font-weight: 500;
          padding: 5px 14px; border-radius: 20px; border: 1.5px solid ${C.border};
          background: #fff; cursor: pointer; white-space: nowrap; transition: all 0.15s;
          display: inline-flex; align-items: center; gap: 6px;
        }
      `}</style>

      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", fontFamily: "'Google Sans','Segoe UI',Roboto,sans-serif", background: "#fff", color: C.text, maxWidth: isMobile ? "100%" : "none", margin: "0 auto" }}>

        {/* ═══ MOBILE NAV DRAWER ═══ */}
        {isMobile && <>
          <div className="nav-overlay" onClick={() => setNavOpen(false)} />
          <div className="nav-drawer" ref={navRef}>
            {/* Header */}
            <div style={{ padding: "20px 24px 12px", display: "flex", alignItems: "center", gap: 12 }}>
              <svg width="32" height="32" viewBox="0 0 36 36">
                <rect width="36" height="36" rx="4" fill={C.pri}/>
                <text x="18" y="25" textAnchor="middle" fill="#fff" fontSize="16" fontWeight="700" fontFamily="Google Sans">{today.getDate()}</text>
              </svg>
              <div>
                <div style={{ fontSize: 18, fontWeight: 500, color: "#fff" }}>Kyle & Luka's</div>
                <div style={{ fontSize: 13, color: C.navMuted }}>Calendar</div>
              </div>
            </div>

            <div className="nav-sep" />

            {/* View options */}
            {VIEW_OPTIONS.map(v => (
              <button key={v.key} className={`nav-item ${mobileView === v.key ? 'active' : ''}`}
                onClick={() => { setMobileView(v.key); setNavOpen(false); }}>
                <svg width="20" height="20" fill="none" stroke={mobileView === v.key ? "#8ab4f8" : C.navMuted} strokeWidth="2" viewBox="0 0 24 24">
                  <path d={v.icon}/>
                </svg>
                {v.label}
              </button>
            ))}

            <div className="nav-sep" />

            {/* Person toggles */}
            <div style={{ padding: "8px 24px 4px", fontSize: 11, fontWeight: 500, color: C.navMuted, textTransform: "uppercase", letterSpacing: 1 }}>People</div>
            {[["kyle","Kyle",C.kyle],["luka","Luka",C.luka]].map(([k,label,color]) => (
              <button key={k} className="nav-item" onClick={() => togglePerson(k)} style={{ padding: "10px 24px" }}>
                <div className="nav-check" style={{ background: personFilter[k] ? color : "transparent", border: personFilter[k] ? "none" : `2px solid ${C.navMuted}` }}>
                  {personFilter[k] && <svg viewBox="0 0 24 24" fill="none" stroke={k === "kyle" ? "#333" : "#fff"} strokeWidth="3"><path d="M5 13l4 4L19 7"/></svg>}
                </div>
                <span>{label}</span>
                <span style={{ marginLeft: "auto", fontSize: 11, color: C.navMuted }}>
                  {k === "kyle" ? kyleCount : lukaCount}
                </span>
              </button>
            ))}

            <div className="nav-sep" />

            {/* Status section */}
            <div style={{ padding: "8px 24px 4px", fontSize: 11, fontWeight: 500, color: C.navMuted, textTransform: "uppercase", letterSpacing: 1 }}>Status</div>
            <div style={{ padding: "6px 24px", display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 13, color: C.navText }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.pri }}/> Confirmed · {confirmed}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 13, color: C.navText }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", border: `2px solid ${C.navMuted}` }}/> Tentative · {tentative}
              </div>
            </div>

            <div className="nav-sep" />

            {/* Semester info */}
            <div style={{ padding: "12px 24px", fontSize: 12, color: C.navMuted }}>
              <div style={{ fontWeight: 500 }}>Semester: Feb – Jul 2026</div>
              <div style={{ marginTop: 2 }}>{EVENTS.length} events total</div>
            </div>
          </div>
        </>}

        {/* ═══ MOBILE TOP BAR ═══ */}
        {isMobile && (
          <>
            <div style={{ display: "flex", alignItems: "center", padding: "8px 12px", gap: 8 }}>
              <button className="hamburger" onClick={() => setNavOpen(true)}>
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
                </svg>
              </button>
              <div style={{ fontSize: 20, fontWeight: 400, flex: 1, color: C.pri }}>{MONTH_NAMES[month]} {year}</div>
              <button className="top-btn" onClick={() => { setYear(today.getFullYear()); setMonth(today.getMonth()); }}>
                <svg width="20" height="20" fill={C.pri} viewBox="0 0 24 24">
                  <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z"/>
                  <text x="12" y="17" textAnchor="middle" fontSize="9" fontWeight="700" fill={C.pri}>{today.getDate()}</text>
                </svg>
              </button>
            </div>
            <div className="month-tabs">
              {SHORT_MONTHS.map((m, i) => (
                <button key={i} className={`month-tab ${i === month ? 'active' : ''}`} onClick={() => setMonth(i)}>{m}</button>
              ))}
            </div>
          </>
        )}

        {/* ═══ DESKTOP TOP BAR ═══ */}
        {!isMobile && (
          <div style={{ display: "flex", alignItems: "center", padding: "8px 16px", borderBottom: `1px solid ${C.border}`, flexShrink: 0, gap: 16, height: 64 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <svg width="36" height="36" viewBox="0 0 36 36" style={{ flexShrink: 0 }}>
                <rect width="36" height="36" rx="4" fill={C.pri}/>
                <text x="18" y="25" textAnchor="middle" fill="#fff" fontSize="18" fontWeight="700" fontFamily="Google Sans">{today.getDate()}</text>
              </svg>
              <span style={{ fontSize: 22, fontWeight: 400, color: C.text }}>Kyle & Luka's Calendar</span>
            </div>
            <button onClick={() => { setYear(today.getFullYear()); setMonth(today.getMonth()); }} style={{ border: `1px solid ${C.border}`, borderRadius: 4, padding: "6px 20px", background: "#fff", fontSize: 14, fontWeight: 500, color: C.pri, cursor: "pointer", marginLeft: 16 }}>Today</button>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <button onClick={prev} style={{ background: "none", border: "none", cursor: "pointer", padding: 8, borderRadius: "50%", display: "flex", alignItems: "center", color: C.textSec, fontSize: 20 }}>‹</button>
              <button onClick={next} style={{ background: "none", border: "none", cursor: "pointer", padding: 8, borderRadius: "50%", display: "flex", alignItems: "center", color: C.textSec, fontSize: 20 }}>›</button>
            </div>
            <span style={{ fontSize: 22, fontWeight: 400, color: C.text }}>{MONTH_NAMES[month]} {year}</span>
            <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
              {[["kyle","Kyle",C.kyle],["luka","Luka",C.luka]].map(([k,v,color]) => (
                <button key={k} className="person-chip" onClick={() => togglePerson(k)} style={{
                  background: personFilter[k] ? color : "#fff",
                  color: personFilter[k] ? (k === "kyle" ? "#333" : "#fff") : C.textSec,
                  borderColor: personFilter[k] ? "transparent" : C.border,
                }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: personFilter[k] ? (k === "kyle" ? "#333" : "#fff") : color, display: "inline-block" }} />
                  {v}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ═══ BODY ═══ */}
        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

          {/* SIDEBAR - Desktop only */}
          {!isMobile && (
            <div style={{ width: 256, borderRight: `1px solid ${C.border}`, padding: "16px 12px", overflowY: "auto", flexShrink: 0, background: C.bgSub }}>
              {/* Mini Calendar */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 8px", marginBottom: 8 }}>
                  <span style={{ fontSize: 14, fontWeight: 500, color: C.text }}>{MONTH_NAMES[month]} {year}</span>
                  <div style={{ display: "flex", gap: 2 }}>
                    <button onClick={prev} style={{ background: "none", border: "none", cursor: "pointer", color: C.textSec, fontSize: 16, padding: 4 }}>‹</button>
                    <button onClick={next} style={{ background: "none", border: "none", cursor: "pointer", color: C.textSec, fontSize: 16, padding: 4 }}>›</button>
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 0, textAlign: "center" }}>
                  {MINI_DAYS.map((d, i) => <div key={i} style={{ fontSize: 10, color: C.textMuted, padding: "4px 0", fontWeight: 500 }}>{d}</div>)}
                  {miniCells.map((d, i) => {
                    const t = d && isToday(d);
                    const ev = d && hasEvent(d);
                    return (
                      <div key={i} onClick={() => d && ev && setSelected(fmtKey(year, month, d))} style={{
                        fontSize: 11, cursor: ev ? "pointer" : "default", position: "relative",
                        borderRadius: "50%", width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto",
                        background: t ? C.pri : "transparent", color: t ? "#fff" : C.text, fontWeight: t || ev ? 600 : 400,
                      }}>
                        {d || ""}
                        {ev && !t && <div style={{ position: "absolute", bottom: 0, width: 4, height: 4, borderRadius: "50%", background: C.pri }} />}
                      </div>
                    );
                  })}
                </div>
              </div>
              {/* Person Legend */}
              <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 500, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 12, padding: "0 8px" }}>By Person</div>
                <div style={{ padding: "0 8px", display: "flex", flexDirection: "column", gap: 6 }}>
                  {[["kyle","Kyle",C.kyle,kyleCount],["luka","Luka",C.luka,lukaCount]].map(([k,label,color,count]) => (
                    <div key={k} onClick={() => togglePerson(k)} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", padding: "4px 0" }}>
                      <div style={{ width: 10, height: 10, borderRadius: "50%", background: personFilter[k] ? color : "transparent", border: personFilter[k] ? "none" : `2px solid ${C.textMuted}`, flexShrink: 0 }} />
                      <span style={{ fontSize: 12, color: C.text, flex: 1, fontWeight: personFilter[k] ? 500 : 400, opacity: personFilter[k] ? 1 : 0.5 }}>{label}</span>
                      <span style={{ fontSize: 11, color: C.textMuted }}>{count}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Status */}
              <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 16, marginTop: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 500, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 12, padding: "0 8px" }}>Status</div>
                <div style={{ padding: "0 8px", display: "flex", flexDirection: "column", gap: 6 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.pri }} />
                    <span style={{ fontSize: 12, color: C.text }}>Confirmed · <strong>{confirmed}</strong></span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", border: `2px solid ${C.textMuted}`, background: "transparent" }} />
                    <span style={{ fontSize: 12, color: C.text }}>Tentative · <strong>{tentative}</strong></span>
                  </div>
                </div>
              </div>
              <div style={{ borderTop: `1px solid ${C.border}`, marginTop: 16, paddingTop: 16, padding: "16px 8px 0" }}>
                <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 4 }}>Semester</div>
                <div style={{ fontSize: 13, color: C.text }}>Feb – Jul 2026</div>
                <div style={{ fontSize: 12, color: C.textSec, marginTop: 2 }}>{EVENTS.length} events total</div>
              </div>
              <div style={{ borderTop: `1px solid ${C.border}`, marginTop: 16, paddingTop: 16, padding: "16px 8px 0" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 12, height: 12, borderRadius: 2, background: C.free, border: `1px solid ${C.freeBorder}`, flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: C.textSec, fontWeight: 450 }}>✈ Free weekends</span>
                </div>
              </div>
            </div>
          )}

          {/* ═══ MAIN CONTENT ═══ */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

            {/* SCHEDULE VIEW (mobile only) */}
            {isMobile && mobileView === "schedule" && (
              <div style={{ flex: 1, overflowY: "auto", padding: "0 0 80px" }}>
                {scheduleEvents.length === 0 && (
                  <div style={{ textAlign: "center", padding: 40, color: C.textMuted, fontSize: 14 }}>No events this month</div>
                )}
                {scheduleEvents.map((ev, i) => {
                  const pc = PERSON_COLORS[ev.person] || PERSON_COLORS.kyle;
                  const showDate = i === 0 || scheduleEvents[i-1].dayNum !== ev.dayNum;
                  const dateObj = new Date(ev.date + "T12:00:00");
                  return (
                    <div key={i}>
                      {showDate && (
                        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 16px 6px" }}>
                          <div style={{
                            width: 40, textAlign: "center",
                            color: isToday(ev.dayNum) ? C.pri : C.text,
                          }}>
                            <div style={{ fontSize: 11, fontWeight: 500, color: C.textMuted }}>{dateObj.toLocaleDateString("en-US",{weekday:"short"}).toUpperCase()}</div>
                            <div style={{
                              fontSize: 22, fontWeight: isToday(ev.dayNum) ? 700 : 400,
                              width: isToday(ev.dayNum) ? 36 : "auto", height: isToday(ev.dayNum) ? 36 : "auto",
                              borderRadius: "50%", background: isToday(ev.dayNum) ? C.pri : "transparent",
                              color: isToday(ev.dayNum) ? "#fff" : C.text,
                              display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto",
                            }}>{ev.dayNum}</div>
                          </div>
                          <div style={{ flex: 1, height: 1, background: C.border }} />
                        </div>
                      )}
                      <div onClick={() => setSelected(ev.date)} style={{
                        display: "flex", alignItems: "center", gap: 12, padding: "10px 16px 10px 68px", cursor: "pointer",
                      }}>
                        <div style={{ width: 4, height: 36, borderRadius: 2, background: pc.chip, flexShrink: 0 }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 14, fontWeight: 500, color: C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ev.title}</div>
                          <div style={{ fontSize: 12, color: C.textSec }}>{ev.time}{ev.venue ? ` · ${ev.venue}` : ""}</div>
                        </div>
                        <div style={{ fontSize: 10, fontWeight: 500, color: pc.chip, background: pc.soft, padding: "2px 8px", borderRadius: 10, flexShrink: 0 }}>{pc.label}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* MONTH GRID VIEW */}
            {(!isMobile || mobileView === "month") && <>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", borderBottom: `1px solid ${C.border}`, flexShrink: 0, padding: isMobile ? "0 2px" : "0" }}>
                {(isMobile ? MINI_DAYS : DAY_HEADERS).map((d, i) => (
                  <div key={d+i} style={{ textAlign: "center", fontSize: 11, fontWeight: 500, color: i === todayCol && isMobile ? C.pri : C.textMuted, padding: "6px 0", letterSpacing: "0.8px" }}>{d}</div>
                ))}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gridTemplateRows: `repeat(${gridRows}, 1fr)`, flex: 1, padding: isMobile ? "0 2px" : "0" }}>
                {cells.map((cell, i) => {
                  const key = cell.current ? fmtKey(year, month, cell.day) : null;
                  const events = key ? getFilteredEvents(key) : [];
                  const t = cell.current && isToday(cell.day);
                  const isSelected = key && selected === key;
                  const hasEv = events.length > 0;
                  const isWeekend = i % 7 === 0 || i % 7 === 6;
                  const isFreeWeekend = cell.current && isWeekend && !hasEv;
                  const isInTodayCol = (i % 7) === todayCol && isMobile;
                  const cellBg = isSelected ? C.priSoft : isInTodayCol ? C.priTint : hasEv && !isMobile ? C.priTint : isFreeWeekend ? C.free : "#fff";
                  return (
                    <div key={i} onClick={() => key && events.length && setSelected(isSelected ? null : key)} style={{
                      borderRight: (i + 1) % 7 !== 0 ? `1px solid ${C.border}` : "none",
                      borderBottom: `1px solid ${C.border}`, padding: isMobile ? "1px" : "4px 8px",
                      background: cellBg,
                      borderLeft: hasEv && !isMobile ? `3px solid ${PERSON_COLORS[events[0]?.person]?.chip || C.pri}` : isFreeWeekend ? `2px solid ${C.freeBorder}` : "none",
                      cursor: events.length ? "pointer" : "default", minHeight: isMobile ? "56px" : 0,
                      overflow: "hidden", transition: "background 0.15s", opacity: cell.current ? 1 : 0.35,
                    }}>
                      <div style={{ marginBottom: 2, textAlign: isMobile ? "center" : "left" }}>
                        <span style={{
                          fontSize: 12, fontWeight: 500, display: "inline-flex", alignItems: "center", justifyContent: "center",
                          width: t ? (isMobile ? 24 : 26) : "auto", height: t ? (isMobile ? 24 : 26) : "auto",
                          borderRadius: "50%", background: t ? C.pri : "transparent",
                          color: t ? "#fff" : cell.current ? C.text : C.textMuted,
                        }}>{cell.day}</span>
                      </div>
                      {isFreeWeekend && (
                        <div style={{ fontSize: isMobile ? 7 : 9, fontWeight: 500, color: C.textMuted, background: C.free, border: `1px solid ${C.freeBorder}`, borderRadius: 3, padding: isMobile ? "0px 3px" : "1px 5px", marginBottom: 2, display: "inline-block" }}>✈ free</div>
                      )}
                      {events.map((ev, j) => {
                        const pc = PERSON_COLORS[ev.person] || PERSON_COLORS.kyle;
                        const isTentative = ev.status === "tentative";
                        return (
                          <div key={j} onMouseEnter={() => !isMobile && setHovered(`${key}-${j}`)} onMouseLeave={() => !isMobile && setHovered(null)}
                            style={{
                              fontSize: isMobile ? 9 : 11, fontWeight: 500, color: ev.person === "kyle" ? "#2c3e50" : "#fff", background: pc.chip,
                              borderRadius: isMobile ? 2 : 4, padding: isMobile ? "1.5px 3px" : "2px 6px",
                              margin: isMobile ? "0.5px 1px" : "0 0 2px 0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", display: "block",
                              opacity: hovered === `${key}-${j}` ? 0.85 : isTentative ? 0.7 : 1, transition: "opacity 0.15s",
                            }}>
                            {!isMobile && <span style={{ fontSize: 10, marginRight: 3, opacity: 0.75 }}>{ev.time}</span>}
                            {ev.title}
                            {isTentative && !isMobile && <span style={{ marginLeft: 4, fontSize: 9 }}>❓</span>}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </>}

            {/* DAY / 3-DAY / WEEK placeholder views (mobile) */}
            {isMobile && (mobileView === "day" || mobileView === "3day" || mobileView === "week") && (
              <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 40 }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>📅</div>
                  <div style={{ fontSize: 16, fontWeight: 500, color: C.text, marginBottom: 4 }}>{mobileView.charAt(0).toUpperCase() + mobileView.slice(1)} View</div>
                  <div style={{ fontSize: 13, color: C.textMuted }}>Coming soon — use Month or Schedule for now</div>
                </div>
              </div>
            )}

          </div>
        </div>




        {/* EVENT DETAIL POPUP */}
        {selected && getFilteredEvents(selected).length > 0 && (
          <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, display: "flex", alignItems: isMobile ? "flex-end" : "center", justifyContent: "center", background: "rgba(60,20,25,0.35)", zIndex: 150 }} onClick={() => setSelected(null)}>
            <div onClick={e => e.stopPropagation()} style={{
              background: "#fff", borderRadius: isMobile ? "16px 16px 0 0" : 12, padding: 0,
              width: isMobile ? "100%" : "auto", minWidth: isMobile ? "100%" : 380, maxWidth: isMobile ? "100%" : 460,
              maxHeight: isMobile ? "70vh" : "80vh", overflowY: "auto",
              boxShadow: "0 -4px 24px rgba(139,26,43,0.18)",
            }}>
              {/* Drag handle on mobile */}
              {isMobile && <div style={{ display: "flex", justifyContent: "center", padding: "10px 0 4px" }}><div style={{ width: 36, height: 4, borderRadius: 2, background: C.border }} /></div>}
              {getFilteredEvents(selected).map((ev, i) => {
                const isTentative = ev.status === "tentative";
                const pc = PERSON_COLORS[ev.person] || PERSON_COLORS.kyle;
                const evList = getFilteredEvents(selected);
                return (
                  <div key={i}>
                    <div style={{ height: 4, background: pc.chip, margin: isMobile ? "0 16px" : 0, borderRadius: isMobile ? 2 : 0 }} />
                    <div style={{ padding: isMobile ? "16px 20px" : "20px 24px", borderBottom: i < evList.length - 1 ? `1px solid ${C.border}` : "none" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                        <span style={{ fontSize: isMobile ? 18 : 22, fontWeight: 400, color: C.text, flex: 1 }}>{ev.title}</span>
                        <span style={{ fontSize: 11, fontWeight: 500, padding: "3px 10px", borderRadius: 12, background: pc.soft, color: pc.chip }}>{pc.label}</span>
                      </div>
                      <div style={{ fontSize: 13, color: C.textSec, lineHeight: 1.8 }}>
                        <div>{new Date(ev.date + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</div>
                        <div>🕐 {ev.time}</div>
                        {ev.venue && <div>📍 {ev.venue}</div>}
                        <div style={{ marginTop: 6 }}>
                          <span style={{ fontSize: 11, fontWeight: 500, padding: "3px 10px", borderRadius: 12, background: isTentative ? "#fff5f6" : C.priSoft, color: isTentative ? C.textMuted : C.priDark }}>{ev.status}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div style={{ textAlign: "right", padding: "8px 16px 12px" }}>
                <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", color: C.pri, fontSize: 14, fontWeight: 500, cursor: "pointer", padding: "6px 12px", borderRadius: 4 }}>Close</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
