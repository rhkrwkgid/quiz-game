# quiz-game
## 퀴즈 목록

| 경로 | 내용 |
| --- | --- |
| `index.html` | 농식품인재개발원 AI 교육 — NotebookLM 퀴즈 |
| `duksung/index.html` | 덕성여자대학교 — AI 시대 커리어 퀴즈 (10문항) |

`duksung/`는 순위표를 Supabase(`quiz_scores` 테이블)에 저장하며,
서버 연결이 안 되면 브라우저 localStorage 기록으로 자동 대체됩니다.
순위표 삭제·초기화는 관리자 비밀번호가 필요합니다.
