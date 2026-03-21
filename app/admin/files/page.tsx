'use client';

import { useState } from 'react';
import { PortalShell } from '@/components/portal-shell';

/* ── Mock student file data ─────────────────────────────────────────────── */
const STUDENTS = [
  {
    id: 'S001',
    nameKo: '김민정',
    nameEn: 'KIM MINJUNG',
    university: '치앙마이 대학교',
    country: '태국',
    status: 'under_review',
    files: {
      passport:       { name: 'passport_KIM_MINJUNG.jpg',   size: '2.1 MB', uploaded: '2025.11.13' },
      transcript:     { name: 'transcript_KIM_MINJUNG.pdf', size: '1.4 MB', uploaded: '2025.11.13' },
      enrollment:     { name: 'enrollment_KIM.pdf',         size: '0.8 MB', uploaded: '2025.11.13' },
      recommendation: { name: 'recommend_KIM.pdf',          size: '0.5 MB', uploaded: '2025.11.14' },
      bank:           null,
      privacy:        { name: 'privacy_agreed',             size: '—',      uploaded: '2025.11.13' },
    },
  },
  {
    id: 'S002',
    nameKo: '박지수',
    nameEn: 'PARK JISU',
    university: '와세다 대학교',
    country: '일본',
    status: 'accepted',
    files: {
      passport:       { name: 'passport_PARK_JISU.pdf',     size: '3.2 MB', uploaded: '2025.10.20' },
      transcript:     { name: 'transcript_PARK.pdf',        size: '2.1 MB', uploaded: '2025.10.20' },
      enrollment:     { name: 'enrollment_PARK.pdf',        size: '0.9 MB', uploaded: '2025.10.20' },
      recommendation: { name: 'recommend_PARK.pdf',         size: '0.7 MB', uploaded: '2025.10.21' },
      bank:           { name: 'bank_PARK.pdf',              size: '1.1 MB', uploaded: '2025.10.21' },
      privacy:        { name: 'privacy_agreed',             size: '—',      uploaded: '2025.10.20' },
    },
  },
  {
    id: 'S003',
    nameKo: '이현우',
    nameEn: 'LEE HYUNWOO',
    university: '프라하 찰스 대학교',
    country: '체코',
    status: 'dormitory_pending',
    files: {
      passport:       { name: 'passport_LEE_HYUNWOO.jpg',   size: '1.8 MB', uploaded: '2025.11.01' },
      transcript:     { name: 'transcript_LEE.pdf',         size: '1.6 MB', uploaded: '2025.11.01' },
      enrollment:     null,
      recommendation: { name: 'recommend_LEE.pdf',          size: '0.6 MB', uploaded: '2025.11.02' },
      bank:           { name: 'bank_LEE.pdf',               size: '0.9 MB', uploaded: '2025.11.02' },
      privacy:        { name: 'privacy_agreed',             size: '—',      uploaded: '2025.11.01' },
    },
  },
  {
    id: 'S004',
    nameKo: '최유진',
    nameEn: 'CHOI YUJIN',
    university: '멜버른 대학교',
    country: '호주',
    status: 'application_pending',
    files: {
      passport:       { name: 'passport_CHOI_YUJIN.jpg',    size: '2.5 MB', uploaded: '2025.11.10' },
      transcript:     null,
      enrollment:     null,
      recommendation: null,
      bank:           null,
      privacy:        null,
    },
  },
] as const;

type Student = typeof STUDENTS[number];

const FILE_LABELS: Record<string, string> = {
  passport:       '여권사본',
  transcript:     '영문성적표',
  enrollment:     '영문재학증명서',
  recommendation: '추천서',
  bank:           '은행잔고증명서',
  privacy:        '개인정보이용동의',
};

const FILE_ORDER = ['passport', 'transcript', 'enrollment', 'recommendation', 'bank', 'privacy'] as const;

const STATUS_LABEL: Record<string, { text: string; cls: string }> = {
  under_review:        { text: '검토 중',     cls: 'badge-yellow' },
  accepted:            { text: '합격',        cls: 'badge-green'  },
  application_pending: { text: '접수 대기',   cls: 'badge-red'    },
  dormitory_pending:   { text: '기숙사 확인', cls: 'badge-yellow' },
};

