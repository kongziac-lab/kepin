"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { PortalShell } from "@/components/portal-shell";
import { AdminSemesterBar } from "@/components/admin-semester-bar";
import { statusLabel, studentApplications, workflow, type WorkflowStatus } from "@/lib/mock-data";
import { useSemester, toSemesterKey, semesterDisplayLabel } from "@/lib/semester-context";

/* ── 상태 배지 색상 ───────────────────────────────────────────────── */
const statusColor: Record<string, string> = {
  under_review:        "badge-yellow",
  accepted:            "badge-green",
  application_pending: "badge-red",
  dormitory_pending:   "badge-yellow",
  enrolled:            "badge-green",
  nomination_submitted:"badge-yellow",
  course_registration: "badge-green",
  orientation:         "badge-green",
};

/* ── 엑셀(CSV) 다운로드 유틸 ─────────────────────────────────────── */
function toCSV(rows: typeof studentApplications) {
  const headers = ["접수번호", "학생명", "국가", "파트너대학", "입학연도 및 학기", "기숙사 종류", "단계"];
  const lines = [
    headers.join(","),
    ...rows.map((r) =>
      [
        r.id,
        r.name,
        r.country,
        r.partner,
        r.intake,
        r.dormitory,
        statusLabel(r.status),
      ]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(",")
    ),
  ];
  return lines.join("\n");
}

