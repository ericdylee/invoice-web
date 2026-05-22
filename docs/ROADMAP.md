# 노션 기반 견적서 관리 시스템 MVP 개발 로드맵

노션을 데이터베이스로 활용하여 견적서를 관리하고, 클라이언트가 웹에서 조회 및 PDF 다운로드할 수 있는 경량 견적서 발급 시스템

## 개요

노션 기반 견적서 관리 시스템 MVP는 견적서를 발행하는 프리랜서/소규모 기업과 견적서를 받는 클라이언트를 위한 간단하고 직관적인 견적서 공유 솔루션으로 다음 기능을 제공합니다:

- **노션 데이터베이스 연동**: Notion API를 통해 견적서 데이터를 실시간으로 조회하여 별도 DB 구축 없이 견적서 관리
- **고유 URL 기반 견적서 조회**: 노션 페이지 ID 기반 고유 URL로 클라이언트가 견적서를 손쉽게 확인
- **PDF 다운로드**: 견적서를 원클릭으로 PDF 파일로 변환하여 다운로드
- **관리자 패널**: 비밀번호 인증 기반 어드민 패널에서 발행한 견적서 목록 조회, 검색, 필터링, 공유 링크 관리

## 개발 워크플로우

1. **작업 계획**

- 기존 코드베이스를 학습하고 현재 상태를 파악
- 새로운 작업을 포함하도록 `ROADMAP.md` 업데이트
- 우선순위 작업은 마지막 완료된 작업 다음에 삽입

2. **작업 생성**

- 기존 코드베이스를 학습하고 현재 상태를 파악
- `/tasks` 디렉토리에 새 작업 파일 생성
- 명명 형식: `XXX-description.md` (예: `001-setup.md`)
- 고수준 명세서, 관련 파일, 수락 기준, 구현 단계 포함
- **API/비즈니스 로직 작업 시 "## 테스트 체크리스트" 섹션 필수 포함 (Playwright MCP 테스트 시나리오 작성)**
- 예시를 위해 `/tasks` 디렉토리의 마지막 완료된 작업 참조. 예를 들어, 현재 작업이 `012`라면 `011`과 `010`을 예시로 참조.
- 이러한 예시들은 완료된 작업이므로 내용이 완료된 작업의 최종 상태를 반영함 (체크된 박스와 변경 사항 요약). 새 작업의 경우, 문서에는 빈 박스와 변경 사항 요약이 없어야 함. 초기 상태의 샘플로 `000-sample.md` 참조.

3. **작업 구현**

- 작업 파일의 명세서를 따름
- 기능과 기능성 구현
- **API 연동 및 비즈니스 로직 구현 시 Playwright MCP로 테스트 수행 필수**
- 각 단계 후 작업 파일 내 단계 진행 상황 업데이트
- 구현 완료 후 Playwright MCP를 사용한 E2E 테스트 실행
- 테스트 통과 확인 후 다음 단계로 진행
- 각 단계 완료 후 중단하고 추가 지시를 기다림

4. **로드맵 업데이트**

- 로드맵에서 완료된 작업을 ✅로 표시

## 개발 단계

### Phase 1: 애플리케이션 골격 구축 ✅

- **Task 001: 프로젝트 구조 및 라우팅 설정** ✅
  - ✅ Next.js 15 App Router 기반 전체 라우트 구조 생성 (`/invoice/[id]`)
  - ✅ 견적서 조회 페이지의 빈 껍데기 파일 생성 (`src/app/invoice/[id]/page.tsx`)
  - ✅ 루트 레이아웃 및 글로벌 메타데이터 설정 (`src/app/layout.tsx`)
  - ✅ 404 not-found 페이지 골격 생성 (`src/app/not-found.tsx`, `src/app/invoice/[id]/not-found.tsx`)
  - ✅ 루트 페이지(`/`) 안내용 placeholder 구성
  - ✅ 환경 변수 템플릿 정리 (`.env.local.example`에 `NOTION_API_KEY`, `NOTION_DATABASE_ID` 명시)

