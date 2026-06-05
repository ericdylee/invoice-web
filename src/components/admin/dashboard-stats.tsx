/**
 * 관리자 대시보드 통계 카드 (Server Component)
 * 총 건수·총 금액·상태별 분포·최근 발행 건을 카드 형태로 표시
 */

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { FileText, Wallet, Clock, EyeOff } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/format'
import type { InvoiceStats } from '@/lib/services/invoice.service'
import type { InvoiceStatus } from '@/types/invoice'

/**
 * 상태별 표시 메타데이터 (라벨 + 진행바/배지 색상)
 */
const statusMeta: Record<
  InvoiceStatus,
  { label: string; barClass: string; badgeClass: string }
> = {
  pending: {
    label: '대기',
    barClass: '[&>div]:bg-amber-500',
    badgeClass:
      'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800',
  },
  approved: {
    label: '승인',
    barClass: '[&>div]:bg-emerald-500',
    badgeClass:
      'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800',
  },
  rejected: {
    label: '거절',
    barClass: '[&>div]:bg-rose-500',
    badgeClass:
      'bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800',
  },
}

const STATUS_ORDER: InvoiceStatus[] = ['pending', 'approved', 'rejected']

/**
 * 요약 지표 카드 (단일 수치)
 */
function SummaryCard({
  icon: Icon,
  label,
  value,
  color,
  bgColor,
}: {
  icon: typeof FileText
  label: string
  value: string
  color: string
  bgColor: string
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 py-4">
        <div className={`rounded-lg p-2.5 ${bgColor}`}>
          <Icon className={`h-5 w-5 ${color}`} />
        </div>
        <div className="min-w-0">
          <p className="text-muted-foreground text-xs font-medium">{label}</p>
          <p className="truncate text-lg font-bold tracking-tight tabular-nums">
            {value}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export function DashboardStats({ stats }: { stats: InvoiceStats }) {
  return (
    <div className="space-y-4">
      {/* 요약 지표 카드 */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          icon={FileText}
          label="총 견적서"
          value={`${stats.total}건`}
          color="text-primary"
          bgColor="bg-primary/10"
        />
        <SummaryCard
          icon={Wallet}
          label="총 견적 금액"
          value={formatCurrency(stats.totalAmount)}
          color="text-blue-600 dark:text-blue-400"
          bgColor="bg-blue-100 dark:bg-blue-900/30"
        />
        <SummaryCard
          icon={Clock}
          label="대기 중"
          value={`${stats.byStatus.pending.count}건`}
          color="text-amber-600 dark:text-amber-400"
          bgColor="bg-amber-100 dark:bg-amber-900/30"
        />
        <SummaryCard
          icon={EyeOff}
          label="미열람"
          value={`${stats.unviewed}건`}
          color="text-rose-600 dark:text-rose-400"
          bgColor="bg-rose-100 dark:bg-rose-900/30"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* 상태별 분포 */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">상태별 분포</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {STATUS_ORDER.map(status => {
              const { count, ratio } = stats.byStatus[status]
              const percent = Math.round(ratio * 100)
              return (
                <div key={status} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">
                      {statusMeta[status].label}
                    </span>
                    <span className="text-muted-foreground tabular-nums">
                      {count}건 ({percent}%)
                    </span>
                  </div>
                  <Progress
                    value={percent}
                    className={`h-2 ${statusMeta[status].barClass}`}
                    aria-label={`${statusMeta[status].label} ${percent}%`}
                  />
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* 최근 발행 건 */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">최근 발행</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.recent.length === 0 ? (
              <p className="text-muted-foreground py-6 text-center text-sm">
                발행된 견적서가 없습니다
              </p>
            ) : (
              <ul className="divide-border divide-y">
                {stats.recent.map(invoice => (
                  <li
                    key={invoice.id}
                    className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {invoice.clientName}
                      </p>
                      <p className="text-muted-foreground font-mono text-xs">
                        {invoice.invoiceNumber} ·{' '}
                        {formatDate(invoice.issueDate, 'short')}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <span className="text-sm font-semibold tabular-nums">
                        {formatCurrency(invoice.totalAmount)}
                      </span>
                      <Badge
                        variant="outline"
                        className={`border text-[10px] ${statusMeta[invoice.status].badgeClass}`}
                      >
                        {statusMeta[invoice.status].label}
                      </Badge>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
