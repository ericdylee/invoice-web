# 프로젝트 개발 규칙

## 프로젝트 개요

**노션 기반 견적서 관리 시스템** - 노션을 데이터베이스로 활용하여 견적서를 관리하고, 클라이언트가 웹에서 조회 및 PDF 다운로드. 관리자 대시보드 포함.

### 핵심 기술 스택

- **프레임워크**: Next.js 15.5.3 (App Router + Turbopack)
- **런타임**: React 19.1.0 + TypeScript 5
- **스타일링**: TailwindCSS v4 + shadcn/ui (new-york)
- **폼**: React Hook Form + Zod + Server Actions
- **외부 API**: @notionhq/client (Notion API v5 SDK)
- **인증**: jose (JWT) + 쿠키 기반 세션
- **PDF**: @react-pdf/renderer

---

## 실제 프로젝트 구조

```
src/
├── app/
│   ├── (auth)/
│   │   └── admin-login/         # 관리자 로그인 (공개)
│   │       ├── actions.ts       # 로그인 Server Action
│   │       └── page.tsx
│   ├── admin/                   # 관리자 대시보드 (JWT 인증 필수)
│   │   ├── invoices/
│   │   │   ├── error.tsx
│   │   │   ├── loading.tsx
│   │   │   └── page.tsx
│   │   ├── actions.ts           # 관리자 Server Actions
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── api/
│   │   └── generate-pdf/
│   │       └── route.ts         # PDF 생성 API (Rate Limited)
│   ├── invoice/
│   │   └── [id]/                # 공개 견적서 조회 페이지
│   │       ├── error.tsx
│   │       ├── loading.tsx
│   │       ├── not-found.tsx
│   │       └── page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   ├── not-found.tsx
│   └── page.tsx
├── components/
│   ├── admin/                   # 관리자 전용 컴포넌트
│   ├── invoice/                 # 견적서 조회 컴포넌트
│   ├── layout/                  # 공통 레이아웃
│   ├── pdf/                     # PDF 템플릿
│   │   └── InvoiceTemplate.tsx  # @react-pdf/renderer 컴포넌트
│   ├── providers/
│   └── ui/                      # shadcn/ui 컴포넌트
├── hooks/
│   └── use-clipboard.ts
├── lib/
│   ├── auth/
│   │   ├── password.ts          # 비밀번호 해싱
│   │   └── session.ts           # JWT 세션 생성/검증
│   ├── services/
│   │   └── invoice.service.ts   # Notion API 서비스 레이어 (메인 엔트리)
│   ├── utils/
│   │   ├── link-generator.ts    # 견적서 공유 링크 생성
│   │   └── notion-parser.ts     # Notion → Invoice 변환
│   ├── cache.ts                 # unstable_cache + Request Deduplication
│   ├── constants.ts             # 에러 메시지, PDF 설정 상수
│   ├── env.ts                   # 환경변수 Zod 검증
│   ├── format.ts                # 날짜/금액/파일명 포맷팅
│   ├── logger.ts                # 구조화 로거
│   ├── mock-data.ts             # 개발용 목 데이터
│   ├── notion.ts                # Notion 클라이언트 초기화
│   ├── rate-limit.ts            # IP 기반 Rate Limiter
│   └── utils.ts                 # cn() 헬퍼
├── middleware.ts                 # 인증 + Rate Limiting
└── types/
    ├── auth.ts
    ├── invoice.ts               # Invoice, InvoiceItem, InvoiceStatus
    ├── notion.ts                # NotionPage, 타입 가드
    └── pdf.ts
```

---

## 경로 별칭 사용 필수

```typescript
// ✅ 필수: 경로 별칭 사용
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { getOptimizedInvoice } from '@/lib/services/invoice.service'

// ❌ 금지: 상대 경로 사용
import { Button } from '../../../components/ui/button'
```

