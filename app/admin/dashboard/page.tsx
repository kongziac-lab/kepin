import Link from "next/link";
import { PortalShell } from "@/components/portal-shell";
import { NameMismatchPanel } from "@/components/name-mismatch-panel";
import { partnerNominations, nominationSummary } from "@/lib/mock-data";

const submittedCount = partnerNominations.filter(p => p.submissionStatus !== "not_submitted").length;
const days = Math.ceil((new Date(nominationSummary.deadline).getTime() - Date.now()) / 86400000);

const metrics = [
  { label: "전체 학생",        value: "124", sub: "+12 이번 달",    color: "#f5f0ef" },
  { label: "검토 중",           value: "18",  sub: "보완 요청 7건",  color: "#fbbf24" },
  { label: "합격 완료",         value: "47",  sub: "Acceptance 발행", color: "#34d399" },
  { label: "오리엔테이션 대기", value: "22",  sub: "자료 공유 예정", color: "#f87171" }
];

const weeklyTasks = [
  { icon: "🔗", text: "파트너대학 3곳 초대 승인 처리" },
  { icon: "🔍", text: "보완 요청 7건 발송" },
  { icon: "🎓", text: "Acceptance Letter 5건 업로드" },
  { icon: "📧", text: "오리엔테이션 자료 공지 예약" }
];

const quickLinks = [
  { href: "/admin/partners"    as const, label: "파트너대학 관리",     icon: "🏛️" },
  { href: "/admin/students"    as const, label: "학생 목록 관리",      icon: "👥" },
  { href: "/admin/emails"      as const, label: "이메일 템플릿 관리",  icon: "✉️" },
  { href: "/admin/orientation" as const, label: "오리엔테이션 자료",   icon: "📁" }
];

export default function AdminDashboardPage() {
  return (
    <PortalShell
      area="admin"
      title="관리자 대시보드"
      description="기획서 기준의 전체 현황 통계, 단계별 학생 수, 우선 처리 액션을 정리한 메인 보드입니다."
    >
      {/* ── Metrics ── */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map(({ label, value, sub, color }) => (
          <div key={label} className="metric-card">
            <div className="info-cell-label">{label}</div>
            <div
              className="mt-2 text-3xl font-black tracking-tight"
              style={{ color }}
            >
              {value}
            </div>
            <div className="mt-1.5 text-xs text-white/35">{sub}</div>
          </div>
        ))}
      </section>

      {/* ── 이름 불일치 알림 ── */}
      <NameMismatchPanel />

      {/* ── 노미네이션 현황 요약 ── */}
      <section
        className="rounded-[2rem] p-5"
        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="font-bold text-white">노미네이션 현황</div>
            <div className="text-xs text-white/35 mt-0.5">
              마감 {nominationSummary.deadline} · {days > 0 ? `D-${days}` : "마감"}
            </div>
          </div>
          <Link
            href="/admin/nominations"
            className="text-xs px-3 py-1.5 rounded-xl border border-white/10 text-white/40 hover:text-white hover:border-white/20 transition"
          >
            전체 보기 →
          </Link>
        </div>

        {/* 대학별 진행 바 */}
        <div className="space-y-2 mb-4">
          {partnerNominations.filter(p => p.submissionStatus !== "not_submitted").map((p) => (
            <div key={p.partnerId} className="flex items-center gap-3">
              <span className="text-sm shrink-0">{p.flag}</span>
              <span className="text-xs text-white/55 w-40 truncate shrink-0">{p.university}</span>
              <div className="flex-1 h-1.5 rounded-full bg-white/8 overflow-hidden">
                <div
                  className={`h-full rounded-full ${p.submissionStatus === "submitted" ? "bg-green-500" : "bg-amber-400"}`}
                  style={{ width: `${Math.min(Math.round((p.students.length / p.quota) * 100), 100)}%` }}
                />
              </div>
              <span className="text-xs text-white/35 shrink-0 w-12 text-right">
                {p.students.length}/{p.quota}
              </span>
              {p.students.some(s => s.hasNameMismatch) && (
                <span className="text-[10px] text-amber-400 shrink-0">⚠</span>
              )}
            </div>
          ))}
        </div>

        {/* 미제출 대학 */}
        <div className="rounded-xl bg-white/3 border border-white/6 px-4 py-3 flex items-center justify-between">
          <span className="text-xs text-white/45">
            미제출 대학
            <span className="ml-2 font-bold text-amber-400">
              {partnerNominations.filter(p => p.submissionStatus === "not_submitted").length}곳
            </span>
            <span className="ml-2 text-white/25">
              ({partnerNominations.filter(p => p.submissionStatus === "not_submitted").map(p => p.university).slice(0, 2).join(", ")}
              {partnerNominations.filter(p => p.submissionStatus === "not_submitted").length > 2 ? ` 외 ${partnerNominations.filter(p => p.submissionStatus === "not_submitted").length - 2}곳` : ""})
            </span>
          </span>
          <Link
            href="/admin/emails"
            className="text-xs px-2.5 py-1 rounded-lg bg-red-700/70 hover:bg-red-600 text-white font-semibold transition"
          >
            리마인드 발송
          </Link>
        </div>
      </section>

      {/* ── Weekly tasks + Quick links ── */}
      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        {/* Weekly tasks */}
        <div
          className="rounded-[2rem] p-6"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)"
          }}
        >
          <div className="mb-1 flex items-center justify-between gap-4">
            <div className="text-xl font-bold">이번 주 운영 작업</div>
            <span className="badge-yellow">4건 대기</span>
          </div>
          <p className="mb-6 text-xs text-white/35">우선 처리가 필요한 운영 업무 목록입니다.</p>
          <div className="space-y-3">
            {weeklyTasks.map(({ icon, text }) => (
              <div
                key={text}
                className="flex items-center gap-3.5 rounded-2xl border border-white/6 bg-white/3 px-4 py-4 text-sm text-white/65"
              >
                <span className="flex-shrink-0 text-base">{icon}</span>
                {text}
              </div>
            ))}
          </div>
        </div>

        {/* Quick links */}
        <div
          className="rounded-[2rem] p-6"
          style={{
            background: "rgba(185,28,28,0.08)",
            border: "1px solid rgba(185,28,28,0.2)"
          }}
        >
          <div className="mb-6 text-xl font-bold">빠른 이동</div>
          <div className="grid gap-2.5">
            {quickLinks.map(({ href, label, icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/4 px-4 py-3.5 text-sm font-medium text-white/72 transition-all hover:bg-white/8 hover:text-white"
              >
                <span>{icon}</span>
                {label}
                <span className="ml-auto text-white/25">→</span>
              </Link>
            ))}
          </div>

          {/* Recent activity */}
          <div className="mt-5 rounded-2xl border border-white/6 bg-black/15 p-4">
            <div className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-3">
              최근 활동
            </div>
            <div className="space-y-2 text-xs text-white/42">
              <div>Anna Lee — 서류 검토 중</div>
              <div>Haruto Sato — 합격 처리 완료</div>
              <div>Liu Wen — 신청서 접수 대기</div>
            </div>
          </div>
        </div>
      </section>
    </PortalShell>
  );
}
