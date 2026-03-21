import Link from "next/link";

const navItems = [
  { href: "#overview",    label: "Overview"    },
  { href: "#map-section", label: "Partner Map" },
  { href: "#workflow",    label: "Workflow"    },
  { href: "#faq",         label: "FAQ"         }
];

export function SiteHeader() {
  return (
    <header
      className="sticky top-0 z-40 backdrop-blur-xl"
      style={{
        background: "rgba(12, 10, 10, 0.82)",
        borderBottom: "1px solid rgba(185, 28, 28, 0.14)"
      }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-xl text-sm font-black text-white"
            style={{ background: "linear-gradient(135deg, #b91c1c, #f97360)" }}
          >
            K
          </div>
          <div>
            <div className="text-base font-bold tracking-tight">Kepin</div>
            <div className="text-[10px] text-white/35">Keimyung Inbound Exchange</div>
          </div>
        </Link>

        {/* Nav */}
        <nav className="hidden items-center gap-7 text-sm text-white/50 md:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="transition-colors duration-200 hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Auth buttons */}
        <div className="flex items-center gap-2">
          <Link href="/auth/student" className="button-secondary px-4 py-2.5 text-sm">
            Student
          </Link>
          <Link href="/auth/partner" className="button-secondary hidden px-4 py-2.5 text-sm md:inline-flex">
            Partner
          </Link>
          <Link href="/admin/login" className="button-primary px-4 py-2.5 text-sm">
            Admin
          </Link>
        </div>
      </div>
    </header>
  );
}