/* ══════════════════════════════════════════════════════════════════════════ */
export default function AdminFilesPage() {
  const [selected,   setSelected]   = useState<Student | null>(null);
  const [zipping,    setZipping]    = useState(false);
  const [zipDone,    setZipDone]    = useState(false);
  const [filterText, setFilterText] = useState('');

  const filtered = STUDENTS.filter(s =>
    s.nameKo.includes(filterText) ||
    s.nameEn.toLowerCase().includes(filterText.toLowerCase()) ||
    s.university.includes(filterText)
  );

  /* ── Count uploaded files ─────────────────────────────────────────── */
  function countFiles(s: Student) {
    return FILE_ORDER.filter(k => (s.files as Record<string, unknown>)[k] !== null).length;
  }

  /* ── ZIP download (JSZip) ─────────────────────────────────────────── */
  async function handleZipDownload(student: Student) {
    setZipping(true);
    setZipDone(false);
    try {
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();
      const folder = zip.folder(`kepin_files_${student.id}_${student.nameEn.replace(/\s/g, '_')}`);

      /* Add each uploaded file as a placeholder (real impl would fetch from storage) */
      FILE_ORDER.forEach(key => {
        const f = (student.files as Record<string, { name: string } | null>)[key];
        if (f && key !== 'privacy') {
          const placeholder = `[파일 placeholder] ${FILE_LABELS[key]}\n학생: ${student.nameEn}\n파일명: ${f.name}\n\n실제 구현 시 서버에서 바이너리를 fetch하여 추가합니다.`;
          folder?.file(f.name, placeholder);
        }
      });

      /* Privacy consent log */
      const privacyLog = `개인정보 동의 기록\n학생: ${student.nameKo} (${student.nameEn})\n학번: ${student.id}\n동의일시: ${(student.files.privacy as { uploaded: string } | null)?.uploaded ?? '-'}\n동의내용: 교환학생 지원을 위한 개인정보 수집 및 이용에 동의함`;
      folder?.file('privacy_consent_log.txt', privacyLog);

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `kepin_${student.id}_${student.nameEn.replace(/\s/g, '_')}_files.zip`;
      a.click();
      URL.revokeObjectURL(url);
      setZipDone(true);
      setTimeout(() => setZipDone(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setZipping(false);
    }
  }

  /* ── Bulk ZIP (all students) ──────────────────────────────────────── */
  async function handleBulkZip() {
    setZipping(true);
    try {
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();

      STUDENTS.forEach(student => {
        const folder = zip.folder(`${student.id}_${student.nameEn.replace(/\s/g, '_')}`);
        FILE_ORDER.forEach(key => {
          const f = (student.files as Record<string, { name: string } | null>)[key];
          if (f && key !== 'privacy') {
            const placeholder = `[파일 placeholder] ${FILE_LABELS[key]}\n학생: ${student.nameEn}\n파일명: ${f.name}`;
            folder?.file(f.name, placeholder);
          }
        });
        const privLog = `개인정보 동의: ${student.nameKo} / ${(student.files.privacy as { uploaded: string } | null)?.uploaded ?? '미동의'}`;
        folder?.file('privacy_consent_log.txt', privLog);
      });

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `kepin_all_files_${new Date().toISOString().slice(0, 10)}.zip`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setZipping(false);
    }
  }

  /* ══════════════════════════════════════════════════════════════════════ */
  return (
    <PortalShell
      area="admin"
      title="파일 관리"
      description="학생별 제출 서류를 확인하고 ZIP으로 일괄 다운로드합니다."
    >
      <div className="space-y-5">

        {/* ── Toolbar ─────────────────────────────────────────────────── */}
        <div className="flex flex-wrap items-center gap-3">
          <input
            className="input flex-1 min-w-48"
            placeholder="이름 / 대학 검색…"
            value={filterText}
            onChange={e => setFilterText(e.target.value)}
          />
          <button
            onClick={handleBulkZip}
            disabled={zipping}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-red-700 hover:bg-red-600 disabled:opacity-50 text-white text-sm font-semibold transition"
          >
            {zipping ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                압축 중…
              </>
            ) : (
              <>🗜️ 전체 일괄 다운로드 (ZIP)</>
            )}
          </button>
        </div>

        {/* ── Stats row ───────────────────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: '전체 학생',     value: STUDENTS.length },
            { label: '파일 완납',     value: STUDENTS.filter(s => countFiles(s) === 6).length },
            { label: '서류 미제출',   value: STUDENTS.filter(s => countFiles(s) < 4).length },
          ].map(({ label, value }) => (
            <div key={label} className="panel rounded-2xl px-5 py-4">
              <p className="text-xs text-white/40 uppercase tracking-widest">{label}</p>
              <p className="text-2xl font-black text-white mt-1">{value}</p>
            </div>
          ))}
        </div>

        {/* ── Student list ────────────────────────────────────────────── */}
        <div className="panel rounded-2xl overflow-hidden">
          <div className="px-5 py-3 border-b border-white/5 flex items-center gap-2">
            <span className="w-1.5 h-4 rounded-full bg-red-700 inline-block" />
            <h2 className="text-xs font-semibold tracking-widest text-white/45 uppercase">학생 서류 목록</h2>
          </div>

          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 text-xs text-white/30 uppercase tracking-widest">
                <th className="px-5 py-3 text-left">학생</th>
                <th className="px-4 py-3 text-left">소속대학</th>
                <th className="px-4 py-3 text-center">상태</th>
                <th className="px-4 py-3 text-center">파일 제출</th>
                <th className="px-4 py-3 text-center">여권</th>
                <th className="px-4 py-3 text-center">개인정보동의</th>
                <th className="px-4 py-3 text-right">다운로드</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(student => {
                const st = STATUS_LABEL[student.status] ?? { text: student.status, cls: 'badge-yellow' };
                const uploaded = countFiles(student);
                const hasPassport = student.files.passport !== null;
                const hasPrivacy  = student.files.privacy  !== null;
                return (
                  <tr
                    key={student.id}
                    className="border-b border-white/4 hover:bg-white/3 transition cursor-pointer"
                    onClick={() => setSelected(student)}
                  >
                    <td className="px-5 py-4">
                      <p className="font-semibold text-white">{student.nameKo}</p>
                      <p className="text-xs text-white/35 mt-0.5">{student.nameEn} · {student.country}</p>
                    </td>
                    <td className="px-4 py-4 text-white/60">{student.university}</td>
                    <td className="px-4 py-4 text-center">
                      <span className={st.cls}>{st.text}</span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className={uploaded >= 5 ? 'badge-green' : uploaded >= 3 ? 'badge-yellow' : 'badge-red'}>
                        {uploaded} / 6
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center text-lg">
                      {hasPassport ? '✅' : '❌'}
                    </td>
                    <td className="px-4 py-4 text-center text-lg">
                      {hasPrivacy  ? '✅' : '❌'}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <button
                        onClick={e => { e.stopPropagation(); handleZipDownload(student); }}
                        disabled={zipping}
                        className="px-3 py-1.5 rounded-lg bg-white/6 hover:bg-white/10 border border-white/10 text-white/70 text-xs transition disabled:opacity-40"
                      >
                        🗜️ ZIP
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {zipDone && (
          <div className="fixed bottom-6 right-6 z-50 bg-green-900/80 border border-green-600/40 rounded-xl px-5 py-3 text-green-300 text-sm shadow-xl backdrop-blur">
            ✓ ZIP 파일 다운로드 완료
          </div>
        )}
      </div>

      {/* ── File detail modal ─────────────────────────────────────────────── */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setSelected(null)}
        >
          <div
            className="glass rounded-2xl p-7 w-full max-w-xl space-y-5"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">{selected.nameKo}</h3>
                <p className="text-xs text-white/40 mt-0.5">{selected.nameEn} · {selected.university}</p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="text-white/30 hover:text-white/60 text-xl leading-none transition"
              >✕</button>
            </div>

            {/* File list */}
            <div className="space-y-2">
              {FILE_ORDER.map(key => {
                const f = (selected.files as Record<string, { name: string; size: string; uploaded: string } | null>)[key];
                return (
                  <div
                    key={key}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition ${
                      f ? 'border-white/10 bg-white/4' : 'border-white/5 bg-white/2 opacity-50'
                    }`}
                  >
                    <span className="text-lg shrink-0">{f ? '📄' : '—'}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-white/50 uppercase tracking-widest">
                        {FILE_LABELS[key]}
                      </p>
                      <p className="text-sm text-white truncate mt-0.5">
                        {f ? f.name : '미제출'}
                      </p>
                    </div>
                    {f && (
                      <div className="text-right shrink-0">
                        <p className="text-xs text-white/40">{f.size}</p>
                        <p className="text-xs text-white/25 mt-0.5">{f.uploaded}</p>
                      </div>
                    )}
                    {f && key !== 'privacy' && (
                      <button className="ml-1 px-2.5 py-1 rounded-lg border border-white/10 text-white/40 text-xs hover:border-white/20 hover:text-white/60 transition">
                        ↓
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            {/* ZIP button */}
            <div className="flex gap-3 justify-end pt-1">
              <button
                onClick={() => setSelected(null)}
                className="px-4 py-2 rounded-xl border border-white/15 text-white/50 text-sm hover:bg-white/5 transition"
              >
                닫기
              </button>
              <button
                onClick={() => handleZipDownload(selected)}
                disabled={zipping}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-red-700 hover:bg-red-600 disabled:opacity-50 text-white text-sm font-semibold transition"
              >
                {zipping ? (
                  <><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> 압축 중…</>
                ) : (
                  <>🗜️ ZIP 다운로드</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </PortalShell>
  );
}
