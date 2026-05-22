import Link from 'next/link'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { FileQuestion, Home, ArrowLeft } from 'lucide-react'

/**
 * 전역 404 Not Found 페이지
 * Next.js App Router에서 notFound() 함수 호출 시 또는
 * 존재하지 않는 경로 접근 시 자동으로 렌더링됩니다.
 * 서버 컴포넌트로 동작합니다.
 */
export default function NotFound() {
  return (
    <div className="bg-muted/20 flex min-h-screen flex-col">
      <main className="flex flex-1 items-center justify-center px-4 py-16">
        <div className="mx-auto max-w-md text-center">
          {/* 404 아이콘 */}
          <div className="mb-6 flex justify-center">
            <div className="bg-muted rounded-full p-6">
              <FileQuestion className="text-muted-foreground h-12 w-12" />
            </div>
          </div>

          {/* 404 숫자 */}
          <p className="text-primary/30 mb-2 text-8xl font-black tabular-nums sm:text-9xl">
            404
          </p>

          {/* 제목 및 설명 */}
          <h1 className="text-foreground mb-3 text-xl font-bold">
            페이지를 찾을 수 없습니다
          </h1>
          <p className="text-muted-foreground mb-8 text-sm leading-relaxed">
            요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
            <br />
            URL 주소를 다시 확인해 주세요.
          </p>

          {/* 액션 버튼 */}
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button asChild size="default">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                홈으로 돌아가기
              </Link>
            </Button>
            <Button asChild variant="ghost" size="default">
              <Link href="javascript:history.back()">
                <ArrowLeft className="mr-2 h-4 w-4" />
                이전 페이지
              </Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
