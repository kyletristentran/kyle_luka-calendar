import { useState, useMemo } from "react";

const PEOPLE = {
  kyle: { name: "Kyle", color: "#5BA4CF", light: "#dceefb", text: "#1a5276" },
  luka: { name: "Luka", color: "#8B1A2B", light: "#f5dde2", text: "#6b0f1e" },
  both: { name: "Kyle & Luka", color: "linear-gradient(135deg, #5BA4CF 50%, #8B1A2B 50%)", solid: "#7a5f7b", light: "#ece4f0", text: "#4a2d5e" },
};

const EVENTS = [
  { date: "2026-02-08", title: "Tiki Disco Winter", venue: "Knockdown Center, BK", status: "confirmed", person: "both", time: "10pm" },
  { date: "2026-02-12", title: "RawCuts", venue: "Secret Location, BK", status: "confirmed", person: "both", time: "11pm" },
  { date: "2026-02-20", title: "Bedouin", venue: "Capitale, NY", status: "tentative", person: "both", time: "10pm" },
  { date: "2026-02-21", title: "Cassian", venue: "Navy Yard, BK", status: "confirmed", person: "both", time: "10pm" },
  { date: "2026-03-01", title: "Tiki Disco Winter", venue: "Knockdown Center, BK", status: "confirmed", person: "both", time: "10pm" },
  { date: "2026-03-20", title: "Prospa b2b Josh Baker", venue: "Navy Yard, BK", status: "tentative", person: "both", time: "10pm" },
  { date: "2026-03-21", title: "Carl Cox", venue: "Navy Yard, BK", status: "tentative", person: "both", time: "11pm" },
  { date: "2026-04-03", title: "SIDEPIECE", venue: "Navy Yard, BK", status: "tentative", person: "both", time: "10pm" },
  { date: "2026-04-20", title: "Hot Since 82", venue: "House of Yes, BK", status: "tentative", person: "both", time: "11pm" },
  { date: "2026-04-25", title: "CID", venue: "99 Scott, BK", status: "confirmed", person: "both", time: "11pm" },
  { date: "2026-05-23", title: "Solomun", venue: "Fulton Fish Market, QE", status: "confirmed", person: "both", time: "6pm" },
  { date: "2026-06-20", title: "Beltran", venue: "Navy Yard, BK", status: "tentative", person: "both", time: "10pm" },
  { date: "2026-07-25", title: "Klangkeuntsler", venue: "Monegros Desert Fest, SP", status: "confirmed", person: "both", time: "All day" },
];

