import { useState, useMemo, useEffect } from "react";

const PEOPLE = {
  kyle: { name: "Kyle", color: "#2d2d2d", light: "#f0f0f0", text: "#1a1a1a" },
  luka: { name: "Luka", color: "#787878", light: "#f0f0f0", text: "#4a4a4a" },
  both: { name: "Kyle & Luka", color: "linear-gradient(135deg, #2d2d2d 50%, #787878 50%)", solid: "#4a4a4a", light: "#f0f0f0", text: "#333" },
};

const EVENTS = [
  // Week 1
  { date: "2026-02-02", title: "KT / Dr. Arthur", venue: "USC", status: "confirmed", person: "kyle", time: "12:30pm" },
  { date: "2026-02-02", title: "Tutoring - Noah", venue: "USC", status: "confirmed", person: "kyle", time: "5:00pm" },
  { date: "2026-02-03", title: "WRIT 340: Submit Student Profile", venue: "USC", status: "confirmed", person: "kyle", time: "11:45pm" },
  { date: "2026-02-04", title: "USC HOLD - TRE", venue: "USC", status: "confirmed", person: "kyle", time: "2:00pm" },
  { date: "2026-02-04", title: "Tutoring - Kenne", venue: "USC", status: "confirmed", person: "kyle", time: "5:00pm" },
  { date: "2026-02-05", title: "KT / Devon - The...", venue: "USC", status: "confirmed", person: "kyle", time: "1:00pm" },
  { date: "2026-02-05", title: "WRIT 340: Email Illumin article topics", venue: "USC", status: "confirmed", person: "kyle", time: "11:45pm" },
  { date: "2026-02-05", title: "Illumin Oral Pres", venue: "USC", status: "confirmed", person: "kyle", time: "11:59pm" },
  { date: "2026-02-06", title: "RED 469: Mix", venue: "USC", status: "confirmed", person: "kyle", time: "9:00am" },
  { date: "2026-02-06", title: "Tutoring - Erwin", venue: "USC", status: "confirmed", person: "kyle", time: "1:00pm" },

  // Week 2
  { date: "2026-02-09", title: "KT / Meina", venue: "USC", status: "confirmed", person: "kyle", time: "2:00pm" },
  { date: "2026-02-10", title: "KT / SkinFX", venue: "USC", status: "confirmed", person: "kyle", time: "10:30am" },
  { date: "2026-02-12", title: "WRIT 340: Submit Illumin rough draft", venue: "USC", status: "confirmed", person: "kyle", time: "11:45pm" },
  { date: "2026-02-13", title: "RED 469: Mix", venue: "USC", status: "confirmed", person: "kyle", time: "9:00am" },
  { date: "2026-02-13", title: "Spring 26 Com", venue: "USC", status: "confirmed", person: "kyle", time: "10:00pm" },
  { date: "2026-02-13", title: "Observational A", venue: "USC", status: "confirmed", person: "kyle", time: "11:59pm" },
  { date: "2026-02-14", title: "Valentine's Day", venue: "", status: "confirmed", person: "kyle", time: "All day" },

  // Week 3
  { date: "2026-02-16", title: "Presidents' Day", venue: "", status: "confirmed", person: "kyle", time: "All day" },
  { date: "2026-02-16", title: "TREA E-Board Meeting", venue: "USC", status: "confirmed", person: "kyle", time: "3:00pm" },
  { date: "2026-02-17", title: "WRIT 340: Illumin oral pres", venue: "USC", status: "confirmed", person: "kyle", time: "5:00pm" },
  { date: "2026-02-18", title: "Dining Society D", venue: "USC", status: "confirmed", person: "kyle", time: "6:30pm" },
  { date: "2026-02-18", title: "Final Draft Illumin", venue: "USC", status: "confirmed", person: "kyle", time: "11:59pm" },
  { date: "2026-02-19", title: "KT / Ray", venue: "USC", status: "confirmed", person: "kyle", time: "10:30am" },
  { date: "2026-02-19", title: "WRIT 340: Submit Illumin final draft", venue: "USC", status: "confirmed", person: "kyle", time: "11:45pm" },
  { date: "2026-02-20", title: "RED 469: Mix", venue: "USC", status: "confirmed", person: "kyle", time: "9:00am" },

  // Week 4
  { date: "2026-02-22", title: "Project Angel F", venue: "USC", status: "confirmed", person: "kyle", time: "12:45pm" },
  { date: "2026-02-24", title: "Resume Review", venue: "USC", status: "tentative", person: "kyle", time: "6:30pm" },
  { date: "2026-02-25", title: "Dining Society D", venue: "USC", status: "confirmed", person: "kyle", time: "6:30pm" },
  { date: "2026-02-26", title: "Lever Friends Ha", venue: "USC", status: "confirmed", person: "kyle", time: "6:00pm" },
  { date: "2026-02-27", title: "RED 469: Mix", venue: "USC", status: "confirmed", person: "kyle", time: "9:00am" },
];

