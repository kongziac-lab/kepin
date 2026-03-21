import { PortalShell } from "@/components/portal-shell";
import { orientationAssets } from "@/lib/mock-data";

export default function AdminOrientationPage() {
  return (
    <PortalShell
      area="admin"
      title="오리엔테이션 관리"
      description="자료 업로드, 공유 파일 목록, 학생 공지 발송을 위한 운영 화면입니다."
    >
      <section className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
        <div className="panel-strong rounded-[2rem] p-6">
          <div className="text-2xl font-bold">자료 업로드</div>
          <div className="mt-5 rounded-[1.5rem] border border-dashed border-orange-300/30 bg-black/10 p-10 text-center text-sm text-white/45">
            Orientation Asset Upload
          </div>
          <button className="button-primary mt-5">학생 공지 발송</button>
        </div>
        <div className="panel rounded-[2rem] p-6">
          <div className="text-2xl font-bold">공유 자료 목록</div>
          <div className="mt-6 space-y-4">
            {orientationAssets.map((item) => (
              <div key={item.title} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="font-semibold">{item.title}</div>
                    <div className="mt-1 text-sm text-white/45">{item.updatedAt}</div>
                  </div>
                  <div className="text-sm text-white/68">{item.type}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PortalShell>
  );
}
