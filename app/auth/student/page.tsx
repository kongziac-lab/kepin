import { OtpLogin } from "@/components/otp-login";

export const dynamic = "force-dynamic";

export default function StudentLoginPage() {
  return (
    <OtpLogin
      role="student"
      title="학생 포털 로그인"
      description="파트너대학을 통해 노미네이션된 학생만 접근 가능합니다."
      accentColor="bg-blue-600"
    />
  );
}
