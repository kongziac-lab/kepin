"use client";

import { useState } from "react";
import { PortalShell } from "@/components/portal-shell";
import { AdminSemesterBar } from "@/components/admin-semester-bar";

/* ── 파트너 대학 목록 ─────────────────────────────────────────── */
const PARTNERS = [
  { id: 1,  name: "Thammasat University",      country: "Thailand",     contact: "Siriporn K.",  email: "intl@tu.ac.th",          students: 8, status: "active" },
  { id: 2,  name: "Fudan University",           country: "China",        contact: "Li Wei",       email: "exchange@fudan.edu.cn",  students: 5, status: "active" },
  { id: 3,  name: "Ritsumeikan University",     country: "Japan",        contact: "Yuki Tanaka",  email: "oia@ritsumei.ac.jp",     students: 3, status: "active" },
  { id: 4,  name: "University of Auckland",     country: "New Zealand",  contact: "Emma Brown",   email: "exchange@auckland.ac.nz",students: 2, status: "active" },
  { id: 5,  name: "Mahidol University",         country: "Thailand",     contact: "Pim Chan",     email: "pim@mahidol.ac.th",      students: 0, status: "invited" },
  { id: 6,  name: "Kansai University",          country: "Japan",        contact: "Yuta Mori",    email: "y.mori@kansai.ac.jp",    students: 0, status: "invited" },
  { id: 7,  name: "Tunghai University",         country: "Taiwan",       contact: "Pei Lin",      email: "pei.lin@thu.edu.tw",     students: 4, status: "active" },
  { id: 8,  name: "Chiang Mai University",      country: "Thailand",     contact: "Nong P.",      email: "intl@cmu.ac.th",         students: 6, status: "active" },
  { id: 9,  name: "Peking University",          country: "China",        contact: "Zhang Min",    email: "oia@pku.edu.cn",         students: 3, status: "active" },
  { id: 10, name: "Waseda University",          country: "Japan",        contact: "Kenji Ito",    email: "exchange@waseda.jp",     students: 7, status: "active" },
  { id: 11, name: "National Taiwan University", country: "Taiwan",       contact: "Chen Yu",      email: "oia@ntu.edu.tw",         students: 2, status: "active" },
  { id: 12, name: "Hanyang University",         country: "Korea",        contact: "Park Ji-su",   email: "global@hanyang.ac.kr",   students: 0, status: "invited" },
];

/* ── 수료 학생 목록 (Step 3 전용) ────────────────────────────── */
const GRADUATES = [
  { id: "KMU-2025-0301", name: "Anna Lee",     partner: "Thammasat University",  email: "anna.lee@tu.ac.th",       semester: "2025 Spring", transcript: null as File | null },
  { id: "KMU-2025-0302", name: "Haruto Sato",  partner: "Ritsumeikan University",email: "h.sato@ritsumei.ac.jp",   semester: "2025 Spring", transcript: null as File | null },
  { id: "KMU-2025-0303", name: "Liu Wen",      partner: "Fudan University",       email: "liu.wen@fudan.edu.cn",    semester: "2025 Spring", transcript: null as File | null },
  { id: "KMU-2025-0304", name: "Emma Park",    partner: "University of Auckland", email: "emma.park@auckland.ac.nz",semester: "2025 Spring", transcript: null as File | null },
];

