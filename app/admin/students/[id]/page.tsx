"use client";

import { useState, use } from "react";
import { PortalShell } from "@/components/portal-shell";
import { StatusTimeline } from "@/components/status-timeline";
import { studentProfile } from "@/lib/mock-data";

/* ── 필드 정의 ─────────────────────────────────────────────── */
type FieldKey = keyof typeof studentProfile;
const FIELDS: { key: FieldKey; label: string; type?: string }[] = [
  { key: "applicationNo", label: "접수번호" },
  { key: "studentId",     label: "학번" },
  { key: "nameKo",        label: "한글성명" },
  { key: "nameEn",        label: "영문성명" },
  { key: "nationality",   label: "국적" },
  { key: "email",         label: "이메일",   type: "email" },
  { key: "phone",         label: "연락처" },
  { key: "passportNo",    label: "여권번호" },
  { key: "major",         label: "전공" },
  { key: "dormitory",     label: "기숙사" },
  { key: "intake",        label: "수학기간" },
];

export default function AdminStudentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [data, setData]         = useState({ ...studentProfile });
  const [draft, setDraft]       = useState({ ...studentProfile });
  const [isEditing, setIsEditing] = useState(false);
  const [saved, setSaved]         = useState(false);

  const [status, setStatus] = useState("under_review");

  function startEdit() {
    setDraft({ ...data });
    setIsEditing(true);
    setSaved(false);
  }
  function saveEdit() {
    setData({ ...draft });
    setIsEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }
  function cancelEdit() {
    setIsEditing(false);
  }

  return (
    <PortalShell
      area="admin"
      title={`학생 상세 · ${id}`}
      description="신청서 상세, 서류 검토, 상태 변경, 이메일 발송을 한 페이지에서 처리하는 화면입니다."
    >
      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">

        {/* ── 신청서 상세 ── */}
        <div className="panel rounded-[2rem] p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-xl font-bold">신청서 상세</div>
            <div className="flex items-center gap-2">
              {saved && (
                <span className="text-xs text-green-400 animate-pulse">✓ 저장됨</span>
              )}
              {isEditing ? (
                <>
                  <button
                    onClick={cancelEdit}
                    className="text-xs text-white/40 hover:text-white/70 border border-white/10 rounded-lg px-3 py-1.5 transition"
                  >
                    취소
                  </button>
                  <button
                    onClick={saveEdit}
                    className="text-xs bg-red-700 hover:bg-red-600 text-white font-semibold rounded-lg px-3 py-1.5 transition"
                  >
                    저장
                  </button>
                </>
              ) : (
                <button
                  onClick={startEdit}
                  className="text-xs text-white/40 hover:text-white/70 border border-white/10 rounded-lg px-3 py-1.5 transition"
                >
                  편집
                </button>
              )}
            </div>
          </div>

          {/* 필드 목록 */}
          <div className="divide-y divide-white/5 rounded-xl border border-white/8 overflow-hidden">
            {FIELDS.map(({ key, label, type }) => (
              <div
                key={key}
                className="flex items-center gap-4 px-4 py-2.5 bg-white/2 hover:bg-white/4 transition"
              >
                <span className="text-xs text-white/35 w-20 shrink-0">{label}</span>
                {isEditing ? (
                  <input
                    type={type ?? "text"}
                    value={draft[key]}
                    onChange={(e) =>
                      setDraft((d) => ({ ...d, [key]: e.target.value }))
                    }
                    className="flex-1 text-sm bg-white/5 border border-white/12 focus:border-red-500/50 rounded-lg px-2.5 py-1 text-white/90 outline-none transition"
                  />
                ) : (
                  <span className="flex-1 text-sm font-medium text-white/85">
                    {data[key]}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── 우측 패널 ── */}
        <div className="space-y-6">
          {/* 상태 변경 */}
          <div className="panel-strong rounded-[2rem] p-6">
            <div className="text-xl font-bold">상태 변경</div>
            <div className="mt-4 grid gap-3">
              <select
                className="input"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="nomination_submitted">노미네이션 제출</option>
                <option value="application_pending">온라인 신청 대기</option>
                <option value="under_review">서류 검토 중</option>
                <option value="accepted">합격</option>
                <option value="dormitory_pending">기숙사비 납부 대기</option>
                <option value="course_registration">수강신청 안내</option>
                <option value="orientation">오리엔테이션</option>
                <option value="enrolled">입학 완료</option>
              </select>
              <button className="button-primary">상태 저장</button>
            </div>
          </div>

          {/* 이메일 액션 */}
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

      {/* ── 단계 흐름 ── */}
      <section className="panel rounded-[2rem] p-6">
        <div className="text-2xl font-bold">단계 흐름</div>
        <div className="mt-6">
          <StatusTimeline currentStatus="under_review" />
        </div>
      </section>
    </PortalShell>
  );
}
