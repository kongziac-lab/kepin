"use client";

import { useState } from "react";
import Link from "next/link";
import { PortalShell } from "@/components/portal-shell";
import {
  partnerNominations,
  nominationSummary,
  statusLabel,
  type PartnerNomination,
  type NominationStudentStatus,
  type PartnerSubmissionStatus,
} from "@/lib/mock-data";

/* ── 유틸 ──────────────────────────────────────────────────────────── */
function daysUntil(iso: string) {
  return Math.ceil((new Date(iso).getTime() - Date.now()) / 86400000);
}
function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("ko-KR", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

/* ── 배지 색상 ─────────────────────────────────────────────────────── */
const submissionColors: Record<PartnerSubmissionStatus, string> = {
  submitted:     "bg-green-900/50 text-green-300 border-green-600/30",
  partial:       "bg-amber-900/50 text-amber-300 border-amber-500/30",
  not_submitted: "bg-white/5 text-white/35 border-white/10",
  closed:        "bg-white/5 text-white/20 border-white/8",
};
const submissionLabel: Record<PartnerSubmissionStatus, string> = {
  submitted:     "제출 완료",
  partial:       "일부 제출",
  not_submitted: "미제출",
  closed:        "마감",
};
const studentStatusColors: Record<NominationStudentStatus, string> = {
  confirmed:  "bg-green-900/50 text-green-300",
  pending:    "bg-amber-900/50 text-amber-300",
  rejected:   "bg-red-900/50 text-red-300",
  withdrawn:  "bg-white/5 text-white/30",
};
const studentStatusLabels: Record<NominationStudentStatus, string> = {
  confirmed:  "확정",
  pending:    "검토 중",
  rejected:   "반려",
  withdrawn:  "철회",
};

/* ── 대학 행 ───────────────────────────────────────────────────────── */
function PartnerRow({ p }: { p: PartnerNomination }) {
  const [open, setOpen] = useState(false);
  const days     = daysUntil(p.deadline);
  const mismatch = p.students.filter((s) => s.hasNameMismatch).length;
  const confirmed = p.students.filter((s) => s.nominationStatus === "confirmed").length;
  const fillPct   = Math.round((p.students.length / p.quota) * 100);

  return (
    <div className={`rounded-2xl border overflow-hidden transition-all ${
      p.submissionStatus === "submitted"
        ? "border-green-600/20 bg-white/2"
        : p.submissionStatus === "partial"
          ? "border-amber-500/20 bg-white/2"
          : "border-white/6 bg-white/1"
    }`}>
      {/* ── 헤더 행 (클릭으로 펼침) ── */}
      <div
        className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-white/3 transition select-none"
        onClick={() => p.students.length > 0 && setOpen((v) => !v)}
      >
        {/* 국가 플래그 + 대학명 */}
        <span className="text-2xl shrink-0">{p.flag}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-sm text-white/90">{p.university}</span>
            <span className="text-xs text-white/35">{p.country}</span>
            {mismatch > 0 && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-900/60 text-amber-300 border border-amber-500/25 font-semibold">
                ⚠ 이름 불일치 {mismatch}건
              </span>
            )}
          </div>
          <div className="text-xs text-white/35 mt-0.5">{p.contact} · {p.email}</div>
        </div>

        {/* 제출 배지 */}
        <span className={`text-[11px] px-2.5 py-1 rounded-full border font-semibold shrink-0 ${submissionColors[p.submissionStatus]}`}>
          {submissionLabel[p.submissionStatus]}
        </span>

        {/* 노미네이션 수 / 쿼터 */}
        <div className="text-right shrink-0 w-24">
          <div className="text-sm font-bold text-white/80">
            {p.students.length}
            <span className="text-white/30 font-normal"> / {p.quota}</span>
          </div>
          <div className="mt-1 h-1.5 rounded-full bg-white/8 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${fillPct >= 80 ? "bg-green-500" : fillPct >= 40 ? "bg-amber-500" : "bg-white/20"}`}
              style={{ width: `${Math.min(fillPct, 100)}%` }}
            />
          </div>
        </div>

        {/* 마감 */}
        <div className="text-right shrink-0 w-20">
          <div className={`text-xs font-semibold ${days <= 7 ? "text-red-400" : days <= 14 ? "text-amber-400" : "text-white/40"}`}>
            {days > 0 ? `D-${days}` : "마감"}
          </div>
          <div className="text-[10px] text-white/25 mt-0.5">{p.deadline}</div>
        </div>

        {/* 토글 화살표 */}
        {p.students.length > 0 && (
          <span className={`text-white/25 text-xs transition-transform shrink-0 ${open ? "rotate-180" : ""}`}>▼</span>
        )}
        {p.students.length === 0 && (
          <span className="text-white/10 text-xs shrink-0">—</span>
        )}
      </div>

      {/* ── 학생 목록 (펼침) ── */}
      {open && p.students.length > 0 && (
        <div className="border-t border-white/6">
          <div className="px-5 py-2 text-[10px] font-bold uppercase tracking-widest text-white/25 flex gap-4">
            <span className="w-32">접수번호</span>
            <span className="flex-1">영문성명</span>
            <span className="w-36">전공</span>
            <span className="w-20 text-center">노미네이션</span>
            <span className="w-24 text-center">신청 단계</span>
            <span className="w-20 text-center">제출시각</span>
            <span className="w-16"></span>
          </div>
          {p.students.map((s) => (
            <div
              key={s.id}
              className="border-t border-white/4 px-5 py-3 flex items-center gap-4 hover:bg-white/2 transition"
            >
              <span className="w-32 font-mono text-xs text-white/40 shrink-0">{s.id}</span>
              <div className="flex-1 min-w-0 flex items-center gap-2">
                <span className="text-sm font-medium text-white/85">{s.nameEn}</span>
                {s.hasNameMismatch && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-900/50 text-amber-300 border border-amber-500/20 shrink-0">⚠ 이름</span>
                )}
              </div>
              <span className="w-36 text-xs text-white/45 shrink-0 truncate">{s.major}</span>
              <span className={`w-20 text-center text-[10px] px-2 py-0.5 rounded font-semibold shrink-0 ${studentStatusColors[s.nominationStatus]}`}>
                {studentStatusLabels[s.nominationStatus]}
              </span>
              <span className="w-24 text-center text-xs text-white/40 shrink-0">
                {s.appStatus ? statusLabel(s.appStatus) : "—"}
              </span>
              <span className="w-20 text-center text-[10px] text-white/25 shrink-0">{fmtDate(s.submittedAt)}</span>
              <div className="w-16 flex justify-end shrink-0">
                {s.appStatus && (
                  <Link
                    href={`/admin/students/${encodeURIComponent(s.id)}` as never}
                    className="text-[10px] px-2 py-1 rounded-lg border border-white/10 text-white/40 hover:text-white hover:border-white/20 transition"
                  >
                    상세 →
                  </Link>
                )}
              </div>
            </div>
          ))}
          {/* 미제출 슬롯 */}
          {p.students.length < p.quota && (
            <div className="border-t border-white/4 px-5 py-2.5 flex items-center gap-3">
              <span className="text-[10px] text-white/20 italic">
                {p.quota - p.students.length}개 슬롯 미사용 — 마감일 {p.deadline}까지 노미네이션 가능
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════ */
export default function AdminNominationsPage() {
  const [filter, setFilter] = useState<PartnerSubmissionStatus | "all" | "mismatch">("all");
  const [search, setSearch] = useState("");

  const days = daysUntil(nominationSummary.deadline);

  /* 이름 불일치 건수 */
  const mismatchCount = partnerNominations.reduce(
    (acc, p) => acc + p.students.filter((s) => s.hasNameMismatch).length, 0
  );

  const filtered = partnerNominations.filter((p) => {
    const matchFilter =
      filter === "all"      ? true :
      filter === "mismatch" ? p.students.some((s) => s.hasNameMismatch) :
      p.submissionStatus === filter;
    const matchSearch = p.university.toLowerCase().includes(search.toLowerCase()) ||
                        p.country.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  /* ── 요약 통계 ── */
  const stats = [
    {
      label: "제출 대학",
      value: `${partnerNominations.filter((p) => p.submissionStatus === "submitted" || p.submissionStatus === "partial").length}`,
      sub:   `전체 ${nominationSummary.totalPartners}개 중`,
      color: "text-green-400",
    },
    {
      label: "미제출 대학",
      value: `${partnerNominations.filter((p) => p.submissionStatus === "not_submitted").length}`,
      sub:   "리마인드 필요",
      color: "text-amber-400",
    },
    {
      label: "노미네이션 총계",
      value: `${nominationSummary.totalNominations}`,
      sub:   `확정 ${nominationSummary.confirmedCount} · 검토 중 ${nominationSummary.pendingCount}`,
      color: "text-white",
    },
    {
      label: "마감까지",
      value: days > 0 ? `D-${days}` : "마감",
      sub:   nominationSummary.deadline,
      color: days <= 7 ? "text-red-400" : days <= 14 ? "text-amber-400" : "text-white/70",
    },
  ];

  return (
    <PortalShell
      area="admin"
      title="노미네이션 관리"
      description="파트너 대학별 노미네이션 제출 현황을 실시간으로 확인하고 관리합니다."
    >
      <div className="space-y-5">

        {/* ── 통계 카드 ── */}
        <section className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="metric-card">
              <div className="info-cell-label">{s.label}</div>
              <div className={`mt-2 text-3xl font-black tracking-tight ${s.color}`}>{s.value}</div>
              <div className="mt-1.5 text-xs text-white/35">{s.sub}</div>
            </div>
          ))}
        </section>

        {/* ── 진행률 바 ── */}
        <div className="panel rounded-2xl px-5 py-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-white/40">
            <span>파트너 제출률</span>
            <span className="font-semibold text-white/60">
              {partnerNominations.filter(p => p.submissionStatus !== "not_submitted").length} / {nominationSummary.totalPartners}개 대학
            </span>
          </div>
          <div className="h-2 rounded-full bg-white/8 overflow-hidden flex gap-0.5">
            {partnerNominations.map((p) => (
              <div
                key={p.partnerId}
                title={p.university}
                className={`flex-1 h-full transition-all ${
                  p.submissionStatus === "submitted"     ? "bg-green-500" :
                  p.submissionStatus === "partial"       ? "bg-amber-400" :
                  "bg-white/10"
                }`}
              />
            ))}
          </div>
          <div className="flex items-center gap-4 text-[10px] text-white/30">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500 inline-block"/><span>제출 완료</span></span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400 inline-block"/><span>일부 제출</span></span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-white/10 inline-block"/><span>미제출</span></span>
          </div>
        </div>

        {/* ── 필터 & 검색 ── */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* 검색 */}
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="대학명 · 국가 검색"
            className="input text-sm py-2 px-3 w-48 shrink-0"
          />

          {/* 구분선 */}
          <span className="h-4 w-px bg-white/10 shrink-0" />

          {/* 제출 상태 필터 */}
          {(["all", "submitted", "partial", "not_submitted"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-xs px-3 py-1.5 rounded-xl border transition font-medium shrink-0 ${
                filter === f
                  ? "bg-red-700 border-red-600 text-white"
                  : "border-white/10 text-white/45 hover:border-white/20 hover:text-white/70"
              }`}
            >
              {f === "all" ? "전체" : submissionLabel[f]}
            </button>
          ))}

          {/* 구분선 */}
          <span className="h-4 w-px bg-white/10 shrink-0" />

          {/* 이름 불일치 필터 버튼 */}
          <button
            onClick={() => setFilter(filter === "mismatch" ? "all" : "mismatch")}
            className={`relative text-xs px-3 py-1.5 rounded-xl border transition font-medium flex items-center gap-1.5 shrink-0 ${
              filter === "mismatch"
                ? "bg-amber-700/80 border-amber-500/60 text-white"
                : "border-amber-500/40 text-amber-400 hover:border-amber-500/70 hover:text-amber-300"
            }`}
          >
            {mismatchCount > 0 && filter !== "mismatch" && (
              <span className="relative flex h-1.5 w-1.5 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-400" />
              </span>
            )}
            <span>⚠ 이름 불일치</span>
            {mismatchCount > 0 && (
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                filter === "mismatch" ? "bg-white/20 text-white" : "bg-amber-900/70 text-amber-300"
              }`}>
                {mismatchCount}
              </span>
            )}
          </button>

          {/* 우측 카운트 */}
          <span className="ml-auto text-xs text-white/30 shrink-0">
            {filtered.length}개 대학 표시
          </span>
        </div>

        {/* ── 대학 목록 ── */}
        <div className="space-y-2">
          {filtered.map((p) => (
            <PartnerRow key={p.partnerId} p={p} />
          ))}
        </div>

      </div>
    </PortalShell>
  );
}
