# Zinc Dark Theme Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 현재 teal 라이트 테마를 Zinc Dark(검정 배경 + 흰색 텍스트)로 교체하고 항상 다크 모드로 고정한다.

**Architecture:** `globals.css`의 CSS 변수를 Zinc Dark 팔레트로 전면 교체하고, `layout.tsx`에서 ThemeProvider를 제거한 뒤 `<html className="dark">`로 고정한다. ThemeToggle과 theme-provider 파일은 삭제한다.

**Tech Stack:** Next.js 15.5.3 App Router, TailwindCSS v4, shadcn/ui, oklch 색상

---

### Task 1: globals.css — Zinc Dark 색상 변수 교체

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: globals.css 전체를 아래 내용으로 교체**

```css
@import 'tailwindcss';
@import 'tw-animate-css';

@custom-variant dark (&:is(.dark *));

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-noto-sans-kr), system-ui, sans-serif;
  --font-mono: var(--font-geist-mono), 'IBM Plex Mono', monospace;
  --color-sidebar-ring: var(--sidebar-ring);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar: var(--sidebar);
  --color-chart-5: var(--chart-5);
  --color-chart-4: var(--chart-4);
  --color-chart-3: var(--chart-3);
  --color-chart-2: var(--chart-2);
  --color-chart-1: var(--chart-1);
  --color-ring: var(--ring);
  --color-input: var(--input);
  --color-border: var(--border);
  --color-destructive: var(--destructive);
  --color-accent-foreground: var(--accent-foreground);
  --color-accent: var(--accent);
  --color-muted-foreground: var(--muted-foreground);
  --color-muted: var(--muted);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-secondary: var(--secondary);
  --color-primary-foreground: var(--primary-foreground);
  --color-primary: var(--primary);
  --color-popover-foreground: var(--popover-foreground);
  --color-popover: var(--popover);
  --color-card-foreground: var(--card-foreground);
  --color-card: var(--card);
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
  --radius: 0.5rem;
  --color-destructive-foreground: var(--destructive-foreground);
}

:root {
  --radius: 0.5rem;
  --background: oklch(0.141 0.005 285.82);
  --foreground: oklch(0.985 0 0);
  --card: oklch(0.21 0.006 285.89);
  --card-foreground: oklch(0.985 0 0);
  --popover: oklch(0.21 0.006 285.89);
  --popover-foreground: oklch(0.985 0 0);
  --primary: oklch(0.985 0 0);
  --primary-foreground: oklch(0.21 0.006 285.89);
  --secondary: oklch(0.274 0.006 286.03);
  --secondary-foreground: oklch(0.985 0 0);
  --muted: oklch(0.21 0.006 285.89);
  --muted-foreground: oklch(0.552 0.016 285.94);
  --accent: oklch(0.274 0.006 286.03);
  --accent-foreground: oklch(0.985 0 0);
  --destructive: oklch(0.704 0.191 22.18);
  --destructive-foreground: oklch(0.985 0 0);
  --border: oklch(0.274 0.006 286.03);
  --input: oklch(0.274 0.006 286.03);
  --ring: oklch(0.552 0.016 285.94);
  --chart-1: oklch(0.488 0.243 264.38);
  --chart-2: oklch(0.696 0.17 162.48);
  --chart-3: oklch(0.769 0.188 70.08);
  --chart-4: oklch(0.627 0.265 303.9);
  --chart-5: oklch(0.645 0.246 16.44);
  --sidebar: oklch(0.21 0.006 285.89);
  --sidebar-foreground: oklch(0.985 0 0);
  --sidebar-primary: oklch(0.985 0 0);
  --sidebar-primary-foreground: oklch(0.21 0.006 285.89);
  --sidebar-accent: oklch(0.274 0.006 286.03);
  --sidebar-accent-foreground: oklch(0.985 0 0);
  --sidebar-border: oklch(0.274 0.006 286.03);
  --sidebar-ring: oklch(0.552 0.016 285.94);
}

.dark {
  --background: oklch(0.141 0.005 285.82);
  --foreground: oklch(0.985 0 0);
  --card: oklch(0.21 0.006 285.89);
  --card-foreground: oklch(0.985 0 0);
  --popover: oklch(0.21 0.006 285.89);
  --popover-foreground: oklch(0.985 0 0);
  --primary: oklch(0.985 0 0);
  --primary-foreground: oklch(0.21 0.006 285.89);
  --secondary: oklch(0.274 0.006 286.03);
  --secondary-foreground: oklch(0.985 0 0);
  --muted: oklch(0.21 0.006 285.89);
  --muted-foreground: oklch(0.552 0.016 285.94);
  --accent: oklch(0.274 0.006 286.03);
  --accent-foreground: oklch(0.985 0 0);
  --destructive: oklch(0.704 0.191 22.18);
  --destructive-foreground: oklch(0.985 0 0);
  --border: oklch(0.274 0.006 286.03);
  --input: oklch(0.274 0.006 286.03);
  --ring: oklch(0.552 0.016 285.94);
  --chart-1: oklch(0.488 0.243 264.38);
  --chart-2: oklch(0.696 0.17 162.48);
  --chart-3: oklch(0.769 0.188 70.08);
  --chart-4: oklch(0.627 0.265 303.9);
  --chart-5: oklch(0.645 0.246 16.44);
  --sidebar: oklch(0.21 0.006 285.89);
  --sidebar-foreground: oklch(0.985 0 0);
  --sidebar-primary: oklch(0.985 0 0);
  --sidebar-primary-foreground: oklch(0.21 0.006 285.89);
  --sidebar-accent: oklch(0.274 0.006 286.03);
  --sidebar-accent-foreground: oklch(0.985 0 0);
  --sidebar-border: oklch(0.274 0.006 286.03);
  --sidebar-ring: oklch(0.552 0.016 285.94);
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

- [ ] **Step 2: 빌드 오류 없는지 확인**

```bash
npm run build 2>&1 | tail -20
```

Expected: `✓ Compiled` 또는 오류 없음

---

### Task 2: layout.tsx — ThemeProvider 제거, dark 클래스 고정

**Files:**
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: layout.tsx를 아래 내용으로 교체**

```tsx
import type { Metadata } from 'next'
import { Geist_Mono, Noto_Sans_KR } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'

