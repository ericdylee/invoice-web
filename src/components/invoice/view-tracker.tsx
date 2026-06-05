'use client'

import { useEffect } from 'react'

interface ViewTrackerProps {
  /** 견적서 ID (정규화된 Notion 페이지 ID) */
  id: string
}

/**
 * 현재 페이지 로드에서 이미 전송한 ID 집합.
 * 모듈 스코프라 StrictMode 재마운트·동시 렌더에서도 중복 전송을 막는다.
 * (전체 새로고침 시 모듈이 재초기화되므로 sessionStorage가 그 경우를 담당)
 */
const trackedInSession = new Set<string>()

/**
 * 견적서 열람 추적 비콘 (Client Component)
 * 공개 페이지 마운트 시 열람 기록 API를 1회 호출한다.
 * - 모듈 스코프 가드: 같은 페이지 로드 내 중복(StrictMode 등) 방지
 * - sessionStorage 가드: 같은 탭 세션 내 새로고침 재집계 방지
 * 화면에는 아무것도 렌더링하지 않는다.
 */
export function ViewTracker({ id }: ViewTrackerProps) {
  useEffect(() => {
    if (trackedInSession.has(id)) {
      return
    }

    const key = `inv-viewed:${id}`
    try {
      // 같은 탭 세션에서 이미 기록했다면 스킵 (새로고침 중복 방지)
      if (sessionStorage.getItem(key)) {
        trackedInSession.add(id)
        return
      }
      sessionStorage.setItem(key, '1')
    } catch {
      // sessionStorage 비활성(프라이빗 모드 등) — 가드 없이 진행
    }

    trackedInSession.add(id)

    // keepalive로 페이지 이탈 중에도 전송 보장, 실패는 무시
    fetch(`/api/invoice/${id}/view`, {
      method: 'POST',
      keepalive: true,
    }).catch(() => {
      // 추적 실패는 사용자 경험에 영향을 주지 않음
    })
  }, [id])

  return null
}
