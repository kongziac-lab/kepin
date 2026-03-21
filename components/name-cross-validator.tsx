"use client";

/* ── Levenshtein 거리 계산 ──────────────────────────────────────────── */
function levenshtein(a: string, b: string): number {
  const m = a.length, n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
  return dp[m][n];
}

/* ── 문자 단위 diff 하이라이트 (단어 분리 후 비교) ─────────────────── */
function DiffText({ a, b }: { a: string; b: string }) {
  const wordsA = a.split(" ");
  const wordsB = b.split(" ");
  const maxLen = Math.max(wordsA.length, wordsB.length);

  return (
    <span>
      {Array.from({ length: maxLen }).map((_, i) => {
        const wa = wordsA[i] ?? "";
        const wb = wordsB[i] ?? "";
        const diff = wa.toUpperCase() !== wb.toUpperCase();
        return (
          <span key={i}>
            {i > 0 && " "}
            <span className={diff ? "text-amber-300 underline decoration-dotted" : ""}>
              {a.split(" ")[i] ?? ""}
            </span>
          </span>
        );
      })}
    </span>
  );
}

/* ══════════════════════════════════════════════════════════════════════ */
type Props = {
  /** 노미네이션에서 가져온 영문 이름 */
  nominationName: string;
  /** 여권 OCR / 등록에서 가져온 영문 이름 */
  passportName: string;
  /** 현재 신청서에 적용된 이름 */
  currentName: string;
  /** 여권 이름으로 대체할 때 호출 */
  onReplaceWithPassport: () => void;
  /** 읽기 전용 여부 (최종 제출 후) */
  readOnly?: boolean;
};

export function NameCrossValidator({
  nominationName,
  passportName,
  currentName,
  onReplaceWithPassport,
  readOnly = false,
}: Props) {
  const normNom  = nominationName.trim().toUpperCase();
  const normPass = passportName.trim().toUpperCase();
  const normCurr = currentName.trim().toUpperCase();

  const nomPassDist  = levenshtein(normNom,  normPass);
  const isExactMatch = normNom === normPass;
  const isMinorTypo  = !isExactMatch && nomPassDist <= 3;
  const isMajorDiff  = !isExactMatch && nomPassDist > 3;

  /* 현재 적용 이름이 어느 쪽인지 */
  const usesPassport   = normCurr === normPass && normCurr !== normNom;
  const usesNomination = normCurr === normNom;

  if (!nominationName && !passportName) return null;

  return (
    <div className={`rounded-xl border text-xs overflow-hidden ${
      isExactMatch
        ? "border-green-600/30 bg-green-900/10"
        : isMinorTypo
          ? "border-amber-500/30 bg-amber-900/10"
          : "border-red-600/30 bg-red-900/10"
    }`}>

      {/* ── 헤더 ── */}
      <div className={`px-3 py-2 border-b flex items-center gap-2 ${
        isExactMatch
          ? "border-green-600/20 bg-green-900/10"
          : isMinorTypo
            ? "border-amber-500/20 bg-amber-900/10"
            : "border-red-600/20 bg-red-900/10"
      }`}>
        <span className="text-base leading-none">
          {isExactMatch ? "✅" : isMinorTypo ? "⚠️" : "❌"}
        </span>
        <span className={`font-semibold tracking-wide ${
          isExactMatch ? "text-green-300" : isMinorTypo ? "text-amber-300" : "text-red-300"
        }`}>
          {isExactMatch
            ? "이름 일치 — 노미네이션·여권 동일"
            : isMinorTypo
              ? `철자 오류 의심 — ${nomPassDist}자 차이 감지`
              : `이름 불일치 — ${nomPassDist}자 차이 (직접 확인 필요)`}
        </span>
      </div>

      {/* ── 비교 행 ── */}
      <div className="divide-y divide-white/5">
        {/* 노미네이션 이름 */}
        <div className="flex items-center gap-3 px-3 py-2">
          <span className="w-20 shrink-0 text-[10px] px-1.5 py-0.5 rounded bg-green-900/50 text-green-300 font-bold tracking-wide text-center">
            노미네이션
          </span>
          <span className="flex-1 font-mono font-semibold text-white/80 tracking-wider">
            {isExactMatch
              ? nominationName
              : <DiffText a={nominationName} b={passportName} />}
          </span>
          {usesNomination && (
            <span className="text-[10px] text-green-400 shrink-0">← 현재 적용</span>
          )}
        </div>

        {/* 여권 이름 */}
        <div className="flex items-center gap-3 px-3 py-2">
          <span className="w-20 shrink-0 text-[10px] px-1.5 py-0.5 rounded bg-blue-900/50 text-blue-300 font-bold tracking-wide text-center">
            여권
          </span>
          <span className="flex-1 font-mono font-semibold text-white/80 tracking-wider">
            {passportName || <span className="text-white/25 italic">미등록</span>}
          </span>
          {usesPassport && (
            <span className="text-[10px] text-green-400 shrink-0">← 현재 적용</span>
          )}
        </div>
      </div>

      {/* ── 액션 (철자 오류 의심 시) ── */}
      {isMinorTypo && passportName && !readOnly && (
        <div className="px-3 py-2.5 border-t border-amber-500/20 flex items-center gap-3">
          <p className="flex-1 text-white/45 leading-relaxed">
            여권 이름 <span className="text-white/70 font-mono font-semibold">{passportName}</span>으로
            교체하시겠습니까? 여권이 공식 신원 기준입니다.
          </p>
          <button
            type="button"
            onClick={onReplaceWithPassport}
            className="shrink-0 px-3 py-1.5 rounded-lg bg-amber-700/60 hover:bg-amber-600/70 text-amber-100 font-semibold transition whitespace-nowrap"
          >
            여권 이름으로 대체
          </button>
        </div>
      )}

      {/* ── 대불일치 경고 ── */}
      {isMajorDiff && (
        <div className="px-3 py-2.5 border-t border-red-600/20 text-red-300/70 leading-relaxed">
          ⚠ 이름 차이가 커 자동 대체가 불가합니다. 학생에게 직접 확인 후 수동으로 수정해 주세요.
        </div>
      )}
    </div>
  );
}
