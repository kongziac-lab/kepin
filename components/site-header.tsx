"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const navItems = [
  { href: "#home",        label: "Home"        },
  { href: "#map-section", label: "Partner Map" },
  { href: "#workflow",    label: "Workflow"     },
  { href: "#faq",         label: "FAQ"          },
];

const sectionIds = ["home", "map-section", "workflow", "faq"];

export function SiteHeader() {
  const [active, setActive] = useState("home");

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(id); },
        { rootMargin: "-40% 0px -55% 0px" }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  function handleNav(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
    e.preventDefault();
    const id = href.replace("#", "");
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <header
      className="sticky top-0 z-40 backdrop-blur-xl"
      style={{
        background: "rgba(12, 10, 10, 0.82)",
        borderBottom: "1px solid rgba(185, 28, 28, 0.14)"
      }}
    >
      <div className="mx-auto flex max-w-4xl items-center justify-between px-5 py-2">
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
        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const id = item.href.replace("#", "");
            const isActive = active === id;
            return (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => handleNav(e, item.href)}
                className="relative px-3 py-1.5 text-sm rounded-lg transition-all duration-200"
                style={{
                  color: isActive ? "#fff" : "rgba(255,255,255,0.45)",
                  background: isActive ? "rgba(185,28,28,0.12)" : "transparent",
                }}
              >
                {item.label}
                {isActive && (
                  <span
                    className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full"
                    style={{ background: "linear-gradient(90deg, #b91c1c, #f97360)" }}
                  />
                )}
              </a>
            );
          })}
        </nav>

        {/* Auth buttons */}
        <div className="flex items-center gap-2">
          <Link href="/auth/student" className="button-secondary px-3 py-1.5 text-xs">
            Student
          </Link>
          <Link href="/auth/partner" className="button-secondary hidden px-3 py-1.5 text-xs md:inline-flex">
            Partner
          </Link>
          <Link href="/admin/login" className="button-primary px-3 py-1.5 text-xs">
            Admin
          </Link>
        </div>
      </div>
    </header>
  );
}
