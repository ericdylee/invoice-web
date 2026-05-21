import { ImageResponse } from 'next/og'
import { getOptimizedInvoice } from '@/lib/services/invoice.service'
import {
  isValidNotionPageId,
  normalizeNotionPageId,
} from '@/lib/utils/validation'
import { formatCurrency, formatDate } from '@/lib/format'

export const runtime = 'nodejs'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const statusLabel: Record<string, string> = {
  pending: '검토중',
  approved: '승인됨',
  rejected: '거절됨',
}

const statusColor: Record<string, string> = {
  pending: '#f59e0b',
  approved: '#10b981',
  rejected: '#ef4444',
}

interface OGImageProps {
  params: Promise<{ id: string }>
}

export default async function InvoiceOGImage({ params }: OGImageProps) {
  const { id } = await params

  if (!isValidNotionPageId(id)) {
    return defaultOGImage()
  }

  try {
    const invoice = await getOptimizedInvoice(normalizeNotionPageId(id))

    return new ImageResponse(
      (
        <div
          style={{
            width: '1200px',
            height: '630px',
            display: 'flex',
            flexDirection: 'column',
            background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)',
            padding: '60px',
            fontFamily: 'sans-serif',
          }}
        >
          {/* 상단 브랜드 바 */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '48px',
            }}
          >
            <div
              style={{
                background: '#10b981',
                borderRadius: '12px',
                width: '48px',
                height: '48px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '16px',
              }}
            >
              <div
                style={{ color: 'white', fontSize: '24px', fontWeight: 'bold' }}
              >
                N
              </div>
            </div>
            <span
              style={{ color: '#6b7280', fontSize: '18px', fontWeight: '500' }}
            >
              견적서 조회 시스템
            </span>
          </div>

          {/* 메인 콘텐츠 */}
          <div style={{ display: 'flex', flex: 1, gap: '48px' }}>
            {/* 좌측: 견적서 정보 */}
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              {/* 상태 배지 */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: (statusColor[invoice.status] ?? '#6b7280') + '20',
                  border: `1px solid ${statusColor[invoice.status] ?? '#6b7280'}40`,
                  borderRadius: '999px',
                  padding: '6px 16px',
                  marginBottom: '20px',
                  width: 'fit-content',
                }}
              >
                <div
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: statusColor[invoice.status] ?? '#6b7280',
                    marginRight: '8px',
                  }}
                />
                <span
                  style={{
                    color: statusColor[invoice.status] ?? '#6b7280',
                    fontSize: '14px',
                    fontWeight: '600',
                  }}
                >
                  {statusLabel[invoice.status] ?? invoice.status}
                </span>
              </div>

              {/* 견적서 번호 */}
              <div
                style={{
                  color: '#6b7280',
                  fontSize: '16px',
                  marginBottom: '8px',
                }}
              >
                견적서 번호
              </div>
              <div
                style={{
                  color: '#111827',
                  fontSize: '36px',
                  fontWeight: '700',
                  marginBottom: '24px',
                  letterSpacing: '-0.5px',
                }}
              >
                {invoice.invoiceNumber}
              </div>

              {/* 클라이언트명 */}
              <div
                style={{
                  color: '#6b7280',
                  fontSize: '16px',
                  marginBottom: '8px',
                }}
              >
                수신
              </div>
              <div
                style={{
                  color: '#111827',
                  fontSize: '28px',
                  fontWeight: '600',
                  marginBottom: '32px',
                }}
              >
                {invoice.clientName} 귀중
              </div>

              {/* 날짜 정보 */}
              <div style={{ display: 'flex', gap: '32px' }}>
                <div>
                  <div
                    style={{
                      color: '#9ca3af',
                      fontSize: '13px',
                      marginBottom: '4px',
                    }}
                  >
                    발행일
                  </div>
                  <div
                    style={{
                      color: '#374151',
                      fontSize: '15px',
                      fontWeight: '500',
                    }}
                  >
                    {formatDate(invoice.issueDate)}
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      color: '#9ca3af',
                      fontSize: '13px',
                      marginBottom: '4px',
                    }}
                  >
                    유효기간
                  </div>
                  <div
                    style={{
                      color: '#374151',
                      fontSize: '15px',
                      fontWeight: '500',
                    }}
                  >
                    {formatDate(invoice.validUntil)}
                  </div>
                </div>
              </div>
            </div>

            {/* 우측: 총액 카드 */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                background: 'white',
                borderRadius: '24px',
                border: '1px solid #d1fae5',
                padding: '40px 48px',
                minWidth: '320px',
                boxShadow: '0 4px 24px rgba(16,185,129,0.08)',
              }}
            >
              <div
                style={{
                  color: '#6b7280',
                  fontSize: '16px',
                  marginBottom: '12px',
                  fontWeight: '500',
                }}
              >
                총 견적 금액
              </div>
              <div
                style={{
                  color: '#10b981',
                  fontSize: '38px',
                  fontWeight: '800',
                  letterSpacing: '-1px',
                  marginBottom: '12px',
                }}
              >
                {formatCurrency(invoice.totalAmount)}
              </div>
              <div
                style={{
                  color: '#9ca3af',
                  fontSize: '13px',
                }}
              >
                항목 {invoice.items.length}개 · 부가세 별도
              </div>
            </div>
          </div>
        </div>
      ),
      { width: 1200, height: 630 }
    )
  } catch {
    return defaultOGImage()
  }
}

function defaultOGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            background: '#10b981',
            borderRadius: '20px',
            width: '80px',
            height: '80px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '28px',
          }}
        >
          <div style={{ color: 'white', fontSize: '40px', fontWeight: 'bold' }}>
            N
          </div>
        </div>
        <div
          style={{
            color: '#111827',
            fontSize: '48px',
            fontWeight: '700',
            marginBottom: '16px',
          }}
        >
          견적서 조회 시스템
        </div>
        <div style={{ color: '#6b7280', fontSize: '22px' }}>
          노션 기반 견적서 관리 시스템
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
