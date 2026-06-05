/**
 * 견적서 열람 기록 API Route
 * 공개 견적서 페이지의 클라이언트 비콘이 호출하여 열람을 집계한다.
 * - 관리자 세션(admin_session)으로 열람한 경우는 집계에서 제외한다.
 * - 미들웨어의 /api/* Rate Limiting이 자동 적용된다.
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { recordInvoiceView } from '@/lib/services/invoice.service'
import { getSession } from '@/lib/auth/session'
import {
  isValidNotionPageId,
  normalizeNotionPageId,
} from '@/lib/utils/validation'

/**
 * POST /api/invoice/[id]/view
 * 해당 견적서의 최근 열람일·조회수를 갱신한다.
 */
export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  // 잘못된 형식의 ID는 집계하지 않음
  if (!isValidNotionPageId(id)) {
    return new NextResponse(null, { status: 400 })
  }

  // 관리자 미리보기("보기")는 집계에서 제외
  const session = await getSession()
  if (session?.isAuthenticated) {
    return new NextResponse(null, { status: 204 })
  }

  // 기록 실패는 recordInvoiceView 내부에서 swallow(로깅만)되므로 항상 204
  await recordInvoiceView(normalizeNotionPageId(id))
  return new NextResponse(null, { status: 204 })
}
