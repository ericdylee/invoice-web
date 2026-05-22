/**
 * 견적서 클라이언트 정보 컴포넌트
 * 견적서를 받는 클라이언트의 정보를 표시합니다.
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import type { Invoice } from '@/types/invoice'
import { Building2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface InvoiceClientInfoProps {
  /** 견적서 데이터 (클라이언트명 사용) */
  invoice: Invoice
  /** 추가 CSS 클래스 */
  className?: string
}

/**
 * 클라이언트 정보 섹션 컴포넌트
 * 견적서를 받는 클라이언트의 기본 정보를 표시합니다.
 */
export function InvoiceClientInfo({
  invoice,
  className,
}: InvoiceClientInfoProps) {
  return (
    <Card
      className={cn(
        'shadow-sm transition-shadow duration-200 hover:shadow-md',
        className
      )}
    >
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2.5 text-base font-semibold">
          <div className="bg-primary/10 rounded-md p-1.5">
            <Building2 className="text-primary h-4 w-4" />
          </div>
          클라이언트 정보
        </CardTitle>
      </CardHeader>

      <Separator />

      <CardContent className="pt-5 pb-6">
        {/* 수신처 레이블 */}
        <div className="flex items-baseline gap-4">
          <span className="text-muted-foreground w-14 shrink-0 text-xs font-medium tracking-wider uppercase">
            수신처
          </span>
          <p className="text-foreground text-lg leading-snug font-bold">
            {invoice.clientName}
            <span className="text-muted-foreground ml-1 text-sm font-normal">
              귀중
            </span>
          </p>
        </div>

        {/* TODO: 추후 클라이언트 상세 정보 추가 가능 (주소, 담당자, 연락처 등) */}
      </CardContent>
    </Card>
  )
}
