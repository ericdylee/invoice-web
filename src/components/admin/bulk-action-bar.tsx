'use client'

import { Button } from '@/components/ui/button'
import { useClipboard } from '@/hooks/use-clipboard'
import { Copy, X } from 'lucide-react'

/**
 * 일괄 복사 대상 항목
 */
export interface BulkSelectedItem {
  /** 견적서 ID */
  id: string
  /** 견적서 번호 (예: INV-2025-001) */
  invoiceNumber: string
  /** 공개 견적서 URL */
  url: string
}

interface BulkActionBarProps {
  /** 현재 선택된 항목들 */
  selectedItems: BulkSelectedItem[]
  /** 선택 해제 콜백 */
  onClear: () => void
}

/**
 * 일괄 액션 바 컴포넌트 (Client Component)
 * 선택된 견적서 개수 표시 + 공유 링크 일괄 복사 + 선택 해제 제공
 */
export function BulkActionBar({ selectedItems, onClear }: BulkActionBarProps) {
  const { copy } = useClipboard()
  const count = selectedItems.length

  /**
   * 선택 항목을 `INV-번호 - URL` 줄 단위 문자열로 묶어 클립보드에 복사
   */
  const handleCopy = () => {
    const text = selectedItems
      .map(item => `${item.invoiceNumber} - ${item.url}`)
      .join('\n')

    copy(text, {
      success: `${count}개 링크가 복사되었습니다`,
      error: '링크 복사에 실패했습니다',
    })
  }

  return (
    <div className="bg-muted/60 flex items-center justify-between rounded-lg border px-4 py-2.5 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">
          <span className="text-primary font-semibold tabular-nums">
            {count}
          </span>
          개 선택됨
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="text-muted-foreground hover:text-foreground h-7 gap-1 px-2 text-xs"
        >
          <X className="h-3.5 w-3.5" />
          선택 해제
        </Button>
      </div>
      <Button
        size="sm"
        onClick={handleCopy}
        className="h-8 gap-1.5"
        aria-label={`선택한 ${count}개 견적서 링크 일괄 복사`}
      >
        <Copy className="h-3.5 w-3.5" />
        링크 일괄 복사
      </Button>
    </div>
  )
}
