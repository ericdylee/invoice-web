import { useState } from 'react'
import { toast } from 'sonner'

/**
 * 클립보드 복사 시 노출할 토스트 메시지 (선택)
 */
interface ClipboardMessages {
  /** 복사 성공 토스트 문구 */
  success?: string
  /** 복사 실패 토스트 문구 */
  error?: string
}

/**
 * 클립보드 복사 커스텀 훅
 * 브라우저 호환성을 고려한 폴백 로직 포함
 */
export function useClipboard() {
  const [isCopied, setIsCopied] = useState(false)

  /**
   * 텍스트를 클립보드에 복사한다.
   * @param text - 복사할 문자열
   * @param messages - 성공/실패 토스트 문구(선택). 미지정 시 기본 문구 사용 (하위호환)
   */
  const copy = async (text: string, messages?: ClipboardMessages) => {
    try {
      // Modern Clipboard API
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text)
      } else {
        // Fallback for older browsers
        const textarea = document.createElement('textarea')
        textarea.value = text
        textarea.style.position = 'fixed'
        textarea.style.left = '-999999px'
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand('copy')
        document.body.removeChild(textarea)
      }

      setIsCopied(true)
      toast.success(messages?.success ?? '링크가 복사되었습니다')

      // 2초 후 아이콘 원래대로
      setTimeout(() => setIsCopied(false), 2000)
    } catch (error) {
      console.error('Copy failed:', error)
      toast.error(messages?.error ?? '복사에 실패했습니다')
    }
  }

  return { copy, isCopied }
}
