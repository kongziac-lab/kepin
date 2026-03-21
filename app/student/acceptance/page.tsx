import { PortalShell } from "@/components/portal-shell";

export default function StudentAcceptancePage() {
  return (
    <PortalShell
      area="student"
      title="입학통지서 다운로드"
      description="합격 처리 후 관리자가 업로드한 Acceptance Letter를 학생이 바로 내려받는 화면입니다."
    >
      <section className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="panel rounded-[2rem] p-6">
          <div className="text-2xl font-bold">Acceptance Letter</div>
          <div className="mt-6 rounded-[1.5rem] border border-dashed border-white/15 bg-black/10 p-10 text-center text-white/45">
            PDF Preview Placeholder
          </div>
        </div>
        <div className="panel-strong rounded-[2rem] p-6">
          <div className="text-lg font-bold">문서 메타 정보</div>
          <div className="mt-5 space-y-3 text-sm text-white/68">
            <div className="rounded-2xl border border-white/10 bg-black/10 px-4 py-3">발행일: 2026-05-30</div>
            <div className="rounded-2xl border border-white/10 bg-black/10 px-4 py-3">상태: Accepted</div>
            <div className="rounded-2xl border border-white/10 bg-black/10 px-4 py-3">비자 신청 제출용</div>
          </div>
          <button className="button-primary mt-6 w-full">PDF 다운로드</button>
        </div>
      </section>
    </PortalShell>
  );
}
