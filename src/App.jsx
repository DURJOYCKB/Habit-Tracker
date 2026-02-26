import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Navbar } from "./components/ui";
import Dashboard from "./components/Dashboard";
import Calendar from "./components/Calendar";
import Analytics from "./components/Analytics";

export default function App() {
  return (
    <div className="min-h-screen text-slate-900 selection:bg-violet-500/20">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}