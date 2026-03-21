export type WorkflowStatus =
  | "nomination_submitted"
  | "application_pending"
  | "under_review"
  | "accepted"
  | "dormitory_pending"
  | "course_registration"
  | "orientation"
  | "enrolled";

export const workflow = [
  { key: "nomination_submitted", title: "노미네이션 제출", owner: "파트너대학", detail: "학생 후보 등록과 초대 메일 발송" },
  { key: "application_pending", title: "온라인 신청", owner: "학생", detail: "여권 OCR 및 서류 업로드" },
  { key: "under_review", title: "서류 검토", owner: "KMU 관리자", detail: "보완 요청과 최종 심사" },
  { key: "accepted", title: "합격 처리", owner: "KMU 관리자", detail: "합격 메일과 입학통지서 업로드" },
  { key: "dormitory_pending", title: "기숙사비 납부", owner: "학생", detail: "증빙 업로드와 확인" },
  { key: "course_registration", title: "수강신청 안내", owner: "KMU 관리자", detail: "학사 일정과 신청 현황 관리" },
  { key: "orientation", title: "오리엔테이션", owner: "KMU 관리자", detail: "자료 공유와 공지 발송" },
  { key: "enrolled", title: "입학 완료", owner: "시스템", detail: "최종 상태 확정 및 아카이브" }
] as const;

export const landingStats = [
  { label: "협정 대학", value: "247+" },
  { label: "참여 국가", value: "83" },
  { label: "올해 노미네이션", value: "124" },
  { label: "지원 단계", value: "8-step" }
];

export const roleCards = [
  {
    title: "학생 포털",
    href: "/student/dashboard" as const,
    description: "신청서 작성, 서류 업로드, 단계별 상태 추적, 입학통지서 다운로드",
    bullets: ["AI 여권 OCR", "상태 추적", "문의 전송"]
  },
  {
    title: "파트너 포털",
    href: "/partner/dashboard" as const,
    description: "노미네이션 제출, 엑셀 일괄 등록, 학생별 진행 현황 확인",
    bullets: ["단건·일괄 등록", "후보자 목록", "진행률 모니터링"]
  },
  {
    title: "관리자 대시보드",
    href: "/admin/dashboard" as const,
    description: "학생 심사, 단계 관리, 이메일 발송, 파트너·오리엔테이션 운영",
    bullets: ["통계 보드", "상태 변경", "템플릿 메일"]
  }
];

export const partnerUniversities = [
  { name: "Thammasat University", country: "Thailand", nominations: 8, status: "active" },
  { name: "Fudan University", country: "China", nominations: 5, status: "active" },
  { name: "Ritsumeikan University", country: "Japan", nominations: 3, status: "review" },
  { name: "University of Auckland", country: "New Zealand", nominations: 2, status: "invited" }
];

export const studentApplications = [
  {
    id: "KMU-2026-0412",
    name: "Anna Lee",
    partner: "Thammasat University",
    country: "Thailand",
    status: "under_review" as WorkflowStatus,
    major: "Business Administration",
    intake: "2026 Fall",
    dormitory: "기숙사 신청",
  },
  {
    id: "KMU-2026-0413",
    name: "Haruto Sato",
    partner: "Ritsumeikan University",
    country: "Japan",
    status: "accepted" as WorkflowStatus,
    major: "Computer Engineering",
    intake: "2026 Fall",
    dormitory: "미신청",
  },
  {
    id: "KMU-2026-0414",
    name: "Liu Wen",
    partner: "Fudan University",
    country: "China",
    status: "application_pending" as WorkflowStatus,
    major: "Korean Language",
    intake: "2026 Fall",
    dormitory: "기숙사 신청",
  }
];

export const studentProfile = {
  applicationNo: "KMU-2026-0412",
  studentId: "EX-260178",
  nameKo: "안나 리",
  nameEn: "Anna Lee",
  nationality: "Thailand",
  email: "anna.lee@example.edu",
  phone: "+66 81 555 9090",
  passportNo: "M12930291",
  major: "Business Administration",
  dormitory: "신청",
  intake: "2026 Fall"
};

/* ── 이름 불일치 알림 목록 ────────────────────────────────────────── */
export type NameMismatchSeverity = "typo" | "major";

export type NameMismatchAlert = {
  studentId:      string;
  nameKo:         string;
  partner:        string;
  nominationName: string;
  passportName:   string;
  distance:       number;
  severity:       NameMismatchSeverity;
  detectedAt:     string;   // ISO date string
  status:         WorkflowStatus;
};

