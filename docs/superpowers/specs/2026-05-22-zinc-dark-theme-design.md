# Zinc Dark Theme 리디자인 스펙

**작성일:** 2026-05-22  
**결정 사항:** C 옵션 (Zinc Dark) 선택, 항상 다크 모드 고정

---

## 목표

현재 teal 계열 라이트 테마를 검정 배경 + 흰색 텍스트의 Zinc Dark 테마로 교체한다.  
ThemeProvider와 ThemeToggle을 제거하고 항상 다크 모드로 고정한다.

---

## 색상 팔레트 (Zinc Dark)

| 역할 | 값 | 용도 |
|---|---|---|
| background | `oklch(0.141 0.005 285.82)` (~#111113) | 페이지 배경 |
| card / surface | `oklch(0.21 0.006 285.89)` (~#18181b) | 카드, 헤더, 행 배경 |
| border | `oklch(0.274 0.006 286.03)` (~#27272a) | 구분선, 테두리 |
| muted | `oklch(0.21 0.006 285.89)` | 비활성 배경 |
| foreground | `oklch(0.985 0 0)` (~#fafafa) | 본문 텍스트 |
| muted-foreground | `oklch(0.552 0.016 285.94)` (~#71717a) | 보조 텍스트 |
| primary (버튼) | `oklch(0.985 0 0)` (near white) | 주요 액션 버튼 배경 |
| primary-foreground | `oklch(0.21 0.006 285.89)` | 버튼 위 텍스트 (검정) |
| secondary | `oklch(0.274 0.006 286.03)` | 보조 버튼/배지 |
| secondary-foreground | `oklch(0.985 0 0)` | 보조 버튼 텍스트 |
| accent | `oklch(0.274 0.006 286.03)` | hover 하이라이트 |
| destructive | `oklch(0.704 0.191 22.18)` | 삭제/오류 액션 |
| ring | `oklch(0.552 0.016 285.94)` | focus 링 |

---

## 변경 파일 목록

### 1. `src/app/globals.css`
- `:root` CSS 변수 전체를 Zinc Dark 값으로 교체 (라이트 모드 제거)
- `.dark` 클래스 블록도 동일 값으로 맞춤 (html.dark 고정 대응)
- `--font-sans`를 `var(--font-noto-sans-kr), system-ui, sans-serif`로 교체 (현재 serif 폰트 제거)
- radius를 `0.5rem`으로 약간 키워 현대적 느낌 강화

### 2. `src/app/layout.tsx`
- `ThemeProvider` import 및 래퍼 제거
- `<html>` 태그에 `className="dark"` 고정 추가
- `Toaster` 유지 (알림은 계속 필요)
- `geistMono` 폰트 변수 유지

### 3. `src/components/admin/admin-header.tsx`
- `ThemeToggle` 컴포넌트 import 및 렌더링 제거
- `Separator` (ThemeToggle 옆 구분선) 제거
- 나머지 레이아웃 유지

### 4. `src/components/providers/theme-provider.tsx`
- 파일 삭제 (더 이상 사용하지 않음)

### 5. `src/components/theme-toggle.tsx`
- 파일 삭제 (더 이상 사용하지 않음)

---

## 에러 처리 / 경계 조건

- PDF 생성 컴포넌트(`InvoiceTemplate.tsx`)는 별도 흰 배경 유지 — PDF는 인쇄물이므로 다크 테마 적용 제외
- `not-found.tsx`, `error.tsx` 등 전체 페이지 컴포넌트도 동일 Zinc Dark 팔레트 자동 적용 (globals.css 변수 사용 중이므로 별도 수정 불필요)

---

## 범위 외 (이번 작업에서 제외)

- 개별 컴포넌트 레이아웃 구조 변경
- 새로운 컴포넌트 추가
- PDF 인쇄 스타일 변경
