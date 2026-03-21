"use client";

import Link from "next/link";
import { PortalShell } from "@/components/portal-shell";
import { AdminSemesterBar } from "@/components/admin-semester-bar";
import { NameMismatchPanel } from "@/components/name-mismatch-panel";
import { partnerNominations, studentApplications } from "@/lib/mock-data";
import { useSemester, toSemesterKey, semesterDisplayLabel } from "@/lib/semester-context";

const weeklyTasks = [
  { icon: "🔗", text: "파트너대학 3곳 초대 승인 처리" },
  { icon: "🔍", text: "보완 요청 7건 발송" },
  { icon: "🎓", text: "Acceptance Letter 5건 업로드" },
  { icon: "📧", text: "오리엔테이션 자료 공지 예약" },
];

const quickLinks = [
  { href: "/admin/partners"    as const, label: "파트너대학 관리",    icon: "🏛️" },
  { href: "/admin/nominations" as const, label: "노미네이션 관리",    icon: "📋" },
  { href: "/admin/students"    as const, label: "학생 목록 관리",     icon: "👥" },
  { href: "/admin/emails"      as const, label: "이메일 템플릿 관리", icon: "✉️" },
];

export default function AdminDashboardPage() {
  const { semester } = useSemester();
  const semKey = toSemesterKey(semester);

  const semStudents    = studentApplications.filter((s) => s.semesterKey === semKey);
  const semNominations = partnerNominations.filter((p)  => p.semesterKey === semKey);

  const underReview    = semStudents.filter((s) => s.status === "under_review").length;
  const accepted       = semStudents.filter((s) => s.status === "accepted" || s.status === "enrolled").length;
  const appPending     = semStudents.filter((s) => s.status === "application_pending" || s.status === "nomination_submitted").length;
  const submittedCount = semNominations.filter((p) => p.submissionStatus !== "not_submitted").length;
  const deadline       = semNominations[0]?.deadline ?? "—";
  const days           = deadline !== "—"
    ? Math.ceil((new Date(deadline).getTime() - Date.now()) / 86400000)
    : null;

  const metrics = [
    { label: "전체 학생",    value: String(semStudents.length), sub: semesterDisplayLabel(semester), color: "#f5f0ef" },
    { label: "서류 검토 중", value: String(underReview),        sub: "보완 요청 포함",               color: "#fbbf24" },
    { label: "합격·완료",    value: String(accepted),           sub: "Acceptance 발행",              color: "#34d399" },
    { label: "신청 대기",    value: String(appPending),         sub: "온라인 신청 미완료",            color: "#f87171" },
  ];

  return (
    <PortalShell
      area="admin"
      title="관리자 대시보드"
      description="기획서 기준의 전체 현황 통계, 단계별 학생 수, 우선 처리 액션을 정리한 메인 보드입니다."
      topBar={<AdminSemesterBar />}
    >
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map(({ label, value, sub, color }) => (
          <div key={label} className="metric-card">
            <div className="info-cell-label">{label}</div>
            <div className="mt-2 text-3xl font-black tracking-tight" style={{ color }}>{value}</div>
            <div className="mt-1.5 text-xs text-white/35">{sub}</div>
          </div>
        ))}
      </section>

      <NameMismatchPanel />

      <section className="rounded-[2rem] p-5" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="font-bold text-white">노미네이션 현황</div>
            <div className="text-xs text-white/35 mt-0.5">
              {semNominations.length > 0
                ? `마감 ${deadline} · ${days !== null && days > 0 ? `D-${days}` : "마감"}`
                : `${semesterDisplayLabel(semester)} 노미네이션 없음`}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-white/30">{submittedCount}/{semNominations.length}개 대학 제출</span>
            <Link href="/admin/nominations" className="text-xs px-3 py-1.5 rounded-xl border border-white/10 text-white/40 hover:text-white hover:border-white/20 transition">전체 보기 →</Link>
          </div>
        </div>

        {semNominations.filter((p) => p.submissionStatus !== "not_submitted").length > 0 ? (
          <>
            <div className="space-y-2 mb-4">
              {semNominations.filter((p) => p.submissionStatus !== "not_submitted").map((p) => (
                <div key={`${p.partnerId}-${p.semesterKey}`} className="flex items-center gap-3">
                  <span className="text-2xl shrink-0">{p.flag}</span>
                  <span className="text-xs text-white/55 w-40 truncate shrink-0">{p.university}</span>
                  <div className="flex-1 h-1.5 rounded-full bg-white/8 overflow-hidden">
                    <div className={`h-full rounded-full ${p.submissionStatus === "submitted" ? "bg-green-500" : "bg-amber-400"}`}
                      style={{ width: `${Math.min(Math.round((p.students.length / p.quota) * 100), 100)}%` }} />
                  </div>
                  <span className="text-xs text-white/35 shrink-0 w-12 text-right">{p.students.length}/{p.quota}</span>
                  {p.students.some((s) => s.hasNameMismatch) && <span className="text-[10px] text-amber-400 shrink-0">⚠</span>}
                </div>
              ))}
            </div>
            {semNominations.filter((p) => p.submissionStatus === "not_submitted").length > 0 && (
              <div className="rounded-xl bg-white/3 border border-white/6 px-4 py-3 flex items-center justify-between">
                <span className="text-xs text-white/45">
                  미제출 대학 <span className="ml-2 font-bold text-amber-400">{semNominations.filter((p) => p.submissionStatus === "not_submitted").length}곳</span>
                  <span className="ml-2 text-white/25">({semNominations.filter((p) => p.submissionStatus === "not_submitted").map((p) => p.university).slice(0, 2).join(", ")}{semNominations.filter((p) => p.submissionStatus === "not_submitted").length > 2 ? ` 외 ${semNominations.filter((p) => p.submissionStatus === "not_submitted").length - 2}곳` : ""})</span>
                </span>
                <Link href="/admin/emails" className="text-xs px-2.5 py-1 rounded-lg bg-red-700/70 hover:bg-red-600 text-white font-semibold transition">리마인드 발송</Link>
              </div>
            )}
          </>
        ) : (
          <div className="py-8 text-center text-sm text-white/25">{semesterDisplayLabel(semester)} 기준 제출된 노미네이션이 없습니다.</div>
        )}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[2rem] p-6" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="mb-1 flex items-center justify-between gap-4">
            <div className="text-xl font-bold">이번 주 운영 작업</div>
            <span className="badge-yellow">4건 대기</span>
          </div>
          <p className="mb-6 text-xs text-white/35">우선 처리가 필요한 운영 업무 목록입니다.</p>
          <div className="space-y-3">
            {weeklyTasks.map(({ icon, text }) => (
              <div key={text} className="flex items-center gap-3.5 rounded-2xl border border-white/6 bg-white/3 px-4 py-4 text-sm text-white/65">
                <span className="flex-shrink-0 text-base">{icon}</span>{text}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] p-6" style={{ background: "rgba(185,28,28,0.08)", border: "1px solid rgba(185,28,28,0.2)" }}>
          <div className="mb-6 text-xl font-bold">빠른 이동</div>
          <div className="grid gap-2.5">
            {quickLinks.map(({ href, label, icon }) => (
              <Link key={href} href={href} className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/4 px-4 py-3.5 text-sm font-medium text-white/72 transition-all hover:bg-white/8 hover:text-white">
                <span>{icon}</span>{label}<span className="ml-auto text-white/25">→</span>
              </Link>
            ))}
          </div>
          <div className="mt-5 rounded-2xl border border-white/6 bg-black/15 p-4">
            <div className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-3">최근 활동 — {semesterDisplayLabel(semester)}</div>
            <div className="space-y-2 text-xs text-white/42">
              {semStudents.slice(0, 3).map((s) => <div key={s.id}>{s.name} — {s.partner}</div>)}
              {semStudents.length === 0 && <div className="text-white/20">이 학기 학생 데이터가 없습니다.</div>}
            </div>
          </div>
        </div>
      </section>
    </PortalShell>
  );
}