export const nameMismatchAlerts: NameMismatchAlert[] = [
  {
    studentId:      "KMU-2026-0412",
    nameKo:         "안나 리",
    partner:        "Thammasat University",
    nominationName: "ANNA LEE",
    passportName:   "ANNA LI",
    distance:       2,
    severity:       "typo",
    detectedAt:     "2026-03-21T09:14:00Z",
    status:         "under_review",
  },
  {
    studentId:      "KMU-2026-0413",
    nameKo:         "하루토 사토",
    partner:        "Ritsumeikan University",
    nominationName: "HARUTO SATO",
    passportName:   "HARUTO SATOH",
    distance:       1,
    severity:       "typo",
    detectedAt:     "2026-03-21T11:32:00Z",
    status:         "accepted",
  },
  {
    studentId:      "KMU-2026-0414",
    nameKo:         "리우 원",
    partner:        "Fudan University",
    nominationName: "LIU WEN",
    passportName:   "LIU WENG",
    distance:       1,
    severity:       "typo",
    detectedAt:     "2026-03-22T08:05:00Z",
    status:         "application_pending",
  },
];

export const emailTemplates = [
  { title: "노미네이션 초대 메일", audience: "학생", status: "활성" },
  { title: "서류 보완 요청", audience: "학생", status: "활성" },
  { title: "합격 안내 및 Acceptance Letter", audience: "학생", status: "활성" },
  { title: "수강신청 일정 안내", audience: "학생", status: "초안" }
];

export const orientationAssets = [
  { title: "2026 Fall Orientation Guide.pdf", updatedAt: "2026-06-21", type: "PDF" },
  { title: "Dormitory Check-in Guide.pptx", updatedAt: "2026-06-19", type: "PPTX" },
  { title: "Course Registration Timeline.xlsx", updatedAt: "2026-06-15", type: "XLSX" }
];

export const partnerInvites = [
  { school: "Mahidol University", manager: "Pim Chan", email: "pim@mahidol.ac.th", status: "활성" },
  { school: "Kansai University", manager: "Yuta Mori", email: "y.mori@kansai.ac.jp", status: "대기" },
  { school: "Tunghai University", manager: "Pei Lin", email: "pei.lin@thu.edu.tw", status: "비활성" }
];

/* ── 노미네이션 관리 데이터 ─────────────────────────────────────────── */
export type NominationStudentStatus = "confirmed" | "pending" | "rejected" | "withdrawn";
export type PartnerSubmissionStatus = "submitted" | "not_submitted" | "partial" | "closed";

export type NominationStudent = {
  id:               string;
  nameEn:           string;
  major:            string;
  nominationStatus: NominationStudentStatus;
  submittedAt:      string;
  appStatus?:       WorkflowStatus;
  hasNameMismatch?: boolean;
};

export type PartnerNomination = {
  partnerId:        number;
  university:       string;
  country:          string;
  contact:          string;
  email:            string;
  flag:             string;
  quota:            number;
  deadline:         string;   // ISO date
  submissionStatus: PartnerSubmissionStatus;
  students:         NominationStudent[];
};

