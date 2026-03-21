import Link from "next/link";
import type { ReactNode } from "react";

type PortalShellProps = {
  area: "student" | "partner" | "admin";
  title: string;
  description: string;
  children: ReactNode;
};

const navByArea = {
  student: [
    { href: "/student/dashboard",   label: "대시보드",      icon: "⊞"  },
    { href: "/student/passport",    label: "여권 등록",      icon: "🛂" },
    { href: "/student/apply",       label: "온라인 신청서",  icon: "✏️" },
    { href: "/student/status",      label: "신청 현황",      icon: "📋" },
    { href: "/student/acceptance",  label: "입학통지서",     icon: "🎓" },
    { href: "/student/inquiry",     label: "질문하기",       icon: "💬" }
  ],
  partner: [
    { href: "/partner/dashboard",    label: "대시보드",        icon: "⊞"  },
    { href: "/partner/nominate",     label: "노미네이션 제출", icon: "✏️" },
    { href: "/partner/nominations",  label: "노미네이션 현황", icon: "📋" }
  ],
  admin: [
    { href: "/admin/dashboard",      label: "대시보드",    icon: "⊞"  },
    { href: "/admin/partners",       label: "파트너 관리", icon: "🏛️" },
    { href: "/admin/students",       label: "학생 관리",   icon: "👥" },
    { href: "/admin/files",          label: "파일 관리",   icon: "🗂️" },
    { href: "/admin/emails",         label: "이메일 관리", icon: "✉️" },
    { href: "/admin/orientation",    label: "오리엔테이션", icon: "📁" }
  ]
} as const;

const areaConfig = {
  student: {
    label: "Student Portal",
    badge: "badge-area-blue",
    accent: "rgba(96, 165, 250, 0.18)",
    accentBorder: "rgba(96, 165, 250, 0.28)"
  },
  partner: {
    label: "Partner Portal",
    badge: "badge-area-green",
    accent: "rgba(52, 211, 153, 0.14)",
    accentBorder: "rgba(52, 211, 153, 0.24)"
  },
  admin: {
    label: "KMU Admin",
    badge: "badge-area-red",
    accent: "rgba(185, 28, 28, 0.14)",
    accentBorder: "rgba(185, 28, 28, 0.25)"
  }
};

const areaColors: Record<string, { text: string; bg: string; border: string }> = {
  "badge-area-blue": {
    text: "#93c5fd",
    bg: "rgba(59, 130, 246, 0.12)",
    border: "rgba(96, 165, 250, 0.25)"
  },
  "badge-area-green": {
    text: "#6ee7b7",
    bg: "rgba(52, 211, 153, 0.1)",
    border: "rgba(52, 211, 153, 0.22)"
  },
  "badge-area-red": {
    text: "#fca5a5",
    bg: "rgba(185, 28, 28, 0.12)",
    border: "rgba(248, 113, 113, 0.24)"
  }
};

export function PortalShell({ area, title, description, children }: PortalShellProps) {
  const config = areaConfig[area];
  const color = areaColors[config.badge];

  return (
    <div className="page-shell min-h-screen">
      {/* ── Portal header ── */}
      <header
        className="sticky top-0 z-40 backdrop-blur-xl"
        style={{
          background: "rgba(12, 10, 10, 0.88)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.06)"
        }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-2">
          <Link href="/" className="flex items-center gap-2.5">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-xl text-sm font-black text-white"
              style={{ background: "linear-gradient(135deg, #b91c1c, #f97360)" }}
            >
              K
            </div>
            <div>
              <div className="text-sm font-bold tracking-tight">Kepin</div>
              <div className="text-[9px] text-white/30">Keimyung Inbound Exchange</div>
            </div>
          </Link>

          {/* Area badge */}
          <span
            className="rounded-full border px-3 py-1 text-xs font-semibold"
            style={{ color: color.text, background: color.bg, borderColor: color.border }}
          >
            {config.label}
          </span>

          <Link href="/" className="button-secondary text-xs px-3.5 py-2">
            ← 랜딩
          </Link>
        </div>
      </header>

      {/* ── Tab nav ── */}
      <div
        style={{
          background: "rgba(12,10,10,0.6)",
          borderBottom: "1px solid rgba(255,255,255,0.06)"
        }}
      >
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex overflow-x-auto gap-1">
            {navByArea[area].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2 px-4 py-3 text-sm text-white/45 whitespace-nowrap transition-all duration-200 hover:text-white border-b-2 border-transparent hover:border-red-600/60"
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── Content area ── */}
      <div className="mx-auto max-w-7xl px-6 pt-8 pb-24">
        {/* Page heading */}
        <div className="mb-6">
          <h1 className="text-2xl font-black tracking-tight">{title}</h1>
          <p className="mt-1.5 max-w-2xl text-sm leading-6 text-white/44">{description}</p>
        </div>

        {/* Main content */}
        <main className="space-y-6">{children}</main>
      </div>
    </div>
  );
}
