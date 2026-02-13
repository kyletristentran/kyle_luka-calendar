import { useState, useMemo } from "react";

const EVENTS = [
  { date: "2026-02-08", title: "Tiki Disco Winter", venue: "Knockdown Center, BK", status: "confirmed", time: "22:00", endTime: "04:00", color: "#7A1B2D" },
  { date: "2026-02-12", title: "RawCuts", venue: "Secret Location, BK", status: "confirmed", time: "23:00", endTime: "04:00", color: "#7A1B2D" },
  { date: "2026-02-20", title: "Bedouin", venue: "Capitale, NY", status: "tentative", time: "22:00", endTime: "04:00", color: "#B8860B" },
  { date: "2026-02-21", title: "Cassian", venue: "Navy Yard, BK", status: "confirmed", time: "22:00", endTime: "04:00", color: "#7A1B2D" },
  { date: "2026-03-01", title: "Tiki Disco Winter", venue: "Knockdown Center, BK", status: "confirmed", time: "22:00", endTime: "04:00", color: "#7A1B2D" },
  { date: "2026-03-20", title: "Prospa b2b Josh Baker", venue: "Navy Yard, BK", status: "tentative", time: "22:00", endTime: "04:00", color: "#B8860B" },
  { date: "2026-03-21", title: "Carl Cox", venue: "Navy Yard, BK", status: "tentative", time: "22:00", endTime: "05:00", color: "#B8860B" },
  { date: "2026-04-03", title: "SIDEPIECE", venue: "Navy Yard, BK", status: "tentative", time: "22:00", endTime: "04:00", color: "#B8860B" },
  { date: "2026-04-20", title: "Hot Since 82", venue: "House of Yes, BK", status: "tentative", time: "22:00", endTime: "04:00", color: "#B8860B" },
  { date: "2026-04-25", title: "CID", venue: "99 Scott, BK", status: "confirmed", time: "22:00", endTime: "04:00", color: "#7A1B2D" },
  { date: "2026-05-23", title: "Solomun", venue: "Fulton Fish Market, QE", status: "confirmed", time: "14:00", endTime: "23:00", color: "#7A1B2D" },
  { date: "2026-06-20", title: "Beltran", venue: "Navy Yard, BK", status: "tentative", time: "22:00", endTime: "04:00", color: "#B8860B" },
  { date: "2026-07-25", title: "Klangkeuntsler", venue: "Monegros Desert Festival, Fraga, SP", status: "confirmed", time: "16:00", endTime: "06:00", color: "#4A0E1B" },
];

const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAY_ABBR = ["S","M","T","W","T","F","S"];

function getDaysInMonth(y, m) { return new Date(y, m + 1, 0).getDate(); }
function getFirstDayOfWeek(y, m) { return new Date(y, m, 1).getDay(); }
function fmtKey(y, m, d) { return `${y}-${String(m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`; }
function getDayName(dateStr) {
  return new Date(dateStr + "T12:00:00").toLocaleDateString("en-US", { weekday: "long" }).toUpperCase();
}
function getDayNum(dateStr) { return new Date(dateStr + "T12:00:00").getDate(); }
function getMonthShort(dateStr) { return new Date(dateStr + "T12:00:00").toLocaleDateString("en-US", { month: "short" }); }

const eventMap = {};
EVENTS.forEach(e => { if (!eventMap[e.date]) eventMap[e.date] = []; eventMap[e.date].push(e); });

