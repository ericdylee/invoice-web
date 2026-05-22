import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { Invoice, InvoiceStatus } from '@/types/invoice'
import { formatCurrency, formatDate } from '@/lib/format'
import Link from 'next/link'
import { ExternalLink, ArrowUpDown } from 'lucide-react'
import { generateInvoiceUrl } from '@/lib/utils/link-generator'
import { LinkDisplay } from '@/components/admin/link-display'
import { CopyButton } from '@/components/admin/copy-button'
import { ShareButton } from '@/components/admin/share-button'

interface InvoiceTableProps {
  invoices: Invoice[]
  currentSort?: 'issue_date' | 'total_amount'
}

/**
 * 견적서 상태별 배지 설정
 * 각 상태에 맞는 색상과 스타일을 정의합니다.
 */
const statusConfig: Record<
  InvoiceStatus,
  {
    label: string
    variant: 'default' | 'secondary' | 'destructive'
    className: string
  }
> = {
  pending: {
    label: '대기',
    variant: 'secondary',
    className:
      'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800',
  },
  approved: {
    label: '승인',
    variant: 'default',
    className:
      'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800',
  },
  rejected: {
    label: '거절',
    variant: 'destructive',
    className: '',
  },
}

/**
 * 정렬 버튼 컴포넌트
 * 클릭 시 해당 필드로 정렬합니다.
 */
function SortButton({
  field,
  currentSort,
  children,
}: {
  field: 'issue_date' | 'total_amount'
  currentSort?: string
  children: React.ReactNode
}) {
  const isActive = currentSort === field

  return (
    <Link
      href={`?sort=${field}`}
      className={`hover:text-foreground flex items-center gap-1.5 transition-colors ${isActive ? 'text-foreground font-semibold' : ''}`}
    >
      {children}
      <ArrowUpDown
        className={`h-3.5 w-3.5 ${isActive ? 'text-primary' : 'text-muted-foreground/60'}`}
      />
    </Link>
  )
}

/**
 * 견적서 테이블 컴포넌트
 * shadcn/ui Table로 견적서 목록을 테이블 형태로 표시
 */
export function InvoiceTable({ invoices, currentSort }: InvoiceTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            <TableHead className="w-[140px] text-xs font-semibold tracking-wider uppercase">
              견적서 번호
            </TableHead>
            <TableHead className="text-xs font-semibold tracking-wider uppercase">
              클라이언트
            </TableHead>
            <TableHead className="w-[130px] text-xs font-semibold tracking-wider uppercase">
              <SortButton field="issue_date" currentSort={currentSort}>
                발행일
              </SortButton>
            </TableHead>
            <TableHead className="w-[130px] text-xs font-semibold tracking-wider uppercase">
              유효기간
            </TableHead>
            <TableHead className="w-[130px] text-right text-xs font-semibold tracking-wider uppercase">
              <SortButton field="total_amount" currentSort={currentSort}>
                총액
              </SortButton>
            </TableHead>
            <TableHead className="w-[90px] text-xs font-semibold tracking-wider uppercase">
              상태
            </TableHead>
            <TableHead className="w-[220px] text-xs font-semibold tracking-wider uppercase">
              링크
            </TableHead>
            <TableHead className="w-[80px] text-right text-xs font-semibold tracking-wider uppercase">
              작업
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice, index) => (
            <TableRow
              key={invoice.id}
              className={index % 2 === 1 ? 'bg-muted/10' : ''}
            >
              <TableCell className="font-mono text-sm font-medium">
                {invoice.invoiceNumber}
              </TableCell>
              <TableCell className="font-medium">
                {invoice.clientName}
              </TableCell>
              <TableCell className="text-muted-foreground text-sm tabular-nums">
                {formatDate(invoice.issueDate, 'short')}
              </TableCell>
              <TableCell className="text-muted-foreground text-sm tabular-nums">
                {formatDate(invoice.validUntil, 'short')}
              </TableCell>
              <TableCell className="text-right font-semibold tabular-nums">
                {formatCurrency(invoice.totalAmount)}
              </TableCell>
              <TableCell>
                <Badge
                  variant={statusConfig[invoice.status].variant}
                  className={`border text-xs ${statusConfig[invoice.status].className}`}
                >
                  {statusConfig[invoice.status].label}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <LinkDisplay url={generateInvoiceUrl(invoice.id)} />
                  <CopyButton text={generateInvoiceUrl(invoice.id)} />
                  <ShareButton
                    url={generateInvoiceUrl(invoice.id)}
                    title={invoice.invoiceNumber}
                    description={`${invoice.clientName}님의 견적서`}
                  />
                </div>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="h-7 gap-1 text-xs"
                >
                  <Link href={`/invoice/${invoice.id}`} target="_blank">
                    보기
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
