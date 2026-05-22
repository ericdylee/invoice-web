/**
 * 견적서 총액 요약 컴포넌트
 * 견적서의 총 금액을 강조하여 표시합니다.
 */

import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { formatCurrency } from '@/lib/format'
import type { Invoice } from '@/types/invoice'
import { Receipt } from 'lucide-react'
import { cn } from '@/lib/utils'

interface InvoiceSummaryProps {
  /** 견적서 데이터 (총액 사용) */
  invoice: Invoice
  /** 추가 CSS 클래스 */
  className?: string
}

/**
 * 총액 요약 컴포넌트
 * 견적서의 최종 총액을 크게 표시합니다.
 */
export function InvoiceSummary({ invoice, className }: InvoiceSummaryProps) {
  return (
    <Card
      className={cn(
        'overflow-hidden shadow-sm transition-shadow duration-200 hover:shadow-md',
        className
      )}
    >
      <CardContent className="p-0">
        {/* 소계 영역 */}
        <div className="space-y-3 px-6 pt-6 pb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground font-medium">공급가액</span>
            <span className="text-foreground font-medium tabular-nums">
              {formatCurrency(invoice.totalAmount)}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground font-medium">
              부가세 (VAT)
            </span>
            <span className="text-muted-foreground text-xs tabular-nums">
              별도 청구
            </span>
          </div>
        </div>

        <Separator />

        {/* 최종 합계 */}
        <div className="bg-primary/5 px-6 py-5">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2.5">
              <div className="bg-primary/15 rounded-md p-1.5">
                <Receipt className="text-primary h-4 w-4" />
              </div>
              <div>
                <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                  최종 견적 금액
                </p>
                <p className="text-muted-foreground text-xs">부가세 별도</p>
              </div>
            </div>

            {/* 총액 강조 표시 */}
            <div className="text-right">
              <p className="text-primary text-3xl font-bold tabular-nums sm:text-4xl">
                {formatCurrency(invoice.totalAmount)}
              </p>
              <p className="text-muted-foreground mt-0.5 text-xs">
                총 {invoice.items.length}개 항목
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
