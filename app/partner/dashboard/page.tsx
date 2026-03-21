import Link from "next/link";
import { PortalShell } from "@/components/portal-shell";
import { partnerUniversities, studentApplications, statusLabel } from "@/lib/mock-data";

const statusBadge = (status: string) => {
  switch (status) {
    case "under_review":       return { label: "검토 중", cls: "badge-yellow" };
    case "accepted":           return { label: "합격",    cls: "badge-green"  };
    case "application_pending":return { label: "신청 대기", cls: "badge-red"   };
    default:                   return { label: status,   cls: "badge-yellow"  };
  }
};

export default function PartnerDashboardPage() {
  return (
    <PortalShell
      area="partner"
      title="파트너대학 대시보드"
      description="노미네이션 현황, 학생별 진행 상태, 이번 학기 활동 요약을 확인하는 홈 화면입니다."
    >
      {/* ── Metrics ── */}
      <section className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "이번 학기 제출", value: "18", color: "#f5f0ef" },
          { label: "검토 중",        value: "6",  color: "#fbbf24" },
          { label: "합격",           value: "9",  color: "#34d399" }
        ].map(({ label, value, color }) => (
          <div key={label} className="metric-card">
            <div className="info-cell-label">{label}</div>
            <div className="mt-2 text-3xl font-black tracking-tight" style={{ color }}>{value}</div>
          </div>
        ))}
      </section>

      {/* ── Students + Network ── */}
      <section className="grid gap-6 xl:grid-cols-[1fr_0.85fr]">
        {/* Nominated students */}
        <div
          className="rounded-[2rem] p-6"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)"
          }}
        >
          <div className="mb-2 flex items-center justify-between gap-4">
            <div className="text-xl font-bold">노미네이션 진행 학생</div>
            <Link href="/partner/nominations" className="text-xs text-red-400 hover:text-red-300 transition-colors">
              전체 보기 →
            </Link>
          </div>
          <p className="mb-6 text-xs text-white/35">현재 접수 중인 학생의 진행 현황입니다.</p>
          <div className="space-y-3">
            {studentApplications.map((item) => {
              const badge = statusBadge(item.status);
              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-4 rounded-2xl border border-white/7 bg-white/3 px-5 py-4"
                >
                  <div>
                    <div className="font-semibold text-sm">{item.name}</div>
                    <div className="mt-0.5 text-xs text-white/38">{item.id} · {item.major}</div>
                  </div>
                  <span className={badge.cls}>{badge.label}</span>
                </div>
              );
            })}
          </div>

          <Link href="/partner/nominate" className="button-primary mt-6 block w-full text-center py-3.5 text-sm">
            + 노미네이션 신규 제출
          </Link>
        </div>

        {/* Network */}
        <div
          className="rounded-[2rem] p-6"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)"
          }}
        >
          <div className="mb-6 text-xl font-bold">협정 네트워크</div>
          <div className="space-y-3">
            {partnerUniversities.map((item) => (
              <div
                key={item.name}
                className="rounded-2xl border border-white/6 bg-black/10 px-4 py-4"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-sm font-semibold">{item.name}</div>
                    <div className="mt-0.5 text-xs text-white/35">{item.country}</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-base font-bold text-red-400">{item.nominations}명</div>
                    <div className="text-[10px] text-white/30 mt-0.5">{item.status}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-2xl border border-white/6 bg-white/3 p-4 text-center">
            <div className="text-xs text-white/35 mb-1">전체 협정대학</div>
            <div className="text-2xl font-black text-red-400">247+</div>
            <div className="text-xs text-white/30">83개국</div>
          </div>
        </div>
      </section>
    </PortalShell>
  );
}
