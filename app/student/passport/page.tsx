'use client';

import { useState, useRef, useEffect, DragEvent } from 'react';
import { PortalShell } from '@/components/portal-shell';

/* ── localStorage key shared with apply page ──────────────────────────── */
const PASSPORT_KEY = 'kepin_passport_v1';

/* ── OCR simulation result ────────────────────────────────────────────── */
const MOCK_OCR = {
  nameEn:         'KIM MINJUNG',
  gender:         '여',
  birthDate:      '2003.09.08',
  country:        '태국',
  passportNo:     'AC3371174',
  passportExpiry: '2029.03.15',
};

type Step = 'upload' | 'scanning' | 'confirm' | 'done';

/* ══════════════════════════════════════════════════════════════════════════ */
export default function PassportPage() {
  const [step,       setStep]       = useState<Step>('upload');
  const [fileName,   setFileName]   = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [parsed,     setParsed]     = useState({ ...MOCK_OCR });
  const [registered, setRegistered] = useState<{ registeredAt: string } | null>(null);
  const [dragging,   setDragging]   = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  /* Load existing data from localStorage */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(PASSPORT_KEY);
      if (raw) {
        const data = JSON.parse(raw);
        setParsed(data.fields);
        setFileName(data.fileName);
        setRegistered({ registeredAt: data.registeredAt });
        setStep('done');
      }
    } catch { /* ignore */ }
  }, []);

  function processFile(file: File) {
    setFileName(file.name);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setStep('scanning');
    /* Simulate AI OCR — 2.5s */
    setTimeout(() => {
      setParsed({ ...MOCK_OCR });
      setStep('confirm');
    }, 2500);
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) processFile(f);
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f) processFile(f);
  }

  function handleConfirm() {
    const payload = {
      fileName,
      registeredAt: new Date().toLocaleDateString('ko-KR'),
      fields: parsed,
    };
    localStorage.setItem(PASSPORT_KEY, JSON.stringify(payload));
    setRegistered({ registeredAt: payload.registeredAt });
    setStep('done');
  }

  function handleReset() {
    localStorage.removeItem(PASSPORT_KEY);
    setStep('upload');
    setFileName('');
    setPreviewUrl(null);
    setRegistered(null);
    setParsed({ ...MOCK_OCR });
  }

  /* ── Parsed field table ─────────────────────────────────────────────── */
  const FIELDS = [
    { label: '영문성명',   key: 'nameEn'         },
    { label: '성별',       key: 'gender'         },
    { label: '생년월일',   key: 'birthDate'      },
    { label: '국가',       key: 'country'        },
    { label: '여권번호',   key: 'passportNo'     },
    { label: '여권만료일', key: 'passportExpiry' },
  ] as const;

  /* ══════════════════════════════════════════════════════════════════════ */
  return (
    <PortalShell
      area="student"
      title="여권 등록"
      description="여권 사본을 업로드하면 AI가 정보를 자동으로 추출합니다. 등록된 정보는 신청서에 자동 연동됩니다."
    >
      <div className="max-w-2xl mx-auto space-y-5">

        {/* ── STEP: upload ──────────────────────────────────────────── */}
        {step === 'upload' && (
          <div
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={[
              'panel rounded-2xl border-2 border-dashed transition cursor-pointer',
              'flex flex-col items-center justify-center gap-4 py-20 px-8 text-center',
              dragging ? 'border-red-500/60 bg-red-900/10' : 'border-white/10 hover:border-white/20',
            ].join(' ')}
          >
            <input
              ref={inputRef}
              type="file"
              accept="image/*,.pdf"
              className="hidden"
              onChange={handleInputChange}
            />
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-3xl">
              🛂
            </div>
            <div>
              <p className="text-base font-semibold text-white">여권 사본을 업로드하세요</p>
              <p className="text-sm text-white/40 mt-1">이미지(JPG, PNG) 또는 PDF · 드래그 앤 드롭 가능</p>
            </div>
            <span className="px-5 py-2 rounded-xl bg-red-700/80 hover:bg-red-600 text-white text-sm font-semibold transition">
              파일 선택
            </span>
          </div>
        )}

        {/* ── STEP: scanning ────────────────────────────────────────── */}
        {step === 'scanning' && (
          <div className="panel rounded-2xl py-20 flex flex-col items-center gap-6">
            {/* Animated spinner */}
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 rounded-full border-4 border-white/5" />
              <div
                className="absolute inset-0 rounded-full border-4 border-transparent border-t-red-500"
                style={{ animation: 'spin 0.9s linear infinite' }}
              />
              <div className="absolute inset-0 flex items-center justify-center text-2xl">🔍</div>
            </div>
            <div className="text-center">
              <p className="text-base font-semibold text-white">AI가 여권 정보를 분석 중입니다…</p>
              <p className="text-sm text-white/40 mt-1">{fileName}</p>
            </div>
            {/* scan line animation */}
            <div className="w-48 h-1 rounded-full bg-white/8 overflow-hidden">
              <div
                className="h-full bg-red-500/70 rounded-full"
                style={{ animation: 'scan-bar 2s ease-in-out infinite' }}
              />
            </div>
            <style>{`
              @keyframes scan-bar {
                0%   { width: 0%;   margin-left: 0; }
                50%  { width: 60%;  margin-left: 20%; }
                100% { width: 0%;   margin-left: 100%; }
              }
            `}</style>
          </div>
        )}

        {/* ── STEP: confirm ─────────────────────────────────────────── */}
        {step === 'confirm' && (
          <div className="space-y-4">
            {/* Success header */}
            <div className="panel rounded-2xl p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-green-900/40 border border-green-600/40 flex items-center justify-center text-xl shrink-0">
                ✓
              </div>
              <div>
                <p className="text-sm font-semibold text-green-300">여권 정보 추출 완료</p>
                <p className="text-xs text-white/40 mt-0.5">{fileName} · 아래 내용을 확인 후 등록해 주세요</p>
              </div>
            </div>

            {/* Parsed fields */}
            <div className="panel rounded-2xl overflow-hidden">
              <div className="px-5 py-3 border-b border-white/5 flex items-center gap-2">
                <span className="w-1.5 h-4 rounded-full bg-red-700 inline-block" />
                <h2 className="text-xs font-semibold tracking-widest text-white/45 uppercase">추출된 정보</h2>
                <span className="badge-passport ml-auto">AI 추출</span>
              </div>
              <div className="p-5 grid grid-cols-2 gap-3">
                {FIELDS.map(({ label, key }) => (
                  <div key={key} className="info-cell flex flex-col gap-1.5">
                    <label className="text-[0.7rem] font-semibold uppercase tracking-widest text-white/35">
                      {label}
                    </label>
                    <input
                      className="input"
                      value={parsed[key]}
                      onChange={e => setParsed(prev => ({ ...prev, [key]: e.target.value }))}
                    />
                  </div>
                ))}
              </div>
              <p className="px-5 pb-4 text-xs text-white/30">
                * 추출 결과가 여권 원본과 다를 경우 직접 수정할 수 있습니다.
              </p>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setStep('upload')}
                className="px-5 py-2.5 rounded-xl border border-white/15 text-white/60 text-sm hover:bg-white/5 transition"
              >
                다시 업로드
              </button>
              <button
                onClick={handleConfirm}
                className="px-6 py-2.5 rounded-xl bg-red-700 hover:bg-red-600 text-white text-sm font-semibold transition"
              >
                등록 확인
              </button>
            </div>
          </div>
        )}

        {/* ── STEP: done ────────────────────────────────────────────── */}
        {step === 'done' && (
          <div className="space-y-4">
            {/* Status card */}
            <div className="panel rounded-2xl p-6 flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-green-900/40 border border-green-600/40 flex items-center justify-center text-3xl shrink-0">
                🛂
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-white">여권 등록 완료</p>
                  <span className="badge-green">등록됨</span>
                </div>
                <p className="text-xs text-white/40 mt-1">
                  {fileName} · {registered?.registeredAt} 등록
                </p>
                <p className="text-xs text-blue-300/70 mt-1">
                  신청서의 여권 정보 필드에 자동 연동됩니다.
                </p>
              </div>
            </div>

            {/* Registered fields (read-only) */}
            <div className="panel rounded-2xl overflow-hidden">
              <div className="px-5 py-3 border-b border-white/5 flex items-center gap-2">
                <span className="w-1.5 h-4 rounded-full bg-red-700 inline-block" />
                <h2 className="text-xs font-semibold tracking-widest text-white/45 uppercase">등록된 정보</h2>
              </div>
              <div className="p-5 grid grid-cols-2 gap-3">
                {FIELDS.map(({ label, key }) => (
                  <div key={key} className="info-cell flex flex-col gap-1">
                    <label className="text-[0.7rem] font-semibold uppercase tracking-widest text-white/35">
                      {label}
                    </label>
                    <p className="text-sm font-medium text-white/80 pt-0.5">{parsed[key]}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleReset}
                className="px-5 py-2 rounded-xl border border-white/10 text-white/40 text-sm hover:border-white/20 hover:text-white/60 transition"
              >
                여권 재등록
              </button>
            </div>
          </div>
        )}

      </div>
    </PortalShell>
  );
}