**정의된 별칭**: `@/components`, `@/lib`, `@/hooks`, `@/ui`(`@/components/ui`), `@/utils`(`@/lib/utils`)

---

## 파일 네이밍

- **컴포넌트 파일**: kebab-case (`invoice-table.tsx`) 또는 PascalCase (`InvoiceTable.tsx`)
- **컴포넌트명**: PascalCase (`InvoiceTable`)
- **폴더명**: kebab-case (`user-settings/`)
- **금지**: snake_case, PascalCase 폴더명

---

## Next.js 15.5.3 필수 규칙

### App Router 엄격 사용

- Pages Router, `getServerSideProps`, `getStaticProps` 절대 금지
- `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx` 규칙 준수

### async request APIs 필수

```typescript
// ✅ 필수: params, searchParams, cookies, headers는 반드시 await
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
}

// ❌ 금지: 동기식 접근
export default function Page({ params }: { params: { id: string } }) {
  const data = getData(params.id) // 런타임 에러
}
```

### Server Components 우선

```typescript
// ✅ 기본: Server Component
export default async function InvoicePage({ params }: InvoicePageProps) {
  const { id } = await params
  return (
    <Suspense fallback={<InvoiceSkeleton />}>
      <InvoiceContent id={id} />
    </Suspense>
  )
}

// ✅ 상호작용 필요 시에만 'use client'
'use client'
export function PDFDownloadButton({ invoice }: Props) { ... }
```

---

## 데이터 조회 패턴

### 서비스 레이어 필수 사용

- Notion API를 직접 호출하지 말고 **반드시 `@/lib/services/invoice.service.ts`** 를 통해 호출
- 페이지 컴포넌트에서 `getOptimizedInvoice(id)` 사용 (캐싱 + Deduplication 포함)

```typescript
// ✅ 필수: 서비스 레이어 사용
import { getOptimizedInvoice } from '@/lib/services/invoice.service'

const invoice = await getOptimizedInvoice(pageId)

// ❌ 금지: Notion 클라이언트 직접 호출
import { notion } from '@/lib/notion'
const page = await notion.pages.retrieve({ page_id: id })
```

### Notion API v5 패턴

- 목록 조회 시 `notion.databases.query` 대신 **`notion.dataSources.query`** 사용 필수
- `data_source_id`는 `getDataSourceId()` 함수로 조회 (자동 캐싱)

```typescript
// ✅ 필수: v5 방식 (dataSources.query)
const dataSourceId = await getDataSourceId()
const response = await notion.dataSources.query({
  data_source_id: dataSourceId,
  page_size: 10,
  sorts: [{ property: '발행일', direction: 'descending' }],
})

// ❌ 금지: v4 방식 (databases.query)
const response = await notion.databases.query({
  database_id: env.NOTION_DATABASE_ID,
})
```

### Notion 필드명 (한국어 사용)

Notion 데이터베이스의 실제 필드명은 한국어입니다. 필터/정렬 시 반드시 한국어 필드명 사용:

| 필드 | Notion 필드명 |
|------|-------------|
| 견적서 번호 | `견적서 번호` (Title) |
| 클라이언트명 | `클라이언트명` |
| 발행일 | `발행일` |
| 상태 | `상태` (Select: 대기/승인/거절) |
| 총 금액 | `총 금액` |
| 항목 | `항목` (Relation) |

### 타입 변환

- Notion 페이지 → `Invoice` 변환: `@/lib/utils/notion-parser.ts`의 `transformNotionToInvoice()` 사용
- 타입 가드: `isInvoicePage()`, `isItemPage()` in `@/types/notion.ts`

---

## 인증 시스템 (관리자)

### 미들웨어 인증 흐름

- `/admin/*` 경로: `admin_session` 쿠키의 JWT 검증 → 실패 시 `/admin-login` 리다이렉트
- JWT 시크릿: `process.env.SESSION_SECRET`
- JWT 라이브러리: `jose` (Web Crypto API 기반)

