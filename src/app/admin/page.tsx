/**
 * 관리자 대시보드 홈 페이지
 * Server Component
 */

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, Users, Clock, ArrowRight, BookOpen } from 'lucide-react'
import Link from 'next/link'

/**
 * 대시보드 기능 카드 데이터
 */
const featureCards = [
  {
    title: '견적서 관리',
    description: '발행한 모든 견적서를 확인하고 관리할 수 있습니다.',
    icon: FileText,
    href: '/admin/invoices',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  {
    title: '클라이언트 관리',
    description: '클라이언트 정보를 확인하고 관리할 수 있습니다.',
    icon: Users,
    href: '#',
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
  },
  {
    title: '최근 활동',
    description: '최근 견적서 발행 및 승인 현황을 확인할 수 있습니다.',
    icon: Clock,
    href: '#',
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-100 dark:bg-purple-900/30',
  },
]

/**
 * 관리자 대시보드 페이지
 */
export default function AdminPage() {
  return (
    <div className="space-y-8">
      {/* 페이지 헤더 */}
      <div className="border-b pb-5">
        <p className="text-muted-foreground mb-1 text-xs font-medium tracking-widest uppercase">
          Dashboard
        </p>
        <h1 className="text-2xl font-bold tracking-tight">관리자 대시보드</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          견적서 관리 시스템에 오신 것을 환영합니다
        </p>
      </div>

      {/* 주요 기능 카드 */}
      <div>
        <h2 className="text-muted-foreground mb-3 text-xs font-semibold tracking-wider uppercase">
          주요 기능
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {featureCards.map(card => {
            const Icon = card.icon
            return (
              <Card
                key={card.title}
                className="group overflow-hidden transition-all duration-200 hover:shadow-md"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className={`rounded-lg p-2 ${card.bgColor}`}>
                      <Icon className={`h-4 w-4 ${card.color}`} />
                    </div>
                  </div>
                  <CardTitle className="text-sm font-semibold">
                    {card.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {card.description}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="text-muted-foreground hover:text-foreground -ml-2 h-7 gap-1 px-2 text-xs"
                  >
                    <Link href={card.href}>
                      바로가기
                      <ArrowRight className="h-3 w-3 transition-transform duration-150 group-hover:translate-x-0.5" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* 시작하기 안내 */}
      <Card className="border-dashed">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold">
            <BookOpen className="text-muted-foreground h-4 w-4" />
            시작하기
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2.5">
          <div className="flex items-start gap-2.5">
            <span className="bg-primary text-primary-foreground mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold">
              1
            </span>
            <p className="text-muted-foreground text-sm">
              왼쪽 사이드바에서{' '}
              <Link
                href="/admin/invoices"
                className="text-foreground font-medium underline underline-offset-4"
              >
                견적서 목록
              </Link>
              을 클릭하여 모든 견적서를 확인하세요.
            </p>
          </div>
          <div className="flex items-start gap-2.5">
            <span className="bg-primary text-primary-foreground mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold">
              2
            </span>
            <p className="text-muted-foreground text-sm">
              견적서를 검색하고 필터링하여 원하는 정보를 빠르게 찾을 수
              있습니다.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
