/**
 * 견적서 항목 테이블 컴포넌트
 * 견적 항목들을 테이블 형식으로 표시합니다.
 */

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { formatCurrency } from '@/lib/format'
import type { InvoiceItem } from '@/types/invoice'
import { List } from 'lucide-react'
import { cn } from '@/lib/utils'

interface InvoiceTableProps {
  /** 견적 항목 배열 */
  items: InvoiceItem[]
  /** 추가 CSS 클래스 */
  className?: string
}

/**
 * 견적 항목 테이블 컴포넌트
 * 항목명, 수량, 단가, 금액을 테이블 형식으로 표시합니다.
 */
export function InvoiceTable({ items, className }: InvoiceTableProps) {
  return (
    <Card
      className={cn(
        'overflow-hidden shadow-sm transition-shadow duration-200 hover:shadow-md',
        className
      )}
    >
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2.5 text-base font-semibold">
            <div className="bg-primary/10 rounded-md p-1.5">
              <List className="text-primary h-4 w-4" />
            </div>
            견적 항목
          </CardTitle>
          {/* 항목 수 뱃지 */}
          <span className="bg-muted text-muted-foreground rounded-full px-2.5 py-0.5 text-xs font-medium">
            {items.length}건
          </span>
        </div>
      </CardHeader>

      <Separator />

      <CardContent className="p-0">
        {/* 데스크톱 테이블 뷰 */}
        <div className="hidden overflow-x-auto md:block">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="w-[50%] px-6 py-3 text-xs font-semibold tracking-wider uppercase">
                  항목명
                </TableHead>
                <TableHead className="px-6 py-3 text-center text-xs font-semibold tracking-wider uppercase">
                  수량
                </TableHead>
                <TableHead className="px-6 py-3 text-right text-xs font-semibold tracking-wider uppercase">
                  단가
                </TableHead>
                <TableHead className="px-6 py-3 text-right text-xs font-semibold tracking-wider uppercase">
                  금액
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item, index) => (
                <TableRow
                  key={item.id}
                  className={cn(
                    'transition-colors',
                    index % 2 === 1 && 'bg-muted/20'
                  )}
                >
                  <TableCell className="px-6 py-4 font-medium">
                    {item.description}
                  </TableCell>
                  <TableCell className="text-muted-foreground px-6 py-4 text-center tabular-nums">
                    {item.quantity}
                  </TableCell>
                  <TableCell className="text-muted-foreground px-6 py-4 text-right tabular-nums">
                    {formatCurrency(item.unitPrice)}
                  </TableCell>
                  <TableCell className="text-foreground px-6 py-4 text-right font-semibold tabular-nums">
                    {formatCurrency(item.amount)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* 모바일 카드 뷰 */}
        <div className="divide-y md:hidden">
          {items.map((item, index) => (
            <div
              key={item.id}
              className={cn('space-y-3 p-5', index % 2 === 1 && 'bg-muted/20')}
            >
              {/* 항목 번호 및 이름 */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2.5">
                  <span className="bg-primary/10 text-primary mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold">
                    {index + 1}
                  </span>
                  <span className="text-foreground leading-snug font-semibold">
                    {item.description}
                  </span>
                </div>
              </div>

              {/* 수량 및 단가 */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-muted/50 space-y-0.5 rounded-md p-2.5">
                  <span className="text-muted-foreground block text-xs font-medium tracking-wider uppercase">
                    수량
                  </span>
                  <span className="text-foreground font-semibold tabular-nums">
                    {item.quantity}
                  </span>
                </div>
                <div className="bg-muted/50 space-y-0.5 rounded-md p-2.5">
                  <span className="text-muted-foreground block text-xs font-medium tracking-wider uppercase">
                    단가
                  </span>
                  <span className="text-foreground font-semibold tabular-nums">
                    {formatCurrency(item.unitPrice)}
                  </span>
                </div>
              </div>

              {/* 소계 금액 */}
              <div className="flex items-center justify-between border-t pt-2.5">
                <span className="text-muted-foreground text-sm font-medium">
                  소계
                </span>
                <span className="text-foreground text-base font-bold tabular-nums">
                  {formatCurrency(item.amount)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