### 관리자 기능 수정 시 필수 파일

1. `src/app/(auth)/admin-login/actions.ts` - 로그인 Server Action
2. `src/lib/auth/session.ts` - JWT 세션 생성/검증
3. `src/lib/auth/password.ts` - 비밀번호 처리
4. `src/middleware.ts` - 인증 검사 경로 설정

### 인증 패턴

```typescript
// ✅ 필수: 관리자 페이지는 Server Component에서 세션 확인 불필요 (미들웨어가 처리)
// middleware.ts에서 /admin/* 경로 전체를 JWT 검증
export default async function AdminPage() {
  const invoices = await getInvoicesFromNotion()
  return <InvoiceTable invoices={invoices} />
}
```

---

## PDF 생성 패턴

### API Route 사용

- PDF 생성: `POST /api/generate-pdf` 호출
- PDF 템플릿: `@/components/pdf/InvoiceTemplate.tsx` (`@react-pdf/renderer` 사용)
- 클라이언트에서 `PDFDownloadButton` 컴포넌트 사용

```typescript
// ✅ PDF 생성 호출 패턴 (클라이언트 컴포넌트)
const response = await fetch('/api/generate-pdf', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ invoice }),
})
const blob = await response.blob()
```

### PDF 관련 파일 수정 시

1. `src/components/pdf/InvoiceTemplate.tsx` - PDF 레이아웃 변경
2. `src/app/api/generate-pdf/route.ts` - API 로직 변경
3. `src/lib/constants.ts` - `PDF_CONFIG` (파일명 프리픽스 등)
4. `public/fonts/` - 한국어 폰트 (NotoSansKR-Regular.ttf)

---

## Rate Limiting

- `/api/*` 경로: 분당 10회 요청 제한 (IP 기반)
- 초과 시 429 응답
- 설정 변경: `src/middleware.ts`의 `RATE_LIMIT_CONFIG`
- Rate Limiter 구현: `src/lib/rate-limit.ts`

---

## 환경 변수 관리

### lib/env.ts에서 Zod 검증 필수

```typescript
// ✅ 필수: 환경변수 추가 시 env.ts envSchema에 반드시 추가
export const env = envSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  NOTION_API_KEY: process.env.NOTION_API_KEY,
  NOTION_DATABASE_ID: process.env.NOTION_DATABASE_ID,
  SESSION_SECRET: process.env.SESSION_SECRET,
  ADMIN_PASSWORD_HASH: process.env.ADMIN_PASSWORD_HASH,
})
```

### 환경 변수 추가 시 필수 작업

1. `.env.local.example`에 변수명 추가
2. `src/lib/env.ts`의 `envSchema`에 검증 규칙 추가
3. `env` 객체에 `process.env.*` 매핑 추가

---

## 스타일링 규칙

### TailwindCSS v4 + shadcn/ui

```typescript
// ✅ 필수: cn() 함수로 클래스 조합
import { cn } from '@/lib/utils'
<div className={cn("base-classes", isActive && "active-classes", className)}>

// ✅ 필수: 시맨틱 색상 변수
<div className="bg-background text-foreground">
  <p className="text-muted-foreground">설명</p>
</div>

// ❌ 금지: 인라인 스타일
<div style={{ display: 'flex' }}>

// ❌ 금지: 하드코딩 색상
<div className="bg-white text-black">
```

### 새 shadcn/ui 컴포넌트 추가

```bash
npx shadcn@latest add [component-name]
# 자동으로 src/components/ui/ 에 추가됨
```

---

## 컴포넌트 작성 규칙

- Props 인터페이스 반드시 정의
- 파일 크기 300줄 이하
- 단일 책임 원칙 준수
- `'use client'` 없이 `useState`, `useEffect`, 이벤트 핸들러 사용 금지

---

## 다중 파일 조정 규칙

### 새 견적서 필드 추가 시