export default function App() {
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(1);
  const [selectedDate, setSelectedDate] = useState("2026-02-08");

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfWeek(year, month);
  const prevMonthDays = getDaysInMonth(year, month === 0 ? 11 : month - 1);

  const prev = () => { if (month === 0) { setMonth(11); setYear(y=>y-1); } else setMonth(m=>m-1); };
  const next = () => { if (month === 11) { setMonth(0); setYear(y=>y+1); } else setMonth(m=>m+1); };

  const calendarCells = useMemo(() => {
    const cells = [];
    for (let i = 0; i < firstDay; i++) cells.push({ day: prevMonthDays - firstDay + 1 + i, outside: true });
    for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d, outside: false });
    const remaining = 42 - cells.length;
    for (let i = 1; i <= remaining; i++) cells.push({ day: i, outside: true });
    return cells;
  }, [firstDay, daysInMonth, prevMonthDays]);

  const selectedEvents = eventMap[selectedDate] || [];

  // Get upcoming events from selected date forward
  const upcomingEvents = useMemo(() => {
    return EVENTS.filter(e => e.date >= selectedDate).slice(0, 5);
  }, [selectedDate]);

  // Group events by date for timeline
  const groupedUpcoming = useMemo(() => {
    const groups = {};
    upcomingEvents.forEach(e => {
      if (!groups[e.date]) groups[e.date] = [];
      groups[e.date].push(e);
    });
    return Object.entries(groups);
  }, [upcomingEvents]);

  // Count confirmed & tentative for this month
  const monthEvents = EVENTS.filter(e => {
    const d = new Date(e.date);
    return d.getFullYear() === year && d.getMonth() === month;
  });
  const confirmedCount = monthEvents.filter(e => e.status === "confirmed").length;
  const tentativeCount = monthEvents.filter(e => e.status === "tentative").length;

  const maroon = "#7A1B2D";
  const maroonLight = "rgba(122,27,45,0.08)";
  const maroonMid = "rgba(122,27,45,0.15)";

  return (
    <div style={{ minHeight: "100vh", background: "#ECEEF1", fontFamily: "'Times New Roman', 'Georgia', serif", display: "flex", justifyContent: "center", padding: "20px 12px" }}>
      <div style={{ width: "100%", maxWidth: 420, display: "flex", flexDirection: "column", gap: 0 }}>

        {/* ─── TOP: CALENDAR CARD ─── */}
        <div style={{ background: "#F7F7F9", borderRadius: "28px 28px 0 0", padding: "28px 24px 20px", position: "relative" }}>

          {/* Avatar + Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: `linear-gradient(135deg, ${maroon}, #4A0E1B)`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 16, fontWeight: "bold", letterSpacing: 1 }}>KL</div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <button onClick={prev} style={{ background: "none", border: "none", fontSize: 18, color: "#888", cursor: "pointer", padding: "4px 8px" }}>‹</button>
              <button onClick={next} style={{ background: "none", border: "none", fontSize: 18, color: "#888", cursor: "pointer", padding: "4px 8px" }}>›</button>
              <div style={{ width: 1, height: 20, background: "#ddd", margin: "0 4px" }} />
              <button style={{ background: "none", border: "none", fontSize: 16, color: "#888", cursor: "pointer" }}>⟲</button>
              <button style={{ background: "none", border: `1.5px solid ${maroon}`, borderRadius: "50%", width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", color: maroon, fontSize: 18, cursor: "pointer", lineHeight: 1 }}>+</button>
            </div>
          </div>

          {/* Month Title */}
          <h1 style={{ fontSize: 30, fontWeight: "normal", fontStyle: "italic", color: "#1a1a1a", margin: "0 0 20px 0", letterSpacing: "-0.5px" }}>
            {MONTH_NAMES[month]} <span style={{ fontStyle: "normal", fontSize: 16, color: "#aaa", fontWeight: "normal" }}>{year}</span>
          </h1>

          {/* Day Headers */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 0, marginBottom: 6 }}>
            {DAY_ABBR.map((d, i) => (
              <div key={i} style={{ textAlign: "center", fontSize: 12, color: "#999", padding: "4px 0", fontStyle: "italic" }}>{d}</div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2 }}>
            {calendarCells.map((cell, i) => {
              const dateKey = cell.outside ? null : fmtKey(year, month, cell.day);
              const hasEvent = dateKey && eventMap[dateKey];
              const isSelected = dateKey === selectedDate;
              const evts = dateKey ? (eventMap[dateKey] || []) : [];
              const hasConfirmed = evts.some(e => e.status === "confirmed");
              const hasTentative = evts.some(e => e.status === "tentative");

              return (
                <div key={i}
                  onClick={() => { if (!cell.outside) setSelectedDate(fmtKey(year, month, cell.day)); }}
                  style={{
                    textAlign: "center", padding: "10px 0", cursor: cell.outside ? "default" : "pointer",
                    position: "relative", borderRadius: 12, transition: "all 0.2s",
                    background: isSelected ? maroon : hasEvent ? maroonLight : "transparent",
                    color: isSelected ? "#fff" : cell.outside ? "#ccc" : hasEvent ? maroon : "#555",
                  }}>
                  <span style={{ fontSize: 15, fontWeight: isSelected || hasEvent ? "bold" : "normal" }}>{cell.day}</span>
                  {hasEvent && !isSelected && (
                    <div style={{ display: "flex", gap: 3, justifyContent: "center", marginTop: 3 }}>
                      {hasConfirmed && <div style={{ width: 5, height: 5, borderRadius: "50%", background: maroon }} />}
                      {hasTentative && <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#B8860B" }} />}
                    </div>
                  )}
                  {isSelected && hasEvent && (
                    <div style={{ display: "flex", gap: 3, justifyContent: "center", marginTop: 3 }}>
                      <div style={{ width: 5, height: 5, borderRadius: "50%", background: "rgba(255,255,255,0.7)" }} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ─── Drag Handle ─── */}
        <div style={{ background: "#fff", display: "flex", justifyContent: "center", padding: "10px 0 6px" }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: "#d0d0d0" }} />
        </div>

        {/* ─── BOTTOM: EVENTS PANEL ─── */}
        <div style={{ background: "#fff", borderRadius: "0 0 28px 28px", padding: "8px 24px 32px", flex: 1, minHeight: 320 }}>

          {/* Summary line */}
          {monthEvents.length > 0 && (
            <div style={{ fontSize: 13, color: "#999", marginBottom: 16, fontStyle: "italic" }}>
              {confirmedCount > 0 && <><span style={{ color: maroon, fontWeight: "bold" }}>{confirmedCount} confirmed</span></>}
              {confirmedCount > 0 && tentativeCount > 0 && " · "}
              {tentativeCount > 0 && <><span style={{ color: "#B8860B" }}>{tentativeCount} tentative</span></>}
              {monthEvents.length > 0 && " this month"}
            </div>
          )}

          {/* Timeline Events */}
          {groupedUpcoming.map(([date, events], gi) => (
            <div key={date} style={{ marginBottom: 20 }}>
              {/* Day Header */}
              <div style={{ fontSize: 11, fontWeight: "bold", letterSpacing: "0.12em", color: "#aaa", textTransform: "uppercase", marginBottom: 10 }}>
                {getDayName(date)} {getDayNum(date)}
              </div>

              {events.map((event, ei) => (
                <div key={ei} style={{ display: "flex", gap: 14, marginBottom: 14, alignItems: "stretch" }}>
                  {/* Time column */}
                  <div style={{ width: 48, flexShrink: 0, textAlign: "right", paddingTop: 2 }}>
                    <div style={{ fontSize: 13, color: "#888" }}>{event.time}</div>
                    <div style={{ fontSize: 11, color: "#bbb" }}>{event.endTime}</div>
                  </div>

                  {/* Color bar */}
                  <div style={{ width: 3, borderRadius: 2, background: event.status === "confirmed" ? maroon : "#B8860B", flexShrink: 0 }} />

                  {/* Event details */}
                  <div style={{ flex: 1, paddingTop: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: "bold", color: "#1a1a1a", marginBottom: 2 }}>{event.title}</div>
                    <div style={{ fontSize: 12, color: "#999" }}>{event.venue}</div>
                    {event.status === "tentative" && (
                      <span style={{ display: "inline-block", marginTop: 4, fontSize: 10, fontStyle: "italic", color: "#B8860B", background: "rgba(184,134,11,0.08)", padding: "2px 8px", borderRadius: 4, letterSpacing: "0.05em" }}>Tentative</span>
                    )}
                  </div>

                  {/* Status dot */}
                  <div style={{ display: "flex", alignItems: "flex-start", paddingTop: 6 }}>
                    <div style={{ width: 7, height: 7, borderRadius: "50%", background: event.status === "confirmed" ? maroon : "#B8860B" }} />
                  </div>
                </div>
              ))}
            </div>
          ))}

          {groupedUpcoming.length === 0 && (
            <div style={{ textAlign: "center", padding: "40px 0", color: "#ccc", fontStyle: "italic", fontSize: 14 }}>
              No upcoming events from this date
            </div>
          )}
        </div>

        {/* ─── BOTTOM NAV ─── */}
        <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center", padding: "14px 20px", marginTop: 8 }}>
          {[
            { icon: "⊞", label: "Grid" },
            { icon: "☐", label: "Tasks" },
            { icon: "☷", active: true, label: "Calendar" },
            { icon: "⚬", label: "Alerts" },
            { icon: "☐", label: "Chat" },
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, cursor: "pointer" }}>
              <span style={{ fontSize: 18, color: item.active ? maroon : "#bbb", transition: "color 0.2s" }}>{item.icon}</span>
              <span style={{ fontSize: 9, color: item.active ? maroon : "#ccc", letterSpacing: "0.05em" }}>{item.label}</span>
            </div>
          ))}
        </div>

        {/* ─── Quick Month Jump ─── */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center", marginTop: 8, paddingBottom: 12 }}>
          {MONTH_NAMES.map((m, idx) => {
            const hasEv = EVENTS.some(e => { const d = new Date(e.date); return d.getFullYear() === 2026 && d.getMonth() === idx; });
            const isCurrent = month === idx && year === 2026;
            return (
              <button key={m} onClick={() => { setYear(2026); setMonth(idx); }}
                style={{
                  background: isCurrent ? maroon : hasEv ? maroonLight : "transparent",
                  border: hasEv ? `1px solid ${maroon}33` : "1px solid #e0e0e0",
                  borderRadius: 8, padding: "5px 10px", cursor: "pointer",
                  fontSize: 11, fontFamily: "'Times New Roman', serif",
                  color: isCurrent ? "#fff" : hasEv ? maroon : "#bbb",
                  fontWeight: isCurrent ? "bold" : "normal",
                  transition: "all 0.2s",
                }}>
                {m.slice(0, 3)}
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
}
