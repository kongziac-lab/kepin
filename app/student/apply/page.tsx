'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PortalShell } from '@/components/portal-shell';
const PASSPORT_KEY = 'kepin_passport_v1';

/* ── Nomination mock data ──────────────────────────────────────────────── */
const nominationData = {
  nameEn:     'KIM MINJUNG',
  university: '치앙마이 대학교',
  major:      '경영학',
  grade:      '3',
};

/* ── Passport field defaults (shown when not yet registered) ───────────── */
const EMPTY_PASSPORT = {
  nameEn:         '',
  gender:         '',
  birthDate:      '',
  country:        '',
  passportNo:     '',
  passportExpiry: '',
};

/* ── Attachment config (여권사본 제외) ─────────────────────────────────── */
const ATTACHMENTS = [
  { key: 'transcript',     label: '영문성적표',    note: '', required: true  },
  { key: 'enrollment',     label: '영문재학증명서', note: '', required: true  },
  { key: 'recommendation', label: '추천서',        note: '', required: false },
  { key: 'bank',           label: '은행잔고증명서', note: '', required: false },
] as const;

/* ══════════════════════════════════════════════════════════════════════════ */
export default function ApplyPage() {
  const [submitted,     setSubmitted]     = useState(false);
  const [confirmOpen,   setConfirmOpen]   = useState(false);
  const [privacyOpen,   setPrivacyOpen]   = useState(false);
  const [privacyAgreed, setPrivacyAgreed] = useState(false);
  const [passportData,  setPassportData]  = useState(EMPTY_PASSPORT);
  const [passportRegistered, setPassportRegistered] = useState(false);

  /* Load passport data from localStorage (registered in /student/passport) */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(PASSPORT_KEY);
      if (raw) {
        const data = JSON.parse(raw);
        setPassportData(data.fields);
        setPassportRegistered(true);
      }
    } catch { /* ignore */ }
  }, []);

  const [form, setForm] = useState({
    nameKo:        '',
    email:         '',
    address:       '',
    phone:         '',
    phoneExtra:    '',
    gpa:           '',
    admissionType: '교환학생',
    semester:      '한학기',
    dormType:      '신축동',
    dormMeal:      '신청A (아침+저녁)',
  });

  const [files, setFiles] = useState<Record<string, File | null>>({
    transcript: null, enrollment: null,
    recommendation: null, bank: null,
  });

  const ro = submitted;

  function setField(key: keyof typeof form, val: string) {
    if (!ro) setForm(prev => ({ ...prev, [key]: val }));
  }
  function handleFile(key: string, f: File | null) {
    if (!ro) setFiles(prev => ({ ...prev, [key]: f }));
  }
  function handleFinalSubmit() {
    setSubmitted(true);
    setConfirmOpen(false);
  }

  /* ── Section wrapper ────────────────────────────────────────────────── */
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

  /* ── Field cell ─────────────────────────────────────────────────────── */
  function Cell({ label, badge, required, children }: {
    label: string;
    badge?: 'passport' | 'linked';
    required?: boolean;
    children: React.ReactNode;
  }) {
    return (
      <div className="info-cell flex flex-col gap-1.5">
        <label className="text-[0.7rem] font-semibold uppercase tracking-widest text-white/35 select-none leading-none">
          {label}
          {required && <span className="text-red-500 ml-0.5 normal-case not-italic">*</span>}
          {badge === 'passport' && <span className="badge-passport">여권</span>}
          {badge === 'linked'   && <span className="badge-linked">노미네이션</span>}
        </label>
        {children}
      </div>
    );
  }

  /* ═══════════════════════════ RENDER ═══════════════════════════════════ */
  return (
    <PortalShell area="student" title="온라인 신청서" description="교환교류접수 양식을 작성하고 제출합니다.">
      <div className="max-w-4xl mx-auto py-8 px-4 space-y-5">

        {/* Passport not registered warning */}
        {!passportRegistered && !submitted && (
          <div className="rounded-xl border border-amber-600/40 bg-amber-900/20 px-5 py-3 flex items-center gap-3 text-sm">
            <span className="text-xl">🛂</span>
            <div className="flex-1">
              <span className="text-amber-300 font-semibold">여권이 아직 등록되지 않았습니다.</span>
              <span className="text-amber-200/50 ml-2">여권 정보 필드가 비어 있습니다.</span>
            </div>
            <Link
              href="/student/passport"
              className="shrink-0 px-3 py-1.5 rounded-lg bg-amber-700/60 hover:bg-amber-600/70 text-amber-100 text-xs font-semibold transition"
            >
              여권 등록하기 →
            </Link>
          </div>
        )}

        {/* Submit banner */}
        {submitted && (
          <div className="rounded-xl bg-green-900/40 border border-green-600/40 px-5 py-3 text-green-300 text-sm flex items-center gap-2">
            🔒 최종 제출 완료 — 수정 불가
          </div>
        )}

        <div className={ro ? 'form-locked space-y-4' : 'space-y-4'}>

          {/* ══ 1. 접수정보 ══════════════════════════════════════════════ */}
          <Section title="접수정보">
            <div className="grid grid-cols-4 gap-3">
              <Cell label="접수번호">
                <input className="input" value="2025110026" disabled readOnly />
              </Cell>
              <Cell label="접수일자">
                <input className="input" value="2025.11.13" disabled readOnly />
              </Cell>
              <Cell label="입학연도">
                <input className="input" value="2026" disabled readOnly />
              </Cell>
              <Cell label="입학학기">
                <input className="input" value="1학기" disabled readOnly />
              </Cell>
            </div>
          </Section>

          {/* ══ 2. 개인정보 ══════════════════════════════════════════════ */}
          <Section title="개인정보">
            <div className="grid grid-cols-8 gap-3">
              <div className="col-span-4">
                <Cell label="영문성명" badge="linked" required>
                  <input className="input" value={nominationData.nameEn} disabled readOnly />
                </Cell>
              </div>
              <div className="col-span-4">
                <Cell label="한글이름" required>
                  <input
                    className="input"
                    value={form.nameKo}
                    onChange={e => setField('nameKo', e.target.value)}
                    readOnly={ro}
                    placeholder="한글 이름 입력"
                  />
                </Cell>
              </div>

              <div className="col-span-2">
                <Cell label="성별" badge="passport">
                  <input className="input" value={passportData.gender} disabled readOnly />
                </Cell>
              </div>
              <div className="col-span-3">
                <Cell label="생년월일" badge="passport">
                  <input className="input" value={passportData.birthDate} disabled readOnly />
                </Cell>
              </div>
              <div className="col-span-3">
                <Cell label="국가" badge="passport">
                  <input className="input" value={passportData.country} disabled readOnly />
                </Cell>
              </div>

              <div className="col-span-4">
                <Cell label="여권번호" badge="passport">
                  <input className="input" value={passportData.passportNo} disabled readOnly />
                </Cell>
              </div>
              <div className="col-span-4">
                <Cell label="여권만료일" badge="passport">
                  <input className="input" value={passportData.passportExpiry} disabled readOnly />
                </Cell>
              </div>

              <div className="col-span-4">
                <Cell label="이메일" required>
                  <input
                    className="input"
                    type="email"
                    value={form.email}
                    onChange={e => setField('email', e.target.value)}
                    readOnly={ro}
                    placeholder="example@email.com"
                  />
                </Cell>
              </div>
              <div className="col-span-2">
                <Cell label="전화번호">
                  <input
                    className="input"
                    value={form.phone}
                    onChange={e => setField('phone', e.target.value)}
                    readOnly={ro}
                    placeholder="010-0000-0000"
                  />
                </Cell>
              </div>
              <div className="col-span-2">
                <Cell label="추가전화번호">
                  <input
                    className="input"
                    value={form.phoneExtra}
                    onChange={e => setField('phoneExtra', e.target.value)}
                    readOnly={ro}
                    placeholder="선택사항"
                  />
                </Cell>
              </div>

              <div className="col-span-8">
                <Cell label="주소">
                  <input
                    className="input"
                    value={form.address}
                    onChange={e => setField('address', e.target.value)}
                    readOnly={ro}
                    placeholder="현재 거주 주소를 입력하세요"
                  />
                </Cell>
              </div>
            </div>
          </Section>

          {/* ══ 3. 소속대학 ══════════════════════════════════════════════ */}
          <Section title="소속대학">
            <div className="grid grid-cols-8 gap-3">
              <div className="col-span-4">
                <Cell label="대학명" badge="linked" required>
                  <input className="input" value={nominationData.university} disabled readOnly />
                </Cell>
              </div>
              <div className="col-span-2">
                <Cell label="전공명" badge="linked">
                  <input className="input" value={nominationData.major} disabled readOnly />
                </Cell>
              </div>
              <div className="col-span-2">
                <Cell label="학년" badge="linked">
                  <input className="input" value={`${nominationData.grade}학년`} disabled readOnly />
                </Cell>
              </div>
              <div className="col-span-3">
                <Cell label="평균평점">
                  <input
                    className="input"
                    value={form.gpa}
                    onChange={e => setField('gpa', e.target.value)}
                    readOnly={ro}
                    placeholder="0.00 / 4.50"
                  />
                </Cell>
              </div>
            </div>
          </Section>

          {/* ══ 4. 지원내용 ══════════════════════════════════════════════ */}
          <Section title="지원내용">
            <div className="grid grid-cols-4 gap-3">
              <div className="col-span-2">
                <Cell label="입학구분" required>
                  <select
                    className="input"
                    value={form.admissionType}
                    onChange={e => setField('admissionType', e.target.value)}
                    disabled={ro}
                  >
                    <option>교환학생</option>
                    <option>방문학생</option>
                  </select>
                </Cell>
              </div>
              <div className="col-span-2">
                <Cell label="수학학기" required>
                  <select
                    className="input"
                    value={form.semester}
                    onChange={e => setField('semester', e.target.value)}
                    disabled={ro}
                  >
                    <option>한학기</option>
                    <option>1년</option>
                  </select>
                </Cell>
              </div>
            </div>
          </Section>

          {/* ══ 5. 기숙사신청 ════════════════════════════════════════════ */}
          <Section title="기숙사신청">
            <div className="grid grid-cols-4 gap-3">
              <div className="col-span-2">
                <Cell label="기숙사종류">
                  <select
                    className="input"
                    value={form.dormType}
                    onChange={e => setField('dormType', e.target.value)}
                    disabled={ro}
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
                    onChange={e => setField('dormMeal', e.target.value)}
                    disabled={ro}
                  >
                    <option>신청A (아침+저녁)</option>
                    <option>신청B (저녁)</option>
                    <option>미신청</option>
                  </select>
                </Cell>
              </div>
            </div>
          </Section>

          {/* ══ 6. 첨부파일 ══════════════════════════════════════════════ */}
          <Section title="첨부파일">
            <div className="space-y-2.5">

              {/* Regular file uploads */}
              {ATTACHMENTS.map(({ key, label, note, required }) => (
                <div key={key} className="flex items-start gap-4">
                  <div className="w-40 shrink-0 pt-2">
                    <p className="text-sm text-white/70">
                      {label}
                      {required && <span className="text-red-500 ml-0.5">*</span>}
                    </p>
                    {note && <p className="text-[0.68rem] text-white/30 mt-0.5">{note}</p>}
                  </div>
                  <label
                    className={[
                      'flex-1 flex items-center gap-2 px-3 py-2.5 rounded-xl border transition',
                      files[key] ? 'border-green-600/40 bg-green-900/15' : 'border-white/10 bg-white/4',
                      ro ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-white/20',
                    ].join(' ')}
                  >
                    <input
                      type="file"
                      className="hidden"
                      disabled={ro}
                      onChange={e => handleFile(key, e.target.files?.[0] ?? null)}
                    />
                    <svg className="w-4 h-4 text-white/25 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 002.112 2.13" />
                    </svg>
                    <span className="text-xs text-white/40 truncate flex-1 min-w-0">
                      {files[key] ? files[key]!.name : '파일을 선택하세요'}
                    </span>
                    {files[key]
                      ? <span className="text-[0.65rem] text-green-400 shrink-0">✓ 업로드됨</span>
                      : !ro && <span className="text-[0.65rem] text-white/25 border border-white/10 rounded px-2 py-0.5 shrink-0">찾아보기</span>
                    }
                  </label>
                </div>
              ))}

              {/* 개인정보이용동의서 — popup */}
              <div className="flex items-start gap-4">
                <div className="w-40 shrink-0 pt-2">
                  <p className="text-sm text-white/70">
                    개인정보이용동의서
                    <span className="text-red-500 ml-0.5">*</span>
                  </p>
                  <p className="text-[0.68rem] text-white/30 mt-0.5">팝업에서 동의 진행</p>
                </div>
                <div className="flex items-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => !ro && setPrivacyOpen(true)}
                    disabled={ro}
                    className={[
                      'px-5 py-2 rounded-xl text-sm border transition',
                      privacyAgreed
                        ? 'border-green-600/50 bg-green-900/20 text-green-300'
                        : 'border-white/15 bg-white/5 text-white/60 hover:border-white/25 hover:text-white/80',
                      ro ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
                    ].join(' ')}
                  >
                    {privacyAgreed ? '✓ 동의 완료' : '동의하기 →'}
                  </button>
                  {privacyAgreed && (
                    <span className="text-xs text-green-400">개인정보 수집 및 이용에 동의하셨습니다.</span>
                  )}
                </div>
              </div>

            </div>
          </Section>

        </div>{/* /form area */}

        {/* ── Action buttons ───────────────────────────────────────────── */}
        {!submitted ? (
          <div className="flex gap-3 justify-end pt-2">
            <button
              onClick={() => alert('임시저장되었습니다.')}
              className="px-6 py-2.5 rounded-xl border border-white/15 text-white/60 text-sm hover:bg-white/5 transition"
            >
              임시저장
            </button>
            <button
              onClick={() => setConfirmOpen(true)}
              className="px-6 py-2.5 rounded-xl bg-red-700 hover:bg-red-600 text-white text-sm font-semibold transition"
            >
              최종제출
            </button>
          </div>
        ) : (
          <div className="flex justify-end pt-2">
            <span className="text-sm text-white/25 italic">최종 제출이 완료되어 수정이 불가합니다.</span>
          </div>
        )}
      </div>

      {/* ── 최종 제출 확인 Modal ──────────────────────────────────────────── */}
      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="glass rounded-2xl p-8 w-full max-w-sm space-y-5">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📋</span>
              <h3 className="text-lg font-bold text-white">최종 제출 확인</h3>
            </div>
            <p className="text-sm text-white/55 leading-relaxed">
              제출 후에는 내용을 <strong className="text-white/80">수정할 수 없습니다</strong>.<br />
              모든 내용을 확인한 후 제출해 주세요.
            </p>
            <div className="flex gap-3 justify-end pt-2">
              <button
                onClick={() => setConfirmOpen(false)}
                className="px-5 py-2 rounded-xl border border-white/15 text-white/60 text-sm hover:bg-white/5 transition"
              >
                취소
              </button>
              <button
                onClick={handleFinalSubmit}
                className="px-5 py-2 rounded-xl bg-red-700 hover:bg-red-600 text-white text-sm font-semibold transition"
              >
                제출하기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 개인정보 동의 Modal ───────────────────────────────────────────── */}
      {privacyOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="glass rounded-2xl p-8 w-full max-w-lg space-y-5">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🔐</span>
              <h3 className="text-lg font-bold text-white">개인정보 수집 및 이용 동의</h3>
            </div>
            <div className="h-64 overflow-y-auto rounded-xl bg-white/5 border border-white/8 p-4 text-sm text-white/50 space-y-4 leading-relaxed">
              <div>
                <p className="text-white/70 font-semibold mb-1">1. 수집 목적</p>
                <p>교환학생 지원 접수, 선발 심사, 입학 처리 및 관련 행정 업무 처리</p>
              </div>
              <div>
                <p className="text-white/70 font-semibold mb-1">2. 수집 항목</p>
                <p>성명(한글·영문), 생년월일, 성별, 국적, 여권번호 및 만료일, 이메일, 전화번호, 주소, 학교·전공·학년 정보, 성적, 기타 지원 서류</p>
              </div>
              <div>
                <p className="text-white/70 font-semibold mb-1">3. 보유 및 이용 기간</p>
                <p>지원 결과 통보 후 3년간 보관, 이후 즉시 파기</p>
              </div>
              <div>
                <p className="text-white/70 font-semibold mb-1">4. 제3자 제공</p>
                <p>수집된 개인정보는 계명대학교 국제교류처 외 제3자에게 제공되지 않습니다. 단, 법령에 의한 경우는 예외로 합니다.</p>
              </div>
              <div>
                <p className="text-white/70 font-semibold mb-1">5. 동의 거부 권리</p>
                <p>귀하는 개인정보 수집·이용에 대한 동의를 거부할 권리가 있습니다. 단, 동의 거부 시 교환학생 지원이 불가합니다.</p>
              </div>
              <p className="text-white/35 text-xs border-t border-white/10 pt-3">
                본 동의 기록은 관리자가 확인할 수 있으며, 동의 일시 및 지원자 정보와 함께 저장됩니다.
              </p>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setPrivacyOpen(false)}
                className="px-5 py-2 rounded-xl border border-white/15 text-white/60 text-sm hover:bg-white/5 transition"
              >
                닫기
              </button>
              <button
                onClick={() => { setPrivacyAgreed(true); setPrivacyOpen(false); }}
                className="px-5 py-2 rounded-xl bg-red-700 hover:bg-red-600 text-white text-sm font-semibold transition"
              >
                동의합니다
              </button>
            </div>
          </div>
        </div>
      )}
    </PortalShell>
  );
}