export const partnerNominations: PartnerNomination[] = [
  {
    partnerId: 1, university: "Thammasat University", country: "Thailand", flag: "🇹🇭",
    contact: "Siriporn K.", email: "intl@tu.ac.th", quota: 10, deadline: "2026-04-30",
    submissionStatus: "submitted",
    students: [
      { id: "KMU-2026-0412", nameEn: "Anna Lee",      major: "Business Administration", nominationStatus: "confirmed", submittedAt: "2026-03-10T09:00:00Z", appStatus: "under_review",        hasNameMismatch: true  },
      { id: "KMU-2026-0415", nameEn: "Pim Wattana",   major: "Economics",               nominationStatus: "confirmed", submittedAt: "2026-03-10T09:05:00Z", appStatus: "application_pending", hasNameMismatch: false },
      { id: "KMU-2026-0416", nameEn: "Nong Chaiwat",  major: "Political Science",        nominationStatus: "confirmed", submittedAt: "2026-03-10T09:10:00Z", appStatus: "nomination_submitted",hasNameMismatch: false },
      { id: "KMU-2026-0417", nameEn: "Sira Khamkong", major: "International Relations",  nominationStatus: "pending",   submittedAt: "2026-03-15T14:00:00Z", appStatus: undefined,             hasNameMismatch: false },
    ],
  },
  {
    partnerId: 2, university: "Fudan University", country: "China", flag: "🇨🇳",
    contact: "Li Wei", email: "exchange@fudan.edu.cn", quota: 8, deadline: "2026-04-30",
    submissionStatus: "submitted",
    students: [
      { id: "KMU-2026-0414", nameEn: "Liu Wen",   major: "Korean Language",  nominationStatus: "confirmed", submittedAt: "2026-03-12T10:00:00Z", appStatus: "application_pending", hasNameMismatch: true  },
      { id: "KMU-2026-0418", nameEn: "Zhang Mei",  major: "Media Studies",    nominationStatus: "confirmed", submittedAt: "2026-03-12T10:05:00Z", appStatus: "nomination_submitted",hasNameMismatch: false },
      { id: "KMU-2026-0419", nameEn: "Chen Xiong", major: "Economics",        nominationStatus: "rejected",  submittedAt: "2026-03-12T10:10:00Z", appStatus: undefined,             hasNameMismatch: false },
    ],
  },
  {
    partnerId: 3, university: "Ritsumeikan University", country: "Japan", flag: "🇯🇵",
    contact: "Yuki Tanaka", email: "oia@ritsumei.ac.jp", quota: 6, deadline: "2026-04-30",
    submissionStatus: "submitted",
    students: [
      { id: "KMU-2026-0413", nameEn: "Haruto Sato",  major: "Computer Engineering", nominationStatus: "confirmed", submittedAt: "2026-03-08T08:00:00Z", appStatus: "accepted",            hasNameMismatch: true  },
      { id: "KMU-2026-0420", nameEn: "Yui Nakamura", major: "Architecture",          nominationStatus: "confirmed", submittedAt: "2026-03-08T08:05:00Z", appStatus: "under_review",        hasNameMismatch: false },
    ],
  },
  {
    partnerId: 4, university: "University of Auckland", country: "New Zealand", flag: "🇳🇿",
    contact: "Emma Brown", email: "exchange@auckland.ac.nz", quota: 4, deadline: "2026-04-30",
    submissionStatus: "submitted",
    students: [
      { id: "KMU-2026-0421", nameEn: "Emma Park",   major: "Marine Science", nominationStatus: "confirmed", submittedAt: "2026-03-14T11:00:00Z", appStatus: "application_pending", hasNameMismatch: false },
      { id: "KMU-2026-0422", nameEn: "James Wilson", major: "Engineering",    nominationStatus: "pending",   submittedAt: "2026-03-18T15:00:00Z", appStatus: undefined,             hasNameMismatch: false },
    ],
  },
  {
    partnerId: 7, university: "Tunghai University", country: "Taiwan", flag: "🇹🇼",
    contact: "Pei Lin", email: "pei.lin@thu.edu.tw", quota: 6, deadline: "2026-04-30",
    submissionStatus: "partial",
    students: [
      { id: "KMU-2026-0423", nameEn: "Lin Wei-Chen", major: "Fine Arts",  nominationStatus: "confirmed", submittedAt: "2026-03-16T09:00:00Z", appStatus: "nomination_submitted", hasNameMismatch: false },
    ],
  },
  {
    partnerId: 8, university: "Chiang Mai University", country: "Thailand", flag: "🇹🇭",
    contact: "Nong P.", email: "intl@cmu.ac.th", quota: 8, deadline: "2026-04-30",
    submissionStatus: "submitted",
    students: [
      { id: "KMU-2026-0424", nameEn: "Kanya Sriporn",  major: "Tourism Management", nominationStatus: "confirmed", submittedAt: "2026-03-11T07:00:00Z", appStatus: "under_review",        hasNameMismatch: false },
      { id: "KMU-2026-0425", nameEn: "Tanawat Boonma", major: "Business",            nominationStatus: "confirmed", submittedAt: "2026-03-11T07:05:00Z", appStatus: "application_pending", hasNameMismatch: false },
    ],
  },
  {
    partnerId: 9, university: "Peking University", country: "China", flag: "🇨🇳",
    contact: "Zhang Min", email: "oia@pku.edu.cn", quota: 5, deadline: "2026-04-30",
    submissionStatus: "not_submitted",
    students: [],
  },
  {
    partnerId: 10, university: "Waseda University", country: "Japan", flag: "🇯🇵",
    contact: "Kenji Ito", email: "exchange@waseda.jp", quota: 8, deadline: "2026-04-30",
    submissionStatus: "not_submitted",
    students: [],
  },
  {
    partnerId: 11, university: "National Taiwan University", country: "Taiwan", flag: "🇹🇼",
    contact: "Chen Yu", email: "oia@ntu.edu.tw", quota: 4, deadline: "2026-04-30",
    submissionStatus: "not_submitted",
    students: [],
  },
  {
    partnerId: 5, university: "Mahidol University", country: "Thailand", flag: "🇹🇭",
    contact: "Pim Chan", email: "pim@mahidol.ac.th", quota: 4, deadline: "2026-04-30",
    submissionStatus: "not_submitted",
    students: [],
  },
  {
    partnerId: 6, university: "Kansai University", country: "Japan", flag: "🇯🇵",
    contact: "Yuta Mori", email: "y.mori@kansai.ac.jp", quota: 4, deadline: "2026-04-30",
    submissionStatus: "not_submitted",
    students: [],
  },
  {
    partnerId: 12, university: "Hanyang University", country: "Korea", flag: "🇰🇷",
    contact: "Park Ji-su", email: "global@hanyang.ac.kr", quota: 4, deadline: "2026-04-30",
    submissionStatus: "not_submitted",
    students: [],
  },
];

export const nominationSummary = {
  totalPartners:    12,
  submittedCount:   6,
  totalNominations: 16,
  confirmedCount:   13,
  pendingCount:     2,
  rejectedCount:    1,
  deadline:         "2026-04-30",
  mismatchCount:    3,
};

export function statusLabel(status: WorkflowStatus) {
  return workflow.find((step) => step.key === status)?.title ?? status;
}
