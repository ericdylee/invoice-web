# Task 009: 성능 최적화 및 UX 향상 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** OG 이미지 생성, loading.tsx DRY 처리, PDF API 캐시 헤더를 추가하여 성능과 공유 UX를 완성한다.

**Architecture:** Next.js `ImageResponse`로 견적서별 동적 OG 이미지를 생성한다. loading.tsx는 기존 InvoiceSkeleton 컴포넌트를 재사용하도록 단순화한다. PDF API route에 Cache-Control 헤더를 추가해 중복 생성을 방지한다.

**Tech Stack:** Next.js 15 App Router, `next/og` (ImageResponse), TailwindCSS v4, `@react-pdf/renderer`

---

## File Map

| 파일 | 작업 |
|------|------|
| `src/app/invoice/[id]/opengraph-image.tsx` | **신규** — 동적 OG 이미지 route |
| `src/app/invoice/[id]/loading.tsx` | **수정** — InvoiceSkeleton 재사용으로 단순화 |
| `src/app/api/generate-pdf/route.ts` | **수정** — Cache-Control 헤더 추가 |

---

### Task 1: loading.tsx DRY 처리

`loading.tsx`와 `InvoiceSkeleton.tsx`가 동일한 스켈레톤 UI를 각각 별도로 구현하고 있다. `loading.tsx`가 `InvoiceSkeleton`을 재사용하도록 교체한다.

**Files:**
- Modify: `src/app/invoice/[id]/loading.tsx`

- [ ] **Step 1: loading.tsx를 InvoiceSkeleton 래퍼로 교체**

`src/app/invoice/[id]/loading.tsx` 전체를 아래로 교체:

```tsx
import { InvoiceSkeleton } from '@/components/invoice/InvoiceSkeleton'

export default function InvoiceLoading() {
  return <InvoiceSkeleton />
}
```

- [ ] **Step 2: 빌드 확인**

```bash
npm run build
```

Expected: ✓ 빌드 성공 (에러 없음)

- [ ] **Step 3: 커밋**

```bash
git add src/app/invoice/[id]/loading.tsx
git commit -m "refactor: loading.tsx에서 InvoiceSkeleton 재사용"
```

---

### Task 2: PDF API route 캐시 헤더 추가

`/api/generate-pdf` POST 요청은 동일한 견적서 ID에 대해 동일한 PDF를 반복 생성한다. `Cache-Control` 헤더로 브라우저 캐싱을 유도한다.

**Files:**
- Modify: `src/app/api/generate-pdf/route.ts`

- [ ] **Step 1: route.ts 현재 Response 헤더 확인**

```bash
grep -n "Content-Type\|headers\|Response" src/app/api/generate-pdf/route.ts
```

- [ ] **Step 2: Cache-Control 헤더 추가**

기존 Response 반환 부분에서 헤더를 아래와 같이 확장한다 (기존 `Content-Type` 헤더가 있는 return 문 수정):

```typescript
return new Response(pdfBuffer, {
  headers: {
    'Content-Type': 'application/pdf',
    'Content-Disposition': `attachment; filename="invoice-${invoiceData.invoiceNumber}.pdf"`,
    'Cache-Control': 'private, max-age=300', // 5분간 브라우저 캐시
  },
})
```

> 참고: `private`으로 설정해 CDN이 아닌 브라우저만 캐싱하도록 제한한다.

- [ ] **Step 3: 빌드 확인**

```bash
npm run build
```

Expected: ✓ 빌드 성공

- [ ] **Step 4: 커밋**

```bash
git add src/app/api/generate-pdf/route.ts
git commit -m "perf: PDF API route에 Cache-Control 헤더 추가"
```

---

### Task 3: 동적 OG 이미지 생성

견적서 URL을 SNS/메신저로 공유할 때 카드 미리보기에 견적서 정보가 표시되도록 동적 OG 이미지를 생성한다.

**Files:**
- Create: `src/app/invoice/[id]/opengraph-image.tsx`

- [ ] **Step 1: opengraph-image.tsx 생성**

`src/app/invoice/[id]/opengraph-image.tsx`:

```tsx
import { ImageResponse } from 'next/og'
import { getOptimizedInvoice } from '@/lib/services/invoice.service'
import {
  isValidNotionPageId,
  normalizeNotionPageId,
} from '@/lib/utils/validation'
import { formatCurrency, formatDate } from '@/lib/format'

export const runtime = 'nodejs'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

interface OGImageProps {
  params: Promise<{ id: string }>
}

export default async function InvoiceOGImage({ params }: OGImageProps) {
  const { id } = await params

  // 유효하지 않은 ID → 기본 OG 이미지 반환
  if (!isValidNotionPageId(id)) {
    return defaultOGImage()
  }

  try {
    const invoice = await getOptimizedInvoice(normalizeNotionPageId(id))

    const statusLabel: Record<string, string> = {
      pending: '검토중',
      approved: '승인됨',
      rejected: '거절됨',
    }
    const statusColor: Record<string, string> = {
      pending: '#f59e0b',
      approved: '#10b981',
      rejected: '#ef4444',
    }

    return new ImageResponse(
      (
        <div
          style={{
            width: '1200px',
            height: '630px',
            display: 'flex',
            flexDirection: 'column',
            background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)',
            padding: '60px',
            fontFamily: 'sans-serif',
          }}
        >
          {/* 상단 브랜드 바 */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '48px',
            }}
          >
            <div
              style={{
                background: '#10b981',
                borderRadius: '12px',
                width: '48px',
                height: '48px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '16px',
              }}
            >
              <div
                style={{ color: 'white', fontSize: '24px', fontWeight: 'bold' }}
              >
                N
              </div>
            </div>
            <span
              style={{ color: '#6b7280', fontSize: '18px', fontWeight: '500' }}
            >
              견적서 조회 시스템
            </span>
          </div>

          {/* 메인 콘텐츠 */}
          <div style={{ display: 'flex', flex: 1, gap: '48px' }}>
            {/* 좌측: 견적서 정보 */}
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              {/* 상태 배지 */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  background: statusColor[invoice.status] + '20',
                  border: `1px solid ${statusColor[invoice.status]}40`,
                  borderRadius: '999px',
                  padding: '6px 16px',
                  marginBottom: '20px',
                  width: 'fit-content',
                }}
              >
                <div
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: statusColor[invoice.status],
                    marginRight: '8px',
                  }}
                />
                <span
                  style={{
                    color: statusColor[invoice.status],
                    fontSize: '14px',
                    fontWeight: '600',
                  }}
                >
                  {statusLabel[invoice.status] ?? invoice.status}
                </span>
              </div>

              {/* 견적서 번호 */}
              <div
                style={{
                  color: '#6b7280',
                  fontSize: '16px',
                  marginBottom: '8px',
                }}
              >
                견적서 번호
              </div>
              <div
                style={{
                  color: '#111827',
                  fontSize: '36px',
                  fontWeight: '700',
                  marginBottom: '24px',
                  letterSpacing: '-0.5px',
                }}
              >
                {invoice.invoiceNumber}
              </div>

              {/* 클라이언트명 */}
              <div
                style={{
                  color: '#6b7280',
                  fontSize: '16px',
                  marginBottom: '8px',
                }}
              >
                수신
              </div>
              <div
                style={{
                  color: '#111827',
                  fontSize: '28px',
                  fontWeight: '600',
                  marginBottom: '32px',
                }}
              >
                {invoice.clientName} 귀중
              </div>

              {/* 날짜 정보 */}
              <div style={{ display: 'flex', gap: '32px' }}>
                <div>
                  <div
                    style={{
                      color: '#9ca3af',
                      fontSize: '13px',
                      marginBottom: '4px',
                    }}
                  >
                    발행일
                  </div>
                  <div
                    style={{
                      color: '#374151',
                      fontSize: '15px',
                      fontWeight: '500',
                    }}
                  >
                    {formatDate(invoice.issueDate)}
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      color: '#9ca3af',
                      fontSize: '13px',
                      marginBottom: '4px',
                    }}
                  >
                    유효기간
                  </div>
                  <div
                    style={{
                      color: '#374151',
                      fontSize: '15px',
                      fontWeight: '500',
                    }}
                  >
                    {formatDate(invoice.validUntil)}
                  </div>
                </div>
              </div>
            </div>

            {/* 우측: 총액 카드 */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                background: 'white',
                borderRadius: '24px',
                border: '1px solid #d1fae5',
                padding: '40px 48px',
                minWidth: '320px',
                boxShadow: '0 4px 24px rgba(16,185,129,0.08)',
              }}
            >
              <div
                style={{
                  color: '#6b7280',
                  fontSize: '16px',
                  marginBottom: '12px',
                  fontWeight: '500',
                }}
              >
                총 견적 금액
              </div>
              <div
                style={{
                  color: '#10b981',
                  fontSize: '38px',
                  fontWeight: '800',
                  letterSpacing: '-1px',
                  marginBottom: '12px',
                }}
              >
                {formatCurrency(invoice.totalAmount)}
              </div>
              <div
                style={{
                  color: '#9ca3af',
                  fontSize: '13px',
                }}
              >
                항목 {invoice.items.length}개 · 부가세 별도
              </div>
            </div>
          </div>
        </div>
      ),
      { width: 1200, height: 630 }
    )
  } catch {
    return defaultOGImage()
  }
}

function defaultOGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            background: '#10b981',
            borderRadius: '20px',
            width: '80px',
            height: '80px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '28px',
          }}
        >
          <div
            style={{ color: 'white', fontSize: '40px', fontWeight: 'bold' }}
          >
            N
          </div>
        </div>
        <div
          style={{
            color: '#111827',
            fontSize: '48px',
            fontWeight: '700',
            marginBottom: '16px',
          }}
        >
          견적서 조회 시스템
        </div>
        <div style={{ color: '#6b7280', fontSize: '22px' }}>
          노션 기반 견적서 관리 시스템
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
```

- [ ] **Step 2: 빌드 확인**

```bash
npm run build
```

Expected: ✓ 빌드 성공. `Route (app)` 목록에 `/invoice/[id]/opengraph-image` 가 나타남.

- [ ] **Step 3: lint + format 확인**

```bash
npm run check-all
```

Expected: 에러 없음

- [ ] **Step 4: 커밋**

```bash
git add src/app/invoice/[id]/opengraph-image.tsx
git commit -m "feat: 견적서별 동적 OG 이미지 생성 추가"
```

---

### Task 4: 최종 검증

- [ ] **Step 1: 전체 빌드 + 검사 통과 확인**

```bash
npm run check-all && npm run build
```

Expected: 모든 검사 통과, 빌드 성공

- [ ] **Step 2: OG 이미지 엔드포인트 수동 확인**

개발 서버 시작 후 브라우저에서 아래 URL로 OG 이미지 확인:

```
http://localhost:3000/invoice/<실제_notion_page_id>/opengraph-image
```

기본 OG 이미지도 확인:
```
http://localhost:3000/invoice/invalid-id/opengraph-image
```

Expected: 각각 견적서 정보 카드 이미지 / 기본 브랜드 이미지 표시

- [ ] **Step 3: 최종 커밋 (필요시)**

이미 각 단계에서 커밋했으면 skip.
