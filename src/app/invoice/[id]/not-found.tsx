import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { FileX, MessageSquare } from 'lucide-react'
import Link from 'next/link'

export default function InvoiceNotFound() {
  return (
    <div className="bg-muted/20 flex min-h-screen flex-col">
      <main className="flex flex-1 items-center justify-center px-4 py-16">
        <div className="mx-auto max-w-sm text-center">
          {/* 오류 아이콘 */}
          <div className="mb-6 flex justify-center">
            <div className="bg-destructive/10 rounded-full p-6">
              <FileX className="text-destructive h-12 w-12" />
            </div>
          </div>

          {/* 제목 및 설명 */}
          <h1 className="text-foreground mb-3 text-xl font-bold">
            견적서를 찾을 수 없습니다
          </h1>
          <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
            요청하신 견적서가 존재하지 않거나 삭제되었을 수 있습니다.
          </p>

          {/* 확인 사항 카드 */}
          <div className="bg-card mb-8 rounded-lg border p-4 text-left">
            <h3 className="text-foreground mb-2.5 text-sm font-semibold">
              해결 방법
            </h3>
            <ul className="text-muted-foreground space-y-1.5 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5 font-bold">·</span>
                견적서 링크가 정확한지 다시 확인해 주세요
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5 font-bold">·</span>
                견적서를 발행한 담당자에게 올바른 링크를 요청하세요
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5 font-bold">·</span>
                링크가 만료되지 않았는지 확인해 주세요
              </li>
            </ul>
          </div>

          {/* 액션 버튼 */}
          <div className="flex flex-col gap-2">
            <Button asChild variant="outline" size="default">
              <Link href="/invoice/guide">
                <MessageSquare className="mr-2 h-4 w-4" />
                안내 페이지로 이동
              </Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