- **Task 002: 타입 정의 및 인터페이스 설계** ✅
  - ✅ 견적서 도메인 TypeScript 인터페이스 정의 (`src/types/invoice.ts`)
  - ✅ 견적 항목(Item) 타입 정의 및 Invoice와의 관계 모델링
  - ✅ 노션 데이터베이스 스키마 매핑 타입 정의 (Notion property → 도메인 모델 변환 타입)
  - ✅ API 응답 및 에러 타입 정의 (`InvoiceFetchResult`, `InvoiceError` 등)
  - ✅ PDF 렌더링용 props 타입 정의
  - ✅ 공통 유틸리티 타입 정의 (`Status`, `Currency` 등)

### Phase 2: UI/UX 완성 (더미 데이터 활용) ✅

- **Task 003: 공통 컴포넌트 라이브러리 구현** ✅
  - ✅ shadcn/ui 기반 공통 컴포넌트 설치 및 설정 (Button, Card, Separator, Skeleton, Alert)
  - ✅ 견적서 헤더 컴포넌트 구현 (`InvoiceHeader`: 견적서 번호, 발행일, 유효기간)
  - ✅ 견적서 항목 테이블 컴포넌트 구현 (`InvoiceItemsTable`: description, quantity, unit_price, amount)
  - ✅ 견적서 합계 영역 컴포넌트 구현 (`InvoiceSummary`: 총액, 통화 포맷팅)
  - ✅ PDF 다운로드 버튼 컴포넌트 구현 (`DownloadPdfButton`: Lucide 아이콘 포함)
  - ✅ 더미 데이터 fixture 생성 (`src/lib/mocks/invoice.ts`)

- **Task 004: 견적서 조회 페이지 UI 완성** ✅
  - ✅ 더미 데이터를 사용한 견적서 조회 페이지 UI 구현
  - ✅ 발행자 정보 / 클라이언트 정보 영역 레이아웃 구현
  - ✅ 견적 항목 리스트 렌더링 및 금액 포맷팅 (Intl.NumberFormat)
  - ✅ 견적서 상태 배지(Badge) 표시 (작성중/발행/만료)
  - ✅ 로딩 상태(Skeleton)와 빈 상태 UI 처리
  - ✅ 인쇄 친화적 스타일링 적용 (`print:` Tailwind variant)

- **Task 005: 404 에러 페이지 및 반응형 디자인** ✅
  - ✅ 견적서 not-found 페이지 UI 구현 (안내 메시지 + 발행자 문의 가이드)
  - ✅ 글로벌 not-found 페이지 구현
  - ✅ 모바일/태블릿/데스크톱 반응형 레이아웃 적용 (Tailwind breakpoint: sm/md/lg)
  - ✅ 견적서 항목 테이블의 모바일 카드형 뷰 대응
  - ✅ 접근성 기준 적용 (시맨틱 HTML, aria-label, 키보드 포커스 스타일)
  - ✅ Zinc Dark 테마 적용 (어두운 배경 + 흰색 텍스트, 항상 다크 모드 고정)

### Phase 3: 핵심 기능 구현 ✅

- **Task 006: Notion API 클라이언트 및 데이터 페칭 구현** ✅
  - ✅ `@notionhq/client` 설치 및 Notion 클라이언트 싱글톤 구현 (`src/lib/notion/client.ts`)
  - ✅ Notion Database 페이지 조회 함수 구현 (`getInvoiceById(pageId)`)
  - ✅ Notion Relation을 통한 견적 항목 조회 함수 구현 (`getInvoiceItems(invoiceId)`)
  - ✅ Notion property → 도메인 모델 변환 매퍼 구현 (`src/lib/notion/mappers.ts`)
  - ✅ 견적서 조회 페이지의 더미 데이터를 실제 Notion 호출로 교체 (React Server Component)
  - ✅ 페이지 단위 캐싱 전략 적용 (`revalidate`, `cache: 'force-cache'`)
  - ✅ Playwright MCP를 활용한 실제 노션 데이터 fetching 통합 테스트 수행

