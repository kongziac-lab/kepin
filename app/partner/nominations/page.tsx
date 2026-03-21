import { PortalShell } from "@/components/portal-shell";
import { studentApplications } from "@/lib/mock-data";

export default function PartnerNominationsPage() {
  return (
    <PortalShell
      area="partner"
      title="노미네이션 현황"
      description="제출 목록, 상태, 학생별 진행 단계를 테이블 중심으로 확인하는 화면입니다."
    >
      <section className="panel rounded-[2rem] p-6">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div className="text-2xl font-bold">제출 목록</div>
          <div className="text-sm text-white/45">제출 완료 / 대기 / 취소 상태 관리</div>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>접수번호</th>
                <th>학생명</th>
                <th>전공</th>
                <th>상태</th>
              </tr>
            </thead>
            <tbody>
              {studentApplications.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td>{item.major}</td>
                  <td>{item.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </PortalShell>
  );
}
