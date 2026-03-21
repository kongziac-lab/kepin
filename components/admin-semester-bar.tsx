"use client";

import {
  useSemester,
  SEMESTER_OPTIONS,
  AVAILABLE_YEARS,
  semesterDisplayLabel,
} from "@/lib/semester-context";

export function AdminSemesterBar() {
  const { semester, setSemester } = useSemester();

  return (
    <div
      className="border-b border-white/8"
      style={{ background: "rgba(8,6,6,0.75)" }}
    >
      <div className="mx-auto max-w-7xl px-6 py-2 flex items-center gap-4 flex-wrap">

        {/* 학년도 선택 */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-white/25 font-bold uppercase tracking-widest shrink-0">
            학년도
          </span>
          <div className="flex gap-1">
            {AVAILABLE_YEARS.map((y) => (
              <button
                key={y}
                onClick={() => setSemester({ ...semester, year: y })}
                className={`text-xs px-2.5 py-1 rounded-lg font-bold transition ${
                  semester.year === y
                    ? "bg-red-700 text-white"
                    : "text-white/35 hover:text-white/65 hover:bg-white/5"
                }`}
              >
                {y}
              </button>
            ))}
          </div>
        </div>

        <span className="h-4 w-px bg-white/10 shrink-0" />

        {/* 학기 선택 */}
        <div className="flex gap-1.5 flex-wrap">
          {SEMESTER_OPTIONS.map((opt) => {
            const isActive =
              semester.programType === opt.type && semester.term === opt.term;
            const isExchange = opt.type === "exchange";
            return (
              <button
                key={`${opt.type}-${opt.term}`}
                onClick={() =>
                  setSemester({ ...semester, programType: opt.type, term: opt.term })
                }
                className={`flex items-center gap-1.5 text-xs px-3 py-1 rounded-xl border transition font-medium ${
                  isActive
                    ? isExchange
                      ? "bg-blue-900/50 border-blue-500/50 text-blue-200"
                      : "bg-amber-900/50 border-amber-500/50 text-amber-200"
                    : "border-white/8 text-white/35 hover:border-white/18 hover:text-white/60"
                }`}
              >
                <span
                  className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                    isActive
                      ? isExchange
                        ? "bg-blue-700/60 text-blue-300"
                        : "bg-amber-700/60 text-amber-300"
                      : "bg-white/5 text-white/20"
                  }`}
                >
                  {opt.tag}
                </span>
                {opt.label}
              </button>
            );
          })}
        </div>

        {/* 현재 학기 표시 */}
        <div className="ml-auto shrink-0">
          <span className="text-[11px] font-semibold px-3 py-1.5 rounded-xl bg-white/4 border border-white/8 text-white/50">
            📅 {semesterDisplayLabel(semester)}
          </span>
        </div>
      </div>
    </div>
  );
}
