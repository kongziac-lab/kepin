"use client";

import { useState, useRef } from "react";
import { PortalShell } from "@/components/portal-shell";

/* ── 초기 파트너 목록 ─────────────────────────────────────── */
type Partner = {
  id: number;
  school: string;
  country: string;
  manager: string;
  email: string;
  phone: string;
  status: "활성" | "대기" | "비활성";
  nominations: number;
  registeredAt: string;
};

const INIT_PARTNERS: Partner[] = [
  { id: 1, school: "Thammasat University",      country: "Thailand",     manager: "Siriporn K.", email: "intl@tu.ac.th",           phone: "+66-2-613-3333", status: "활성",   nominations: 8, registeredAt: "2025-03-01" },
  { id: 2, school: "Fudan University",           country: "China",        manager: "Li Wei",      email: "exchange@fudan.edu.cn",   phone: "+86-21-6565-0000", status: "활성", nominations: 5, registeredAt: "2025-04-12" },
  { id: 3, school: "Ritsumeikan University",     country: "Japan",        manager: "Yuki Tanaka", email: "oia@ritsumei.ac.jp",      phone: "+81-75-813-8000", status: "활성",   nominations: 3, registeredAt: "2025-05-20" },
  { id: 4, school: "Mahidol University",         country: "Thailand",     manager: "Pim Chan",    email: "pim@mahidol.ac.th",       phone: "+66-2-849-6000", status: "대기",    nominations: 0, registeredAt: "2026-01-08" },
  { id: 5, school: "Kansai University",          country: "Japan",        manager: "Yuta Mori",   email: "y.mori@kansai.ac.jp",     phone: "+81-6-6368-0800", status: "대기",   nominations: 0, registeredAt: "2026-02-14" },
  { id: 6, school: "Tunghai University",         country: "Taiwan",       manager: "Pei Lin",     email: "pei.lin@thu.edu.tw",      phone: "+886-4-2359-0121", status: "비활성",nominations: 4, registeredAt: "2024-11-30" },
];

const EMPTY_FORM = { school: "", country: "", manager: "", email: "", phone: "", status: "대기" as Partner["status"] };

const STATUS_STYLE: Record<string, string> = {
  활성: "bg-green-900/50 text-green-300",
  대기: "bg-amber-900/50 text-amber-300",
  비활성: "bg-white/10 text-white/40",
};

/* ── 엑셀 행 파싱 (TSV / CSV) ───────────────────────────── */
function parseExcelText(text: string): Omit<Partner, "id" | "nominations" | "registeredAt">[] {
  const lines = text.trim().split("\n").filter(Boolean);
  // 첫 행이 헤더면 제거
  const isHeader = lines[0].toLowerCase().includes("school") || lines[0].toLowerCase().includes("대학");
  const rows = isHeader ? lines.slice(1) : lines;
  return rows.map((row) => {
    const cols = row.split(/\t|,/).map((c) => c.trim().replace(/^"|"$/g, ""));
    return {
      school:  cols[0] ?? "",
      country: cols[1] ?? "",
      manager: cols[2] ?? "",
      email:   cols[3] ?? "",
      phone:   cols[4] ?? "",
      status:  (cols[5] as Partner["status"]) ?? "대기",
    };
  });
}