const notoSansKR = Noto_Sans_KR({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-noto-sans-kr',
  preload: true,
  fallback: ['system-ui', 'sans-serif'],
  weight: ['400', '500', '700'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: '견적서 조회 시스템',
  description:
    '노션 기반 견적서 관리 시스템 - 웹에서 견적서를 확인하고 PDF로 다운로드하세요',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="ko"
      className={`dark ${notoSansKR.variable} ${geistMono.variable}`}
    >
      <body className="font-sans antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  )
}
```

- [ ] **Step 2: 빌드 확인**

```bash
npm run build 2>&1 | tail -20
```

Expected: 오류 없음

---

### Task 3: admin-header.tsx — ThemeToggle 제거

**Files:**
- Modify: `src/components/admin/admin-header.tsx`

- [ ] **Step 1: admin-header.tsx를 아래 내용으로 교체**

```tsx
import { LogoutButton } from './logout-button'
import { FileText } from 'lucide-react'

export function AdminHeader() {
  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/80 sticky top-0 z-50 border-b backdrop-blur">
      <div className="flex h-14 items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-lg shadow-sm">
            <FileText className="text-primary-foreground h-4 w-4" />
          </div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-semibold tracking-tight">
              견적서 관리
            </h1>
            <span className="bg-secondary text-secondary-foreground rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase">
              Admin
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <LogoutButton />
        </div>
      </div>
    </header>
  )
}
```

- [ ] **Step 2: 빌드 확인**

```bash
npm run build 2>&1 | tail -20
```

Expected: 오류 없음

---

### Task 4: 미사용 파일 삭제

**Files:**
- Delete: `src/components/providers/theme-provider.tsx`
- Delete: `src/components/theme-toggle.tsx`

- [ ] **Step 1: 두 파일이 더 이상 import되지 않는지 확인**

```bash
grep -r "theme-provider\|ThemeProvider\|theme-toggle\|ThemeToggle" src/ --include="*.tsx" --include="*.ts"
```

Expected: 결과 없음 (아무 파일도 import하지 않음)

- [ ] **Step 2: 파일 삭제**

```bash
rm src/components/providers/theme-provider.tsx
rm src/components/theme-toggle.tsx
```

- [ ] **Step 3: 최종 빌드 확인**

```bash
npm run build 2>&1 | tail -30
```

Expected: `✓ Compiled successfully` — 오류 없음

---

### Task 5: 커밋

- [ ] **Step 1: 변경사항 스테이징 및 커밋**

```bash
git add src/app/globals.css src/app/layout.tsx src/components/admin/admin-header.tsx
git rm src/components/providers/theme-provider.tsx src/components/theme-toggle.tsx
git commit -m "$(cat <<'EOF'
feat: Zinc Dark 테마 적용 및 다크 모드 고정

- globals.css: Zinc Dark 팔레트로 CSS 변수 전면 교체, 폰트를 Noto Sans KR로 정리
- layout.tsx: ThemeProvider 제거, html에 dark 클래스 고정
- admin-header.tsx: ThemeToggle 및 Separator 제거
- theme-provider.tsx, theme-toggle.tsx 삭제

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```
