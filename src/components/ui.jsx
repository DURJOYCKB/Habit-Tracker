import React from "react";
import { NavLink } from "react-router-dom";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useHabits } from "../store";
import { toISODate, startOfMonth, endOfMonth, addDays, dayOfWeekMon0, monthLabel } from "../utils";

// ---------- small helpers ----------
const presetColors = ["#8b5cf6", "#ec4899", "#3b82f6", "#10b981", "#f59e0b", "#f43f5e"];
const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// ---------- Icons ----------
const BoltIcon = ({ className = "w-4 h-4", color = "currentColor" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    style={{ color: color }}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M13 2 L3 14 L12 14 L11 22 L21 10 L12 10 L13 2 Z" fill="currentColor" />
  </svg>
);

// ---------- Navbar ----------
function LinkItem({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-300
        ${isActive
          ? "bg-slate-900/10 text-violet-600 shadow-inner"
          : "text-slate-500 hover:text-violet-600 hover:bg-slate-900/5"}`
      }
    >
      {children}
    </NavLink>
  );
}

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/40 bg-white/60 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/20 animate-float flex items-center justify-center">
            <BoltIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-lg font-bold leading-tight tracking-tight text-gradient">Daily Dominion</p>
            <p className="text-xs text-slate-400 leading-tight">
              Elevate your daily routine
            </p>
          </div>
        </div>

        <nav className="flex items-center gap-1 bg-slate-900/5 p-1 rounded-2xl border border-slate-900/5 backdrop-blur-md">
          <LinkItem to="/">Dashboard</LinkItem>
          <LinkItem to="/calendar">Calendar</LinkItem>
          <LinkItem to="/analytics">Analytics</LinkItem>
        </nav>
      </div>
    </header>
  );
}

// ---------- StatCard ----------
export function StatCard({ title, value, subtitle }) {
  return (
    <div className="grow rounded-2xl glass p-5 transition-all hover:translate-y-[-2px] hover:shadow-xl hover:shadow-violet-500/10">
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <p className="mt-2 text-3xl font-bold text-slate-800">{value}</p>
      <p className="mt-1 text-xs text-slate-400 font-medium">{subtitle}</p>
    </div>
  );
}

// ---------- TrendChart ----------
export function TrendChart({ data }) {
  return (
    <div className="h-[240px] w-full mt-6">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#64748b', fontSize: 10, fontWeight: 600 }}
            dy={10}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#64748b', fontSize: 10, fontWeight: 600 }}
            domain={[0, 100]}
            ticks={[0, 50, 100]}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              border: '1px solid rgba(0,0,0,0.05)',
              borderRadius: '12px',
              fontSize: '12px',
              color: '#1e293b',
              backdropFilter: 'blur(8px)',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
            }}
            itemStyle={{ color: '#8b5cf6', fontWeight: 'bold' }}
            cursor={{ stroke: '#8b5cf6', strokeWidth: 2, strokeDasharray: '4 4' }}
          />
          <Area
            type="monotone"
            dataKey="percent"
            stroke="#8b5cf6"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#trendGradient)"
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

// ---------- HabitForm ----------
export function HabitForm() {
  const { actions } = useHabits();
  const [name, setName] = React.useState("");
  const [color, setColor] = React.useState(presetColors[0]);
  const [timeOfDay, setTimeOfDay] = React.useState("Morning");

  const times = [
    { label: "Morning", emoji: "🌅" },
    { label: "Noon", emoji: "☀️" },
    { label: "Evening", emoji: "🌆" },
    { label: "Night", emoji: "🌙" }
  ];

  function onSubmit(e) {
    e.preventDefault();
    const nm = name.trim();
    if (!nm) return;
    actions.addHabit({ name: nm, color, timeOfDay });
    setName("");
    setTimeOfDay("Morning");
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-semibold text-slate-500">Habit Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Deep Work 4 Hours"
          className="mt-1.5 w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all placeholder:text-slate-400"
        />
      </div>

      <div>
        <label className="text-sm font-semibold text-slate-500">Daily Schedule</label>
        <div className="mt-1.5 grid grid-cols-4 gap-2">
          {times.map((t) => (
            <button
              key={t.label}
              type="button"
              onClick={() => setTimeOfDay(t.label)}
              className={`flex flex-col items-center justify-center rounded-xl py-3 border transition-all duration-300 
                ${timeOfDay === t.label
                  ? "bg-violet-600 text-white border-violet-600 shadow-lg shadow-violet-500/20"
                  : "bg-white border-slate-100 text-slate-400 hover:bg-slate-50 hover:border-slate-300"}`}
            >
              <span className="text-lg">{t.emoji}</span>
              <span className="text-[10px] font-bold uppercase mt-1 tracking-wider">{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm font-semibold text-slate-300">Color Palette</span>
        <div className="flex gap-2">
          {presetColors.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              className={`h-8 w-8 rounded-full border-2 transition-all duration-300 transform
                ${color === c ? "border-white scale-125 shadow-lg shadow-white/20" : "border-transparent opacity-60 hover:opacity-100 hover:scale-110"}`}
              style={{ backgroundColor: c }}
              aria-label={`Select color ${c}`}
            />
          ))}
        </div>
      </div>

      <button
        className="btn-primary w-full mt-2"
        type="submit"
      >
        Launch New Habit
      </button>
    </form>
  );
}

// ---------- HabitList + HabitCard ----------
export function HabitList({ habits, dateISO }) {
  if (!habits || habits.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 p-4 text-sm text-slate-600 dark:border-slate-700 dark:text-slate-300">
        No habits yet. Add your first habit below 👇
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {habits.map((h) => (
        <HabitCard key={h.id} habit={h} dateISO={dateISO} />
      ))}
    </div>
  );
}

export function HabitCard({ habit, dateISO }) {
  const { state, actions } = useHabits();
  const done = !!state.completions?.[dateISO]?.[habit.id];
  const stats = actions.statsForHabit(habit.id);

  const timeEmojis = {
    "Morning": "🌅",
    "Noon": "☀️",
    "Evening": "🌆",
    "Night": "🌙"
  };

  return (
    <div className="rounded-2xl glass p-5 transition-all duration-500 hover:shadow-2xl hover:shadow-violet-500/10 group">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <BoltIcon color={habit.color} className="w-5 h-5 drop-shadow-sm" />
            <p className="truncate text-lg font-bold text-slate-800 tracking-tight leading-none">{habit.name}</p>
          </div>
          <div className="mt-2.5 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-violet-600">
            <span className="bg-violet-100 px-1.5 py-0.5 rounded-md flex items-center gap-1">
              {timeEmojis[habit.timeOfDay] || "📅"} {habit.timeOfDay || "Anytime"}
            </span>
          </div>
          <div className="mt-2.5 flex items-center gap-3 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1">
              <span className="text-orange-400">🔥</span> {stats.streak} day streak
            </span>
            <span className="h-1 w-1 rounded-full bg-slate-700" />
            <span>{stats.rate30}% success</span>
          </div>
        </div>

        <button
          onClick={() => actions.toggleDone(habit.id, dateISO)}
          className={`shrink-0 rounded-xl px-5 py-2.5 text-sm font-bold transition-all duration-300 active:scale-95
            ${done
              ? "bg-violet-600 text-white shadow-lg shadow-violet-500/30"
              : "bg-slate-100 text-slate-500 border border-slate-200 hover:bg-white hover:text-violet-600 hover:border-violet-200"}`}
        >
          {done ? "Completed ✓" : "Mark Done"}
        </button>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
        <button
          onClick={() => actions.deleteHabit(habit.id)}
          className="text-xs font-semibold text-slate-400 hover:text-red-500 transition-colors uppercase tracking-widest"
        >
          Remove
        </button>
        <div className={`text-[10px] font-bold uppercase tracking-[0.2em] px-2 py-0.5 rounded-md ${done ? "text-violet-600 bg-violet-100" : "text-slate-400 bg-slate-100"}`}>
          {done ? "Verified" : "Pending"}
        </div>
      </div>
    </div>
  );
}

// ---------- ReminderPanel ----------
export function ReminderPanel() {
  const { state, actions } = useHabits();
  const [habitId, setHabitId] = React.useState(state.habits[0]?.id || "");
  const [time, setTime] = React.useState("08:00");
  const [label, setLabel] = React.useState("Morning");

  React.useEffect(() => {
    if (!habitId && state.habits[0]?.id) setHabitId(state.habits[0].id);
  }, [state.habits, habitId]);

  const selected = state.habits.find((h) => h.id === habitId);

  function add(e) {
    e.preventDefault();
    if (!selected) return;
    actions.addReminder(selected.id, { time, label });
    setLabel("");
  }

  return (
    <div className="rounded-2xl glass p-5">
      <h2 className="text-xl font-bold text-gradient">Reminders</h2>
      <p className="mt-1 text-sm text-slate-400">
        Stay on track with schedule reminders.
      </p>

      {state.habits.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-white/10 p-8 text-center text-sm text-slate-500">
          No habits detected. Add one to set reminders.
        </div>
      ) : (
        <>
          <form onSubmit={add} className="mt-6 space-y-4">
            <div>
              <label className="text-sm font-semibold text-slate-300">Target Habit</label>
              <select
                value={habitId}
                onChange={(e) => setHabitId(e.target.value)}
                className="mt-1.5 w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-violet-500/50 transition-all appearance-none cursor-pointer"
              >
                {state.habits.map((h) => (
                  <option key={h.id} value={h.id} className="bg-white">
                    {h.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-semibold text-slate-500">Phase Time</label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="mt-1.5 w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-violet-500/50 transition-all"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-500">Occasion</label>
                <input
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  placeholder="e.g., Sunrise"
                  className="mt-1.5 w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-violet-500/50 transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            <button className="btn-primary w-full">Set Reminder</button>
          </form>

          <div className="mt-8 space-y-4">
            <p className="text-sm font-bold uppercase tracking-widest text-slate-500">Timeline</p>

            {!selected || selected.reminders.length === 0 ? (
              <p className="text-sm text-slate-600">No active alerts for this habit.</p>
            ) : (
              <div className="space-y-3">
                {selected.reminders
                  .slice()
                  .sort((a, b) => a.time.localeCompare(b.time))
                  .map((r) => (
                    <div
                      key={r.id}
                      className="flex items-center justify-between rounded-xl bg-white border border-slate-100 px-4 py-3 group hover:border-violet-200 transition-all shadow-sm"
                    >
                      <div>
                        <p className="text-base font-bold text-slate-800">{r.time}</p>
                        <p className="text-xs text-slate-500 font-medium">
                          {r.label || "General Reminder"}
                        </p>
                      </div>
                      <button
                        onClick={() => actions.removeReminder(selected.id, r.id)}
                        className="text-xs font-bold text-slate-400 hover:text-red-500 transition-colors uppercase"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// ---------- CalendarGrid ----------
export function CalendarGrid() {
  const { state, actions } = useHabits();
  const [cursor, setCursor] = React.useState(() => new Date());

  const mStart = startOfMonth(cursor);
  const mEnd = endOfMonth(cursor);

  const leading = dayOfWeekMon0(mStart);
  const totalDays = mEnd.getDate();

  const cells = [];
  for (let i = 0; i < leading; i++) cells.push(null);
  for (let d = 1; d <= totalDays; d++) cells.push(new Date(mStart.getFullYear(), mStart.getMonth(), d));

  const todayISO = toISODate(new Date());

  return (
    <div className="space-y-6">
      <div className="rounded-3xl glass p-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gradient">Track Calendar</h1>
            <p className="text-sm text-slate-400">
              Track your consistency through the month.
            </p>
          </div>

          <div className="flex items-center gap-1 bg-white/5 p-1 rounded-2xl border border-white/5">
            <button
              onClick={() => setCursor((c) => new Date(c.getFullYear(), c.getMonth() - 1, 1))}
              className="rounded-xl px-4 py-2 text-base hover:bg-white/10 transition-all font-bold text-white"
            >
              ←
            </button>
            <div className="min-w-[140px] text-center text-sm font-bold text-white uppercase tracking-widest">{monthLabel(cursor)}</div>
            <button
              onClick={() => setCursor((c) => new Date(c.getFullYear(), c.getMonth() + 1, 1))}
              className="rounded-xl px-4 py-2 text-base hover:bg-white/10 transition-all font-bold text-white"
            >
              →
            </button>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-7 gap-3">
          {weekDays.map((d) => (
            <div key={d} className="text-center text-xs font-bold uppercase tracking-widest text-slate-500">
              {d}
            </div>
          ))}
        </div>

        <div className="mt-3 grid grid-cols-7 gap-3">
          {cells.map((dateObj, idx) => {
            if (!dateObj) return <div key={idx} className="aspect-square rounded-2xl border border-transparent" />;

            const iso = toISODate(dateObj);
            const isToday = iso === todayISO;

            const doneMap = state.completions?.[iso] || {};
            const doneCount = state.habits.reduce((acc, h) => acc + (doneMap[h.id] ? 1 : 0), 0);
            const total = state.habits.length;

            const isUpperHalf = idx < 21; // First 3 rows

            return (
              <DayCell
                key={iso}
                iso={iso}
                day={dateObj.getDate()}
                isToday={isToday}
                doneCount={doneCount}
                total={total}
                habits={state.habits}
                completions={state.completions}
                onToggle={(hid) => actions.toggleDone(hid, iso)}
                openBelow={isUpperHalf}
              />
            );
          })}
        </div>
      </div>

      <div className="rounded-2xl glass p-5">
        <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400 mb-4">Focus Areas</h2>
        {state.habits.length === 0 ? (
          <p className="text-sm text-slate-600">Your roadmap is currently empty.</p>
        ) : (
          <div className="mt-3 flex flex-wrap gap-2">
            {state.habits.map((h) => (
              <span
                key={h.id}
                className="inline-flex items-center gap-2 rounded-full glass-pill pr-4 pl-3 py-1.5 text-xs group"
              >
                <BoltIcon color={h.color} className="w-3.5 h-3.5 transition-transform group-hover:scale-125" />
                <span className="text-slate-600 font-semibold">{h.name}</span>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function DayCell({ iso, day, isToday, doneCount, total, habits, completions, onToggle, openBelow }) {
  const [open, setOpen] = React.useState(false);
  const timeOrder = { "Morning": 0, "Noon": 1, "Evening": 2, "Night": 3 };
  const sortedHabits = [...habits].sort((a, b) =>
    (timeOrder[a.timeOfDay] ?? 99) - (timeOrder[b.timeOfDay] ?? 99)
  );

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((x) => !x)}
        className={`aspect-square w-full rounded-2xl border p-2 text-left transition-all duration-300 transform hover:scale-105
          ${isToday
            ? "border-violet-500 bg-violet-600 text-white shadow-[0_0_20px_rgba(139,92,246,0.2)]"
            : "border-slate-200 bg-white/50 hover:bg-white hover:border-violet-200"}`}
      >
        <div className="flex items-start justify-between">
          <div className={`text-lg font-bold ${isToday ? "text-white" : "text-slate-800"}`}>{day}</div>
          <div className={`text-xs font-bold ${isToday ? "text-violet-100" : "text-slate-400"}`}>
            {total === 0 ? "" : `${doneCount}/${total}`}
          </div>
        </div>

        {total > 0 && (
          <div className="mt-1 flex flex-wrap gap-1">
            {sortedHabits.slice(0, 4).map((h) => {
              const done = !!completions?.[iso]?.[h.id];
              return (
                <span key={h.id} className="text-sm font-bold leading-none" style={{ color: done ? (isToday ? '#fff' : h.color) : 'transparent' }}>
                  {done ? "✓" : ""}
                </span>
              );
            })}
          </div>
        )}
      </button>

      {open && total > 0 && (
        <div className={`absolute z-50 left-1/2 -translate-x-1/2 w-[280px] bg-violet-50/98 backdrop-blur-2xl rounded-3xl p-5 shadow-[0_20px_50px_rgba(139,92,246,0.3)] border border-white animate-float
          ${openBelow ? "top-full mt-3" : "bottom-full mb-3"}`}>
          <div className="flex items-center justify-between mb-4">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-violet-400">{iso}</p>
            <button
              onClick={() => setOpen(false)}
              className="rounded-xl p-1.5 text-slate-400 hover:text-violet-600 hover:bg-violet-100 transition-all"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <div className="space-y-2.5">
            {sortedHabits.map((h) => {
              const done = !!completions?.[iso]?.[h.id];
              return (
                <button
                  key={h.id}
                  onClick={() => onToggle(h.id)}
                  className="flex w-full items-center justify-between rounded-2xl bg-white/50 border border-violet-100/50 px-4 py-3 text-sm transition-all hover:bg-white hover:shadow-md group"
                >
                  <span className="flex items-center gap-3">
                    <BoltIcon color={h.color} className="w-4 h-4" />
                    <span className="truncate font-bold text-slate-700 group-hover:text-violet-600 transition-colors">{h.name}</span>
                  </span>
                  <div className={`h-5 w-10 rounded-full border transition-all duration-300 relative ${done ? "bg-violet-600 border-violet-500" : "bg-white/5 border-white/10"}`}>
                    <div className={`absolute top-0.5 h-3.5 w-3.5 rounded-full bg-white transition-all duration-300 ${done ? "left-[22px]" : "left-0.5 shadow-sm"}`} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}