"use client";

import Link from "next/link";
import { useState } from "react";
import { nameMismatchAlerts, statusLabel, type NameMismatchAlert } from "@/lib/mock-data";

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  if (h >= 24) return `${Math.floor(h / 24)}일 전`;
  if (h > 0)   return `${h}시간 전`;
  return `${m}분 전`;
}

function DiffBadge({ a, b }: { a: string; b: string }) {
  const wa = a.split(" ");
  const wb = b.split(" ");
  return (
    <span className="font-mono text-xs tracking-wide">
      {wa.map((word, i) => {
        const same = word.toUpperCase() === (wb[i] ?? "").toUpperCase();
        return (
          <span key={i}>
            {i > 0 && " "}
            <span className={same ? "text-white/55" : "text-amber-300 underline decoration-dotted underline-offset-2"}>
              {word}
            </span>
          </span>
        );
      })}
    </span>
  );
}

/* ── 한 줄 compact 카드 ─────────────────────────────────────────────── */
function AlertRow({ alert, onDismiss }: { alert: NameMismatchAlert; onDismiss: () => void }) {
  const isTypo = alert.severity === "typo";
  return (
    <div className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border ${
      isTypo ? "border-amber-500/20 bg-amber-900/8" : "border-red-600/25 bg-red-900/8"
    }`}>
      {/* 심각도 아이콘 */}
      <span className="text-sm shrink-0">{isTypo ? "⚠️" : "❌"}</span>

      {/* 학생 정보 */}
      <div className="shrink-0">
        <span className="text-sm font-semibold text-white/85">{alert.nameKo}</span>
        <span className="text-[10px] text-white/30 ml-1.5 font-mono">{alert.studentId}</span>
      </div>

      {/* 배지들 */}
      <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold shrink-0 ${
        isTypo ? "bg-amber-900/60 text-amber-300" : "bg-red-900/60 text-red-300"
      }`}>
        {isTypo ? `철자 오류 ${alert.distance}자` : `불일치 ${alert.distance}자`}
      </span>
      <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-white/30 border border-white/8 shrink-0">
        {statusLabel(alert.status)}
      </span>

      {/* 이름 비교 — 가운데 영역 */}
      <div className="flex-1 flex items-center gap-2 min-w-0 overflow-hidden">
        <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-900/50 text-green-300 font-bold shrink-0">노미</span>
        <DiffBadge a={alert.nominationName} b={alert.passportName} />
        <span className="text-white/20 shrink-0">→</span>
        <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-900/50 text-blue-300 font-bold shrink-0">여권</span>
        <span className="font-mono text-xs text-white/55 tracking-wide">{alert.passportName}</span>
      </div>

      {/* 시간 + 액션 */}
      <span className="text-[10px] text-white/20 shrink-0">{timeAgo(alert.detectedAt)}</span>
      <Link
        href={`/admin/students/${encodeURIComponent(alert.studentId)}/apply` as never}
        className="text-[11px] px-2.5 py-1 rounded-lg bg-red-700/80 hover:bg-red-600 text-white font-semibold transition shrink-0 whitespace-nowrap"
      >
        수정 →
      </Link>
      <button
        onClick={onDismiss}
        className="text-white/20 hover:text-white/50 transition shrink-0 w-4 h-4 flex items-center justify-center text-xs"
      >
        ✕
      </button>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════ */
export function NameMismatchPanel() {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [expanded,  setExpanded]  = useState(false);

  const visible = nameMismatchAlerts.filter((a) => !dismissed.has(a.studentId));
  if (visible.length === 0) return null;

  const first = visible[0];
  const rest  = visible.slice(1);

  const typoCount  = visible.filter((a) => a.severity === "typo").length;
  const majorCount = visible.filter((a) => a.severity === "major").length;

  function dismiss(id: string) {
    setDismissed((prev) => new Set([...prev, id]));
    // 펼쳐진 상태에서 rest가 모두 닫히면 접기
    if (expanded && rest.filter(a => a.studentId !== id).length === 0) setExpanded(false);
  }

  return (
    <section
      className="rounded-2xl overflow-hidden"
      style={{ background: "rgba(251,191,36,0.03)", border: "1px solid rgba(251,191,36,0.16)" }}
    >
      {/* ── 헤더 ── */}
      <div className="flex items-center gap-2.5 px-4 py-3 border-b border-white/5">
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
        </span>
        <span className="font-semibold text-sm text-white">이름 불일치 감지</span>
        <span className="text-xs text-white/35">학생 신청서 작성 중 노미네이션·여권 이름이 다른 건이 있습니다</span>
        <div className="ml-auto flex items-center gap-2">
          {typoCount > 0 && (
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-900/60 text-amber-300 font-semibold border border-amber-500/25">
              철자 오류 {typoCount}건
            </span>
          )}
          {majorCount > 0 && (
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-red-900/60 text-red-300 font-semibold border border-red-600/25">
              불일치 {majorCount}건
            </span>
          )}
        </div>
      </div>

      {/* ── 카드 목록 ── */}
      <div className="px-3 py-3 space-y-1.5">
        {/* 첫 번째 항목 — 항상 표시 */}
        <AlertRow
          alert={first}
          onDismiss={() => dismiss(first.studentId)}
        />

        {/* 나머지 — 펼쳐야 표시 */}
        {expanded && rest.filter((a) => !dismissed.has(a.studentId)).map((alert) => (
          <AlertRow
            key={alert.studentId}
            alert={alert}
            onDismiss={() => dismiss(alert.studentId)}
          />
        ))}

        {/* 펼치기 / 접기 버튼 */}
        {rest.filter((a) => !dismissed.has(a.studentId)).length > 0 && (
          <button
            onClick={() => setExpanded((v) => !v)}
            className="w-full text-xs text-white/35 hover:text-white/60 py-1.5 flex items-center justify-center gap-1.5 transition"
          >
            <span className={`transition-transform ${expanded ? "rotate-180" : ""}`}>▾</span>
            {expanded
              ? "접기"
              : `${rest.filter((a) => !dismissed.has(a.studentId)).length}건 더 보기`}
          </button>
        )}
      </div>
    </section>
  );
}
