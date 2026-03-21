import Link from "next/link";

export default function StudentAuthPage() {
  return (
    <div className="page-shell">
      <div className="mx-auto flex min-h-screen max-w-5xl items-center px-6 py-12">
        <div className="grid w-full gap-6 lg:grid-cols-2">
          <div className="panel rounded-[2rem] p-8">
            <div className="chip mb-5">Student Auth</div>
            <h1 className="text-4xl font-black tracking-tight">학생 로그인 / 가입</h1>
            <p className="mt-4 text-white/60">
              기획서 기준의 초대형 가입 플로우를 반영했습니다. 노미네이션 확정 후 학생 초대 메일을
              발송하고, 링크를 통해 계정을 활성화합니다.
            </p>
            <div className="mt-8 space-y-4">
              <input className="input" placeholder="초대받은 이메일" />
              <input className="input" placeholder="인증 코드 또는 비밀번호" />
              <Link href="/student/dashboard" className="button-primary w-full">
                학생 포털로 이동
              </Link>
            </div>
          </div>
          <div className="panel-strong rounded-[2rem] p-8">
            <div className="text-sm uppercase tracking-[0.2em] text-orange-200/70">Flow</div>
            <div className="mt-4 text-2xl font-bold">초대 기반 접근</div>
            <div className="mt-6 space-y-4 text-sm text-white/65">
              <div className="rounded-2xl border border-white/10 bg-black/10 p-4">1. 파트너대학이 노미네이션 제출</div>
              <div className="rounded-2xl border border-white/10 bg-black/10 p-4">2. KMU가 학생 계정 생성</div>
              <div className="rounded-2xl border border-white/10 bg-black/10 p-4">3. 신청 링크가 이메일로 발송</div>
              <div className="rounded-2xl border border-white/10 bg-black/10 p-4">4. 학생이 신청서와 서류를 제출</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
