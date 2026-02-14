import { useState, useMemo, useEffect, useRef } from "react";

/* ── Palette ── */
const C = {
  pri: "#8B1A2B", priDark: "#6b0f1e", priLight: "#a93545",
  priSoft: "#f5dde2", priTint: "rgba(139,26,43,0.06)",
  text: "#3c2025", textSec: "#7a4a52", textMuted: "#a8757e",
  border: "#e8d0d5", bg: "#fff", bgSub: "#fff",
  free: "rgba(34,197,94,0.08)", freeBorder: "rgba(34,197,94,0.2)",
  kyle: "#E6F4FF", kyleBg: "rgba(230,244,255,0.18)",
  luka: "#8B1A2B", lukaBg: "rgba(139,26,43,0.12)",
  unavailable: "rgba(239,68,68,0.08)", unavailableBorder: "rgba(239,68,68,0.15)",
  // Nav drawer (dark like Google Calendar)
  nav: "#2d2d2d", navText: "#e0e0e0", navMuted: "#999",
  navHover: "#3a3a3a", navActive: "#1a73e8",
};

const PERSON_COLORS = {
  kyle: { chip: C.kyle, soft: C.kyleBg, label: "Kyle" },
  luka: { chip: C.luka, soft: C.lukaBg, label: "Luka" },
};

const PlaneIcon = ({ size = 14, color = "currentColor", style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, ...style }}>
    <path d="M21 16v-2l-8-5V3.5A1.5 1.5 0 0 0 11.5 2 1.5 1.5 0 0 0 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" fill={color}/>
  </svg>
);

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
  { date: "2026-02-08", title: "Tiki Disco Winter", venue: "Knockdown Center, BK", status: "confirmed", time: "10:00pm", person: "luka" },
  { date: "2026-02-09", title: "KT / Meina", venue: "USC", status: "confirmed", time: "2:00pm", person: "kyle" },
  { date: "2026-02-10", title: "KT / SkinFX", venue: "USC", status: "confirmed", time: "10:30am", person: "kyle" },
  { date: "2026-02-12", title: "RawCuts", venue: "Secret Location, BK", status: "confirmed", time: "10:00pm", person: "luka" },
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
  { date: "2026-03-01", title: "Tiki Disco Winter", venue: "Knockdown Center, BK", status: "confirmed", time: "10:00pm", person: "luka" },
  { date: "2026-03-20", title: "Prospa b2b Josh Baker", venue: "Navy Yard, BK", status: "tentative", time: "10:00pm", person: "luka" },
  { date: "2026-03-21", title: "Carl Cox", venue: "Navy Yard, BK", status: "tentative", time: "10:00pm", person: "luka" },
  { date: "2026-04-03", title: "SiDEPiECE", venue: "Navy Yard, BK", status: "tentative", time: "10:00pm", person: "luka" },
  { date: "2026-04-20", title: "Hot Since 82", venue: "House of Yes, BK", status: "confirmed", time: "10:00pm", person: "luka" },
  { date: "2026-04-25", title: "CID", venue: "99 Scott, BK", status: "confirmed", time: "10:00pm", person: "luka" },
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