/* ── 이메일 단계 정의 ────────────────────────────────────────── */
const STEPS = [
  {
    id: 1,
    tag: "STEP 1",
    title: "업무 개시 안내",
    subtitle: "신학기 초청교환학생 업무 개시 · 팩트시트 · 노미네이션 일정",
    color: "text-blue-400",
    border: "border-blue-500/40",
    bg: "bg-blue-500/10",
    subject: "[KMU Kepin] 2026학년도 신학기 교환학생 업무 개시 안내",
    body:
`Dear Partner University,

We are pleased to announce the commencement of the 2026 Fall Inbound Exchange Student Program at Keimyung University (KMU).

Please find the attached Factsheet which includes:
  - Admission requirements and course information
  - Nomination and application deadlines
  - Dormitory and living information

■ Key Dates
  - Nomination Deadline   : April 30, 2026
  - Application Deadline  : May 31, 2026
  - Semester Start        : September 1, 2026

Please submit your nominations via the KMU Kepin portal at your earliest convenience.

Best regards,
International Affairs Office
Keimyung University`,
    attachments: ["factsheet", "schedule"],
  },
  {
    id: 2,
    tag: "STEP 2",
    title: "입학허가 완료 안내",
    subtitle: "심사 완료 후 파트너 대학 및 학생에게 합격 통보",
    color: "text-green-400",
    border: "border-green-500/40",
    bg: "bg-green-500/10",
    subject: "[KMU Kepin] Admission Decision — 2026 Fall Exchange Students",
    body:
`Dear Partner University,

We are delighted to inform you that the nominated students listed below have been officially admitted to Keimyung University for the 2026 Fall semester.

■ Admitted Students
  [Student list will be inserted automatically per partner]

Individual Admission Letters are attached to this email.

Students are required to:
  1. Complete the online application by June 30, 2026
  2. Upload all required documents via the Kepin portal
  3. Submit dormitory application if applicable

Please share this information with your students at your earliest convenience.

Best regards,
International Affairs Office
Keimyung University`,
    attachments: ["admission_letters"],
  },
  {
    id: 3,
    tag: "STEP 3",
    title: "성적증명서 발송",
    subtitle: "수료 학생 성적증명서 온라인 발송",
    color: "text-amber-400",
    border: "border-amber-500/40",
    bg: "bg-amber-500/10",
    subject: "[KMU Kepin] Official Transcript — KMU Exchange Student",
    body:
`Dear Partner University,

Please find enclosed the official academic transcript for the following student who has successfully completed their exchange program at Keimyung University.

The attached document is the official transcript issued by the Keimyung University Registrar's Office and may be used for academic credit transfer purposes.

Should you require additional documentation or have any inquiries, please do not hesitate to contact us.

Best regards,
International Affairs Office
Keimyung University`,
    attachments: ["transcript"],
  },
];

/* ── 발송 이력 (목업) ────────────────────────────────────────── */
type HistoryEntry = { date: string; step: string; count: number; subject: string };
const INIT_HISTORY: HistoryEntry[] = [
  { date: "2026-03-10", step: "STEP 1", count: 10, subject: "[KMU Kepin] 2026학년도 신학기 교환학생 업무 개시 안내" },
  { date: "2026-02-20", step: "STEP 1", count: 4,  subject: "[KMU Kepin] 2026학년도 신학기 교환학생 업무 개시 안내" },
];

/* ─────────────────────────────────────────────────────────────── */

