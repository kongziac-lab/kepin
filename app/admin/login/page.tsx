import Link from "next/link";

export default function AdminLoginPage() {
  return (
    <div className="page-shell">
      <div className="mx-auto flex min-h-screen max-w-3xl items-center px-6 py-12">
        <div className="panel-strong w-full rounded-[2rem] p-8">
          <div className="chip mb-5">KMU Admin Login</div>
          <h1 className="text-4xl font-black tracking-tight">국제처 관리자 로그인</h1>
          <p className="mt-4 text-white/60">
            관리자 전용 로그인 화면입니다. 실제 구현 시 Supabase Auth와 role 기반 접근 제어를 연결하면
            됩니다.
          </p>
          <div className="mt-8 grid gap-4">
            <input className="input" placeholder="staff@kmu.ac.kr" />
            <input className="input" placeholder="비밀번호" />
            <input className="input" placeholder="2차 인증 코드" />
            <Link href="/admin/dashboard" className="button-primary w-full">
              관리자 대시보드로 이동
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