// Status colors
const STATUS_CONFIG = {
  confirmed: { label: "Busy", color: "#dc3545", bg: "#fff0f1", icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" },
  tentative: { label: "Tentative", color: "#f59e0b", bg: "#fffbeb", icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" },
  free: { label: "Free", color: "#22c55e", bg: "#f0fdf4", icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" },
};

export default function App() {
  const [year, setYear] = useState(2026);
  const [events, setEvents] = useState(EVENTS.map((e, i) => ({ ...e, id: i })));
  const [month, setMonth] = useState(1);
  const [selected, setSelected] = useState(null);
  const [hovered, setHovered] = useState(null);
  const [personFilter, setPersonFilter] = useState({ kyle: true, luka: true });
  const [navOpen, setNavOpen] = useState(false);
  const [mobileView, setMobileView] = useState("month");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [highlightedWeekend, setHighlightedWeekend] = useState(null);
  const navRef = useRef(null);

  // Dynamic event map from stateful events
  const eventMap = useMemo(() => {
    const m = {};
    events.forEach(e => { if (!m[e.date]) m[e.date] = []; m[e.date].push(e); });
    return m;
  }, [events]);

  const changeStatus = (eventId, newStatus) => {
    setEvents(prev => prev.map(e => e.id === eventId ? { ...e, status: newStatus } : e));
  };

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
  const prev = () => { if (month === 0) { setMonth(11); setYear(y=>y-1); } else setMonth(m=>m-1); setSelected(null); setHighlightedWeekend(null); };
  const next = () => { if (month === 11) { setMonth(0); setYear(y=>y+1); } else setMonth(m=>m+1); setSelected(null); setHighlightedWeekend(null); };
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

  const kyleCount = events.filter(e => e.person === "kyle").length;
  const lukaCount = events.filter(e => e.person === "luka").length;
  const confirmed = events.filter(e => e.status === "confirmed").length;
  const tentative = events.filter(e => e.status === "tentative").length;
  const freeCount = events.filter(e => e.status === "free").length;

  // Compute free weekends across semester (Feb–Jul 2026)
  const freeWeekends = useMemo(() => {
    const results = [];
    for (let m = 1; m <= 6; m++) { // Feb(1) through Jul(6)
      const dim = getDaysInMonth(2026, m);
      for (let d = 1; d <= dim; d++) {
        const date = new Date(2026, m, d);
        const dow = date.getDay();
        if (dow === 6) { // Saturday — check Sat+Sun pair
          const satKey = fmtKey(2026, m, d);
          const sunD = d + 1;
          const sunKey = sunD <= dim ? fmtKey(2026, m, sunD) : null;
          const satFree = !eventMap[satKey] || eventMap[satKey].length === 0;
          const sunFree = sunKey ? (!eventMap[sunKey] || eventMap[sunKey].length === 0) : true;
          if (satFree && sunFree) {
            const satDate = new Date(2026, m, d);
            const sunDate = sunD <= dim ? new Date(2026, m, sunD) : null;
            results.push({
              id: `${m}-${d}`,
              sat: satDate,
              sun: sunDate,
              label: `${satDate.toLocaleDateString("en-US",{month:"short",day:"numeric"})}${sunDate ? "–"+sunDate.getDate() : ""}`,
              monthIdx: m,
            });
          }
        }
      }
    }
    return results;
  }, []);

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
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes popIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
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
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#dc3545" }}/> Busy · {confirmed}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 13, color: C.navText }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#f59e0b" }}/> Tentative · {tentative}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 13, color: C.navText }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e" }}/> Free · {freeCount}
              </div>
            </div>

            <div className="nav-sep" />

            {/* Semester info */}
            <div style={{ padding: "12px 24px", fontSize: 12, color: C.navMuted }}>
              <div style={{ fontWeight: 500 }}>Semester: Feb – Jul 2026</div>
              <div style={{ marginTop: 2 }}>{events.length} events total</div>
            </div>

            <div className="nav-sep" />

            {/* Free for flights */}
            <div style={{ padding: "8px 24px 4px", fontSize: 11, fontWeight: 500, color: C.navMuted, textTransform: "uppercase", letterSpacing: 1 }}>
              <PlaneIcon size={12} color={C.navMuted} style={{ display: "inline", verticalAlign: "middle", marginRight: 4 }} /> Free for Flights
              <span style={{ marginLeft: 6, fontSize: 10, background: "rgba(255,255,255,0.1)", borderRadius: 8, padding: "1px 6px" }}>{freeWeekends.length}</span>
            </div>
            <div style={{ padding: "4px 16px 16px", display: "flex", flexDirection: "column", gap: 2 }}>
              {freeWeekends.map((fw, i) => (
                <div key={i} onClick={() => { setHighlightedWeekend(fw); setMonth(fw.monthIdx); setNavOpen(false); }} style={{
                  display: "flex", alignItems: "center", gap: 10, padding: "8px 8px", borderRadius: 8, cursor: "pointer",
                  background: highlightedWeekend?.id === fw.id ? "rgba(34,197,94,0.2)" : fw.monthIdx === month ? "rgba(255,255,255,0.08)" : "transparent",
                  border: highlightedWeekend?.id === fw.id ? "1px solid rgba(34,197,94,0.4)" : "1px solid transparent",
                  transition: "all 0.15s",
                }}>
                  <PlaneIcon size={16} color={C.navMuted} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: C.navText }}>{fw.label}</div>
                    <div style={{ fontSize: 10, color: C.navMuted }}>Weekend free</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>}

        {/* ═══ MOBILE TOP BAR ═══ */}
        {isMobile && (
          <>
            {/* Main header row */}
            <div style={{
              display: "flex",
              alignItems: "center",
              padding: "8px 12px",
              gap: 8,
              borderBottom: `1px solid ${C.border}`,
              flexWrap: "wrap"
            }}>
              {/* Hamburger menu */}
              <button className="hamburger" onClick={() => setNavOpen(true)}>
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
                </svg>
              </button>

              {/* Calendar icon + title */}
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <svg width="32" height="32" viewBox="0 0 36 36">
                  <rect width="36" height="36" rx="4" fill={C.pri}/>
                  <text x="18" y="25" textAnchor="middle" fill="#fff" fontSize="16" fontWeight="700" fontFamily="Google Sans">{today.getDate()}</text>
                </svg>
                <span style={{ fontSize: 16, fontWeight: 400, color: C.text }}>Kyle & Luka's Calendar</span>
              </div>

              {/* Today button */}
              <button
                onClick={() => { setYear(today.getFullYear()); setMonth(today.getMonth()); }}
                style={{
                  border: `1px solid ${C.border}`,
                  borderRadius: 4,
                  padding: "4px 12px",
                  background: "#fff",
                  fontSize: 12,
                  fontWeight: 500,
                  color: C.pri,
                  cursor: "pointer",
                  marginLeft: "auto"
                }}>
                Today
              </button>

              {/* Navigation arrows */}
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <button onClick={prev} style={{ background: "none", border: "none", cursor: "pointer", padding: 10, borderRadius: "50%", display: "flex", alignItems: "center", color: C.textSec, fontSize: 26 }}>‹</button>
                <button onClick={next} style={{ background: "none", border: "none", cursor: "pointer", padding: 10, borderRadius: "50%", display: "flex", alignItems: "center", color: C.textSec, fontSize: 26 }}>›</button>
              </div>

              {/* Month Year */}
              <span style={{ fontSize: 16, fontWeight: 400, color: C.text }}>{MONTH_NAMES[month]} {year}</span>
            </div>

            {/* Person filter chips row */}
            <div style={{
              display: "flex",
              gap: 6,
              padding: "8px 12px",
              borderBottom: `1px solid ${C.border}`,
              overflowX: "auto"
            }}>
              {[["kyle","Kyle",C.kyle],["luka","Luka",C.luka]].map(([k,v,color]) => (
                <button
                  key={k}
                  className="person-chip"
                  onClick={() => togglePerson(k)}
                  style={{
                    background: personFilter[k] ? color : "#fff",
                    color: personFilter[k] ? (k === "kyle" ? "#333" : "#fff") : C.textSec,
                    borderColor: personFilter[k] ? "transparent" : C.border,
                    fontSize: 11,
                    padding: "4px 12px",
                  }}>
                  <span style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: personFilter[k] ? (k === "kyle" ? "#333" : "#fff") : color,
                    display: "inline-block",
                    marginRight: 4
                  }} />
                  {v}
                </button>
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
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#dc3545" }} />
                    <span style={{ fontSize: 12, color: C.text }}>Busy · <strong>{confirmed}</strong></span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#f59e0b" }} />
                    <span style={{ fontSize: 12, color: C.text }}>Tentative · <strong>{tentative}</strong></span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e" }} />
                    <span style={{ fontSize: 12, color: C.text }}>Free · <strong>{freeCount}</strong></span>
                  </div>
                </div>
              </div>
              <div style={{ borderTop: `1px solid ${C.border}`, marginTop: 16, paddingTop: 16, padding: "16px 8px 0" }}>
                <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 4 }}>Semester</div>
                <div style={{ fontSize: 13, color: C.text }}>Feb – Jul 2026</div>
                <div style={{ fontSize: 12, color: C.textSec, marginTop: 2 }}>{events.length} events total</div>
              </div>
              <div style={{ borderTop: `1px solid ${C.border}`, marginTop: 16, paddingTop: 16, padding: "16px 8px 0" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <span style={{ fontSize: 11, fontWeight: 500, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.8px", display: "flex", alignItems: "center", gap: 4 }}><PlaneIcon size={12} color={C.textMuted} /> Free for Flights</span>
                  <span style={{ fontSize: 10, color: C.textMuted, background: C.free, border: `1px solid ${C.freeBorder}`, borderRadius: 8, padding: "1px 6px" }}>{freeWeekends.length}</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {freeWeekends.map((fw, i) => (
                    <div key={i} onClick={() => { setHighlightedWeekend(fw); setMonth(fw.monthIdx); }} style={{
                      display: "flex", alignItems: "center", gap: 8, padding: "5px 6px", borderRadius: 6, cursor: "pointer",
                      background: highlightedWeekend?.id === fw.id ? "rgba(34,197,94,0.22)" : fw.monthIdx === month ? C.free : "transparent",
                      border: `1px solid ${highlightedWeekend?.id === fw.id ? "rgba(34,197,94,0.5)" : fw.monthIdx === month ? C.freeBorder : "transparent"}`,
                      transition: "all 0.15s",
                    }}>
                      <PlaneIcon size={16} color={C.textMuted} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 12, fontWeight: 500, color: C.text }}>{fw.label}</div>
                        <div style={{ fontSize: 10, color: C.textMuted }}>Weekend free</div>
                      </div>
                    </div>
                  ))}
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
                  const isWeekend = i % 7 === 0 || i % 7 === 5 || i % 7 === 6;
                  const isFreeWeekend = cell.current && isWeekend && !hasEv;
                  const isInTodayCol = (i % 7) === todayCol && isMobile;
                  const isHighlightedWeekend = highlightedWeekend && cell.current && (
                    (highlightedWeekend.sat && cell.day === highlightedWeekend.sat.getDate() && month === highlightedWeekend.monthIdx) ||
                    (highlightedWeekend.sun && cell.day === highlightedWeekend.sun.getDate() && month === highlightedWeekend.monthIdx)
                  );
                  const cellBg = isSelected ? C.priSoft : isHighlightedWeekend ? "rgba(34,197,94,0.22)" : isInTodayCol ? C.priTint : hasEv ? C.unavailable : isFreeWeekend ? C.free : "#fff";
                  return (
                    <div key={i} onClick={() => key && events.length && setSelected(isSelected ? null : key)} style={{
                      borderRight: (i + 1) % 7 !== 0 ? `1px solid ${C.border}` : "none",
                      borderBottom: `1px solid ${C.border}`, padding: isMobile ? "1px" : "4px 8px",
                      background: cellBg,
                      borderLeft: isHighlightedWeekend ? `3px solid rgba(34,197,94,0.5)` : hasEv ? `2px solid ${C.unavailableBorder}` : isFreeWeekend ? `2px solid ${C.freeBorder}` : "none",
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
                      {hasEv && (
                        <div style={{
                          fontSize: isMobile ? 7 : 8,
                          fontWeight: 600,
                          color: "#ef4444",
                          background: "rgba(239,68,68,0.1)",
                          border: "1px solid rgba(239,68,68,0.2)",
                          borderRadius: 2,
                          padding: isMobile ? "1px 3px" : "1px 4px",
                          marginBottom: 2,
                          display: "inline-block",
                          textTransform: "uppercase",
                          letterSpacing: "0.3px"
                        }}>
                          ✗ Unavailable
                        </div>
                      )}
                      {isFreeWeekend && (
                        <div style={{ fontSize: isMobile ? 7 : 9, fontWeight: 500, color: C.textMuted, background: C.free, border: `1px solid ${C.freeBorder}`, borderRadius: 3, padding: isMobile ? "0px 3px" : "1px 5px", marginBottom: 2, display: "inline-flex", alignItems: "center", gap: 2 }}><PlaneIcon size={isMobile ? 7 : 9} color={C.textMuted} /> free</div>
                      )}
                      {events.map((ev, j) => {
                        const pc = PERSON_COLORS[ev.person] || PERSON_COLORS.kyle;
                        const isTentative = ev.status === "tentative";
                        const isFree = ev.status === "free";
                        return (
                          <div key={j} onMouseEnter={() => !isMobile && setHovered(`${key}-${j}`)} onMouseLeave={() => !isMobile && setHovered(null)}
                            style={{
                              fontSize: isMobile ? 9 : 11, fontWeight: 500,
                              color: isFree ? "#22c55e" : ev.person === "kyle" ? "#2c3e50" : "#fff",
                              background: isFree ? "#f0fdf4" : pc.chip,
                              border: isFree ? "1px solid rgba(34,197,94,0.25)" : "none",
                              borderRadius: isMobile ? 2 : 4, padding: isMobile ? "1.5px 3px" : "2px 6px",
                              margin: isMobile ? "0.5px 1px" : "0 0 2px 0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", display: "block",
                              opacity: hovered === `${key}-${j}` ? 0.85 : isTentative ? 0.7 : isFree ? 0.8 : 1, transition: "opacity 0.15s",
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
          <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, display: "flex", alignItems: isMobile ? "flex-end" : "center", justifyContent: "center", background: "rgba(60,20,25,0.45)", backdropFilter: "blur(3px)", zIndex: 150, animation: "fadeIn 0.2s ease" }} onClick={() => setSelected(null)}>
            <div onClick={e => e.stopPropagation()} style={{
              background: "#fff", borderRadius: isMobile ? "20px 20px 0 0" : 12, padding: 0,
              width: isMobile ? "100%" : "auto", minWidth: isMobile ? "100%" : 400, maxWidth: isMobile ? "100%" : 480,
              maxHeight: isMobile ? "80vh" : "85vh", overflowY: "auto", overflow: "hidden",
              boxShadow: "0 20px 60px rgba(139,26,43,0.25)",
              animation: isMobile ? "slideUp 0.3s ease" : "popIn 0.25s ease",
            }}>
              {/* Drag handle on mobile */}
              {isMobile && <div style={{ display: "flex", justifyContent: "center", padding: "10px 0 2px" }}><div style={{ width: 36, height: 4, borderRadius: 2, background: C.border }} /></div>}

              {getFilteredEvents(selected).map((ev, i) => {
                const pc = PERSON_COLORS[ev.person] || PERSON_COLORS.kyle;
                const sc = STATUS_CONFIG[ev.status] || STATUS_CONFIG.confirmed;
                const evList = getFilteredEvents(selected);
                const dateStr = new Date(ev.date + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
                return (
                  <div key={ev.id}>
                    {/* Colored header bar */}
                    <div style={{
                      background: `linear-gradient(135deg, ${pc.chip}, ${pc.chip}dd)`,
                      padding: isMobile ? "18px 20px" : "22px 28px",
                      position: "relative", overflow: "hidden",
                    }}>
                      <div style={{ position: "absolute", top: "-40%", right: "-8%", width: 160, height: 160, background: "rgba(255,255,255,0.06)", borderRadius: "50%" }} />
                      {/* Close button */}
                      <button onClick={() => setSelected(null)} style={{
                        position: "absolute", top: 14, right: 14, width: 30, height: 30, border: "none",
                        background: "rgba(255,255,255,0.15)", borderRadius: "50%", cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s",
                        color: ev.person === "kyle" ? "#2c3e50" : "#fff",
                      }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
                      </button>
                      <div style={{ display: "flex", alignItems: "center", gap: 14, position: "relative" }}>
                        <div style={{ width: 44, height: 44, background: "rgba(255,255,255,0.15)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(10px)" }}>
                          <svg width="22" height="22" viewBox="0 0 24 24" fill={ev.person === "kyle" ? "#2c3e50" : "#fff"}>
                            <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z"/>
                          </svg>
                        </div>
                        <div>
                          <div style={{ fontSize: isMobile ? 17 : 19, fontWeight: 700, color: ev.person === "kyle" ? "#2c3e50" : "#fff", letterSpacing: "0.2px" }}>{ev.title}</div>
                          <div style={{ fontSize: 12, color: ev.person === "kyle" ? "rgba(44,62,80,0.7)" : "rgba(255,255,255,0.8)", marginTop: 2 }}>{pc.label}'s Event</div>
                        </div>
                      </div>
                    </div>

                    {/* Event details card */}
                    <div style={{ padding: isMobile ? "20px 20px 16px" : "24px 28px 20px" }}>
                      <div style={{ background: "#f8f9fa", border: `1px solid ${C.border}`, borderRadius: 8, padding: "16px 18px", marginBottom: 20 }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: C.textSec }}>
                            <svg width="15" height="15" viewBox="0 0 24 24" fill={C.pri} opacity="0.6"><path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10z"/></svg>
                            <span>{dateStr}</span>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: C.textSec }}>
                            <svg width="15" height="15" viewBox="0 0 24 24" fill={C.pri} opacity="0.6"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.2 3.2.8-1.3-4.5-2.7V7z"/></svg>
                            <span>{ev.time}</span>
                          </div>
                          {ev.venue && (
                            <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: C.textSec }}>
                              <svg width="15" height="15" viewBox="0 0 24 24" fill={C.pri} opacity="0.6"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"/></svg>
                              <span>{ev.venue}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Status selector */}
                      <div style={{ marginBottom: 16 }}>
                        <div style={{ fontSize: 11, fontWeight: 600, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 10 }}>Your Availability</div>
                        <div style={{ display: "flex", gap: 8 }}>
                          {["confirmed", "tentative", "free"].map(s => {
                            const cfg = STATUS_CONFIG[s];
                            const isActive = ev.status === s;
                            return (
                              <button key={s} onClick={() => changeStatus(ev.id, s)} style={{
                                flex: 1, padding: "10px 8px", border: `2px solid ${isActive ? cfg.color : C.border}`,
                                borderRadius: 8, background: isActive ? cfg.bg : "#fff", cursor: "pointer",
                                display: "flex", flexDirection: "column", alignItems: "center", gap: 5,
                                transition: "all 0.2s ease",
                                transform: isActive ? "scale(1.02)" : "scale(1)",
                                boxShadow: isActive ? `0 2px 8px ${cfg.color}25` : "none",
                              }}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill={isActive ? cfg.color : C.textMuted}>
                                  <path d={cfg.icon}/>
                                </svg>
                                <span style={{ fontSize: 11, fontWeight: isActive ? 700 : 500, color: isActive ? cfg.color : C.textSec }}>{cfg.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Current status indicator */}
                      <div style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        padding: "10px 14px", background: sc.bg, border: `1px solid ${sc.color}22`,
                        borderRadius: 6, fontSize: 12,
                      }}>
                        <span style={{ color: C.textSec }}>Current Status</span>
                        <span style={{ fontWeight: 700, color: sc.color, display: "flex", alignItems: "center", gap: 5 }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill={sc.color}><path d={sc.icon}/></svg>
                          {sc.label}
                        </span>
                      </div>
                    </div>

                    {/* Separator between events */}
                    {i < evList.length - 1 && <div style={{ height: 1, background: C.border, margin: "0 24px" }} />}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