export default function AdminPartnersPage() {
  const [partners, setPartners]     = useState<Partner[]>(INIT_PARTNERS);
  const [tab, setTab]               = useState<"individual" | "excel">("individual");
  const [form, setForm]             = useState({ ...EMPTY_FORM });
  const [editId, setEditId]         = useState<number | null>(null);
  const [editForm, setEditForm]     = useState<Partner | null>(null);
  const [search, setSearch]         = useState("");
  const [excelPreview, setExcelPreview] = useState<Omit<Partner, "id" | "nominations" | "registeredAt">[]>([]);
  const [excelFileName, setExcelFileName] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  /* ── 개별 등록 ──────────────────────────────────────────── */
  function handleAdd() {
    if (!form.school || !form.email) return;
    const newPartner: Partner = {
      id: Date.now(),
      ...form,
      nominations: 0,
      registeredAt: new Date().toISOString().slice(0, 10),
    };
    setPartners((prev) => [newPartner, ...prev]);
    setForm({ ...EMPTY_FORM });
  }

  /* ── 엑셀 파일 파싱 ─────────────────────────────────────── */
  function handleExcelFile(file: File) {
    setExcelFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setExcelPreview(parseExcelText(text));
    };
    reader.readAsText(file, "utf-8");
  }

  function handleExcelImport() {
    const now = new Date().toISOString().slice(0, 10);
    const imported: Partner[] = excelPreview.map((row, i) => ({
      id: Date.now() + i,
      ...row,
      nominations: 0,
      registeredAt: now,
    }));
    setPartners((prev) => [...imported, ...prev]);
    setExcelPreview([]);
    setExcelFileName("");
  }

  /* ── 수정 ───────────────────────────────────────────────── */
  function startEdit(p: Partner) {
    setEditId(p.id);
    setEditForm({ ...p });
  }
  function saveEdit() {
    if (!editForm) return;
    setPartners((prev) => prev.map((p) => (p.id === editId ? editForm : p)));
    setEditId(null);
    setEditForm(null);
  }
  function cancelEdit() { setEditId(null); setEditForm(null); }

  /* ── 삭제 ───────────────────────────────────────────────── */
  function handleDelete(id: number) {
    if (!confirm("이 파트너대학을 삭제하시겠습니까?")) return;
    setPartners((prev) => prev.filter((p) => p.id !== id));
  }

  /* ── 필터 ───────────────────────────────────────────────── */
  const filtered = partners.filter(
    (p) =>
      p.school.toLowerCase().includes(search.toLowerCase()) ||
      p.country.toLowerCase().includes(search.toLowerCase()) ||
      p.manager.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <PortalShell
      area="admin"
      title="파트너대학 관리"
      description="파트너 대학 등록(개별·일괄), 정보 수정, 현황 확인"
    >
      <div className="space-y-6">

        {/* ── 등록 패널 ── */}
        <div className="panel rounded-2xl overflow-hidden">
          {/* 탭 */}
          <div className="flex border-b border-white/8">
            {[["individual", "개별 등록"], ["excel", "엑셀 일괄 등록"]] .map(([key, label]) => (
              <button
                key={key}
                onClick={() => setTab(key as "individual" | "excel")}
                className={`px-6 py-3.5 text-sm font-semibold transition border-b-2 -mb-px ${
                  tab === key
                    ? "border-red-500 text-white"
                    : "border-transparent text-white/40 hover:text-white/60"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="p-6">
            {/* 개별 등록 */}
            {tab === "individual" && (
              <div className="grid grid-cols-6 gap-3">
                <div className="info-cell col-span-2">
                  <label>대학명 <span className="text-red-500">*</span></label>
                  <input className="input" placeholder="대학교명" value={form.school} onChange={(e) => setForm({ ...form, school: e.target.value })} />
                </div>
                <div className="info-cell col-span-1">
                  <label>국가</label>
                  <input className="input" placeholder="국가" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
                </div>
                <div className="info-cell col-span-1">
                  <label>담당자명</label>
                  <input className="input" placeholder="담당자" value={form.manager} onChange={(e) => setForm({ ...form, manager: e.target.value })} />
                </div>
                <div className="info-cell col-span-2">
                  <label>이메일 <span className="text-red-500">*</span></label>
                  <input className="input" placeholder="이메일" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
                <div className="info-cell col-span-2">
                  <label>전화번호</label>
                  <input className="input" placeholder="전화번호" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>
                <div className="info-cell col-span-1">
                  <label>상태</label>
                  <select className="input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Partner["status"] })}>
                    <option>활성</option>
                    <option>대기</option>
                    <option>비활성</option>
                  </select>
                </div>
                <div className="col-span-3 flex items-end">
                  <button
                    onClick={handleAdd}
                    disabled={!form.school || !form.email}
                    className="px-6 py-2.5 rounded-xl bg-red-700 hover:bg-red-600 disabled:opacity-40 text-white text-sm font-semibold transition"
                  >
                    + 등록하기
                  </button>
                </div>
              </div>
            )}

            {/* 엑셀 일괄 등록 */}
            {tab === "excel" && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <label className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border cursor-pointer transition text-sm ${
                    excelFileName ? "border-green-600/40 bg-green-900/20 text-green-300" : "border-white/15 bg-white/5 text-white/60 hover:border-white/25"
                  }`}>
                    <input
                      ref={fileRef}
                      type="file"
                      accept=".csv,.tsv,.txt,.xlsx"
                      className="hidden"
                      onChange={(e) => e.target.files?.[0] && handleExcelFile(e.target.files[0])}
                    />
                    📎 {excelFileName || "CSV / TSV 파일 선택"}
                  </label>
                  <span className="text-xs text-white/30">
                    열 순서: 대학명, 국가, 담당자명, 이메일, 전화번호, 상태
                  </span>
                </div>

                {excelPreview.length > 0 && (
                  <>
                    <div className="rounded-xl border border-white/8 overflow-hidden">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-white/8 bg-white/3">
                            {["대학명","국가","담당자","이메일","전화번호","상태"].map((h) => (
                              <th key={h} className="text-left px-4 py-2.5 text-xs text-white/40 font-semibold">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {excelPreview.map((row, i) => (
                            <tr key={i} className="border-b border-white/5 last:border-0 hover:bg-white/3">
                              <td className="px-4 py-2.5 text-white/80">{row.school}</td>
                              <td className="px-4 py-2.5 text-white/50">{row.country}</td>
                              <td className="px-4 py-2.5 text-white/50">{row.manager}</td>
                              <td className="px-4 py-2.5 text-white/50">{row.email}</td>
                              <td className="px-4 py-2.5 text-white/50">{row.phone}</td>
                              <td className="px-4 py-2.5">
                                <span className={`text-xs px-2 py-0.5 rounded font-semibold ${STATUS_STYLE[row.status] ?? STATUS_STYLE["대기"]}`}>
                                  {row.status || "대기"}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-white/50">{excelPreview.length}개 대학 파싱됨</span>
                      <button
                        onClick={handleExcelImport}
                        className="px-5 py-2 rounded-xl bg-red-700 hover:bg-red-600 text-white text-sm font-semibold transition"
                      >
                        전체 등록
                      </button>
                      <button
                        onClick={() => { setExcelPreview([]); setExcelFileName(""); }}
                        className="px-4 py-2 rounded-xl border border-white/15 text-white/50 text-sm transition hover:bg-white/5"
                      >
                        취소
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── 파트너 목록 ── */}
        <div className="panel rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/8">
            <div>
              <h2 className="font-semibold text-white whitespace-nowrap">대학 조회</h2>
              <p className="text-xs text-white/40 mt-0.5">총 {partners.length}개 대학</p>
            </div>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="대학명·국가·담당자 검색"
              className="input text-sm py-1.5 px-3 w-52"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/8 bg-white/2">
                  {["대학명", "국가", "담당자", "이메일", "전화번호", "상태", "노미네이션", "등록일", "", ""].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs text-white/35 font-semibold whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) =>
                  editId === p.id && editForm ? (
                    /* ── 수정 행 ── */
                    <tr key={p.id} className="border-b border-white/5 bg-white/3">
                      <td className="px-3 py-2"><input className="input text-xs py-1 w-36" value={editForm.school}  onChange={(e) => setEditForm({ ...editForm, school:  e.target.value })} /></td>
                      <td className="px-3 py-2"><input className="input text-xs py-1 w-24" value={editForm.country} onChange={(e) => setEditForm({ ...editForm, country: e.target.value })} /></td>
                      <td className="px-3 py-2"><input className="input text-xs py-1 w-24" value={editForm.manager} onChange={(e) => setEditForm({ ...editForm, manager: e.target.value })} /></td>
                      <td className="px-3 py-2"><input className="input text-xs py-1 w-40" value={editForm.email}   onChange={(e) => setEditForm({ ...editForm, email:   e.target.value })} /></td>
                      <td className="px-3 py-2"><input className="input text-xs py-1 w-32" value={editForm.phone}   onChange={(e) => setEditForm({ ...editForm, phone:   e.target.value })} /></td>
                      <td className="px-3 py-2">
                        <select className="input text-xs py-1" value={editForm.status} onChange={(e) => setEditForm({ ...editForm, status: e.target.value as Partner["status"] })}>
                          <option>활성</option><option>대기</option><option>비활성</option>
                        </select>
                      </td>
                      <td className="px-4 py-2 text-white/50">{p.nominations}</td>
                      <td className="px-4 py-2 text-white/40 text-xs">{p.registeredAt}</td>
                      <td className="px-3 py-2" colSpan={2}>
                        <div className="flex gap-2">
                          <button onClick={saveEdit} className="text-xs px-3 py-1 rounded-lg bg-red-700 hover:bg-red-600 text-white font-semibold transition">저장</button>
                          <button onClick={cancelEdit} className="text-xs px-3 py-1 rounded-lg border border-white/15 text-white/50 hover:bg-white/5 transition">취소</button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    /* ── 일반 행 ── */
                    <tr key={p.id} className="border-b border-white/5 last:border-0 hover:bg-white/3 transition">
                      <td className="px-4 py-3 font-medium text-white whitespace-nowrap">{p.school}</td>
                      <td className="px-4 py-3 text-white/50">{p.country}</td>
                      <td className="px-4 py-3 text-white/50">{p.manager}</td>
                      <td className="px-4 py-3 text-white/40 text-xs">{p.email}</td>
                      <td className="px-4 py-3 text-white/40 text-xs">{p.phone}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded font-semibold ${STATUS_STYLE[p.status]}`}>{p.status}</span>
                      </td>
                      <td className="px-4 py-3 text-white/60">{p.nominations}</td>
                      <td className="px-4 py-3 text-white/35 text-xs">{p.registeredAt}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => startEdit(p)}
                          className="text-xs px-3 py-1.5 rounded-lg border border-white/15 text-white/50 hover:text-white hover:border-white/30 transition"
                        >
                          수정
                        </button>
                      </td>
                      <td className="px-2 py-3">
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="text-xs px-3 py-1.5 rounded-lg border border-red-900/40 text-red-400/70 hover:text-red-300 hover:border-red-600/50 transition"
                        >
                          삭제
                        </button>
                      </td>
                    </tr>
                  )
                )}
                {filtered.length === 0 && (
                  <tr><td colSpan={10} className="px-4 py-8 text-center text-white/30 text-sm">검색 결과가 없습니다.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </PortalShell>
  );
}