1. `src/types/invoice.ts` - `Invoice` 인터페이스 업데이트
2. `src/types/notion.ts` - `InvoicePageProperties` 업데이트
3. `src/lib/utils/notion-parser.ts` - `transformNotionToInvoice()` 변환 로직
4. 관련 컴포넌트 (`InvoiceHeader`, `InvoiceTable` 등)

### 새 관리자 기능 추가 시

1. `src/app/admin/actions.ts` - Server Action 추가
2. `src/components/admin/` - 관련 컴포넌트 추가
3. `src/lib/services/invoice.service.ts` - 서비스 함수 추가 (Notion 쿼리 필요 시)

### 새 API 라우트 추가 시

1. `src/app/api/[route]/route.ts` 생성
2. Rate Limiting은 `src/middleware.ts`가 자동 처리
3. `src/lib/constants.ts`에 에러 메시지 추가

### 새 환경 변수 추가 시

1. `.env.local.example` 업데이트
2. `src/lib/env.ts` envSchema 업데이트
3. Vercel 환경 변수에도 추가 필요 (배포 시)

---

## 에러 처리 규칙

- 모든 에러 메시지 문자열: `src/lib/constants.ts`의 `ERROR_MESSAGES` 사용
- Notion `object_not_found` 에러 → `notFound()` 호출
- 그 외 Notion API 에러 → `error.tsx`로 전달
- 서버 로그: `src/lib/logger.ts`의 `logger` 사용 (`console.log` 지양)

```typescript
// ✅ 필수 패턴
import { logger } from '@/lib/logger'
import { ERROR_MESSAGES } from '@/lib/constants'

logger.error('Notion API 오류', { pageId, errorCode })

if (errorObj.code === 'object_not_found') {
  throw new Error(ERROR_MESSAGES.INVOICE_NOT_FOUND)
}
```

---

## 금지사항

### 절대 금지

- Pages Router 사용
- `getServerSideProps` / `getStaticProps` 사용
- `params` / `searchParams` 동기 접근
- Notion 클라이언트 직접 호출 (서비스 레이어 우회)
- `notion.databases.query` 사용 (v4 방식, `dataSources.query` 사용)
- 인라인 스타일 (`style={{}}`)
- 하드코딩 색상 (`bg-white`, `text-black`)
- 클라이언트 컴포넌트에서 `process.env.*` 직접 접근
- `console.log` 사용 (logger 사용)

### 지양 사항

- `'use client'` 남용 (Server Component 우선)
- 커스텀 CSS 클래스 (Tailwind 우선)
- 300줄 초과 단일 파일

---

## 코드 품질 체크리스트

```bash
npm run check-all   # 타입 체크 + 린트 + 포맷 통합 검사
npm run build       # 빌드 성공 확인
```

---

## AI Agent 결정 트리

### 데이터 조회가 필요할 때

1. 단건 조회 → `getOptimizedInvoice(id)` (캐싱 포함)
2. 목록 조회 → `getInvoicesFromNotion(pageSize, cursor, sortBy)`
3. 검색 → `searchInvoices(filters, pageSize, cursor)`
4. 위 함수 없으면 `invoice.service.ts`에 새 함수 추가 후 사용

### 새 기능 구현 시

1. Server Component로 시작 가능? → YES: Server Component / NO: 'use client'
2. 폼 처리 필요? → React Hook Form + Zod + Server Actions
3. 스타일 필요? → shadcn/ui → Tailwind → cn()
4. 관리자 기능? → `/admin` 경로, 미들웨어 인증 자동 적용

### 파일 수정 시

1. 수정 전 반드시 파일 읽기
2. 기존 코드 패턴과 일치 유지
3. 타입 정의 확인 후 Props 인터페이스 유지
4. Import는 경로 별칭 사용

---

**📝 문서 버전**: v2.0
**📅 업데이트**: 2026-05-19
**🎯 목표**: 실제 구현된 코드베이스를 반영한 AI Agent 실행 규칙
