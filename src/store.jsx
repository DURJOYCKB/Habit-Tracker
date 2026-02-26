import React from "react";
import { loadJSON, saveJSON, toISODate, lastNDays } from "./utils";

const LS_KEY = "habit-tracker:v2-small";

const defaultState = {
  habits: [],
  completions: {} // completions[dateISO][habitId] = true
};

function uid() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}

function calcStreak(habitId, completions, upTo = new Date()) {
  let streak = 0;
  for (let i = 0; i < 3650; i++) {
    const day = toISODate(new Date(upTo.getFullYear(), upTo.getMonth(), upTo.getDate() - i));
    const done = !!(completions?.[day]?.[habitId]);
    if (done) streak++;
    else break;
  }
  return streak;
}

function calcCompletionRate(habitId, completions, days = 30) {
  const dates = lastNDays(days);
  let done = 0;
  for (const d of dates) if (completions?.[d]?.[habitId]) done++;
  return dates.length ? Math.round((done / dates.length) * 100) : 0;
}

const HabitsContext = React.createContext(null);

export function HabitsProvider({ children }) {
  const [state, setState] = React.useState(() => loadJSON(LS_KEY, defaultState));

  React.useEffect(() => saveJSON(LS_KEY, state), [state]);

  const actions = React.useMemo(() => ({

    addHabit({ name, color, timeOfDay }) {
      const habit = {
        id: uid(),
        name: name.trim(),
        color,
        timeOfDay: timeOfDay || "Morning",
        reminders: [],
        createdAt: Date.now()
      };
      setState((s) => ({ ...s, habits: [habit, ...s.habits] }));
    },

    deleteHabit(habitId) {
      setState((s) => {
        const habits = s.habits.filter((h) => h.id !== habitId);
        const completions = { ...s.completions };
        for (const day of Object.keys(completions)) {
          if (completions[day]?.[habitId]) {
            const { [habitId]: _, ...rest } = completions[day];
            completions[day] = rest;
          }
        }
        return { ...s, habits, completions };
      });
    },

    toggleDone(habitId, dateISO) {
      setState((s) => {
        const dayMap = s.completions[dateISO] ? { ...s.completions[dateISO] } : {};
        dayMap[habitId] = !dayMap[habitId];
        return { ...s, completions: { ...s.completions, [dateISO]: dayMap } };
      });
    },

    addReminder(habitId, { time, label }) {
      setState((s) => ({
        ...s,
        habits: s.habits.map((h) =>
          h.id === habitId
            ? { ...h, reminders: [...h.reminders, { id: uid(), time, label: label.trim() }] }
            : h
        )
      }));
    },

    removeReminder(habitId, reminderId) {
      setState((s) => ({
        ...s,
        habits: s.habits.map((h) =>
          h.id === habitId ? { ...h, reminders: h.reminders.filter((r) => r.id !== reminderId) } : h
        )
      }));
    },

    statsForHabit(habitId) {
      return {
        streak: calcStreak(habitId, state.completions, new Date()),
        rate30: calcCompletionRate(habitId, state.completions, 30),
        rate7: calcCompletionRate(habitId, state.completions, 7)
      };
    },

    getTrendData(days = 14) {
      const dates = lastNDays(days).reverse();
      return dates.map(d => {
        const dayCompletions = state.completions[d] || {};
        const done = state.habits.filter(h => dayCompletions[h.id]).length;
        const total = state.habits.length;
        const percent = total > 0 ? Math.round((done / total) * 100) : 0;
        return {
          date: d.slice(5), // MM-DD
          percent
        };
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [state.completions]);

  return (
    <HabitsContext.Provider value={{ state, actions }}>
      {children}
    </HabitsContext.Provider>
  );
}

export function useHabits() {
  const ctx = React.useContext(HabitsContext);
  if (!ctx) throw new Error("useHabits must be used within HabitsProvider");
  return ctx;
}