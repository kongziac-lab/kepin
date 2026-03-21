import { PortalShell } from "@/components/portal-shell";
import { StatusTimeline } from "@/components/status-timeline";

export default function StudentStatusPage() {
  return (
    <PortalShell
      area="student"
      title="신청 현황"
      description="기획서 4장의 8단계 상태 흐름을 학생 관점에서 확인하고, 단계별 제출 자료를 관리하는 화면입니다."
    >
      <section className="panel rounded-[2rem] p-6">
        <div className="text-2xl font-bold">단계별 진행 상태</div>
        <div className="mt-6">
          <StatusTimeline currentStatus="under_review" />
        </div>
      </section>
      <section className="grid gap-6 lg:grid-cols-3">
        {[
          ["보완 요청", "현재 없음"],
          ["기숙사비 납부 증빙", "합격 후 업로드 예정"],
          ["오리엔테이션 확인", "자료 공유 대기"]
        ].map(([title, body]) => (
          <div key={title} className="panel rounded-[2rem] p-6">
            <div className="text-lg font-bold">{title}</div>
            <p className="mt-3 text-sm text-white/58">{body}</p>
          </div>
        ))}
      </section>
    </PortalShell>
  );
}
