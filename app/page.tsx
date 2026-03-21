import Link from "next/link";
import { SectionTitle } from "@/components/section-title";
import { SiteHeader } from "@/components/site-header";
import { StatusTimeline } from "@/components/status-timeline";
import { PartnerMap } from "@/components/partner-map";
import { FaqAccordion } from "@/components/faq-accordion";
import { landingStats, partnerUniversities, roleCards } from "@/lib/mock-data";

/* ── FAQ items (Korean + English mix) ── */
const faqItems = [
  {
    q: "Who is eligible to apply?",
    a: "Students enrolled at a Keimyung University partner institution who have been officially nominated by their home university's international office. Direct (self) applications are not accepted."
  },
  {
    q: "What documents do I need to submit?",
    a: "Passport copy, official transcript (GPA), Certificate of Enrollment, passport-size photo, and language proficiency certificate (if applicable). Passport details are auto-filled by AI when you upload the image."
  },
  {
    q: "Is dormitory accommodation guaranteed?",
    a: "Exchange students receive dormitory priority. Allocation is first-come, first-served after acceptance — complete registration promptly."
  },
  {
    q: "누가 지원할 수 있나요?",
    a: "계명대학교 협정대학에서 공식 노미네이션을 받은 초청교환학생만 지원할 수 있습니다. 개인 지원은 불가합니다."
  },
  {
    q: "학생이 직접 회원가입하나요?",
    a: "파트너대학 노미네이션 이후 학생 초대 메일을 발송하는 초대 기반 가입 방식으로 운영됩니다."
  },
  {
    q: "AI OCR은 어떤 항목을 자동 입력하나요?",
    a: "영문성명, 생년월일, 여권번호, 국적, 여권 만료일 등 기획서에 정의된 핵심 항목을 자동 입력합니다."
  }
];

/* ── Platform features (bento grid) ── */
const features = [
  {
    emoji: "🛂",
    title: "AI Passport Auto-Fill",
    desc: "여권 이미지를 업로드하면 AI가 성명·생년월일·여권번호·국적·만료일을 즉시 읽어 신청서를 자동으로 채웁니다.",
    wide: true,
    iconBg: "bg-red-700/20 border-red-600/30"
  },
  {
    emoji: "💬",
    title: "AI Counseling Chatbot",
    desc: "24/7 AI 챗봇이 지원 절차, 기숙사, 비자, 캠퍼스 생활 질문에 답합니다.",
    wide: false,
    iconBg: "bg-purple-700/20 border-purple-600/30"
  },
  {
    emoji: "📊",
    title: "Real-Time Status Tracking",
    desc: "학생과 파트너대학이 8단계 지원 현황을 실시간으로 조회할 수 있습니다.",
    wide: false,
    iconBg: "bg-amber-600/20 border-amber-500/30"
  },
  {
    emoji: "✉️",
    title: "Automated Email Notifications",
    desc: "합격·기숙사·수강신청·오리엔테이션 등 각 단계마다 이메일이 자동 발송됩니다.",
    wide: false,
    iconBg: "bg-blue-700/20 border-blue-600/30"
  },
  {
    emoji: "🏛️",
    title: "Partner University Portal",
    desc: "협정대학 담당자가 노미네이션을 제출(엑셀 일괄 등록 포함)하고 학생별 진행 현황을 한눈에 확인할 수 있는 전용 포털입니다.",
    wide: true,
    iconBg: "bg-emerald-700/20 border-emerald-600/30"
  },
  {
    emoji: "📄",
    title: "Acceptance Letter Download",
    desc: "합격 후 공식 입학통지서를 Kepin에서 직접 다운로드 — 비자 신청에 바로 사용할 수 있습니다.",
    wide: false,
    iconBg: "bg-pink-700/20 border-pink-600/30"
  }
];

/* ── Marquee partner names ── */
const marqueeNames = [
  "Thammasat University", "Fudan University", "Waseda University",
  "Mahidol University", "University of Auckland", "Ritsumeikan University",
  "Kansai University", "Peking University", "Chulalongkorn University",
  "Monash University", "Keio University", "Tunghai University",
  "Seoul National University", "Nanyang Technological University", "Kyoto University"
];