- **Task 007: 견적서 유효성 검증 및 에러 처리** ✅
  - ✅ 잘못된 노션 페이지 ID 형식 검증 (UUID 형식 체크)
  - ✅ 존재하지 않는 견적서 접근 시 `notFound()` 호출로 404 라우팅
  - ✅ Notion API 호출 실패 시 에러 바운더리 처리 (`error.tsx`)
  - ✅ 견적서 데이터베이스 ID 불일치(다른 DB의 페이지 접근) 검증
  - ✅ Playwright MCP로 잘못된 URL 접근, API 실패 케이스 E2E 테스트

- **Task 008: PDF 생성 및 다운로드 기능 구현** ✅
  - ✅ `@react-pdf/renderer` 설치 및 PDF 문서 컴포넌트 구현 (`src/components/pdf/InvoicePdf.tsx`)
  - ✅ 견적서 PDF 레이아웃 디자인 (헤더, 항목 테이블, 합계, 푸터)
  - ✅ 한글 폰트 설정 (Noto Sans KR 등록)
  - ✅ PDF 다운로드 API Route 구현 (`src/app/api/generate-pdf/route.ts`)
  - ✅ 다운로드 버튼 클릭 시 PDF 파일 다운로드 트리거

- **Task 008-1: 핵심 기능 통합 테스트** ✅
  - ✅ Playwright MCP를 사용한 전체 사용자 플로우 테스트 (URL 접근 → 조회 → PDF 다운로드)
  - ✅ 404 / 에러 페이지 표시 검증
  - ✅ 모바일/태블릿/데스크톱 뷰포트별 반응형 동작 검증

### Phase 4: 고급 기능 및 최적화 ✅

- **Task 009: 성능 최적화 및 사용자 경험 향상** ✅
  - ✅ Notion API 응답 캐싱 최적화 (Next.js `unstable_cache` 또는 `revalidateTag` 활용)
  - ✅ 견적서 페이지 메타데이터 동적 생성 (`generateMetadata`)
  - ✅ Open Graph 이미지 생성으로 링크 미리보기 개선 (`opengraph-image.tsx`)
  - ✅ 로딩 UI 개선 (Suspense 경계 및 스트리밍 렌더링)
  - ✅ 이미지/폰트 최적화 (next/font, next/image)

- **Task 010: 배포 및 모니터링 구축** ✅
  - ✅ Vercel 프로젝트 연결 및 환경 변수 설정 (`NOTION_API_KEY`, `NOTION_DATABASE_ID`)
  - ✅ `vercel.json` 배포 설정 점검 (함수 리전, 타임아웃)
  - ✅ 프리뷰/프로덕션 환경 분리 및 도메인 연결
  - ✅ 운영 가이드 문서화 (`docs/admin-guide.md`, `docs/deployment-checklist.md` 최신화)
  - ✅ 프로덕션 환경에서의 최종 스모크 테스트 수행

### Phase 5: 관리자 패널 (MVP 범위 외 확장 기능) ✅

> PRD의 MVP 범위에는 별도의 관리자 페이지가 포함되지 않았으나, 견적서 운영 편의를 위해 추가로 구현된 확장 기능입니다.

- **Task 011: 관리자 인증 및 세션 관리** ✅
  - ✅ 비밀번호 기반 관리자 로그인 페이지 구현 (`src/app/(auth)/admin-login/page.tsx`)
  - ✅ 로그인 Server Action 및 비밀번호 검증 로직 (`src/lib/auth/password.ts`)
  - ✅ JWT(jose) 기반 세션 발급/검증 구현 (`src/lib/auth/session.ts`)
  - ✅ Next.js Middleware로 `/admin` 경로 인증 가드 및 API Rate Limiting 적용 (`src/middleware.ts`)
  - ✅ 로그아웃 기능 구현 (`src/components/admin/logout-button.tsx`)

