/**
 * 견적서 헤더 컴포넌트
 * 견적서 번호, 발행일, 유효기간, 상태 배지를 표시합니다.
 */

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { formatDate, formatInvoiceStatus } from '@/lib/format'
import type { Invoice } from '@/types/invoice'
import { Calendar, Clock, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'

interface InvoiceHeaderProps {
  /** 견적서 데이터 */
  invoice: Invoice
  /** 추가 CSS 클래스 */
  className?: string
}

/**
 * 상태별 배지 스타일 설정
 * 각 상태에 맞는 색상과 variant를 반환합니다.
 */
function getStatusConfig(status: Invoice['status']): {
  variant: 'default' | 'destructive' | 'secondary'
  className: string
} {
  switch (status) {
    case 'approved':
      return {
        variant: 'default',
        className:
          'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800',
      }
    case 'rejected':
      return {
        variant: 'destructive',
        className: '',
      }
    case 'pending':
    default:
      return {
        variant: 'secondary',
        className:
          'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800',
      }
  }
}

/**
 * 견적서 헤더 컴포넌트
 * 견적서의 기본 정보와 상태를 표시합니다.
 */
export function InvoiceHeader({ invoice, className }: InvoiceHeaderProps) {
  const statusConfig = getStatusConfig(invoice.status)

  return (
    <Card
      className={cn(
        'overflow-hidden shadow-sm transition-shadow duration-200 hover:shadow-md',
        className
      )}
    >
      {/* 상단 컬러 액센트 바 */}
      <div className="bg-primary h-1 w-full" />

      <CardHeader className="pt-6 pb-4">
        {/* 견적서 번호 및 상태 배지 */}
        <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-start">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 rounded-lg p-2.5">
              <FileText className="text-primary h-5 w-5" />
            </div>
            <div>
              <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                견적서 번호
              </p>
              <h2 className="text-foreground text-xl font-bold tracking-tight sm:text-2xl">
                {invoice.invoiceNumber}
              </h2>
            </div>
          </div>
          <Badge
            variant={statusConfig.variant}
            className={cn(
              'shrink-0 border px-3 py-1 text-sm font-medium',
              statusConfig.className
            )}
          >
            {formatInvoiceStatus(invoice.status)}
          </Badge>
        </div>
      </CardHeader>

      <Separator />

      <CardContent className="pt-5 pb-6">
        {/* 날짜 정보 그리드 */}
        <div className="grid gap-5 sm:grid-cols-2">
          {/* 발행일 */}
          <div className="flex items-start gap-3">
            <div className="bg-muted mt-0.5 rounded-md p-1.5">
              <Calendar className="text-muted-foreground h-4 w-4" />
            </div>
            <div className="space-y-0.5">
              <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                발행일
              </p>
              <p className="text-foreground text-sm font-semibold">
                {formatDate(invoice.issueDate)}
              </p>
            </div>
          </div>

          {/* 유효기간 */}
          <div className="flex items-start gap-3">
            <div className="bg-muted mt-0.5 rounded-md p-1.5">
              <Clock className="text-muted-foreground h-4 w-4" />
            </div>
            <div className="space-y-0.5">
              <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                유효기간
              </p>
              <p className="text-foreground text-sm font-semibold">
                {formatDate(invoice.validUntil)}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
