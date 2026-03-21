import { PortalShell } from "@/components/portal-shell";

export default function PartnerNominatePage() {
  return (
    <PortalShell
      area="partner"
      title="노미네이션 제출"
      description="단건 입력과 엑셀 업로드 모두를 고려한 등록 화면입니다."
    >
      <section className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <div className="panel rounded-[2rem] p-6">
          <div className="text-2xl font-bold">신규 후보자 등록</div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <input className="input" placeholder="영문 성명" />
            <input className="input" placeholder="한글 성명" />
            <input className="input" placeholder="이메일" />
            <input className="input" placeholder="생년월일" />
            <select className="input">
              <option>성별</option>
              <option>여</option>
              <option>남</option>
            </select>
            <select className="input">
              <option>과정</option>
              <option>학사</option>
              <option>대학원</option>
            </select>
            <select className="input sm:col-span-2">
              <option>수학기간</option>
              <option>2026 Fall</option>
              <option>2027 Spring</option>
            </select>
          </div>
          <button className="button-primary mt-6">노미네이션 제출</button>
        </div>
        <div className="panel-strong rounded-[2rem] p-6">
          <div className="text-xl font-bold">엑셀 일괄 등록</div>
          <div className="mt-4 rounded-[1.5rem] border border-dashed border-orange-300/30 bg-black/10 p-8 text-center text-sm text-white/45">
            Upload .xlsx Template
          </div>
          <div className="mt-5 text-sm text-white/58">
            템플릿 다운로드, 검증 결과 미리보기, 중복 이메일 검사 영역을 추가하기 좋은 구조입니다.
          </div>
        </div>
      </section>
    </PortalShell>
  );
}
