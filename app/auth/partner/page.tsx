import { OtpLogin } from "@/components/otp-login";

export default function PartnerLoginPage() {
  return (
    <OtpLogin
      role="partner"
      title="파트너대학 포털 로그인"
      description="관리자로부터 초대된 파트너대학 담당자만 접근 가능합니다."
      accentColor="bg-green-600"
    />
  );
}