const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAY_HEADERS = ["SUN","MON","TUE","WED","THU","FRI","SAT"];
const MINI_DAYS = ["S","M","T","W","T","F","S"];

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

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDay(year, month);
  const prevMonthDays = getDaysInMonth(year, month === 0 ? 11 : month - 1);

  const prev = () => { if (month === 0) { setMonth(11); setYear(y=>y-1); } else setMonth(m=>m-1); setSelected(null); };
  const next = () => { if (month === 11) { setMonth(0); setYear(y=>y+1); } else setMonth(m=>m+1); setSelected(null); };

  const today = new Date();
  const isToday = (d) => today.getFullYear() === year && today.getMonth() === month && today.getDate() === d;

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
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", fontFamily: "'Google Sans', 'Segoe UI', Roboto, sans-serif", background: "#fff", color: "#3c4043", overflow: "hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;700&family=Roboto:wght@300;400;500&display=swap" rel="stylesheet" />

      {/* TOP BAR */}
      <div style={{ display: "flex", alignItems: "center", padding: "8px 16px", borderBottom: "1px solid #dadce0", flexShrink: 0, gap: 16, height: 64 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <svg width="36" height="36" viewBox="0 0 36 36" style={{ flexShrink: 0 }}>
            <rect width="36" height="36" rx="4" fill="#4285f4"/>
            <text x="18" y="25" textAnchor="middle" fill="#fff" fontSize="18" fontWeight="700" fontFamily="Google Sans, sans-serif">{today.getDate()}</text>
          </svg>
          <span style={{ fontSize: 22, fontWeight: 400, color: "#3c4043" }}>Calendar</span>
        </div>
        <button onClick={() => { setYear(today.getFullYear()); setMonth(today.getMonth()); }} style={{ border: "1px solid #dadce0", borderRadius: 4, padding: "6px 20px", background: "#fff", fontSize: 14, fontWeight: 500, color: "#3c4043", cursor: "pointer", marginLeft: 16 }}>Today</button>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <button onClick={prev} style={{ background: "none", border: "none", cursor: "pointer", padding: 8, borderRadius: "50%", display: "flex", alignItems: "center", color: "#5f6368", fontSize: 20 }}>‹</button>
          <button onClick={next} style={{ background: "none", border: "none", cursor: "pointer", padding: 8, borderRadius: "50%", display: "flex", alignItems: "center", color: "#5f6368", fontSize: 20 }}>›</button>
        </div>
        <span style={{ fontSize: 22, fontWeight: 400, color: "#3c4043" }}>{MONTH_NAMES[month]} {year}</span>
        <div style={{ marginLeft: "auto", fontSize: 14, color: "#5f6368", border: "1px solid #dadce0", borderRadius: 4, padding: "6px 16px" }}>Month</div>
      </div>

      {/* BODY */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

        {/* SIDEBAR */}
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
                    background: t ? "#1a73e8" : "transparent", color: t ? "#fff" : "#3c4043",
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
                  <div style={{ width: 14, height: 14, borderRadius: 3, flexShrink: 0, background: "linear-gradient(135deg, #5BA4CF 50%, #8B1A2B 50%)" }} />
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
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#0b8043" }} />
                <span style={{ fontSize: 12, color: "#3c4043" }}>Confirmed · <strong>{EVENTS.filter(e=>e.status==="confirmed").length}</strong></span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", border: "2px solid #e37400", background: "transparent" }} />
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
        </div>

        {/* MAIN GRID */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", borderBottom: "1px solid #dadce0", flexShrink: 0 }}>
            {DAY_HEADERS.map(d => (
              <div key={d} style={{ textAlign: "center", fontSize: 11, fontWeight: 500, color: "#70757a", padding: "8px 0", letterSpacing: "0.8px" }}>{d}</div>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gridTemplateRows: "repeat(6, 1fr)", flex: 1 }}>
            {cells.map((cell, i) => {
              const key = cell.current ? fmtKey(year, month, cell.day) : null;
              const events = key ? (eventMap[key] || []) : [];
              const t = cell.current && isToday(cell.day);
              const isSelected = key && selected === key;
              return (
                <div key={i} onClick={() => key && events.length && setSelected(isSelected ? null : key)} style={{
                  borderRight: (i + 1) % 7 !== 0 ? "1px solid #dadce0" : "none",
                  borderBottom: "1px solid #dadce0",
                  padding: "4px 8px",
                  background: isSelected ? "#e8f0fe" : "#fff",
                  cursor: events.length ? "pointer" : "default",
                  minHeight: 0, overflow: "hidden",
                  transition: "background 0.15s",
                  opacity: cell.current ? 1 : 0.35,
                }}>
                  <div style={{ marginBottom: 2 }}>
                    <span style={{
                      fontSize: 12, fontWeight: 500,
                      display: "inline-flex", alignItems: "center", justifyContent: "center",
                      width: t ? 26 : "auto", height: t ? 26 : "auto",
                      borderRadius: "50%", background: t ? "#1a73e8" : "transparent",
                      color: t ? "#fff" : cell.current ? "#3c4043" : "#70757a",
                    }}>{cell.day}</span>
                  </div>

                  {/* Event chips */}
                  {events.map((ev, j) => {
                    const p = PEOPLE[ev.person];
                    const isBoth = ev.person === "both";
                    const chipBg = isBoth ? "linear-gradient(135deg, #5BA4CF 0%, #5BA4CF 48%, #fff 48%, #fff 52%, #8B1A2B 52%, #8B1A2B 100%)" : p.color;
                    const isTentative = ev.status === "tentative";
                    return (
                      <div key={j}
                        onMouseEnter={() => setHovered(`${key}-${j}`)}
                        onMouseLeave={() => setHovered(null)}
                        style={{
                          fontSize: 11, fontWeight: 500, color: "#fff",
                          background: chipBg,
                          borderRadius: 4, padding: "2px 6px", marginBottom: 2,
                          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                          opacity: hovered === `${key}-${j}` ? 0.85 : 1,
                          transition: "opacity 0.15s",
                          borderLeft: isTentative ? "3px dashed rgba(255,255,255,0.5)" : "none",
                        }}>
                        <span style={{ fontSize: 10, marginRight: 3, opacity: 0.85 }}>{ev.time}</span>
                        {ev.title}
                        {isTentative && <span style={{ marginLeft: 4, fontSize: 9 }}>❓</span>}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* EVENT DETAIL POPUP */}
      {selected && eventMap[selected] && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.3)", zIndex: 100 }} onClick={() => setSelected(null)}>
          <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: 12, padding: 0, minWidth: 380, boxShadow: "0 24px 48px rgba(0,0,0,0.18)", maxWidth: 460, overflow: "hidden" }}>
            {eventMap[selected].map((ev, i) => {
              const p = PEOPLE[ev.person];
              const isBoth = ev.person === "both";
              const headerBg = isBoth ? "linear-gradient(135deg, #5BA4CF 50%, #8B1A2B 50%)" : p.color;
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
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span>📍</span> {ev.venue}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
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
                          background: ev.status === "confirmed" ? "#e6f4ea" : "#fce8e6",
                          color: ev.status === "confirmed" ? "#137333" : "#c5221f",
                        }}>{ev.status}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            <div style={{ textAlign: "right", padding: "8px 16px 12px" }}>
              <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", color: "#1a73e8", fontSize: 14, fontWeight: 500, cursor: "pointer", padding: "6px 12px", borderRadius: 4 }}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
