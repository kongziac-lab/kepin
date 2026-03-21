import Link from "next/link";

export default function PartnerAuthPage() {
  return (
    <div className="page-shell">
      <div className="mx-auto flex min-h-screen max-w-5xl items-center px-6 py-12">
        <div className="grid w-full gap-6 lg:grid-cols-2">
          <div className="panel rounded-[2rem] p-8">
            <div className="chip mb-5">Partner Auth</div>
            <h1 className="text-4xl font-black tracking-tight">파트너대학 관리자 활성화</h1>
            <p className="mt-4 text-white/60">
              기획서에 맞춰 KMU 관리자가 초대 메일을 발송하고, 파트너 관리자가 활성화 링크를 통해
              계정을 생성하는 구조로 설계했습니다.
            </p>
            <div className="mt-8 space-y-4">
              <input className="input" placeholder="파트너대학 이메일" />
              <input className="input" placeholder="초대 토큰 또는 비밀번호" />
              <Link href="/partner/dashboard" className="button-primary w-full">
                파트너 포털로 이동
              </Link>
            </div>
          </div>
          <div className="panel rounded-[2rem] p-8">
            <div className="text-sm uppercase tracking-[0.2em] text-white/35">Partner Features</div>
            <div className="mt-4 space-y-4 text-sm text-white/65">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">노미네이션 단건 등록</div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">엑셀 일괄 업로드</div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">학생별 진행 상태 열람</div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">제출, 대기, 취소 상태 관리</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