export default function HomePage() {
  return (
    <div className="page-shell">
      <SiteHeader />

      <main>
        {/* ══════════════ HERO + MARQUEE (one screen) ══════════════ */}
        <section
          id="home"
          style={{ minHeight: "calc(100vh - 64px)" }}
          className="flex flex-col scroll-mt-14"
        >
          {/* Hero content — grows to fill space */}
          <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-10">
            {/* Chip */}
            <div className="flex justify-center mb-7 anim-up">
              <div className="chip">
                <span className="pulse-dot" />
                Connect the World · Keimyung University
              </div>
            </div>

            {/* Headline */}
            <h1 className="text-5xl font-black leading-none tracking-[-0.05em] md:text-7xl anim-up d1">
              <span className="shimmer-text">계명대학교</span>
              <br />
              초청교환학생 플랫폼
            </h1>

            <p className="mt-7 mx-auto max-w-xl text-lg leading-8 text-white/52 anim-up d2">
              노미네이션 제출부터 입학 완료까지 — 학생·파트너대학·관리자의
              모든 흐름을 하나의 시스템으로 연결합니다.
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-4 anim-up d3">
              <Link href="/student/dashboard" className="btn-hero">
                학생 포털 →
              </Link>
              <Link href="/partner/dashboard" className="btn-hero">
                파트너 포털 →
              </Link>
            </div>
          </div>

          {/* Marquee — pinned to bottom of screen */}
          <div className="border-y border-white/5 py-4 marquee-wrap">
            <div className="marquee-track">
              {[...marqueeNames, ...marqueeNames].map((name, i) => (
                <span
                  key={i}
                  className="text-sm font-medium text-white/28 flex-shrink-0 flex items-center"
                >
                  {name}
                  <span className="mx-8 text-red-900/50">·</span>
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════ PARTNER MAP ══════════════ */}
        <section
          id="map-section"
          className="border-t border-white/5 flex flex-col scroll-mt-14"
          style={{ height: "calc(100vh - 52px)" }}
        >
          <div className="mx-auto max-w-7xl w-full px-6 flex flex-col flex-1 overflow-hidden">
            {/* Title + stats row */}
            <div className="flex items-center justify-between py-3 flex-shrink-0">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-red-500">Partner Network</div>
                <h2 className="text-xl font-bold tracking-tight">Partner Universities Worldwide</h2>
              </div>
              <div className="flex gap-2">
                {[
                  { val: "247", label: "Partners",  color: "text-red-400"     },
                  { val: "38",  label: "Active",    color: "text-amber-400"   },
                  { val: "83",  label: "Countries", color: "text-white"       },
                  { val: "124", label: "Nominated", color: "text-emerald-400" },
                ].map(({ val, label, color }) => (
                  <div key={label} className="glass rounded-lg px-3 py-1.5 text-center min-w-[64px]">
                    <div className={`text-base font-bold ${color}`}>{val}</div>
                    <div className="text-[10px] text-white/40">{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Map — fills remaining space */}
            <div className="flex-1 min-h-0">
              <PartnerMap />
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-5 py-2 flex-shrink-0">
              <div className="flex items-center gap-2 text-xs text-white/45">
                <span className="inline-block h-3 w-3 rounded-full bg-red-500" />
                Nomination submitted this semester
              </div>
              <div className="flex items-center gap-2 text-xs text-white/45">
                <span className="inline-block h-3 w-3 rounded-full bg-amber-500" />
                Partner university (no active nomination)
              </div>
              <div className="flex items-center gap-2 text-xs text-white/45">
                <span className="inline-block h-3 w-3 rounded-full bg-blue-600" style={{ border: "2px solid white" }} />
                Keimyung University (KMU)
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════ SYSTEM SCOPE ══════════════ */}
        <section id="overview" className="mx-auto max-w-7xl px-6 py-24 scroll-mt-14">
          <SectionTitle
            eyebrow="System Scope"
            title="역할별 포털 분리 설계"
            description="기획서의 사용자 역할과 화면 구성을 그대로 반영, 세 개의 독립 포털로 접근 경로를 분리했습니다."
          />
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {roleCards.map((role) => (
              <Link
                key={role.title}
                href={role.href}
                className="glass rounded-[1.75rem] p-7 transition-all duration-300 hover:-translate-y-1.5 hover:border-red-500/22 group"
              >
                <div className="text-2xl font-bold">{role.title}</div>
                <p className="mt-4 text-sm leading-6 text-white/48">{role.description}</p>
                <ul className="mt-6 space-y-2">
                  {role.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-center gap-2.5 text-sm text-white/60">
                      <span className="h-1.5 w-1.5 rounded-full bg-red-500 flex-shrink-0" />
                      {bullet}
                    </li>
                  ))}
                </ul>
                <div className="mt-7 text-sm font-semibold text-red-400 transition-all group-hover:translate-x-1">
                  포털 보기 →
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ══════════════ PLATFORM FEATURES ══════════════ */}
        <section className="border-t border-white/5 py-24">
          <div className="mx-auto max-w-7xl px-6">
            <SectionTitle
              eyebrow="Platform Features"
              title="필요한 모든 기능을 하나로"
              description="기획서에 정의된 주요 기능 전체 구현. AI 자동화, 실시간 추적, 역할별 운영이 하나의 플랫폼에."
            />
            <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {features.map((f) => (
                <div
                  key={f.title}
                  className={`glass rounded-2xl p-7 ${f.wide ? "lg:col-span-2 flex gap-6 items-start" : ""}`}
                >
                  <div className={`feature-icon border ${f.iconBg}`}>
                    {f.emoji}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">{f.title}</h3>
                    <p className="text-white/42 text-sm leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════ WORKFLOW ══════════════ */}
        <section id="workflow" className="border-t border-white/5 flex flex-col scroll-mt-14 overflow-y-auto" style={{ height: "calc(100vh - 52px)" }}>
          <div className="mx-auto max-w-7xl px-6">
            <SectionTitle
              eyebrow="Workflow"
              title="8단계 초청교환학생 접수 프로세스"
              description="노미네이션 제출부터 입학 완료까지 기획서에 정의된 상태 흐름을 그대로 시각화했습니다."
            />
            <div className="mt-12">
              <StatusTimeline />
            </div>
          </div>
        </section>


        {/* ══════════════ FAQ ══════════════ */}
        <section id="faq" className="border-t border-white/5 flex flex-col justify-center scroll-mt-14 overflow-y-auto" style={{ height: "calc(100vh - 52px)" }}>
          <div className="mx-auto max-w-3xl px-6">
            <div className="text-center mb-14">
              <div className="text-xs font-bold uppercase tracking-[0.18em] text-red-500 mb-4">FAQ</div>
              <h2 className="text-4xl font-bold tracking-tight">자주 묻는 질문</h2>
            </div>
            <FaqAccordion items={faqItems} />
          </div>
        </section>

        {/* ══════════════ CTA ══════════════ */}
        <section
          className="relative overflow-hidden py-28"
          style={{
            background: "linear-gradient(135deg, #180404 0%, #2d0808 50%, #180404 100%)"
          }}
        >
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(185,28,28,.18) 0%, transparent 70%)"
            }}
          />
          <div className="relative mx-auto max-w-3xl px-6 text-center">
            <div className="text-xs font-bold uppercase tracking-[0.18em] text-red-400 mb-6">
              Start Your Journey
            </div>
            <h2 className="text-4xl font-bold tracking-tight leading-tight mb-6 md:text-5xl">
              한국에서의 한 학기가
              <br />
              여기서 시작됩니다
            </h2>
            <p className="text-white/42 text-lg leading-relaxed mb-10">
              노미네이션을 받으셨나요? 지금 바로 Kepin에서 지원을 완료하세요.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/auth/student" className="button-primary px-8 py-4 text-base">
                🎓 학생 지원하기
              </Link>
              <Link href="/auth/partner" className="button-secondary px-8 py-4 text-base">
                🏛️ 파트너 포털
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap justify-center gap-6 text-sm text-white/26">
              <span>🔒 암호화 보안</span>
              <span>🌏 EN · KO · ZH</span>
              <span>💬 24/7 AI 챗봇</span>
            </div>
          </div>
        </section>

        {/* ══════════════ FOOTER ══════════════ */}
        <footer className="border-t border-white/5 py-14">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3 mb-12">
              <div>
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-red-700 to-orange-500 text-sm font-black">
                    K
                  </div>
                  <span className="font-bold text-lg tracking-tight">Kepin</span>
                </div>
                <p className="text-white/32 text-sm leading-relaxed">
                  계명대학교<br />
                  초청교환학생 접수 플랫폼
                </p>
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/28 mb-5">포털 접속</div>
                <div className="space-y-2.5 text-sm text-white/42">
                  <Link href="/auth/student" className="block hover:text-white transition-colors">학생 포털</Link>
                  <Link href="/auth/partner" className="block hover:text-white transition-colors">파트너 포털</Link>
                  <Link href="/admin/login"  className="block hover:text-white transition-colors">관리자</Link>
                </div>
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/28 mb-5">계명대학교</div>
                <div className="space-y-2.5 text-sm text-white/42">
                  <span className="block">Keimyung University</span>
                  <span className="block">Daegu, Republic of Korea</span>
                  <span className="block">국제교류처</span>
                </div>
              </div>
            </div>
            <div className="border-t border-white/5 pt-8 text-center text-xs text-white/20">
              © 2026 Keimyung University · Kepin v1.0
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