function downloadCSV(rows: typeof studentApplications, filterLabel: string) {
  const csv = "\uFEFF" + toCSV(rows); // BOM for Excel UTF-8
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url;
  a.download = `학생목록_${filterLabel}_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

/* ── 필터 탭 정의 ─────────────────────────────────────────────────── */
type FilterKey = "all" | WorkflowStatus;

const FILTER_TABS: { key: FilterKey; label: string }[] = [
  { key: "all",                  label: "전체" },
  { key: "application_pending",  label: "온라인 신청" },
  { key: "under_review",         label: "서류 검토" },
  { key: "accepted",             label: "합격 처리" },
  { key: "dormitory_pending",    label: "기숙사비 납부" },
  { key: "course_registration",  label: "수강신청" },
  { key: "orientation",          label: "오리엔테이션" },
  { key: "enrolled",             label: "입학 완료" },
];

/* ═══════════════════════════════════════════════════════════════════ */
export default function AdminStudentsPage() {
  const { semester } = useSemester();
  const semKey = toSemesterKey(semester);

  const [statusFilter, setStatusFilter] = useState<FilterKey>("all");
  const [nameSearch,   setNameSearch]   = useState("");
  const [partnerSearch, setPartnerSearch] = useState("");
  const [intakeSearch, setIntakeSearch]  = useState("");

  /* 학기 + 조건 필터 */
  const filtered = useMemo(() => {
    return studentApplications.filter((s) => {
      const matchSem     = s.semesterKey === semKey;
      const matchStatus  = statusFilter === "all" || s.status === statusFilter;
      const matchName    = s.name.toLowerCase().includes(nameSearch.toLowerCase());
      const matchPartner = s.partner.toLowerCase().includes(partnerSearch.toLowerCase());
      const matchIntake  = s.intake.toLowerCase().includes(intakeSearch.toLowerCase());
      return matchSem && matchStatus && matchName && matchPartner && matchIntake;
    });
  }, [semKey, statusFilter, nameSearch, partnerSearch, intakeSearch]);

  /* 탭 카운트도 학기 기준으로 */
  const semStudents = useMemo(
    () => studentApplications.filter((s) => s.semesterKey === semKey),
    [semKey]
  );

  /* 현재 필터 레이블 */
  const currentLabel =
    FILTER_TABS.find((t) => t.key === statusFilter)?.label ?? "전체";

  /* 탭별 카운트 (학기 기준) */
  const countFor = (key: FilterKey) =>
    key === "all"
      ? semStudents.length
      : semStudents.filter((s) => s.status === key).length;

  return (
    <PortalShell
      area="admin"
      title="학생 목록 / 관리"
      description="전체 학생 목록을 필터링하고, 상세 화면으로 진입해 상태 변경과 메일 발송을 이어가는 화면입니다."
      topBar={<AdminSemesterBar />}
    >
      <div className="space-y-5">

        {/* ── 상태 필터 탭 ── */}
        <div className="panel rounded-2xl px-5 py-4 space-y-3">
          <div className="flex flex-wrap gap-2">
            {FILTER_TABS.filter((t) => countFor(t.key) > 0 || t.key === "all").map((tab) => (
              <button
                key={tab.key}
                onClick={() => setStatusFilter(tab.key)}
                className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl border transition font-medium ${
                  statusFilter === tab.key
                    ? "bg-red-700 border-red-600 text-white"
                    : "border-white/10 text-white/45 hover:border-white/25 hover:text-white/70"
                }`}
              >
                {tab.label}
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                  statusFilter === tab.key
                    ? "bg-white/20 text-white"
                    : "bg-white/8 text-white/40"
                }`}>
                  {countFor(tab.key)}
                </span>
              </button>
            ))}
          </div>

          {/* 검색 입력 */}
          <div className="grid grid-cols-3 gap-2">
            <input
              value={nameSearch}
              onChange={(e) => setNameSearch(e.target.value)}
              className="input text-sm py-2 px-3"
              placeholder="학생명 검색"
            />
            <input
              value={partnerSearch}
              onChange={(e) => setPartnerSearch(e.target.value)}
              className="input text-sm py-2 px-3"
              placeholder="파트너대학 검색"
            />
            <input
              value={intakeSearch}
              onChange={(e) => setIntakeSearch(e.target.value)}
              className="input text-sm py-2 px-3"
              placeholder="입학연도 및 학기 (예: 2026 Fall)"
            />
          </div>
        </div>

        {/* ── 학생 테이블 ── */}
        <div
          className="rounded-[2rem] overflow-hidden"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)"
          }}
        >
          {/* 헤더 */}
          <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-white/6">
            <div className="flex items-center gap-3">
              <div className="text-base font-bold">학생 목록</div>
              {/* 활성 필터 표시 */}
              {(statusFilter !== "all" || nameSearch || partnerSearch || intakeSearch) && (
                <div className="flex items-center gap-1.5 flex-wrap">
                  {statusFilter !== "all" && (
                    <span className="text-[10px] bg-red-900/40 text-red-300 border border-red-700/40 rounded-full px-2 py-0.5">
                      {currentLabel}
                    </span>
                  )}
                  {nameSearch && (
                    <span className="text-[10px] bg-white/8 text-white/50 border border-white/10 rounded-full px-2 py-0.5">
                      이름: {nameSearch}
                    </span>
                  )}
                  {partnerSearch && (
                    <span className="text-[10px] bg-white/8 text-white/50 border border-white/10 rounded-full px-2 py-0.5">
                      대학: {partnerSearch}
                    </span>
                  )}
                  {intakeSearch && (
                    <span className="text-[10px] bg-white/8 text-white/50 border border-white/10 rounded-full px-2 py-0.5">
                      기간: {intakeSearch}
                    </span>
                  )}
                  <button
                    onClick={() => { setStatusFilter("all"); setNameSearch(""); setPartnerSearch(""); setIntakeSearch(""); }}
                    className="text-[10px] text-white/30 hover:text-white/60 transition"
                  >
                    필터 초기화 ✕
                  </button>
                </div>
              )}
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-xs text-white/40">{filtered.length}명</span>
              {/* 엑셀 다운로드 */}
              <button
                onClick={() => downloadCSV(filtered, currentLabel)}
                disabled={filtered.length === 0}
                className="flex items-center gap-1.5 text-xs border border-green-700/50 text-green-400 hover:bg-green-900/20 hover:border-green-600/60 disabled:opacity-30 disabled:cursor-not-allowed rounded-xl px-3 py-1.5 transition font-semibold"
              >
                <span>⬇</span>
                엑셀 다운로드
                <span className="text-[10px] text-green-600">({filtered.length}명)</span>
              </button>
            </div>
          </div>

          {/* 테이블 */}
          {filtered.length === 0 ? (
            <div className="py-16 text-center text-sm text-white/30">
              해당 조건의 학생이 없습니다.
            </div>
          ) : (
            <div className="table-wrap" style={{ border: "none", borderRadius: 0 }}>
              <table>
                <thead>
                  <tr>
                    <th>접수번호</th>
                    <th>학생명</th>
                    <th>국가</th>
                    <th>파트너대학</th>
                    <th>입학연도 및 학기</th>
                    <th>기숙사 종류</th>
                    <th>단계</th>
                    <th>상세</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((item) => (
                    <tr key={item.id}>
                      <td className="font-mono text-xs text-white/55">{item.id}</td>
                      <td className="font-semibold">{item.name}</td>
                      <td className="text-white/55 text-xs">{item.country}</td>
                      <td className="text-white/60">{item.partner}</td>
                      <td className="text-white/55 text-xs">{item.intake}</td>
                      <td className="text-xs">
                        <span className={`px-2 py-0.5 rounded-lg text-[11px] font-medium ${
                          item.dormitory === "기숙사 신청"
                            ? "bg-blue-900/40 text-blue-300"
                            : "bg-white/6 text-white/35"
                        }`}>
                          {item.dormitory}
                        </span>
                      </td>
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
          )}
        </div>

      </div>
    </PortalShell>
  );
}
