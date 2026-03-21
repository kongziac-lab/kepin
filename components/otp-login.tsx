"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import type { Role } from "@/lib/supabase/types";

const ROLE_REDIRECT: Record<Role, string> = {
  admin:   "/admin/dashboard",
  partner: "/partner/dashboard",
  student: "/student/dashboard",
};

type Props = {
  role: Role;
  title: string;
  description: string;
  accentColor: string; // Tailwind bg class
};

export function OtpLogin({ role, title, description, accentColor }: Props) {
  const router = useRouter();
  const supabase = createClient();

  const [step, setStep]       = useState<"email" | "otp">("email");
  const [email, setEmail]     = useState("");
  const [otp, setOtp]         = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  /* ── Step 1: send OTP ── */
  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { shouldCreateUser: false }, // only pre-invited users
      });
      if (error) throw error;
      setStep("otp");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "이메일 전송에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }

  /* ── Step 2: verify OTP ── */
  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: "email",
      });
      if (error) throw error;

      // fetch profile to confirm role matches
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: profileData, error: profileErr } = await (supabase as any)
        .from("profiles")
        .select("role")
        .eq("id", data.user!.id)
        .single();

      const profile = profileData as { role: Role } | null;

      if (profileErr || !profile) {
        throw new Error("초대된 계정이 아닙니다. 관리자에게 문의하세요.");
      }
      if (profile.role !== role) {
        await supabase.auth.signOut();
        throw new Error(`이 포털의 접근 권한이 없습니다. (권한: ${profile.role})`);
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      router.push(ROLE_REDIRECT[role] as any);
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "인증에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(120,20,20,0.18) 0%, transparent 70%)" }}
    >
      <div className="w-full max-w-sm space-y-6">
        {/* Logo */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl text-lg font-black text-white mx-auto"
            style={{ background: "linear-gradient(135deg, #b91c1c, #f97360)" }}>
            K
          </div>
          <h1 className="text-2xl font-black text-white">{title}</h1>
          <p className="text-sm text-white/45">{description}</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2">
          {["이메일 입력", "인증코드 확인"].map((label, i) => (
            <div key={i} className="flex-1 flex items-center gap-2">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 transition-all ${
                (i === 0 && step === "email") || (i === 1 && step === "otp")
                  ? "bg-red-600 text-white"
                  : i === 0 && step === "otp"
                  ? "bg-green-700 text-white"
                  : "bg-white/10 text-white/30"
              }`}>
                {i === 0 && step === "otp" ? "✓" : i + 1}
              </div>
              <span className={`text-xs ${
                (i === 0 && step === "email") || (i === 1 && step === "otp")
                  ? "text-white/70" : "text-white/25"
              }`}>{label}</span>
              {i === 0 && <div className="flex-1 h-px bg-white/10" />}
            </div>
          ))}
        </div>

        {/* Form */}
        <div className="glass rounded-2xl p-6 space-y-4">
          {step === "email" ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div className="info-cell">
                <label>이메일</label>
                <input
                  className="input"
                  type="email"
                  placeholder="초대된 이메일 주소 입력"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                />
                <p className="text-xs text-white/30 mt-1">관리자로부터 초대된 이메일만 사용 가능합니다.</p>
              </div>
              {error && <p className="text-xs text-red-400">{error}</p>}
              <button
                type="submit"
                disabled={loading || !email}
                className="w-full py-2.5 rounded-xl bg-red-700 hover:bg-red-600 disabled:opacity-40 text-white text-sm font-semibold transition"
              >
                {loading ? "전송 중..." : "인증코드 발송"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="info-cell">
                <label>인증코드</label>
                <input
                  className="input text-center text-xl tracking-[0.5em] font-mono"
                  type="text"
                  inputMode="numeric"
                  placeholder="000000"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  required
                  autoFocus
                />
                <p className="text-xs text-white/30 mt-1">
                  <span className="text-white/50">{email}</span>로 발송된 6자리 코드를 입력하세요.
                </p>
              </div>
              {error && <p className="text-xs text-red-400">{error}</p>}
              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full py-2.5 rounded-xl bg-red-700 hover:bg-red-600 disabled:opacity-40 text-white text-sm font-semibold transition"
              >
                {loading ? "확인 중..." : "로그인"}
              </button>
              <button
                type="button"
                onClick={() => { setStep("email"); setOtp(""); setError(""); }}
                className="w-full text-xs text-white/35 hover:text-white/60 transition"
              >
                ← 이메일 다시 입력
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-xs text-white/25">
          Keimyung University · Kepin Platform
        </p>
      </div>
    </div>
  );
}
