import React from "react";
import { useHabits } from "../store";
import { toISODate } from "../utils";
import { HabitForm, HabitList, ReminderPanel } from "./ui";

export default function Dashboard() {
  const { state } = useHabits();
  const today = toISODate(new Date());

  const timeOrder = { "Morning": 0, "Noon": 1, "Evening": 2, "Night": 3 };
  const sortedHabits = [...state.habits].sort((a, b) =>
    (timeOrder[a.timeOfDay] ?? 99) - (timeOrder[b.timeOfDay] ?? 99)
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr] items-start">
      <section className="space-y-6">
        <div className="rounded-3xl glass p-6">
          <h1 className="text-2xl font-bold text-gradient">Focus Today</h1>
          <p className="mt-1 text-sm text-slate-500">
            Precision tracking for <span className="font-bold text-violet-600">{today}</span>
          </p>
          <div className="mt-6">
            <HabitList dateISO={today} habits={sortedHabits} />
          </div>
        </div>

        <div className="rounded-3xl glass p-6">
          <h2 className="text-xl font-bold text-gradient">New Habit Archetype</h2>
          <div className="mt-4">
            <HabitForm />
          </div>
        </div>
      </section>

      <section>
        <ReminderPanel />
      </section>
    </div>
  );
}