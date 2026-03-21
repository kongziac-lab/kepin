"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

/* ── 타입 정의 ─────────────────────────────────────────────────────── */
export type ProgramType  = "exchange" | "short_term";
export type SemesterTerm = "fall" | "spring" | "summer" | "winter";

export type SemesterInfo = {
  year:        number;
  programType: ProgramType;
  term:        SemesterTerm;
};

export type SemesterKey = `${number}-${"fall"|"spring"|"summer"|"winter"}`;

export function toSemesterKey(s: SemesterInfo): SemesterKey {
  return `${s.year}-${s.term}` as SemesterKey;
}

export function semesterDisplayLabel(s: SemesterInfo): string {
  const termKo: Record<SemesterTerm, string> = {
    fall:   "가을학기", spring: "봄학기",
    summer: "여름학기", winter: "겨울학기",
  };
  const progKo: Record<ProgramType, string> = {
    exchange:   "교환학생",
    short_term: "단기수학",
  };
  return `${s.year}학년도 ${termKo[s.term]} (${progKo[s.programType]})`;
}

/* ── 선택 가능한 학기 옵션 ──────────────────────────────────────────── */
export const SEMESTER_OPTIONS: {
  type:  ProgramType;
  term:  SemesterTerm;
  label: string;
  tag:   string;
}[] = [
  { type: "exchange",   term: "fall",   label: "가을학기", tag: "교환학생" },
  { type: "exchange",   term: "spring", label: "봄학기",   tag: "교환학생" },
  { type: "short_term", term: "summer", label: "여름학기", tag: "단기수학" },
  { type: "short_term", term: "winter", label: "겨울학기", tag: "단기수학" },
];

export const AVAILABLE_YEARS = [2025, 2026, 2027];

/* ── Context ────────────────────────────────────────────────────────── */
type SemesterContextType = {
  semester:    SemesterInfo;
  setSemester: (s: SemesterInfo) => void;
};

const SemesterContext = createContext<SemesterContextType | null>(null);

export function SemesterProvider({ children }: { children: ReactNode }) {
  const [semester, setSemester] = useState<SemesterInfo>({
    year:        2026,
    programType: "exchange",
    term:        "fall",
  });

  return (
    <SemesterContext.Provider value={{ semester, setSemester }}>
      {children}
    </SemesterContext.Provider>
  );
}

export function useSemester() {
  const ctx = useContext(SemesterContext);
  if (!ctx) throw new Error("useSemester must be used within SemesterProvider");
  return ctx;
}