- **Task 012: 관리자 대시보드 및 견적서 목록** ✅
  - ✅ 관리자 대시보드 홈 페이지 구현 (`src/app/admin/page.tsx`)
  - ✅ 관리자 레이아웃 및 헤더/네비게이션 구현 (`src/app/admin/layout.tsx`, `admin-header.tsx`, `admin-nav.tsx`)
  - ✅ 견적서 목록 페이지 및 테이블 구현 (`src/app/admin/invoices/page.tsx`, `invoice-table.tsx`)
  - ✅ 견적서 검색/필터/페이지네이션 기능 구현 (`search-bar.tsx`, `filter-panel.tsx`, `pagination.tsx`)
  - ✅ 견적서 공유 링크 표시/복사 기능 구현 (`share-button.tsx`, `copy-button.tsx`, `link-display.tsx`)
  - ✅ 견적서 서비스 레이어 구현 (`src/lib/services/invoice.service.ts`)
  - ✅ 어드민 패널 모바일 반응형 레이아웃 적용 (`hidden md:block` 기반 사이드/헤더 대응)
  - ✅ Playwright MCP로 관리자 로그인 → 목록 조회 → 검색 플로우 E2E 검증

## MVP 체크리스트

### 핵심 기능

- [x] **F001**: Notion API를 통한 견적서 데이터 조회
- [x] **F002**: 고유 URL로 특정 견적서 내용 표시
- [x] **F003**: 견적서를 PDF 파일로 변환 및 다운로드

### 필수 지원 기능

- [x] **F010**: 노션 데이터베이스 ID 기반 고유 URL 생성
- [x] **F011**: 존재하지 않는 견적서 접근 시 404 에러 처리
- [x] **F012**: 반응형 레이아웃 (모바일/태블릿/데스크톱)

### 품질 검증

- [x] 모든 페이지가 정상적으로 로드됨
- [x] Notion 데이터가 실시간으로 조회됨
- [x] PDF 다운로드가 정상 작동함
- [x] 에러 처리가 사용자 친화적임
- [x] 반응형 디자인이 모든 기기에서 작동함
- [x] Zinc Dark 테마가 전체 페이지에 적용됨
- [x] 어드민 패널 로그인 및 견적서 목록 조회 정상 작동

## 기술적 의존성

```
Task 001 → Task 002 → Task 003 → Task 004 → Task 005
                              ↓               ↓
                          Task 006 ──→ Task 007 → Task 008 → Task 008-1
                                                              ↓
                                                     Task 009 → Task 010
                                                              ↓
                                                     Task 011 → Task 012  (관리자 패널)
```

## 위험 요소 및 대응 방안

1. **Notion API Rate Limit**: 캐싱 전략(60초 unstable_cache) + Request Deduplication으로 대응
2. **PDF 한글 렌더링**: Noto Sans KR 폰트 임베딩으로 해결
3. **대용량 견적서 처리**: 페이지네이션 + 병렬 항목 조회(Promise.allSettled)로 대응
4. **API 키 보안**: 서버 사이드 전용 처리, 환경 변수 관리

## 성공 지표

- 페이지 로드 시간 < 3초
- PDF 생성 시간 < 5초
- 모바일 반응형 100% 지원 (390px / 768px / 1280px)
- 에러 처리 커버리지 100% (잘못된 ID, 존재하지 않는 페이지, API 실패)

---

**📊 진행 상황**: 전체 프로젝트 완료 🎊 (Phase 1-5 전체 완성 ✅ — MVP 핵심 기능 + 관리자 패널 확장)
**📅 최종 업데이트**: 2026-05-22