export default function AdminEmailsPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [selected, setSelected]     = useState<Set<number>>(new Set());
  const [search, setSearch]         = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [sendOpen, setSendOpen]       = useState(false);
  const [history, setHistory]         = useState<HistoryEntry[]>(INIT_HISTORY);

  /* 템플릿 편집 */
  const [isEditing, setIsEditing] = useState(false);
  const [templateData, setTemplateData] = useState(
    STEPS.map((s) => ({ subject: s.subject, body: s.body }))
  );
  const [editDraft, setEditDraft] = useState({ subject: "", body: "" });

  /* Step-1/2 파일 첨부 */
  const [attachFiles, setAttachFiles] = useState<Record<string, File | null>>({
    factsheet: null, schedule: null, admission_letters: null,
  });

  /* Step-3 학생별 성적증명서 */
  const [transcripts, setTranscripts] = useState<Record<string, File | null>>(
    Object.fromEntries(GRADUATES.map((g) => [g.id, null]))
  );
  const [selectedGrads, setSelectedGrads] = useState<Set<string>>(new Set());

  const step    = STEPS[activeStep];
  const isStep3 = activeStep === 2;
  const currentTemplate = templateData[activeStep];

  /* 파트너 필터 */
  const filtered = PARTNERS.filter(
    (p) => p.name.toLowerCase().includes(search.toLowerCase()) ||
           p.country.toLowerCase().includes(search.toLowerCase())
  );

  function togglePartner(id: number) {
    setSelected((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  }
  function toggleAll() {
    if (selected.size === filtered.length) setSelected(new Set());
    else setSelected(new Set(filtered.map((p) => p.id)));
  }

  function toggleGrad(id: string) {
    setSelectedGrads((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  }
  function toggleAllGrads() {
    if (selectedGrads.size === GRADUATES.length) setSelectedGrads(new Set());
    else setSelectedGrads(new Set(GRADUATES.map((g) => g.id)));
  }

  function handleSend() {
    const count = isStep3 ? selectedGrads.size : selected.size;
    setHistory((prev) => [
      { date: new Date().toISOString().slice(0, 10), step: step.tag, count, subject: currentTemplate.subject },
      ...prev,
    ]);
    setSendOpen(false);
    setPreviewOpen(false);
    setSelected(new Set());
    setSelectedGrads(new Set());
    alert(`✓ ${count}${isStep3 ? "명" : "개 대학"}에 발송 완료`);
  }

  function startEdit() {
    setEditDraft({ subject: currentTemplate.subject, body: currentTemplate.body });
    setIsEditing(true);
  }
  function saveEdit() {
    setTemplateData((prev) => {
      const next = [...prev];
      next[activeStep] = { ...editDraft };
      return next;
    });
    setIsEditing(false);
  }
  function cancelEdit() {
    setIsEditing(false);
  }

  const selectedCount = isStep3 ? selectedGrads.size : selected.size;

  return (
    <PortalShell
      area="admin"
      title="이메일 발송"
      description="파트너 대학별 단계별 이메일 발송 및 성적증명서 온라인 발송"
      topBar={<AdminSemesterBar />}
    >
      <div className="space-y-6 pb-32">

        {/* ── STEP 탭 ── */}
        <div className="flex gap-3">
          {STEPS.map((s, i) => (
            <button
              key={s.id}
              onClick={() => { setActiveStep(i); setSelected(new Set()); setSelectedGrads(new Set()); setIsEditing(false); }}
              className={`flex-1 rounded-2xl border p-4 text-left transition-all ${
                activeStep === i
                  ? `${s.border} ${s.bg} ring-1 ring-white/10`
                  : "border-white/8 bg-white/3 hover:bg-white/5"
              }`}
            >
              <div className={`text-xs font-bold tracking-widest mb-1 ${activeStep === i ? s.color : "text-white/30"}`}>
                {s.tag}
              </div>
              <div className="font-semibold text-white text-sm">{s.title}</div>
              <div className="text-xs text-white/40 mt-0.5">{s.subtitle}</div>
            </button>
          ))}
        </div>

        {/* ── 이메일 템플릿 편집 ── */}
        <div className="panel rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-white">이메일 템플릿</h2>
            <div className="flex items-center gap-2">
              {isEditing ? (
                <>
                  <button
                    onClick={cancelEdit}
                    className="text-xs text-white/40 hover:text-white/70 border border-white/10 rounded-lg px-3 py-1 transition"
                  >
                    취소
                  </button>
                  <button
                    onClick={saveEdit}
                    className="text-xs bg-red-700 hover:bg-red-600 text-white font-semibold rounded-lg px-3 py-1 transition"
                  >
                    저장
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={startEdit}
                    className="text-xs text-white/40 hover:text-white/70 border border-white/10 rounded-lg px-3 py-1 transition"
                  >
                    편집
                  </button>
                  <button
                    onClick={() => setPreviewOpen(true)}
                    className="text-xs text-white/40 hover:text-white/70 border border-white/10 rounded-lg px-3 py-1 transition"
                  >
                    전체 미리보기
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="rounded-xl bg-black/30 border border-white/8 px-4 py-3 space-y-2">
            <div className="flex gap-2 items-center">
              <span className="text-xs text-white/30 w-14 shrink-0">수신</span>
              <span className="text-xs text-white/60">
                {isStep3
                  ? "수료 학생 (개별 발송)"
                  : `선택된 파트너 대학 ${selectedCount > 0 ? `(${selectedCount}개)` : ""}`}
              </span>
            </div>
            <div className="border-t border-white/5" />
            <div className="flex gap-2 items-center">
              <span className="text-xs text-white/30 w-14 shrink-0">제목</span>
              {isEditing ? (
                <input
                  value={editDraft.subject}
                  onChange={(e) => setEditDraft((d) => ({ ...d, subject: e.target.value }))}
                  className="flex-1 text-xs bg-white/5 border border-white/15 rounded-lg px-2 py-1 text-white/90 outline-none focus:border-red-500/50 transition"
                />
              ) : (
                <span className="text-xs text-white/80 font-medium">{currentTemplate.subject}</span>
              )}
            </div>
          </div>

          {isEditing ? (
            <textarea
              value={editDraft.body}
              onChange={(e) => setEditDraft((d) => ({ ...d, body: e.target.value }))}
              rows={12}
              className="w-full text-xs text-white/70 leading-relaxed bg-black/20 border border-white/15 focus:border-red-500/50 rounded-xl px-4 py-3 outline-none resize-none transition font-mono"
            />
          ) : (
            <pre className="text-xs text-white/50 leading-relaxed whitespace-pre-wrap rounded-xl bg-black/20 border border-white/5 px-4 py-3 max-h-48 overflow-y-auto">
              {currentTemplate.body}
            </pre>
          )}

          {/* 첨부파일 업로드 (Step 1/2) */}
          {!isStep3 && (
            <div className="space-y-2">
              <div className="text-xs text-white/30 font-semibold uppercase tracking-widest">첨부파일</div>
              <div className="grid grid-cols-2 gap-2">
                {step.attachments.map((key) => (
                  <label
                    key={key}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition ${
                      attachFiles[key]
                        ? "border-green-600/40 bg-green-900/20"
                        : "border-white/10 bg-white/5 hover:border-white/20"
                    }`}
                  >
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) =>
                        setAttachFiles((prev) => ({ ...prev, [key]: e.target.files?.[0] ?? null }))
                      }
                    />
                    <span className="text-base">{attachFiles[key] ? "📎" : "📄"}</span>
                    <div className="min-w-0">
                      <div className="text-xs text-white/60 capitalize">
                        {key === "factsheet" ? "팩트시트" : key === "schedule" ? "일정표" : "입학허가서"}
                      </div>
                      <div className="text-xs text-white/30 truncate">
                        {attachFiles[key] ? attachFiles[key]!.name : "클릭하여 업로드"}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Step 1/2: 파트너 대학 선택 ── */}
        {!isStep3 && (
          <div className="panel rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-semibold text-white">수신 대학 선택</h2>
              <div className="flex items-center gap-2">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="대학명·국가 검색"
                  className="input text-sm py-1.5 px-3 w-44"
                />
                <button
                  onClick={toggleAll}
                  className="text-xs text-white/50 hover:text-white border border-white/10 rounded-lg px-3 py-1.5 transition whitespace-nowrap"
                >
                  {selected.size === filtered.length ? "전체해제" : "전체선택"}
                </button>
              </div>
            </div>

            <div className="space-y-1.5 max-h-96 overflow-y-auto pr-1">
              {filtered.map((p) => (
                <div
                  key={p.id}
                  onClick={() => togglePartner(p.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all ${
                    selected.has(p.id)
                      ? "border-red-600/40 bg-red-900/15"
                      : "border-white/6 bg-white/3 hover:bg-white/5"
                  }`}
                >
                  {/* 체크박스 */}
                  <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition ${
                    selected.has(p.id) ? "bg-red-600 border-red-600" : "border-white/20"
                  }`}>
                    {selected.has(p.id) && <span className="text-white text-[10px] font-bold">✓</span>}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm text-white truncate">{p.name}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold shrink-0 ${
                        p.status === "active"
                          ? "bg-green-900/50 text-green-300"
                          : "bg-amber-900/50 text-amber-300"
                      }`}>
                        {p.status === "active" ? "활성" : "초대됨"}
                      </span>
                    </div>
                    <div className="text-xs text-white/40 mt-0.5">
                      {p.country} · {p.contact} · {p.email}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-sm font-semibold text-white/70">{p.students}</div>
                    <div className="text-xs text-white/30">학생</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Step 3: 수료 학생 + 성적증명서 업로드 ── */}
        {isStep3 && (
          <div className="panel rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-white">수료 학생 및 성적증명서</h2>
              <button
                onClick={toggleAllGrads}
                className="text-xs text-white/50 hover:text-white border border-white/10 rounded-lg px-3 py-1.5 transition"
              >
                {selectedGrads.size === GRADUATES.length ? "전체해제" : "전체선택"}
              </button>
            </div>

            <div className="space-y-2">
              {GRADUATES.map((g) => (
                <div
                  key={g.id}
                  className={`rounded-xl border transition-all ${
                    selectedGrads.has(g.id)
                      ? "border-amber-500/40 bg-amber-900/10"
                      : "border-white/6 bg-white/3"
                  }`}
                >
                  <div
                    className="flex items-center gap-3 px-4 py-3 cursor-pointer"
                    onClick={() => toggleGrad(g.id)}
                  >
                    <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition ${
                      selectedGrads.has(g.id) ? "bg-amber-500 border-amber-500" : "border-white/20"
                    }`}>
                      {selectedGrads.has(g.id) && <span className="text-white text-[10px] font-bold">✓</span>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm text-white">{g.name}</div>
                      <div className="text-xs text-white/40">{g.partner} · {g.semester}</div>
                    </div>
                    <div className="text-xs text-white/40 truncate max-w-[180px]">{g.email}</div>
                  </div>

                  {/* 성적증명서 업로드 */}
                  <div className="border-t border-white/5 px-4 py-2.5 flex items-center gap-3">
                    <span className="text-xs text-white/30 w-20 shrink-0">성적증명서</span>
                    <label className={`flex-1 flex items-center gap-2 px-3 py-1.5 rounded-lg border cursor-pointer transition ${
                      transcripts[g.id]
                        ? "border-green-600/40 bg-green-900/20"
                        : "border-white/10 bg-white/5 hover:border-white/20"
                    }`}>
                      <input
                        type="file"
                        accept=".pdf"
                        className="hidden"
                        onChange={(e) =>
                          setTranscripts((prev) => ({ ...prev, [g.id]: e.target.files?.[0] ?? null }))
                        }
                      />
                      <span className="text-xs text-white/50">
                        {transcripts[g.id] ? `📎 ${transcripts[g.id]!.name}` : "PDF 업로드"}
                      </span>
                      {!transcripts[g.id] && (
                        <span className="ml-auto text-xs text-white/30 border border-white/10 rounded px-2 py-0.5">찾아보기</span>
                      )}
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── 발송 이력 ── */}
        <div className="panel rounded-2xl p-5 space-y-3">
          <h2 className="font-semibold text-white">발송 이력</h2>
          {history.length === 0 && (
            <p className="text-sm text-white/30">발송 기록이 없습니다.</p>
          )}
          <div className="space-y-2">
            {history.map((h, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/3 border border-white/6">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded shrink-0 ${
                  h.step === "STEP 1" ? "bg-blue-900/60 text-blue-300"
                  : h.step === "STEP 2" ? "bg-green-900/60 text-green-300"
                  : "bg-amber-900/60 text-amber-300"
                }`}>{h.step}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-white/70 truncate">{h.subject}</div>
                </div>
                <div className="text-xs text-white/40 shrink-0">{h.count}{h.step === "STEP 3" ? "명" : "개 대학"}</div>
                <div className="text-xs text-white/30 shrink-0">{h.date}</div>
                <span className="text-[10px] text-green-400 shrink-0">✓ 완료</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ── 하단 고정 액션바 ── */}
      {selectedCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 flex justify-center pb-6 pointer-events-none">
          <div className="pointer-events-auto glass rounded-2xl px-6 py-4 flex items-center gap-4 shadow-2xl border border-white/10">
            <span className="text-sm text-white/60">
              <span className="text-white font-semibold">{selectedCount}</span>
              {isStep3 ? "명" : "개 대학"} 선택됨
            </span>
            <button
              onClick={() => setPreviewOpen(true)}
              className="text-sm px-4 py-2 rounded-xl border border-white/15 text-white/70 hover:bg-white/5 transition"
            >
              미리보기
            </button>
            <button
              onClick={() => setSendOpen(true)}
              className="text-sm px-5 py-2 rounded-xl bg-red-700 hover:bg-red-600 text-white font-semibold transition"
            >
              발송하기
            </button>
          </div>
        </div>
      )}

      {/* ── 미리보기 모달 ── */}
      {previewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="glass rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/8">
              <div>
                <div className={`text-xs font-bold tracking-widest mb-1 ${step.color}`}>{step.tag}</div>
                <h3 className="font-semibold text-white">이메일 미리보기</h3>
              </div>
              <button onClick={() => setPreviewOpen(false)} className="text-white/40 hover:text-white text-xl">✕</button>
            </div>
            <div className="overflow-y-auto flex-1 px-6 py-4 space-y-4">
              <div className="rounded-xl bg-black/30 border border-white/8 px-4 py-3 space-y-2 text-sm">
                <div className="flex gap-3">
                  <span className="text-white/30 w-10 shrink-0">수신</span>
                  <span className="text-white/70">
                    {isStep3
                      ? GRADUATES.filter((g) => selectedGrads.has(g.id)).map((g) => g.name).join(", ")
                      : PARTNERS.filter((p) => selected.has(p.id)).map((p) => p.name).join(", ")}
                  </span>
                </div>
                <div className="border-t border-white/5" />
                <div className="flex gap-3">
                  <span className="text-white/30 w-10 shrink-0">제목</span>
                  <span className="text-white/80 font-medium">{currentTemplate.subject}</span>
                </div>
              </div>
              <pre className="text-sm text-white/60 leading-relaxed whitespace-pre-wrap rounded-xl bg-black/20 border border-white/5 px-5 py-4">
                {currentTemplate.body}
              </pre>
              {!isStep3 && step.attachments.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {step.attachments.map((key) => (
                    <div key={key} className="flex items-center gap-1.5 text-xs text-white/50 border border-white/10 rounded-lg px-3 py-1.5 bg-white/5">
                      📎 {attachFiles[key] ? attachFiles[key]!.name : `${key} (미첨부)`}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="flex gap-3 justify-end px-6 py-4 border-t border-white/8">
              <button onClick={() => setPreviewOpen(false)} className="px-5 py-2 rounded-xl border border-white/15 text-white/70 text-sm">닫기</button>
              <button onClick={() => { setPreviewOpen(false); setSendOpen(true); }} className="px-5 py-2 rounded-xl bg-red-700 hover:bg-red-600 text-white text-sm font-semibold">발송하기</button>
            </div>
          </div>
        </div>
      )}

      {/* ── 발송 확인 모달 ── */}
      {sendOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="glass rounded-2xl p-8 w-full max-w-sm space-y-4">
            <h3 className="text-lg font-bold text-white">발송 확인</h3>
            <p className="text-sm text-white/60">
              <span className={`font-semibold ${step.color}`}>{step.tag} — {step.title}</span> 이메일을{" "}
              <span className="text-white font-semibold">{selectedCount}{isStep3 ? "명" : "개 대학"}</span>에 발송합니다.
            </p>
            <div className="rounded-xl bg-white/5 border border-white/8 px-4 py-3 text-xs text-white/50 max-h-32 overflow-y-auto">
              {isStep3
                ? GRADUATES.filter((g) => selectedGrads.has(g.id)).map((g) => <div key={g.id}>{g.name} — {g.email}</div>)
                : PARTNERS.filter((p) => selected.has(p.id)).map((p) => <div key={p.id}>{p.name} — {p.email}</div>)}
            </div>
            <div className="flex gap-3 justify-end mt-6">
              <button onClick={() => setSendOpen(false)} className="px-5 py-2 rounded-xl border border-white/15 text-white/70 text-sm">취소</button>
              <button onClick={handleSend} className="px-5 py-2 rounded-xl bg-red-700 hover:bg-red-600 text-white text-sm font-semibold">발송하기</button>
            </div>
          </div>
        </div>
      )}
    </PortalShell>
  );
}
