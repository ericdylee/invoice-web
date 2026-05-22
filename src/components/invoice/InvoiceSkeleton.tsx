import { Skeleton } from '@/components/ui/skeleton'
import { Footer } from '@/components/layout/footer'

/**
 * 견적서 페이지 로딩 중 표시되는 스켈레톤 UI
 *
 * 실제 견적서 레이아웃과 동일한 구조로 스켈레톤을 배치하여
 * 로딩 상태에서도 일관된 사용자 경험 제공
 */
export function InvoiceSkeleton() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="bg-muted/20 flex-1">
        <div className="container mx-auto px-4 py-8 sm:py-12">
          {/* 페이지 타이틀 스켈레톤 */}
          <div className="mx-auto mb-8 max-w-3xl">
            <Skeleton className="mb-1 h-3 w-20" />
            <Skeleton className="h-8 w-56 sm:h-9" />
          </div>

          {/* 견적서 콘텐츠 스켈레톤 */}
          <div className="mx-auto max-w-3xl space-y-5">
            {/* 견적서 헤더 스켈레톤 */}
            <div className="bg-card overflow-hidden rounded-lg border shadow-sm">
              {/* 컬러 액센트 바 */}
              <div className="bg-primary/20 h-1 w-full" />
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-9 w-9 rounded-lg" />
                    <div className="space-y-1.5">
                      <Skeleton className="h-3 w-16" />
                      <Skeleton className="h-6 w-32" />
                    </div>
                  </div>
                  <Skeleton className="h-7 w-16 rounded-full" />
                </div>
              </div>
              <div className="border-t" />
              <div className="grid gap-5 p-6 sm:grid-cols-2">
                <div className="flex items-start gap-3">
                  <Skeleton className="mt-0.5 h-7 w-7 rounded-md" />
                  <div className="space-y-1.5">
                    <Skeleton className="h-3 w-12" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Skeleton className="mt-0.5 h-7 w-7 rounded-md" />
                  <div className="space-y-1.5">
                    <Skeleton className="h-3 w-14" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              </div>
            </div>

            {/* 클라이언트 정보 스켈레톤 */}
            <div className="bg-card rounded-lg border p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2.5">
                <Skeleton className="h-7 w-7 rounded-md" />
                <Skeleton className="h-4 w-24" />
              </div>
              <div className="border-t pt-5">
                <div className="flex items-baseline gap-4">
                  <Skeleton className="h-3 w-10 shrink-0" />
                  <Skeleton className="h-6 w-40" />
                </div>
              </div>
            </div>

            {/* 견적 항목 테이블 스켈레톤 */}
            <div className="bg-card overflow-hidden rounded-lg border shadow-sm">
              <div className="flex items-center justify-between p-6 pb-4">
                <div className="flex items-center gap-2.5">
                  <Skeleton className="h-7 w-7 rounded-md" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <Skeleton className="h-5 w-10 rounded-full" />
              </div>
              <div className="border-t" />
              {/* 테이블 헤더 */}
              <div className="bg-muted/40 grid grid-cols-12 gap-4 px-6 py-3">
                <Skeleton className="col-span-6 h-3" />
                <Skeleton className="col-span-2 h-3" />
                <Skeleton className="col-span-2 h-3" />
                <Skeleton className="col-span-2 h-3" />
              </div>
              {/* 테이블 행 (3개) */}
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className={`grid grid-cols-12 gap-4 px-6 py-4 ${i % 2 === 1 ? 'bg-muted/20' : ''}`}
                >
                  <Skeleton className="col-span-6 h-4" />
                  <Skeleton className="col-span-2 h-4" />
                  <Skeleton className="col-span-2 h-4" />
                  <Skeleton className="col-span-2 h-4" />
                </div>
              ))}
            </div>

            {/* 총액 요약 스켈레톤 */}
            <div className="bg-card overflow-hidden rounded-lg border shadow-sm">
              <div className="space-y-3 px-6 pt-6 pb-4">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-28" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
              <div className="border-t" />
              <div className="bg-primary/5 flex items-center justify-between px-6 py-5">
                <div className="flex items-center gap-2.5">
                  <Skeleton className="h-7 w-7 rounded-md" />
                  <div className="space-y-1">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-3 w-12" />
                  </div>
                </div>
                <div className="space-y-1 text-right">
                  <Skeleton className="ml-auto h-10 w-36" />
                  <Skeleton className="ml-auto h-3 w-16" />
                </div>
              </div>
            </div>

            {/* 구분선 */}
            <div className="bg-border my-6 h-px w-full" />

            {/* 액션 버튼 영역 스켈레톤 */}
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Skeleton className="h-11 w-full rounded-md sm:w-44" />
            </div>

            {/* 안내 메시지 스켈레톤 */}
            <div className="rounded-lg border border-dashed p-4">
              <Skeleton className="mx-auto h-4 w-80" />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
