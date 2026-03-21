# Kepin

계명대학교 초청교환학생 접수 플랫폼 프론트엔드 데모입니다.

## 포함 범위

- `/` 랜딩 페이지
- `/auth/student`, `/auth/partner`, `/admin/login`
- `/student/*` 학생 포털
- `/partner/*` 파트너대학 포털
- `/admin/*` 관리자 운영 화면

## 반영 기준

- `kepin_landing.html`의 랜딩 방향과 분위기
- `Kepin_기획서.docx`의 역할, 사이트맵, 8단계 워크플로, 신청 필드

## 실행

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:3000`을 열면 됩니다.

## 메모

- 현재는 목 데이터 기반 UI 데모입니다.
- 실제 서비스 연결 시 Supabase Auth, PostgreSQL, Storage, OCR 파이프라인을 연결하면 됩니다.
