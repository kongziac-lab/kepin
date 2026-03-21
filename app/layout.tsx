import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { BackgroundCanvas } from "@/components/background-canvas";

export const metadata: Metadata = {
  title: "Kepin",
  description: "Keimyung Inbound Exchange Application Platform"
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="ko">
      <body>
        <BackgroundCanvas />
        <div style={{ position: "relative", zIndex: 1 }}>
          {children}
        </div>
      </body>
    </html>
  );
}
