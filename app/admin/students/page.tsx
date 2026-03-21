import Link from "next/link";
import { PortalShell } from "@/components/portal-shell";
import { statusLabel, studentApplications } from "@/lib/mock-data";

const statusColor: Record<string, string> = {
  under_review:        "badge-yellow",
  accepted:            "badge-green",
  application_pending: "badge-red",
  dormitory_pending:   "badge-yellow",
  enrolled:            "badge-green"
};

export default function AdminStudentsPage() {
  return (
    <PortalShell
      area="admin"
      title="학생 목록 / 관리"
      description="전체 학생 목록을 필터링하고, 상세 화면으로 진입해 상태 변경과 메일 발송을 이어가는 화면입니다."
    >
      {/* ── Filter bar ── */}
      <div
        className="rounded-[2rem] p-5"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.07)"
        }}
      >
        <div className="mb-3 text-[10px] font-bold uppercase tracking-widest text-white/28">필터</div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <input className="input" placeholder="학생명 검색" />
          <input className="input" placeholder="파트너대학" />
          <input className="input" placeholder="수학기간" />
          <select className="input">
            <option value="">전체 상태</option>
            <option>under_review</option>
            <option>accepted</option>
            <option>application_pending</option>
          </select>
        </div>
      </div>

      {/* ── Student table ── */}
      <div
        className="rounded-[2rem] overflow-hidden"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.07)"
        }}
      >
        <div className="flex items-center justify-between gap-4 px-6 py-5 border-b border-white/6">
          <div className="text-lg font-bold">학생 목록</div>
          <span className="badge-yellow">{studentApplications.length}명</span>
        </div>
        <div className="table-wrap" style={{ border: "none", borderRadius: 0 }}>
          <table>
            <thead>
              <tr>
                <th>접수번호</th>
                <th>학생명</th>
                <th>파트너대학</th>
                <th>전공</th>
                <th>단계</th>
                <th>상세</th>
              </tr>
            </thead>
            <tbody>
              {studentApplications.map((item) => (
                <tr key={item.id}>
                  <td className="font-mono text-xs text-white/55">{item.id}</td>
                  <td className="font-semibold">{item.name}</td>
                  <td className="text-white/60">{item.partner}</td>
                  <td className="text-white/55">{item.major}</td>
                  <td>
                    <span className={statusColor[item.status] ?? "badge-yellow"}>
                      {statusLabel(item.status)}
                    </span>
                  </td>
                  <td>
                    <Link
                      href={`/admin/students/${encodeURIComponent(item.id)}`}
                      className="inline-flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/60 hover:bg-white/10 hover:text-white transition-all"
                    >
                      상세 보기 →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PortalShell>
  );
}
