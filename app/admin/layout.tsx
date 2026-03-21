import { SemesterProvider } from "@/lib/semester-context";
import type { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <SemesterProvider>{children}</SemesterProvider>;
}
