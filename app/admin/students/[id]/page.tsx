import { PortalShell } from "@/components/portal-shell";
import { StatusTimeline } from "@/components/status-timeline";
import { studentProfile } from "@/lib/mock-data";

export default async function AdminStudentDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <PortalShell
      area="admin"
      title={`학생 상세 · ${id}`}
      description="신청서 상세, 서류 검토, 상태 변경, 이메일 발송을 한 페이지에서 처리하는 화면입니다."
    >
      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="panel rounded-[2rem] p-6">
          <div className="text-2xl font-bold">신청서 상세</div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {[
              ["접수번호", studentProfile.applicationNo],
              ["학번", studentProfile.studentId],
              ["한글성명", studentProfile.nameKo],
              ["영문성명", studentProfile.nameEn],
              ["국적", studentProfile.nationality],
              ["여권번호", studentProfile.passportNo],
              ["전공", studentProfile.major],
              ["수학기간", studentProfile.intake]
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-xs uppercase tracking-[0.14em] text-white/35">{label}</div>
                <div className="mt-2 font-semibold">{value}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <div className="panel-strong rounded-[2rem] p-6">
            <div className="text-xl font-bold">상태 변경</div>
            <div className="mt-4 grid gap-3">
              <select className="input">
                <option>under_review</option>
                <option>accepted</option>
                <option>dormitory_pending</option>
                <option>course_registration</option>
              </select>
              <button className="button-primary">상태 저장</button>
            </div>
          </div>
          <div className="panel rounded-[2rem] p-6">
            <div className="text-xl font-bold">이메일 액션</div>
            <div className="mt-4 space-y-3">
              <button className="button-secondary w-full">보완 요청 메일</button>
              <button className="button-secondary w-full">합격 메일 발송</button>
              <button className="button-secondary w-full">수강신청 안내 메일</button>
            </div>
          </div>
        </div>
      </section>

      <section className="panel rounded-[2rem] p-6">
        <div className="text-2xl font-bold">단계 흐름</div>
        <div className="mt-6">
          <StatusTimeline currentStatus="under_review" />
        </div>
      </section>
    </PortalShell>
  );
}