const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAY_HEADERS = ["SUN","MON","TUE","WED","THU","FRI","SAT"];
const MINI_DAYS = ["S","M","T","W","T","F","S"];
const SHORT_MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function getDaysInMonth(y, m) { return new Date(y, m + 1, 0).getDate(); }
function getFirstDay(y, m) { return new Date(y, m, 1).getDay(); }
function fmtKey(y, m, d) { return `${y}-${String(m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`; }

const eventMap = {};
EVENTS.forEach(e => {
  if (!eventMap[e.date]) eventMap[e.date] = [];
  eventMap[e.date].push(e);
});

function getEventColor(ev) { return PEOPLE[ev.person]?.color || "#888"; }
function getEventSolid(ev) { return PEOPLE[ev.person]?.solid || PEOPLE[ev.person]?.color || "#888"; }

export default function App() {
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(1);
  const [selected, setSelected] = useState(null);
  const [hovered, setHovered] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
    const rem = 42 - c.length;
    for (let i = 1; i <= rem; i++) c.push({ day: i, current: false });
    return c;
  }, [firstDay, daysInMonth, prevMonthDays]);

  const miniCells = useMemo(() => {
    const c = [];
    for (let i = 0; i < firstDay; i++) c.push(null);
    for (let d = 1; d <= daysInMonth; d++) c.push(d);
    return c;
  }, [firstDay, daysInMonth]);

  const hasEvent = (d) => !!eventMap[fmtKey(year, month, d)];

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;700&family=Roboto:wght@300;400;500&display=swap" rel="stylesheet" />
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
        body { overflow-x: hidden; }

        .hamburger, .top-btn {
          cursor: pointer;
          border: none;
          background: none;
          color: #5f6368;
          padding: 8px;
          border-radius: 50%;
          transition: background 0.15s;
        }
        .hamburger:active, .top-btn:active { background: #f8f9fa; }

        .month-tabs {
          display: flex;
          gap: 8px;
          padding: 8px 16px 12px;
          overflow-x: auto;
          scrollbar-width: none;
        }
        .month-tabs::-webkit-scrollbar { display: none; }

        .month-tab {
          font-family: 'Google Sans', sans-serif;
          font-size: 14px;
          font-weight: 500;
          padding: 6px 16px;
          border-radius: 20px;
          border: 1px solid #dadce0;
          background: #fff;
          color: #5f6368;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.15s;
        }
        .month-tab:active { background: #f8f9fa; }
        .month-tab.active {
          background: #f0f0f0;
          color: #2d2d2d;
          border-color: #f0f0f0;
        }

        .fab {
          position: fixed;
          bottom: 24px;
          right: 20px;
          width: 56px;
          height: 56px;
          border-radius: 16px;
          background: #fff;
          box-shadow: 0 2px 12px rgba(0,0,0,0.15);
          display: ${isMobile ? 'grid' : 'none'};
          place-items: center;
          cursor: pointer;
          border: none;
          z-index: 100;
          transition: transform 0.2s;
        }
        .fab:active { transform: scale(0.92); }
      `}</style>

      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", fontFamily: "'Google Sans', 'Segoe UI', Roboto, sans-serif", background: "#fff", color: "#3c4043", maxWidth: isMobile ? "430px" : "none", margin: "0 auto" }}>

        {/* MOBILE TOP BAR */}
        {isMobile && (
          <>
            <div style={{ display: "flex", alignItems: "center", padding: "8px 16px", gap: 12 }}>
              <button className="hamburger">
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <line x1="3" y1="12" x2="21" y2="12"/>
                  <line x1="3" y1="18" x2="21" y2="18"/>
                </svg>
              </button>
              <div style={{ fontSize: 22, fontWeight: 400, flex: 1, display: "flex", alignItems: "center", gap: 4 }}>
                {MONTH_NAMES[month]}
                <div style={{ width: 0, height: 0, borderLeft: "5px solid transparent", borderRight: "5px solid transparent", borderTop: "5px solid #5f6368", marginTop: 2 }}/>
              </div>
              <button className="top-btn" onClick={() => { setYear(today.getFullYear()); setMonth(today.getMonth()); }}>
                <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z"/>
                  <text x="12" y="17" textAnchor="middle" fontSize="9" fontWeight="700" fill="currentColor">{today.getDate()}</text>
                </svg>
              </button>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#2d2d2d", border: "2px solid #555" }}/>
            </div>

            {/* MONTH TABS */}
            <div className="month-tabs">
              {SHORT_MONTHS.map((m, i) => (
                <button
                  key={i}
                  className={`month-tab ${i === month ? 'active' : ''}`}
                  onClick={() => setMonth(i)}
                >
                  {m}
                </button>
              ))}
            </div>
          </>
        )}

        {/* DESKTOP TOP BAR */}
        {!isMobile && (
          <div style={{ display: "flex", alignItems: "center", padding: "8px 16px", borderBottom: "1px solid #dadce0", flexShrink: 0, gap: 16, height: 64 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <svg width="36" height="36" viewBox="0 0 36 36" style={{ flexShrink: 0 }}>
                <rect width="36" height="36" rx="4" fill="#2d2d2d"/>
                <text x="18" y="25" textAnchor="middle" fill="#fff" fontSize="18" fontWeight="700" fontFamily="Google Sans, sans-serif">{today.getDate()}</text>
              </svg>
              <span style={{ fontSize: 22, fontWeight: 400, color: "#3c4043" }}>Kyle and Luka Calendar</span>
            </div>
            <button onClick={() => { setYear(today.getFullYear()); setMonth(today.getMonth()); }} style={{ border: "1px solid #dadce0", borderRadius: 4, padding: "6px 20px", background: "#fff", fontSize: 14, fontWeight: 500, color: "#3c4043", cursor: "pointer", marginLeft: 16 }}>Today</button>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <button onClick={prev} style={{ background: "none", border: "none", cursor: "pointer", padding: 8, borderRadius: "50%", display: "flex", alignItems: "center", color: "#5f6368", fontSize: 20 }}>‹</button>
              <button onClick={next} style={{ background: "none", border: "none", cursor: "pointer", padding: 8, borderRadius: "50%", display: "flex", alignItems: "center", color: "#5f6368", fontSize: 20 }}>›</button>
            </div>
            <span style={{ fontSize: 22, fontWeight: 400, color: "#3c4043" }}>{MONTH_NAMES[month]} {year}</span>
            <div style={{ marginLeft: "auto", fontSize: 14, color: "#5f6368", border: "1px solid #dadce0", borderRadius: 4, padding: "6px 16px" }}>Month</div>
          </div>
        )}

        {/* BODY */}
        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

          {/* SIDEBAR - Desktop only */}
          {!isMobile && (
            <div style={{ width: 256, borderRight: "1px solid #dadce0", padding: "16px 12px", overflowY: "auto", flexShrink: 0 }}>
              {/* Mini Calendar */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 8px", marginBottom: 8 }}>
                  <span style={{ fontSize: 14, fontWeight: 500, color: "#3c4043" }}>{MONTH_NAMES[month]} {year}</span>
                  <div style={{ display: "flex", gap: 2 }}>
                    <button onClick={prev} style={{ background: "none", border: "none", cursor: "pointer", color: "#5f6368", fontSize: 16, padding: 4 }}>‹</button>
                    <button onClick={next} style={{ background: "none", border: "none", cursor: "pointer", color: "#5f6368", fontSize: 16, padding: 4 }}>›</button>
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 0, textAlign: "center" }}>
                  {MINI_DAYS.map((d, i) => <div key={i} style={{ fontSize: 10, color: "#70757a", padding: "4px 0", fontWeight: 500 }}>{d}</div>)}
                  {miniCells.map((d, i) => {
                    const t = d && isToday(d);
                    const ev = d && hasEvent(d);
                    const evData = d && eventMap[fmtKey(year, month, d)];
                    const dotColor = evData ? getEventSolid(evData[0]) : null;
                    return (
                      <div key={i} onClick={() => d && ev && setSelected(fmtKey(year, month, d))} style={{
                        fontSize: 11, cursor: ev ? "pointer" : "default", position: "relative",
                        borderRadius: "50%", width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto",
                        background: t ? "#2d2d2d" : "transparent", color: t ? "#fff" : "#3c4043",
                        fontWeight: t || ev ? 600 : 400,
                      }}>
                        {d || ""}
                        {ev && !t && <div style={{ position: "absolute", bottom: 0, width: 4, height: 4, borderRadius: "50%", background: dotColor }} />}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* People Legend */}
              <div style={{ borderTop: "1px solid #dadce0", paddingTop: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 500, color: "#70757a", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 12, padding: "0 8px" }}>People</div>
                {Object.entries(PEOPLE).map(([key, p]) => (
                  <div key={key} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 8px", borderRadius: 6, cursor: "default" }}>
                    {key === "both" ? (
                      <div style={{ width: 14, height: 14, borderRadius: 3, flexShrink: 0, background: "linear-gradient(135deg, #2d2d2d 50%, #787878 50%)" }} />
                    ) : (
                      <div style={{ width: 14, height: 14, borderRadius: 3, background: p.color, flexShrink: 0 }} />
                    )}
                    <span style={{ fontSize: 13, color: "#3c4043", fontWeight: 450 }}>{p.name}</span>
                  </div>
                ))}
              </div>

              {/* Status Legend */}
              <div style={{ borderTop: "1px solid #dadce0", marginTop: 16, paddingTop: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 500, color: "#70757a", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 12, padding: "0 8px" }}>Status</div>
                <div style={{ padding: "0 8px", display: "flex", flexDirection: "column", gap: 6 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#2d2d2d" }} />
                    <span style={{ fontSize: 12, color: "#3c4043" }}>Confirmed · <strong>{EVENTS.filter(e=>e.status==="confirmed").length}</strong></span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", border: "2px solid #999", background: "transparent" }} />
                    <span style={{ fontSize: 12, color: "#3c4043" }}>Tentative · <strong>{EVENTS.filter(e=>e.status==="tentative").length}</strong></span>
                  </div>
                </div>
              </div>

              {/* Semester range */}
              <div style={{ borderTop: "1px solid #dadce0", marginTop: 16, paddingTop: 16, padding: "16px 8px 0" }}>
                <div style={{ fontSize: 11, color: "#70757a", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 4 }}>Semester</div>
                <div style={{ fontSize: 13, color: "#3c4043" }}>Feb – Jul 2026</div>
                <div style={{ fontSize: 12, color: "#70757a", marginTop: 2 }}>{EVENTS.length} events total</div>
              </div>

              {/* Available weekends note */}
              <div style={{ borderTop: "1px solid #dadce0", marginTop: 16, paddingTop: 16, padding: "16px 8px 0" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 12, height: 12, borderRadius: 2, background: "rgba(0,0,0,0.04)", border: "1px solid rgba(0,0,0,0.1)", flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: "#999", fontWeight: 450 }}>✈ Free weekends</span>
                </div>
                <div style={{ fontSize: 11, color: "#9aa0a6", marginTop: 4 }}>Available for flights & trips</div>
              </div>
            </div>
          )}

          {/* MAIN GRID */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", borderBottom: "1px solid #dadce0", flexShrink: 0, padding: isMobile ? "0 2px" : "0" }}>
              {(isMobile ? MINI_DAYS : DAY_HEADERS).map((d, i) => (
                <div key={d} style={{ textAlign: "center", fontSize: 11, fontWeight: 500, color: i === todayCol && isMobile ? "#2d2d2d" : "#70757a", padding: "6px 0", letterSpacing: "0.8px", textTransform: "uppercase" }}>{d}</div>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gridTemplateRows: "repeat(6, 1fr)", flex: 1, padding: isMobile ? "0 2px" : "0" }}>
              {cells.map((cell, i) => {
                const key = cell.current ? fmtKey(year, month, cell.day) : null;
                const events = key ? (eventMap[key] || []) : [];
                const t = cell.current && isToday(cell.day);
                const isSelected = key && selected === key;
                const hasEv = events.length > 0;
                const evPerson = hasEv ? events[0].person : null;
                const isWeekend = i % 7 === 0 || i % 7 === 6;
                const isFreeWeekend = cell.current && isWeekend && !hasEv && !isMobile;
                const isInTodayCol = (i % 7) === todayCol && isMobile;
                const cellTint = isSelected ? "#f0f0f0"
                  : isInTodayCol ? "rgba(0,0,0,0.015)"
                  : hasEv && !isMobile ? "rgba(0,0,0,0.025)"
                  : isFreeWeekend ? "rgba(0,0,0,0.012)"
                  : "#fff";
                return (
                  <div key={i} onClick={() => key && events.length && setSelected(isSelected ? null : key)} style={{
                    borderRight: (i + 1) % 7 !== 0 ? "1px solid #dadce0" : "none",
                    borderBottom: "1px solid #dadce0",
                    padding: isMobile ? "1px" : "4px 8px",
                    background: cellTint,
                    borderLeft: hasEv && !isMobile ? `3px solid ${evPerson === "kyle" ? "#2d2d2d" : evPerson === "luka" ? "#787878" : "#4a4a4a"}`
                      : isFreeWeekend ? "3px solid rgba(0,0,0,0.08)" : "none",
                    cursor: events.length ? "pointer" : "default",
                    minHeight: isMobile ? "88px" : 0,
                    overflow: "hidden",
                    transition: "background 0.15s",
                    opacity: cell.current ? 1 : 0.4,
                  }}>
                    <div style={{ marginBottom: 2, textAlign: isMobile ? "center" : "left" }}>
                      <span style={{
                        fontSize: 12, fontWeight: 500,
                        display: "inline-flex", alignItems: "center", justifyContent: "center",
                        width: t ? (isMobile ? 24 : 26) : "auto",
                        height: t ? (isMobile ? 24 : 26) : "auto",
                        borderRadius: "50%", background: t ? "#2d2d2d" : "transparent",
                        color: t ? "#fff" : cell.current ? "#3c4043" : (isMobile ? "rgba(63,63,63,0.6)" : "#70757a"),
                      }}>{t && isMobile ? <span>{cell.day}</span> : cell.day}</span>
                    </div>

                    {/* Free weekend tag - Desktop only */}
                    {isFreeWeekend && (
                      <div style={{
                        fontSize: 9, fontWeight: 500, color: "#999",
                        background: "rgba(0,0,0,0.04)", borderRadius: 3,
                        padding: "1px 5px", marginBottom: 2, display: "inline-block",
                        letterSpacing: "0.3px",
                      }}>✈ available</div>
                    )}

                    {/* Event chips */}
                    {events.map((ev, j) => {
                      const p = PEOPLE[ev.person];
                      const isBoth = ev.person === "both";
                      const chipBg = isBoth ? "linear-gradient(135deg, #2d2d2d 0%, #2d2d2d 48%, #fff 48%, #fff 52%, #787878 52%, #787878 100%)" : p.color;
                      const isTentative = ev.status === "tentative";
                      return (
                        <div key={j}
                          onMouseEnter={() => !isMobile && setHovered(`${key}-${j}`)}
                          onMouseLeave={() => !isMobile && setHovered(null)}
                          style={{
                            fontSize: isMobile ? 9 : 11,
                            fontWeight: 500,
                            color: "#fff",
                            background: chipBg,
                            borderRadius: isMobile ? 2 : 4,
                            padding: isMobile ? "1.5px 3px" : "2px 6px",
                            margin: isMobile ? "0.5px 1px" : "0 0 2px 0",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "block",
                            opacity: hovered === `${key}-${j}` ? 0.85 : 1,
                            transition: "opacity 0.15s",
                            borderLeft: isTentative && !isMobile ? "3px dashed rgba(255,255,255,0.5)" : "none",
                            border: isTentative && isMobile ? "1px solid rgba(255,255,255,0.5)" : "none",
                          }}>
                          {!isMobile && <span style={{ fontSize: 10, marginRight: 3, opacity: 0.85 }}>{ev.time}</span>}
                          {ev.title}
                          {isTentative && !isMobile && <span style={{ marginLeft: 4, fontSize: 9 }}>❓</span>}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* FAB - Mobile only */}
        <button className="fab" aria-label="Create event">
          <div style={{ width: 36, height: 36, position: "relative" }}>
            <div style={{ content: '', position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 22, height: 3, background: "#3c4043", borderRadius: 2 }}/>
            <div style={{ content: '', position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 3, height: 22, background: "#3c4043", borderRadius: 2 }}/>
          </div>
        </button>

        {/* EVENT DETAIL POPUP */}
        {selected && eventMap[selected] && (
          <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.3)", zIndex: 100 }} onClick={() => setSelected(null)}>
            <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: 12, padding: 0, minWidth: isMobile ? "90%" : 380, maxWidth: isMobile ? "90%" : 460, boxShadow: "0 24px 48px rgba(0,0,0,0.18)", overflow: "hidden" }}>
              {eventMap[selected].map((ev, i) => {
                const p = PEOPLE[ev.person];
                const isBoth = ev.person === "both";
                const headerBg = isBoth ? "linear-gradient(135deg, #2d2d2d 50%, #787878 50%)" : p.color;
                return (
                  <div key={i}>
                    {/* Color header bar */}
                    <div style={{ height: 6, background: headerBg }} />
                    <div style={{ padding: "20px 24px", borderBottom: i < eventMap[selected].length - 1 ? "1px solid #e8eaed" : "none" }}>
                      <div style={{ fontSize: 22, fontWeight: 400, color: "#3c4043", marginBottom: 12 }}>{ev.title}</div>
                      <div style={{ fontSize: 14, color: "#5f6368", lineHeight: 1.8 }}>
                        <div>{new Date(ev.date + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <span>🕐</span> {ev.time}
                        </div>
                        {ev.venue && (
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <span>📍</span> {ev.venue}
                          </div>
                        )}
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
                          {/* Person badges */}
                          {isBoth ? (
                            <>
                              <span style={{ fontSize: 11, fontWeight: 500, padding: "3px 10px", borderRadius: 12, background: PEOPLE.kyle.light, color: PEOPLE.kyle.text }}>Kyle</span>
                              <span style={{ fontSize: 11, fontWeight: 500, padding: "3px 10px", borderRadius: 12, background: PEOPLE.luka.light, color: PEOPLE.luka.text }}>Luka</span>
                            </>
                          ) : (
                            <span style={{ fontSize: 11, fontWeight: 500, padding: "3px 10px", borderRadius: 12, background: p.light, color: p.text }}>{p.name}</span>
                          )}
                          <span style={{
                            fontSize: 11, fontWeight: 500, padding: "3px 10px", borderRadius: 12,
                            background: ev.status === "confirmed" ? "#e8e8e8" : "#f5f5f5",
                            color: ev.status === "confirmed" ? "#2d2d2d" : "#888",
                          }}>{ev.status}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div style={{ textAlign: "right", padding: "8px 16px 12px" }}>
                <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", color: "#3c4043", fontSize: 14, fontWeight: 500, cursor: "pointer", padding: "6px 12px", borderRadius: 4 }}>Close</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
