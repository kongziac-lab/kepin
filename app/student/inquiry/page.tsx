import { PortalShell } from "@/components/portal-shell";

export default function StudentInquiryPage() {
  return (
    <PortalShell
      area="student"
      title="질문하기"
      description="학생이 관리자에게 문의를 보내고, 단계별 공지와 함께 커뮤니케이션을 이어가는 화면입니다."
    >
      <section className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="panel rounded-[2rem] p-6">
          <div className="text-2xl font-bold">문의 작성</div>
          <div className="mt-6 grid gap-4">
            <input className="input" placeholder="문의 제목" />
            <select className="input">
              <option>카테고리 선택</option>
              <option>서류 제출</option>
              <option>기숙사</option>
              <option>비자</option>
            </select>
            <textarea className="input min-h-48" placeholder="문의 내용을 입력하세요." />
            <button className="button-primary w-full sm:w-fit">관리자에게 전송</button>
          </div>
        </div>
        <div className="panel rounded-[2rem] p-6">
          <div className="text-xl font-bold">최근 문의</div>
          <div className="mt-5 space-y-4 text-sm text-white/65">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="font-semibold">Dormitory payment due date</div>
              <div className="mt-2 text-white/45">답변 대기</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="font-semibold">Transcript file format</div>
              <div className="mt-2 text-white/45">답변 완료</div>
            </div>
          </div>
        </div>
      </section>
    </PortalShell>
  );
}
