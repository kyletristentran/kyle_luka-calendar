import { useState, useMemo, useEffect } from "react";

/* ── Maroon/Burgundy Palette ── */
const C = {
  pri: "#8B1A2B",
  priDark: "#6b0f1e",
  priLight: "#a93545",
  priSoft: "#f5dde2",
  priTint: "rgba(139,26,43,0.06)",
  text: "#3c2025",
  textSec: "#7a4a52",
  textMuted: "#a8757e",
  border: "#e8d0d5",
  bg: "#fff",
  bgSub: "#fdf6f7",
  gold: "#FFCC00",
  goldLight: "#FFF4B3",
};

const EVENTS = [
  { date: "2026-02-02", title: "KT / Dr. Arthur", venue: "USC", status: "confirmed", time: "12:30 PM", endTime: "1:30 PM", desc: "Meeting with Dr. Arthur to discuss academic progress and research opportunities." },
  { date: "2026-02-02", title: "Tutoring - Noah", venue: "USC", status: "confirmed", time: "5:00 PM", endTime: "6:00 PM", desc: "Weekly tutoring session with Noah." },
  { date: "2026-02-03", title: "WRIT 340: Submit Student Profile", venue: "USC", status: "confirmed", time: "11:45 PM", endTime: "11:59 PM", desc: "Deadline for submitting Student Profile assignment for WRIT 340." },
  { date: "2026-02-04", title: "USC HOLD - TRE", venue: "USC", status: "confirmed", time: "2:00 PM", endTime: "3:00 PM", desc: "TREA hold session at USC campus." },
  { date: "2026-02-04", title: "Tutoring - Kenne", venue: "USC", status: "confirmed", time: "5:00 PM", endTime: "6:00 PM", desc: "Weekly tutoring session with Kenne." },
  { date: "2026-02-05", title: "KT / Devon - Therapy", venue: "USC", status: "confirmed", time: "1:00 PM", endTime: "2:00 PM", desc: "Therapy session with Devon." },
  { date: "2026-02-05", title: "WRIT 340: Email Illumin Topics", venue: "USC", status: "confirmed", time: "11:45 PM", endTime: "11:59 PM", desc: "Email Illumin article topics for WRIT 340 class." },
  { date: "2026-02-05", title: "Illumin Oral Pres", venue: "USC", status: "confirmed", time: "11:59 PM", endTime: "11:59 PM", desc: "Illumin oral presentation deadline." },
  { date: "2026-02-06", title: "RED 469: Mix", venue: "USC", status: "confirmed", time: "9:00 AM", endTime: "10:00 AM", desc: "RED 469 mixing session." },
  { date: "2026-02-06", title: "Tutoring - Erwin", venue: "USC", status: "confirmed", time: "1:00 PM", endTime: "2:00 PM", desc: "Weekly tutoring session with Erwin." },
  { date: "2026-02-09", title: "KT / Meina", venue: "USC", status: "confirmed", time: "2:00 PM", endTime: "3:00 PM", desc: "Meeting with Meina." },
  { date: "2026-02-10", title: "KT / SkinFX", venue: "USC", status: "confirmed", time: "10:30 AM", endTime: "11:30 AM", desc: "SkinFX appointment." },
  { date: "2026-02-12", title: "WRIT 340: Submit Illumin Rough Draft", venue: "USC", status: "confirmed", time: "11:45 PM", endTime: "11:59 PM", desc: "Submit Illumin rough draft for WRIT 340." },
  { date: "2026-02-13", title: "RED 469: Mix", venue: "USC", status: "confirmed", time: "9:00 AM", endTime: "10:00 AM", desc: "RED 469 mixing session." },
  { date: "2026-02-13", title: "Spring 26 Commencement", venue: "USC", status: "confirmed", time: "10:00 PM", endTime: "11:00 PM", desc: "Spring 2026 commencement information." },
  { date: "2026-02-13", title: "Observational Analysis", venue: "USC", status: "confirmed", time: "11:59 PM", endTime: "11:59 PM", desc: "Observational analysis assignment deadline." },
  { date: "2026-02-14", title: "Valentine's Day", venue: "", status: "confirmed", time: "All day", endTime: "", desc: "Happy Valentine's Day! 💕" },
  { date: "2026-02-16", title: "Presidents' Day", venue: "", status: "confirmed", time: "All day", endTime: "", desc: "Federal holiday — no classes." },
  { date: "2026-02-16", title: "TREA E-Board Meeting", venue: "USC", status: "confirmed", time: "3:00 PM", endTime: "4:30 PM", desc: "TREA executive board meeting to discuss upcoming events and organization strategy." },
  { date: "2026-02-17", title: "WRIT 340: Illumin Oral Pres", venue: "USC", status: "confirmed", time: "5:00 PM", endTime: "6:00 PM", desc: "Oral presentation for Illumin article in WRIT 340." },
  { date: "2026-02-18", title: "Dining Society Dinner", venue: "USC", status: "confirmed", time: "6:30 PM", endTime: "8:30 PM", desc: "Dining society dinner event." },
  { date: "2026-02-18", title: "Final Draft Illumin", venue: "USC", status: "confirmed", time: "11:59 PM", endTime: "11:59 PM", desc: "Final draft deadline for Illumin article." },
  { date: "2026-02-19", title: "KT / Ray", venue: "USC", status: "confirmed", time: "10:30 AM", endTime: "11:30 AM", desc: "Meeting with Ray." },
  { date: "2026-02-19", title: "WRIT 340: Submit Illumin Final Draft", venue: "USC", status: "confirmed", time: "11:45 PM", endTime: "11:59 PM", desc: "Submit final draft of Illumin article for WRIT 340." },
  { date: "2026-02-20", title: "RED 469: Mix", venue: "USC", status: "confirmed", time: "9:00 AM", endTime: "10:00 AM", desc: "RED 469 mixing session." },
  { date: "2026-02-22", title: "Project Angel Food", venue: "USC", status: "confirmed", time: "12:45 PM", endTime: "3:00 PM", desc: "Volunteer event with Project Angel Food." },
  { date: "2026-02-24", title: "Resume Review", venue: "USC", status: "tentative", time: "6:30 PM", endTime: "8:00 PM", desc: "Professional resume review session. Bring an updated copy of your resume." },
  { date: "2026-02-25", title: "Dining Society Dinner", venue: "USC", status: "confirmed", time: "6:30 PM", endTime: "8:30 PM", desc: "Dining society dinner event." },
  { date: "2026-02-26", title: "Lever Friends Hangout", venue: "USC", status: "confirmed", time: "6:00 PM", endTime: "8:00 PM", desc: "Casual hangout with Lever friends." },
  { date: "2026-02-27", title: "RED 469: Mix", venue: "USC", status: "confirmed", time: "9:00 AM", endTime: "10:00 AM", desc: "RED 469 mixing session." },
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

function addToGCal(ev) {
  const d = ev.date.replace(/-/g, "");
  const url = new URL("https://calendar.google.com/calendar/render");
  url.searchParams.set("action", "TEMPLATE");
  url.searchParams.set("text", ev.title);
  url.searchParams.set("dates", `${d}/${d}`);
  url.searchParams.set("details", ev.desc);
  if (ev.venue) url.searchParams.set("location", ev.venue);
  window.open(url.toString(), "_blank");
}

export default function App() {
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(1);
  const [selectedDate, setSelectedDate] = useState(null);
  const [popupEvent, setPopupEvent] = useState(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);

  const today = new Date();
  const todayKey = fmtKey(today.getFullYear(), today.getMonth(), today.getDate());
  const isToday = (d) => today.getFullYear() === year && today.getMonth() === month && today.getDate() === d;

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDay(year, month);
  const prevMonthDays = getDaysInMonth(year, month === 0 ? 11 : month - 1);

  const prev = () => { if (month === 0) { setMonth(11); setYear(y=>y-1); } else setMonth(m=>m-1); };
  const next = () => { if (month === 11) { setMonth(0); setYear(y=>y+1); } else setMonth(m=>m+1); };

  const cells = useMemo(() => {
    const c = [];
    for (let i = 0; i < firstDay; i++) c.push({ day: prevMonthDays - firstDay + 1 + i, current: false });
    for (let d = 1; d <= daysInMonth; d++) c.push({ day: d, current: true });
    while (c.length < 42) c.push({ day: c.length - firstDay - daysInMonth + 1, current: false });
    return c;
  }, [firstDay, daysInMonth, prevMonthDays]);

  // Get events for current month, sorted by date
  const monthEvents = useMemo(() => {
    return EVENTS.filter(e => {
      const [ey, em] = e.date.split("-").map(Number);
      return ey === year && em === month + 1;
    }).sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));
  }, [year, month]);

  // Filtered events
  const filteredEvents = useMemo(() => {
    let evs = monthEvents;
    if (filter === "upcoming") evs = evs.filter(e => e.date >= todayKey);
    if (filter === "past") evs = evs.filter(e => e.date < todayKey);
    if (filter === "week") {
      const start = new Date(today); start.setDate(today.getDate() - today.getDay());
      const end = new Date(start); end.setDate(start.getDate() + 7);
      const sk = fmtKey(start.getFullYear(), start.getMonth(), start.getDate());
      const ek = fmtKey(end.getFullYear(), end.getMonth(), end.getDate());
      evs = evs.filter(e => e.date >= sk && e.date < ek);
    }
    if (search) evs = evs.filter(e => e.title.toLowerCase().includes(search.toLowerCase()) || e.venue.toLowerCase().includes(search.toLowerCase()));
    return evs;
  }, [monthEvents, filter, search, todayKey]);

  // Stats
  const confirmed = monthEvents.filter(e => e.status === "confirmed").length;
  const tentative = monthEvents.filter(e => e.status === "tentative").length;
  const upcoming = monthEvents.filter(e => e.date >= todayKey).length;
  const thisWeek = (() => {
    const start = new Date(today); start.setDate(today.getDate() - today.getDay());
    const end = new Date(start); end.setDate(start.getDate() + 7);
    const sk = fmtKey(start.getFullYear(), start.getMonth(), start.getDate());
    const ek = fmtKey(end.getFullYear(), end.getMonth(), end.getDate());
    return monthEvents.filter(e => e.date >= sk && e.date < ek).length;
  })();

  const hasEvent = (d) => !!eventMap[fmtKey(year, month, d)];

  const fmtDate = (dateStr) => {
    const d = new Date(dateStr + "T12:00:00");
    return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
  };

  return (
    <>
      <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Crimson+Text:wght@400;600;700&family=Open+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Open Sans', sans-serif; color: ${C.text}; background: #fff; line-height: 1.6; }
        .navbar { background: ${C.pri}; padding: 1rem 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1); position: sticky; top: 0; z-index: 100; }
        .navbar-content { max-width: 1200px; margin: 0 auto; padding: 0 2rem; display: flex; justify-content: space-between; align-items: center; min-height: 50px; }
        .navbar-brand { color: #fff; font-family: 'Crimson Text', serif; font-weight: 700; font-size: 1.1rem; text-transform: uppercase; letter-spacing: 2px; text-decoration: none; }
        .navbar-sub { font-size: 11px; opacity: 0.9; color: #fff; margin-top: 2px; letter-spacing: 0.5px; font-family: 'Open Sans', sans-serif; }
        .nav-links { display: flex; gap: 1rem; align-items: center; }
        .nav-link { color: #fff; font-weight: 600; font-size: .85rem; text-transform: uppercase; letter-spacing: .5px; text-decoration: none; padding: 0.4rem 0.8rem; border: 1px solid transparent; transition: 0.3s; cursor: pointer; background: none; font-family: 'Open Sans', sans-serif; }
        .nav-link:hover { border-color: rgba(255,255,255,0.3); }
        .nav-link.active { background: rgba(255,255,255,0.15); border-color: rgba(255,255,255,0.3); }

        .hero { background: ${C.bgSub}; padding: 3rem 0 2rem; border-bottom: 1px solid ${C.border}; text-align: center; }
        .hero h1 { font-family: 'Crimson Text', serif; font-size: 2.5rem; font-weight: 700; color: ${C.pri}; margin-bottom: 0.5rem; }
        .hero p { font-size: 1.1rem; color: ${C.textSec}; }

        .controls { background: #fff; padding: 1.5rem 0; border-bottom: 2px solid ${C.pri}; }
        .controls-inner { max-width: 1200px; margin: 0 auto; padding: 0 2rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; }
        .filter-tabs { display: flex; gap: 0; border: 2px solid ${C.pri}; }
        .filter-tab { padding: 0.7rem 1.5rem; border: none; background: #fff; color: ${C.pri}; font-family: 'Open Sans', sans-serif; font-weight: 600; font-size: .8rem; cursor: pointer; text-transform: uppercase; letter-spacing: .5px; transition: 0.3s; border-right: 1px solid ${C.pri}; }
        .filter-tab:last-child { border-right: none; }
        .filter-tab.active, .filter-tab:hover { background: ${C.pri}; color: #fff; }
        .search-box { position: relative; min-width: 260px; }
        .search-input { width: 100%; padding: 0.7rem 1rem 0.7rem 2.5rem; border: 2px solid ${C.border}; font-family: 'Open Sans', sans-serif; font-size: 0.9rem; transition: border-color 0.3s; }
        .search-input:focus { outline: none; border-color: ${C.pri}; }
        .search-icon { position: absolute; left: 0.8rem; top: 50%; transform: translateY(-50%); color: ${C.textMuted}; }

        .main { max-width: 1200px; margin: 0 auto; padding: 2rem; }
        .section-title { border-bottom: 2px solid ${C.pri}; font-family: 'Crimson Text', serif; font-weight: 700; margin-bottom: 1.5rem; text-transform: uppercase; font-size: 1.1rem; letter-spacing: .3px; padding-bottom: 0.8rem; }
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; margin-bottom: 3rem; }
        .stat-card { background: ${C.bgSub}; border: 1px solid ${C.border}; padding: 1.5rem; text-align: center; transition: transform 0.3s; }
        .stat-card:hover { transform: translateY(-2px); }
        .stat-value { font-size: 2.5rem; font-weight: 700; color: ${C.pri}; line-height: 1; margin-bottom: 0.5rem; font-family: 'Crimson Text', serif; }
        .stat-label { color: ${C.textSec}; font-size: 0.85rem; font-weight: 600; text-transform: uppercase; letter-spacing: .5px; }

        .content-grid { display: grid; grid-template-columns: 300px 1fr; gap: 2rem; align-items: start; }
        @media (max-width: 900px) { .content-grid { grid-template-columns: 1fr; } }

        .event-item { background: #fff; border: 1px solid ${C.border}; margin-bottom: 1.5rem; transition: box-shadow 0.3s; cursor: pointer; }
        .event-item:hover { box-shadow: 0 4px 12px rgba(139,26,43,0.1); }
        .event-content { padding: 1.5rem; display: grid; grid-template-columns: 80px 1fr auto; gap: 1.5rem; align-items: start; }
        .event-date-box { background: ${C.bgSub}; border: 2px solid ${C.border}; padding: 1rem 0.5rem; text-align: center; transition: 0.3s; min-width: 70px; }
        .event-date-box.today { background: ${C.pri}; border-color: ${C.pri}; color: #fff; }
        .event-date-box.today .ev-day, .event-date-box.today .ev-month { color: #fff; }
        .ev-day { font-size: 1.8rem; font-weight: 700; line-height: 1; color: ${C.text}; font-family: 'Crimson Text', serif; }
        .ev-month { font-size: 0.85rem; text-transform: uppercase; margin-top: 0.3rem; font-weight: 600; letter-spacing: 1px; color: ${C.textSec}; }
        .ev-title { font-size: 1.2rem; font-weight: 700; color: ${C.text}; margin-bottom: 0.3rem; font-family: 'Crimson Text', serif; }
        .ev-type { display: inline-block; padding: 0.3rem 0.8rem; background: ${C.pri}; color: #fff; font-size: 0.7rem; font-weight: 600; text-transform: uppercase; letter-spacing: .5px; margin-right: 0.5rem; }
        .ev-tentative { display: inline-block; padding: 0.3rem 0.8rem; background: ${C.goldLight}; color: ${C.priDark}; font-size: 0.7rem; font-weight: 600; text-transform: uppercase; letter-spacing: .5px; border: 1px solid ${C.gold}; }
        .ev-meta { display: flex; gap: 1.5rem; color: ${C.textSec}; font-size: 0.9rem; margin: 0.5rem 0; flex-wrap: wrap; }
        .ev-meta-item { display: flex; align-items: center; gap: 0.4rem; }
        .ev-meta-item i { width: 16px; text-align: center; color: ${C.textMuted}; }
        .ev-desc { color: ${C.textSec}; line-height: 1.7; font-size: 0.9rem; }
        .ev-actions { display: flex; flex-direction: column; gap: 0.5rem; }

        .btn { padding: 0.7rem 1.2rem; border: 2px solid transparent; font-family: 'Open Sans', sans-serif; font-weight: 600; font-size: 0.8rem; cursor: pointer; text-transform: uppercase; letter-spacing: .5px; display: inline-flex; align-items: center; gap: 0.4rem; transition: 0.3s; min-width: 140px; justify-content: center; }
        .btn-view { background: #fff; color: ${C.pri}; border-color: ${C.pri}; }
        .btn-view:hover { background: ${C.pri}; color: #fff; }
        .btn-cal { background: #4285f4; color: #fff; border-color: #4285f4; }
        .btn-cal:hover { background: #fff; color: #4285f4; }

        .mini-cal { background: #fff; border: 1px solid ${C.border}; padding: 1rem; margin-bottom: 1.5rem; }
        .mini-cal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; }
        .mini-cal-title { font-family: 'Crimson Text', serif; font-weight: 700; font-size: 1rem; color: ${C.text}; }
        .mini-cal-nav { background: none; border: none; cursor: pointer; color: ${C.textSec}; font-size: 1rem; padding: 4px 8px; }
        .mini-cal-grid { display: grid; grid-template-columns: repeat(7, 1fr); text-align: center; }
        .mini-cal-day { font-size: 10px; color: ${C.textMuted}; padding: 4px 0; font-weight: 600; }
        .mini-cell { font-size: 12px; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; margin: 0 auto; border-radius: 50%; cursor: default; position: relative; }
        .mini-cell.today { background: ${C.pri}; color: #fff; font-weight: 700; }
        .mini-cell.has-event { font-weight: 700; cursor: pointer; }
        .mini-cell.has-event:hover { background: ${C.priSoft}; }
        .mini-cell .dot { position: absolute; bottom: 1px; width: 4px; height: 4px; border-radius: 50%; background: ${C.pri}; }

        /* Popup Overlay */
        .overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(60,20,25,0.5); backdrop-filter: blur(3px); z-index: 1000; display: flex; align-items: center; justify-content: center; animation: fadeIn 0.3s; }
        .popup { background: #fff; border-radius: 8px; width: 90%; max-width: 520px; box-shadow: 0 20px 60px rgba(139,26,43,0.3); animation: slideUp 0.3s; overflow: hidden; }
        .popup-header { background: linear-gradient(135deg, ${C.pri}, ${C.priDark}); color: #fff; padding: 24px 30px; position: relative; }
        .popup-header::before { content: ''; position: absolute; top: -50%; right: -10%; width: 200px; height: 200px; background: rgba(255,255,255,0.05); border-radius: 50%; }
        .popup-icon { width: 44px; height: 44px; background: rgba(255,255,255,0.15); border-radius: 50%; display: flex; align-items: center; justify-content: center; }
        .popup-icon i { font-size: 20px; color: ${C.gold}; }
        .popup-title { font-family: 'Crimson Text', serif; font-size: 22px; font-weight: 700; }
        .popup-sub { font-size: 13px; opacity: 0.9; margin-top: 4px; }
        .popup-close { position: absolute; top: 18px; right: 18px; width: 32px; height: 32px; border: none; background: rgba(255,255,255,0.1); border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; color: #fff; transition: 0.2s; }
        .popup-close:hover { background: rgba(255,255,255,0.2); transform: rotate(90deg); }
        .popup-body { padding: 24px 30px; }
        .popup-card { background: ${C.bgSub}; border: 1px solid ${C.border}; border-radius: 6px; padding: 16px; margin-bottom: 20px; }
        .popup-ev-title { font-family: 'Crimson Text', serif; font-weight: 700; color: ${C.pri}; font-size: 16px; margin-bottom: 10px; }
        .popup-meta { display: flex; flex-direction: column; gap: 8px; }
        .popup-meta-item { display: flex; align-items: center; gap: 10px; color: ${C.textSec}; font-size: 13px; }
        .popup-meta-item i { width: 16px; text-align: center; color: ${C.textMuted}; }
        .popup-desc { color: ${C.text}; font-size: 14px; line-height: 1.7; margin-bottom: 20px; }
        .popup-status { display: flex; align-items: center; justify-content: space-between; padding: 8px 12px; background: rgba(139,26,43,0.05); border-radius: 4px; font-size: 12px; margin-top: 12px; }
        .popup-btns { display: flex; gap: 10px; }
        .popup-btns .btn { flex: 1; padding: 10px 16px; border-radius: 6px; font-size: 13px; }
        .popup-btn-close { background: #fff; color: ${C.pri}; border: 2px solid ${C.pri}; }
        .popup-btn-close:hover { background: ${C.priSoft}; }
        .popup-btn-cal { background: #4285f4; color: #fff; border: 2px solid #4285f4; border-radius: 6px; }
        .popup-btn-cal:hover { background: #3367d6; }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @media (max-width: 768px) {
          .hero h1 { font-size: 1.8rem; }
          .event-content { grid-template-columns: 60px 1fr; }
          .ev-actions { display: none; }
          .controls-inner { flex-direction: column; align-items: stretch; }
          .filter-tabs { flex-wrap: wrap; }
          .search-box { min-width: auto; }
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
          .nav-links { display: none; }
          .popup-btns { flex-direction: column-reverse; }
        }
      `}</style>

      {/* NAVBAR */}
      <nav className="navbar">
        <div className="navbar-content">
          <div>
            <div className="navbar-brand">Kyle's Calendar</div>
            <div className="navbar-sub">Spring 2026 Semester</div>
          </div>
          <div className="nav-links">
            <button className="nav-link active">Events</button>
            <button className="nav-link" onClick={() => { setYear(today.getFullYear()); setMonth(today.getMonth()); }}>Today</button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <div className="hero">
        <h1>Events Calendar</h1>
        <p>{MONTH_NAMES[month]} {year} · {monthEvents.length} events scheduled</p>
      </div>

      {/* CONTROLS */}
      <div className="controls">
        <div className="controls-inner">
          <div className="filter-tabs">
            {[["all","All Events"],["upcoming","Upcoming"],["week","This Week"],["past","Past"]].map(([k,v]) => (
              <button key={k} className={`filter-tab ${filter === k ? "active" : ""}`} onClick={() => setFilter(k)}>{v}</button>
            ))}
          </div>
          <div className="search-box">
            <i className="fas fa-search search-icon" />
            <input className="search-input" placeholder="Search events..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div className="main">
        {/* STATS */}
        <div className="stats-grid">
          {[[monthEvents.length, "Total Events"], [upcoming, "Upcoming"], [thisWeek, "This Week"], [tentative, "Tentative"]].map(([v, l], i) => (
            <div key={i} className="stat-card">
              <div className="stat-value">{v}</div>
              <div className="stat-label">{l}</div>
            </div>
          ))}
        </div>

        {/* CONTENT: MINI CAL + EVENT LIST */}
        <div className="content-grid">
          {/* LEFT: Mini Calendar */}
          <div>
            <div className="mini-cal">
              <div className="mini-cal-header">
                <span className="mini-cal-title">{MONTH_NAMES[month]} {year}</span>
                <div>
                  <button className="mini-cal-nav" onClick={prev}>‹</button>
                  <button className="mini-cal-nav" onClick={next}>›</button>
                </div>
              </div>
              <div className="mini-cal-grid">
                {MINI_DAYS.map((d, i) => <div key={i} className="mini-cal-day">{d}</div>)}
                {cells.map((cell, i) => {
                  const t = cell.current && isToday(cell.day);
                  const ev = cell.current && hasEvent(cell.day);
                  return (
                    <div key={i}
                      className={`mini-cell ${t ? "today" : ""} ${ev ? "has-event" : ""}`}
                      onClick={() => cell.current && ev && setSelectedDate(fmtKey(year, month, cell.day))}
                      style={{ opacity: cell.current ? 1 : 0.3 }}>
                      {cell.day}
                      {ev && !t && <div className="dot" />}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Sidebar stats */}
            <div style={{ background: "#fff", border: `1px solid ${C.border}`, padding: "1rem" }}>
              <div style={{ fontFamily: "'Crimson Text', serif", fontWeight: 700, fontSize: 14, textTransform: "uppercase", letterSpacing: "0.5px", borderBottom: `2px solid ${C.pri}`, paddingBottom: 8, marginBottom: 12 }}>Quick Info</div>
              <div style={{ fontSize: 13, color: C.textSec, lineHeight: 2 }}>
                <div><i className="fas fa-check-circle" style={{ color: C.pri, width: 18 }} /> {confirmed} confirmed</div>
                <div><i className="fas fa-question-circle" style={{ color: C.gold, width: 18 }} /> {tentative} tentative</div>
                <div><i className="fas fa-calendar" style={{ color: C.textMuted, width: 18 }} /> Feb – Jul 2026</div>
              </div>
            </div>
          </div>

          {/* RIGHT: Event List */}
          <div>
            <h3 className="section-title">
              {filter === "all" ? "All" : filter === "upcoming" ? "Upcoming" : filter === "week" ? "This Week's" : "Past"} Events
              {search && ` · "${search}"`}
            </h3>
            {filteredEvents.length === 0 && (
              <div style={{ textAlign: "center", padding: "3rem", color: C.textMuted }}>
                <i className="fas fa-calendar-xmark" style={{ fontSize: 40, marginBottom: 12, display: "block" }} />
                <div style={{ fontSize: 14 }}>No events found</div>
              </div>
            )}
            {filteredEvents.map((ev, i) => {
              const d = new Date(ev.date + "T12:00:00");
              const day = d.getDate();
              const mo = SHORT_MONTHS[d.getMonth()];
              const isT = ev.date === todayKey;
              return (
                <div key={i} className="event-item" onClick={() => setPopupEvent(ev)}>
                  <div className="event-content">
                    <div className={`event-date-box ${isT ? "today" : ""}`}>
                      <div className="ev-day">{String(day).padStart(2, "0")}</div>
                      <div className="ev-month">{mo}</div>
                    </div>
                    <div>
                      <div className="ev-title">{ev.title}</div>
                      <div style={{ marginBottom: 6 }}>
                        <span className="ev-type">{ev.venue || "Holiday"}</span>
                        {ev.status === "tentative" && <span className="ev-tentative">Tentative</span>}
                      </div>
                      <div className="ev-meta">
                        <div className="ev-meta-item"><i className="fas fa-clock" /><span>{ev.time}{ev.endTime ? ` – ${ev.endTime}` : ""}</span></div>
                        {ev.venue && <div className="ev-meta-item"><i className="fas fa-map-marker-alt" /><span>{ev.venue}</span></div>}
                      </div>
                      <p className="ev-desc">{ev.desc}</p>
                    </div>
                    <div className="ev-actions">
                      <button className="btn btn-view" onClick={e => { e.stopPropagation(); setPopupEvent(ev); }}>
                        <i className="fas fa-eye" /> View
                      </button>
                      <button className="btn btn-cal" onClick={e => { e.stopPropagation(); addToGCal(ev); }}>
                        <i className="fab fa-google" /> Calendar
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{ background: C.bgSub, borderTop: `1px solid ${C.border}`, padding: "2rem", textAlign: "center", color: C.textMuted, fontSize: 13 }}>
        <p>© 2026 Kyle's Calendar · Spring Semester</p>
      </footer>

      {/* POPUP */}
      {popupEvent && (
        <div className="overlay" onClick={() => setPopupEvent(null)}>
          <div className="popup" onClick={e => e.stopPropagation()}>
            <div className="popup-header">
              <button className="popup-close" onClick={() => setPopupEvent(null)}>
                <i className="fas fa-times" />
              </button>
              <div style={{ display: "flex", alignItems: "center", gap: 15 }}>
                <div className="popup-icon">
                  <i className="fas fa-calendar-check" />
                </div>
                <div>
                  <div className="popup-title">Event Details</div>
                  <div className="popup-sub">View event information</div>
                </div>
              </div>
            </div>
            <div className="popup-body">
              <div className="popup-card">
                <div className="popup-ev-title">{popupEvent.title}</div>
                <div className="popup-meta">
                  <div className="popup-meta-item"><i className="fas fa-calendar" /><span>{fmtDate(popupEvent.date)}</span></div>
                  <div className="popup-meta-item"><i className="fas fa-clock" /><span>{popupEvent.time}{popupEvent.endTime ? ` – ${popupEvent.endTime}` : ""}</span></div>
                  {popupEvent.venue && <div className="popup-meta-item"><i className="fas fa-map-marker-alt" /><span>{popupEvent.venue}</span></div>}
                </div>
                <div className="popup-status">
                  <span style={{ color: C.textSec }}>Status</span>
                  <span style={{ color: C.pri, fontWeight: 600, textTransform: "uppercase" }}>{popupEvent.status}</span>
                </div>
              </div>
              <div className="popup-desc">{popupEvent.desc}</div>
              <div className="popup-btns">
                <button className="btn popup-btn-close" onClick={() => setPopupEvent(null)}>
                  <i className="fas fa-times" /> Close
                </button>
                <button className="btn popup-btn-cal" onClick={() => addToGCal(popupEvent)}>
                  <i className="fab fa-google" /> Add to Calendar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
