import { OtpLogin } from "@/components/otp-login";

export default function AdminLoginPage() {
  return (
    <OtpLogin
      role="admin"
      title="관리자 로그인"
      description="계명대학교 국제교류처 관리자 전용 포털입니다."
      accentColor="bg-red-600"
    />
  );
}
