"use client";

import { useState, use } from "react";
import Link from "next/link";
import { PortalShell } from "@/components/portal-shell";
import { studentProfile } from "@/lib/mock-data";

/* ── 첨부파일 정의 ──────────────────────────────────────────────────── */
const ATTACHMENTS = [
  { key: "transcript",     label: "영문성적표",     required: true  },
  { key: "enrollment",     label: "영문재학증명서",  required: true  },
  { key: "recommendation", label: "추천서",          required: false },
  { key: "bank",           label: "은행잔고증명서",  required: false },
] as const;

/* ── Section 컴포넌트 ──────────────────────────────────────────────── */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="panel rounded-2xl overflow-hidden">
      <div className="px-5 py-3 border-b border-white/5 flex items-center gap-2">
        <span className="w-1.5 h-4 rounded-full bg-red-700 inline-block" />
        <h2 className="text-xs font-semibold tracking-widest text-white/45 uppercase">{title}</h2>
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

/* ── Cell 컴포넌트 ──────────────────────────────────────────────────── */
function Cell({
  label, badge, required, children,
}: {
  label: string;
  badge?: "passport" | "linked" | "admin";
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[0.7rem] font-semibold uppercase tracking-widest text-white/35 select-none leading-none flex items-center gap-1.5">
        {label}
        {required && <span className="text-red-500 ml-0.5 normal-case">*</span>}
        {badge === "passport" && (
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-900/50 text-blue-300 font-semibold normal-case tracking-normal">여권</span>
        )}
        {badge === "linked" && (
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-900/50 text-green-300 font-semibold normal-case tracking-normal">노미네이션</span>
        )}
        {badge === "admin" && (
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-900/50 text-red-300 font-semibold normal-case tracking-normal">관리자</span>
        )}
      </label>
      {children}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════ */
export default function AdminStudentApplyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  /* 관리자는 항상 편집 가능 — 학생 데이터로 초기값 세팅 */
  const [form, setForm] = useState({
    nameKo:        studentProfile.nameKo,
    nameEn:        studentProfile.nameEn,
    gender:        "Female",
    birthDate:     "1999-05-14",
    country:       studentProfile.nationality,
    passportNo:    studentProfile.passportNo,
    passportExpiry:"2030-05-13",
    email:         studentProfile.email,
    phone:         studentProfile.phone,
    address:       "123 Sukhumvit Rd, Bangkok, Thailand",
    university:    "Thammasat University",
    major:         studentProfile.major,
    grade:         "3",
    gpa:           "3.72",
    admissionType: "교환학생",
    semester:      "한학기",
    dormType:      "신축동",
    dormMeal:      "신청A (아침+저녁)",
    intake:        studentProfile.intake,
  });

  const [files, setFiles] = useState<Record<string, File | null>>({
    transcript: null, enrollment: null, recommendation: null, bank: null,
  });
  const [privacyAgreed] = useState(true); // 이미 제출된 신청서이므로 동의 완료

  const [saved,    setSaved]    = useState(false);
  const [saveOpen, setSaveOpen] = useState(false);

  function setField(key: keyof typeof form, val: string) {
    setForm((prev) => ({ ...prev, [key]: val }));
  }

  function handleSave() {
    setSaveOpen(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <PortalShell
      area="admin"
      title={`신청서 편집 · ${id}`}
      description="관리자 권한으로 학생 신청서를 직접 조회·수정합니다."
    >
      <div className="max-w-4xl mx-auto space-y-5 pb-10">

        {/* ── 관리자 편집 모드 배너 ── */}
        <div className="rounded-xl border border-red-600/30 bg-red-900/15 px-5 py-3 flex items-center gap-3">
          <span className="text-lg">🔐</span>
          <div className="flex-1 text-sm">
            <span className="text-red-300 font-semibold">관리자 편집 모드</span>
            <span className="text-white/40 ml-2">— 모든 필드를 직접 수정·저장할 수 있습니다.</span>
          </div>
          <div className="flex items-center gap-2">
            {saved && (
              <span className="text-xs text-green-400 animate-pulse">✓ 저장 완료</span>
            )}
            <Link
              href={`/admin/students/${encodeURIComponent(id)}`}
              className="text-xs text-white/40 hover:text-white/70 border border-white/10 rounded-lg px-3 py-1.5 transition"
            >
              ← 상세로 돌아가기
            </Link>
          </div>
        </div>

        {/* ══ 1. 접수정보 ════════════════════════════════════════════════ */}
        <Section title="접수정보">
          <div className="grid grid-cols-4 gap-3">
            <Cell label="접수번호" badge="admin">
              <input className="input opacity-60" value={id} readOnly disabled />
            </Cell>
            <Cell label="접수일자">
              <input className="input" defaultValue="2025.11.13" />
            </Cell>
            <Cell label="수학기간" badge="admin">
              <input
                className="input"
                value={form.intake}
                onChange={(e) => setField("intake", e.target.value)}
              />
            </Cell>
            <Cell label="입학구분" required>
              <select
                className="input"
                value={form.admissionType}
                onChange={(e) => setField("admissionType", e.target.value)}
              >
                <option>교환학생</option>
                <option>방문학생</option>
              </select>
            </Cell>
          </div>
        </Section>

        {/* ══ 2. 개인정보 ════════════════════════════════════════════════ */}
        <Section title="개인정보">
          <div className="grid grid-cols-8 gap-3">
            <div className="col-span-4">
              <Cell label="영문성명" badge="linked" required>
                <input
                  className="input"
                  value={form.nameEn}
                  onChange={(e) => setField("nameEn", e.target.value)}
                />
              </Cell>
            </div>
            <div className="col-span-4">
              <Cell label="한글이름" required>
                <input
                  className="input"
                  value={form.nameKo}
                  onChange={(e) => setField("nameKo", e.target.value)}
                  placeholder="한글 이름 입력"
                />
              </Cell>
            </div>

            <div className="col-span-2">
              <Cell label="성별" badge="passport">
                <input
                  className="input"
                  value={form.gender}
                  onChange={(e) => setField("gender", e.target.value)}
                />
              </Cell>
            </div>
            <div className="col-span-3">
              <Cell label="생년월일" badge="passport">
                <input
                  className="input"
                  value={form.birthDate}
                  onChange={(e) => setField("birthDate", e.target.value)}
                />
              </Cell>
            </div>
            <div className="col-span-3">
              <Cell label="국가" badge="passport">
                <input
                  className="input"
                  value={form.country}
                  onChange={(e) => setField("country", e.target.value)}
                />
              </Cell>
            </div>

            <div className="col-span-4">
              <Cell label="여권번호" badge="passport">
                <input
                  className="input"
                  value={form.passportNo}
                  onChange={(e) => setField("passportNo", e.target.value)}
                />
              </Cell>
            </div>
            <div className="col-span-4">
              <Cell label="여권만료일" badge="passport">
                <input
                  className="input"
                  value={form.passportExpiry}
                  onChange={(e) => setField("passportExpiry", e.target.value)}
                />
              </Cell>
            </div>

            <div className="col-span-4">
              <Cell label="이메일" required>
                <input
                  className="input"
                  type="email"
                  value={form.email}
                  onChange={(e) => setField("email", e.target.value)}
                />
              </Cell>
            </div>
            <div className="col-span-2">
              <Cell label="전화번호">
                <input
                  className="input"
                  value={form.phone}
                  onChange={(e) => setField("phone", e.target.value)}
                />
              </Cell>
            </div>
            <div className="col-span-2">
              <Cell label="추가전화번호">
                <input
                  className="input"
                  placeholder="선택사항"
                />
              </Cell>
            </div>

            <div className="col-span-8">
              <Cell label="주소">
                <input
                  className="input"
                  value={form.address}
                  onChange={(e) => setField("address", e.target.value)}
                />
              </Cell>
            </div>
          </div>
        </Section>

        {/* ══ 3. 소속대학 ════════════════════════════════════════════════ */}
        <Section title="소속대학">
          <div className="grid grid-cols-8 gap-3">
            <div className="col-span-4">
              <Cell label="대학명" badge="linked" required>
                <input
                  className="input"
                  value={form.university}
                  onChange={(e) => setField("university", e.target.value)}
                />
              </Cell>
            </div>
            <div className="col-span-2">
              <Cell label="전공명" badge="linked">
                <input
                  className="input"
                  value={form.major}
                  onChange={(e) => setField("major", e.target.value)}
                />
              </Cell>
            </div>
            <div className="col-span-2">
              <Cell label="학년" badge="linked">
                <input
                  className="input"
                  value={`${form.grade}학년`}
                  onChange={(e) => setField("grade", e.target.value)}
                />
              </Cell>
            </div>
            <div className="col-span-3">
              <Cell label="평균평점">
                <input
                  className="input"
                  value={form.gpa}
                  onChange={(e) => setField("gpa", e.target.value)}
                  placeholder="0.00 / 4.50"
                />
              </Cell>
            </div>
          </div>
        </Section>

        {/* ══ 4. 지원내용 ════════════════════════════════════════════════ */}
        <Section title="지원내용">
          <div className="grid grid-cols-4 gap-3">
            <div className="col-span-2">
              <Cell label="수학학기" required>
                <select
                  className="input"
                  value={form.semester}
                  onChange={(e) => setField("semester", e.target.value)}
                >
                  <option>한학기</option>
                  <option>1년</option>
                </select>
              </Cell>
            </div>
            <div className="col-span-2">
              <Cell label="입학구분" required>
                <select
                  className="input"
                  value={form.admissionType}
                  onChange={(e) => setField("admissionType", e.target.value)}
                >
                  <option>교환학생</option>
                  <option>방문학생</option>
                </select>
              </Cell>
            </div>
          </div>
        </Section>

        {/* ══ 5. 기숙사신청 ══════════════════════════════════════════════ */}
        <Section title="기숙사신청">
          <div className="grid grid-cols-4 gap-3">
            <div className="col-span-2">
              <Cell label="기숙사종류">
                <select
                  className="input"
                  value={form.dormType}
                  onChange={(e) => setField("dormType", e.target.value)}
                >
                  <option>신축동</option>
                  <option>봉사동</option>
                  <option>협력동</option>
                  <option>믿음동</option>
                </select>
              </Cell>
            </div>
            <div className="col-span-2">
              <Cell label="기숙사 식사여부">
                <select
                  className="input"
                  value={form.dormMeal}
                  onChange={(e) => setField("dormMeal", e.target.value)}
                >
                  <option>신청A (아침+저녁)</option>
                  <option>신청B (저녁)</option>
                  <option>미신청</option>
                </select>
              </Cell>
            </div>
          </div>
        </Section>

        {/* ══ 6. 첨부파일 ════════════════════════════════════════════════ */}
        <Section title="첨부파일">
          <div className="space-y-2.5">
            {ATTACHMENTS.map(({ key, label, required }) => (
              <div key={key} className="flex items-start gap-4">
                <div className="w-40 shrink-0 pt-2">
                  <p className="text-sm text-white/70">
                    {label}
                    {required && <span className="text-red-500 ml-0.5">*</span>}
                  </p>
                </div>
                <label
                  className={[
                    "flex-1 flex items-center gap-2 px-3 py-2.5 rounded-xl border transition cursor-pointer",
                    files[key]
                      ? "border-green-600/40 bg-green-900/15"
                      : "border-white/10 bg-white/4 hover:border-white/20",
                  ].join(" ")}
                >
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) =>
                      setFiles((prev) => ({ ...prev, [key]: e.target.files?.[0] ?? null }))
                    }
                  />
                  <svg className="w-4 h-4 text-white/25 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 002.112 2.13" />
                  </svg>
                  <span className="text-xs text-white/40 truncate flex-1 min-w-0">
                    {files[key] ? files[key]!.name : "파일을 선택하세요"}
                  </span>
                  {files[key]
                    ? <span className="text-[0.65rem] text-green-400 shrink-0">✓ 업로드됨</span>
                    : <span className="text-[0.65rem] text-white/25 border border-white/10 rounded px-2 py-0.5 shrink-0">찾아보기</span>
                  }
                </label>
              </div>
            ))}

            {/* 개인정보 동의 상태 */}
            <div className="flex items-center gap-4 pt-1">
              <div className="w-40 shrink-0">
                <p className="text-sm text-white/70">개인정보이용동의서</p>
              </div>
              <span className={`text-xs px-3 py-1.5 rounded-xl border font-semibold ${
                privacyAgreed
                  ? "border-green-600/40 bg-green-900/20 text-green-300"
                  : "border-white/10 text-white/30"
              }`}>
                {privacyAgreed ? "✓ 동의 완료" : "미동의"}
              </span>
            </div>
          </div>
        </Section>

        {/* ── 하단 액션 버튼 ── */}
        <div className="flex gap-3 justify-end pt-2">
          <Link
            href={`/admin/students/${encodeURIComponent(id)}`}
            className="px-6 py-2.5 rounded-xl border border-white/15 text-white/60 text-sm hover:bg-white/5 transition"
          >
            취소
          </Link>
          <button
            onClick={() => setSaveOpen(true)}
            className="px-6 py-2.5 rounded-xl bg-red-700 hover:bg-red-600 text-white text-sm font-semibold transition"
          >
            변경사항 저장
          </button>
        </div>
      </div>

      {/* ── 저장 확인 모달 ── */}
      {saveOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="glass rounded-2xl p-8 w-full max-w-sm space-y-5">
            <div className="flex items-center gap-3">
              <span className="text-2xl">💾</span>
              <h3 className="text-lg font-bold text-white">변경사항 저장</h3>
            </div>
            <p className="text-sm text-white/55 leading-relaxed">
              관리자 권한으로 <strong className="text-white/80">{id}</strong> 학생의 신청서를 수정 저장합니다.
            </p>
            <div className="flex gap-3 justify-end pt-2">
              <button
                onClick={() => setSaveOpen(false)}
                className="px-5 py-2 rounded-xl border border-white/15 text-white/60 text-sm hover:bg-white/5 transition"
              >
                취소
              </button>
              <button
                onClick={handleSave}
                className="px-5 py-2 rounded-xl bg-red-700 hover:bg-red-600 text-white text-sm font-semibold transition"
              >
                저장하기
              </button>
            </div>
          </div>
        </div>
      )}
    </PortalShell>
  );
}
