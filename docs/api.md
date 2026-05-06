# API Endpoints

| METHOD | PATH | 설명 | 인증 |
|--------|------|------|------|
| GET | /api/auth/callback | Google OAuth 코드를 세션 쿠키로 교환한다 | 불필요 |
| POST | /api/auth/signout | 현재 세션을 만료하고 로그아웃한다 | 필요 |
| GET | /api/tasks | 일감 목록을 조회한다 (쿼리: `assignee_id`, `status`) | 필요 |
| POST | /api/tasks | 새 일감을 생성한다 | 필요 |
| GET | /api/tasks/[id] | 일감 단건을 조회한다 | 필요 |
| PATCH | /api/tasks/[id] | 일감 필드(제목·담당자·상태)를 부분 수정한다 | 필요 |
| DELETE | /api/tasks/[id] | 일감을 삭제한다 | 필요 |
