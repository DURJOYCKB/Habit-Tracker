import React from "react";
import { useHabits } from "../store";
import { StatCard, TrendChart } from "./ui";

export default function Analytics() {
  const { state, actions } = useHabits();

  const totals = state.habits.map((h) => ({ ...h, ...actions.statsForHabit(h.id) }));
  const avg30 =
    totals.length === 0 ? 0 : Math.round(totals.reduce((a, b) => a + b.rate30, 0) / totals.length);
  const best = totals.slice().sort((a, b) => b.rate30 - a.rate30)[0];
  const trendData = actions.getTrendData(14);

  return (
    <div className="space-y-8 pb-12">
      <div className="rounded-3xl glass p-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-2xl font-bold text-gradient">Performance Metrics</h1>
            <p className="mt-1 text-sm text-slate-500 font-medium">
              Deep insights into your consistency cycles.
            </p>
          </div>
          <div className="bg-white/50 px-4 py-2 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">14-Day Velocity</p>
            <p className="text-xl font-bold text-slate-800 leading-none mt-1">Steady Growth</p>
          </div>
        </div>

        <TrendChart data={trendData} />

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard title="30-Day Efficiency" value={`${avg30}%`} subtitle="Global Average" />
          <StatCard title="Active Archetypes" value={`${state.habits.length}`} subtitle="Habit count" />
          <StatCard
            title="Elite Performer"
            value={best ? `${best.rate30}%` : "—"}
            subtitle={best ? best.name : "Establish a routine"}
          />
        </div>
      </div>

      <div className="rounded-3xl glass p-8">
        <h2 className="text-xl font-bold text-gradient">Habit Breakdown</h2>

        {totals.length === 0 ? (
          <p className="mt-6 text-sm text-slate-400 text-center py-10 rounded-2xl border border-dashed border-slate-200">
            Initialize your journey on the Dashboard to see real-time data flow.
          </p>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {totals.map((h) => (
              <div
                key={h.id}
                className="rounded-2xl bg-white/50 border border-slate-100 p-6 transition-all duration-300 hover:bg-white hover:shadow-xl group"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.1)]" style={{ backgroundColor: h.color }} />
                      <p className="truncate font-bold text-slate-800 uppercase tracking-wider text-xs">{h.name}</p>
                    </div>
                    <p className="mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Streak: <span className="text-orange-500">{h.streak} DAYS</span>
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-xl font-bold text-slate-800 tracking-tighter">{h.rate30}%</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">30D SUCCESS</p>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(0,0,0,0.05)]"
                      style={{ width: `${h.rate30}%`, backgroundColor: h.color }}
                    />
                  </div>
                  <div className="mt-3 flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                    <span>7D: {h.rate7}%</span>
                    <span>30D: {h.rate30}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}