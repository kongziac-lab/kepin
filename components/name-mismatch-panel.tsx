"use client";

import Link from "next/link";
import { useState } from "react";
import { nameMismatchAlerts, statusLabel, type NameMismatchAlert } from "@/lib/mock-data";

/* ── 시간 포맷 ── */
function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  if (h >= 24) return `${Math.floor(h / 24)}일 전`;
  if (h > 0)   return `${h}시간 전`;
  return `${m}분 전`;
}

/* ── 단어 차이 하이라이트 ── */
function DiffBadge({ a, b }: { a: string; b: string }) {
  const wa = a.split(" ");
  const wb = b.split(" ");
  const maxLen = Math.max(wa.length, wb.length);
  return (
    <span className="font-mono text-xs">
      {Array.from({ length: maxLen }).map((_, i) => {
        const same = (wa[i] ?? "").toUpperCase() === (wb[i] ?? "").toUpperCase();
        return (
          <span key={i}>
            {i > 0 && " "}
            <span className={same ? "text-white/60" : "text-amber-300 underline decoration-dotted"}>
              {wa[i] ?? ""}
            </span>
          </span>
        );
      })}
    </span>
  );
}

/* ── 개별 알림 카드 ── */
function AlertCard({ alert, onDismiss }: { alert: NameMismatchAlert; onDismiss: () => void }) {
  const isTypo = alert.severity === "typo";

  return (
    <div className={`rounded-2xl border overflow-hidden transition-all ${
      isTypo ? "border-amber-500/25 bg-amber-900/8" : "border-red-600/30 bg-red-900/10"
    }`}>
      {/* 헤더 행 */}
      <div className="flex items-center gap-3 px-4 py-3">
        <span className="text-base shrink-0">{isTypo ? "⚠️" : "❌"}</span>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-sm text-white/90">{alert.nameKo}</span>
            <span className="text-[10px] font-mono text-white/35">{alert.studentId}</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
              isTypo
                ? "bg-amber-900/60 text-amber-300"
                : "bg-red-900/60 text-red-300"
            }`}>
              {isTypo ? `철자 오류 (${alert.distance}자 차이)` : `불일치 (${alert.distance}자 차이)`}
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-white/35 border border-white/8">
              {statusLabel(alert.status)}
            </span>
          </div>
          <div className="text-xs text-white/35 mt-0.5 truncate">{alert.partner}</div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[10px] text-white/25">{timeAgo(alert.detectedAt)}</span>
          <button
            onClick={onDismiss}
            className="text-white/20 hover:text-white/50 transition text-sm w-5 h-5 flex items-center justify-center"
            title="알림 닫기"
          >
            ✕
          </button>
        </div>
      </div>

      {/* 이름 비교 행 */}
      <div className="border-t border-white/5 px-4 py-2.5 grid grid-cols-2 gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-900/50 text-green-300 font-bold shrink-0">노미네이션</span>
          <DiffBadge a={alert.nominationName} b={alert.passportName} />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-900/50 text-blue-300 font-bold shrink-0">여권</span>
          <span className="font-mono text-xs text-white/60">{alert.passportName}</span>
        </div>
      </div>

      {/* 액션 행 */}
      <div className="border-t border-white/5 px-4 py-2.5 flex items-center justify-end gap-2">
        <Link
          href={`/admin/students/${encodeURIComponent(alert.studentId)}/apply` as never}
          className="text-xs px-3 py-1.5 rounded-lg bg-red-700/80 hover:bg-red-600 text-white font-semibold transition"
        >
          신청서에서 수정 →
        </Link>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════ */
export function NameMismatchPanel() {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  const visible = nameMismatchAlerts.filter((a) => !dismissed.has(a.studentId));

  if (visible.length === 0) return null;

  const typoCount  = visible.filter((a) => a.severity === "typo").length;
  const majorCount = visible.filter((a) => a.severity === "major").length;

  return (
    <section
      className="rounded-[2rem] overflow-hidden"
      style={{
        background: "rgba(251,191,36,0.04)",
        border: "1px solid rgba(251,191,36,0.18)"
      }}
    >
      {/* 패널 헤더 */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-white/6">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500" />
        </span>
        <div className="flex-1">
          <span className="font-bold text-white">이름 불일치 감지</span>
          <span className="text-xs text-white/40 ml-3">
            학생 신청서 작성 중 노미네이션·여권 이름이 다른 건이 있습니다
          </span>
        </div>
        <div className="flex items-center gap-2">
          {typoCount > 0 && (
            <span className="text-xs px-2.5 py-1 rounded-full bg-amber-900/60 text-amber-300 font-semibold border border-amber-500/25">
              철자 오류 {typoCount}건
            </span>
          )}
          {majorCount > 0 && (
            <span className="text-xs px-2.5 py-1 rounded-full bg-red-900/60 text-red-300 font-semibold border border-red-600/25">
              불일치 {majorCount}건
            </span>
          )}
        </div>
      </div>

      {/* 알림 카드 목록 */}
      <div className="p-4 space-y-3">
        {visible.map((alert) => (
          <AlertCard
            key={alert.studentId}
            alert={alert}
            onDismiss={() =>
              setDismissed((prev) => new Set([...prev, alert.studentId]))
            }
          />
        ))}
      </div>
    </section>
  );
}
