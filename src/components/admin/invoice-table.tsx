'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
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
import { Checkbox } from '@/components/ui/checkbox'
import type { Invoice, InvoiceStatus } from '@/types/invoice'
import { formatCurrency, formatDate } from '@/lib/format'
import Link from 'next/link'
import { ExternalLink, ArrowUpDown } from 'lucide-react'
import { LinkDisplay } from '@/components/admin/link-display'
import { CopyButton } from '@/components/admin/copy-button'
import { ShareButton } from '@/components/admin/share-button'
import { BulkActionBar } from '@/components/admin/bulk-action-bar'

interface InvoiceTableProps {
  invoices: Invoice[]
  /** 견적서 ID -> 공개 URL 매핑 (서버에서 사전 생성, 클라이언트 env 의존 제거) */
  urls: Record<string, string>
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
 * 정렬 헤더 컴포넌트
 * 클릭 시 해당 필드로 정렬하되, 기존 URL 파라미터(query·status·날짜 등)를
 * 보존하고 정렬 변경 시 page·cursor만 초기화한다.
 */
function SortHeader({
  field,
  label,
  currentSort,
}: {
  field: 'issue_date' | 'total_amount'
  label: string
  currentSort?: string
}) {
  const searchParams = useSearchParams()
  const isActive = currentSort === field

  // 기존 파라미터 병합 → sort 갱신 → page·cursor 삭제 (커서 무효화 → 1페이지 재조회)
  const params = new URLSearchParams(searchParams)
  params.set('sort', field)
  params.delete('page')
  params.delete('cursor')

  return (
    <Link
      href={`?${params.toString()}`}
      aria-label={`${label} 기준 정렬`}
      className={`hover:text-foreground inline-flex items-center gap-1.5 transition-colors ${isActive ? 'text-foreground font-semibold' : ''}`}
    >
      {label}
      <ArrowUpDown
        className={`h-3.5 w-3.5 ${isActive ? 'text-primary' : 'text-muted-foreground/60'}`}
      />
    </Link>
  )
}

/**
 * 견적서 테이블 컴포넌트 (Client Component)
 * shadcn/ui Table로 견적서 목록을 표시하고, 다중 선택·일괄 복사·정렬을 제공
 */
export function InvoiceTable({
  invoices,
  urls,
  currentSort,
}: InvoiceTableProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const allSelected = invoices.length > 0 && selected.size === invoices.length
  const someSelected = selected.size > 0 && selected.size < invoices.length

  function toggleAll(checked: boolean) {
    setSelected(
      checked ? new Set(invoices.map(invoice => invoice.id)) : new Set()
    )
  }

  function toggleOne(id: string, checked: boolean) {
    setSelected(prev => {
      const next = new Set(prev)
      if (checked) {
        next.add(id)
      } else {
        next.delete(id)
      }
      return next
    })
  }

  function clearSelection() {
    setSelected(new Set())
  }

  const selectedItems = invoices
    .filter(invoice => selected.has(invoice.id))
    .map(invoice => ({
      id: invoice.id,
      invoiceNumber: invoice.invoiceNumber,
      url: urls[invoice.id],
    }))

  return (
    <div className="space-y-3">
      {selected.size > 0 && (
        <BulkActionBar selectedItems={selectedItems} onClear={clearSelection} />
      )}
      <div className="overflow-hidden rounded-lg border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead className="w-[44px]">
                <Checkbox
                  checked={
                    allSelected ? true : someSelected ? 'indeterminate' : false
                  }
                  onCheckedChange={checked => toggleAll(checked === true)}
                  aria-label="현재 페이지 전체 선택"
                />
              </TableHead>
              <TableHead className="w-[140px] text-xs font-semibold tracking-wider uppercase">
                견적서 번호
              </TableHead>
              <TableHead className="text-xs font-semibold tracking-wider uppercase">
                클라이언트
              </TableHead>
              <TableHead className="w-[130px] text-xs font-semibold tracking-wider uppercase">
                <SortHeader
                  field="issue_date"
                  label="발행일"
                  currentSort={currentSort}
                />
              </TableHead>
              <TableHead className="w-[130px] text-xs font-semibold tracking-wider uppercase">
                유효기간
              </TableHead>
              <TableHead className="w-[130px] text-right text-xs font-semibold tracking-wider uppercase">
                <SortHeader
                  field="total_amount"
                  label="총액"
                  currentSort={currentSort}
                />
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
            {invoices.map((invoice, index) => {
              const isRowSelected = selected.has(invoice.id)
              const url = urls[invoice.id]
              return (
                <TableRow
                  key={invoice.id}
                  className={
                    isRowSelected
                      ? 'bg-primary/5 hover:bg-primary/10'
                      : index % 2 === 1
                        ? 'bg-muted/10'
                        : ''
                  }
                >
                  <TableCell>
                    <Checkbox
                      checked={isRowSelected}
                      onCheckedChange={checked =>
                        toggleOne(invoice.id, checked === true)
                      }
                      aria-label={`${invoice.invoiceNumber} 선택`}
                    />
                  </TableCell>
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
                      <LinkDisplay url={url} />
                      <CopyButton text={url} />
                      <ShareButton
                        url={url}
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
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
