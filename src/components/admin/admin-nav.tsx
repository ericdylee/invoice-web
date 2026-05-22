/**
 * 관리자 네비게이션 사이드바
 * Client Component (활성 링크 하이라이팅)
 */

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Home, FileText } from 'lucide-react'

/**
 * 네비게이션 항목 정의
 */
const navItems = [
  {
    href: '/admin',
    label: '대시보드',
    icon: Home,
    description: '전체 현황 보기',
  },
  {
    href: '/admin/invoices',
    label: '견적서 목록',
    icon: FileText,
    description: '모든 견적서 관리',
  },
]

/**
 * 관리자 네비게이션 사이드바
 */
export function AdminNav() {
  const pathname = usePathname()

  return (
    <nav className="bg-muted/5 min-h-[calc(100vh-3.5rem)] w-56 shrink-0 border-r">
      {/* 네비게이션 섹션 레이블 */}
      <div className="px-4 pt-5 pb-2">
        <p className="text-muted-foreground text-[10px] font-semibold tracking-widest uppercase">
          메뉴
        </p>
      </div>

      <ul className="space-y-0.5 px-3 pb-4">
        {navItems.map(item => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  'group flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-all duration-150',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-foreground/70 hover:bg-muted hover:text-foreground'
                )}
              >
                {/* 아이콘 래퍼 */}
                <div
                  className={cn(
                    'flex h-5 w-5 items-center justify-center transition-colors',
                    isActive
                      ? 'text-primary-foreground'
                      : 'text-muted-foreground group-hover:text-foreground'
                  )}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <span>{item.label}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
