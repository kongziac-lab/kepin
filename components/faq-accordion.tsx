"use client";

import { useState } from "react";

type FaqItem = { q: string; a: string };

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div
          key={item.q}
          className="glass rounded-2xl overflow-hidden transition-all duration-300"
        >
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
          >
            <span className="font-semibold text-sm">{item.q}</span>
            <span
              className="flex-shrink-0 text-white/40 transition-transform duration-300"
              style={{ transform: open === i ? "rotate(180deg)" : "rotate(0deg)" }}
            >
              ▾
            </span>
          </button>

          <div
            className="overflow-hidden transition-all duration-300"
            style={{
              maxHeight: open === i ? "200px" : "0px",
              opacity: open === i ? 1 : 0,
            }}
          >
            <p className="px-6 pb-5 text-white/45 text-sm leading-relaxed">
              {item.a}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
