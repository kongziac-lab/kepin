import { PortalShell } from "@/components/portal-shell";
import { StatusTimeline } from "@/components/status-timeline";
import { studentProfile, statusLabel, studentApplications } from "@/lib/mock-data";

export default function StudentDashboardPage() {
  const application = studentApplications[0];

  return (
    <PortalShell
      area="student"
      title="학생 대시보드"
      description="접수번호, 현재 단계, 제출 필요 항목, 최근 공지와 액션을 한 화면에서 확인합니다."
    >
      {/* ── Top metric cards ── */}
      <section className="grid gap-4 sm:grid-cols-3">
        <div className="metric-card">
          <div className="info-cell-label">접수번호</div>
          <div className="mt-2 text-xl font-black tracking-tight text-red-400">
            {studentProfile.applicationNo}
          </div>
        </div>
        <div className="metric-card">
          <div className="info-cell-label">현재 단계</div>
          <div className="mt-2 text-xl font-black tracking-tight">
            {statusLabel(application.status)}
          </div>
        </div>
        <div className="metric-card">
          <div className="info-cell-label">기숙사 신청</div>
          <div className="mt-2 text-xl font-black tracking-tight">
            {studentProfile.dormitory}
          </div>
        </div>
      </section>

      {/* ── Info + Next action ── */}
      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        {/* Profile info */}
        <div
          className="rounded-[2rem] p-6"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)"
          }}
        >
          <div className="mb-6 flex items-center justify-between gap-4">
            <div className="text-xl font-bold">지원자 정보</div>
            <span className="badge-yellow">서류 검토 중</span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              ["한글성명", studentProfile.nameKo],
              ["영문성명", studentProfile.nameEn],
              ["국적",     studentProfile.nationality],
              ["이메일",   studentProfile.email],
              ["여권번호", studentProfile.passportNo],
              ["전공",     studentProfile.major]
            ].map(([label, value]) => (
              <div key={label} className="info-cell">
                <div className="info-cell-label">{label}</div>
                <div className="info-cell-value">{value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Next actions */}
        <div
          className="rounded-[2rem] p-6"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)"
          }}
        >
          <div className="mb-6 text-xl font-bold">다음 액션</div>
          <div className="space-y-3">
            {[
              { icon: "🔍", text: "여권 OCR 결과 확인 후 영문성명 검수", done: true },
              { icon: "📄", text: "성적표 PDF 업로드", done: false },
              { icon: "📋", text: "Certificate of Enrollment 첨부", done: false },
              { icon: "📬", text: "검토 결과 메일 수신 대기", done: false }
            ].map(({ icon, text, done }) => (
              <div
                key={text}
                className="flex items-center gap-3 rounded-2xl border px-4 py-3.5 text-sm"
                style={
                  done
                    ? {
                        borderColor: "rgba(52,211,153,0.2)",
                        background: "rgba(52,211,153,0.06)",
                        color: "rgba(255,255,255,0.55)"
                      }
                    : {
                        borderColor: "rgba(255,255,255,0.07)",
                        background: "rgba(255,255,255,0.03)",
                        color: "rgba(255,255,255,0.68)"
                      }
                }
              >
                <span className="flex-shrink-0">{icon}</span>
                <span className={done ? "line-through opacity-60" : ""}>{text}</span>
                {done && (
                  <span className="ml-auto text-xs text-emerald-400">완료</span>
                )}
              </div>
            ))}
          </div>

          {/* Quick links */}
          <div className="mt-6 grid gap-2">
            <a href="/student/apply" className="button-primary text-sm py-3 text-center">
              신청서 작성하기
            </a>
            <a href="/student/status" className="button-secondary text-sm py-3 text-center">
              진행 현황 확인
            </a>
          </div>
        </div>
      </section>

      {/* ── Status timeline (compact) ── */}
      <section
        className="rounded-[2rem] p-6"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.07)"
        }}
      >
        <div className="mb-6 text-xl font-bold">전체 진행 단계</div>
        <StatusTimeline currentStatus={application.status} />
      </section>
    </PortalShell>
  );
}
