/**
 * 관리자 로그인 페이지
 * Client Component (폼 상호작용을 위해)
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { loginAction } from './actions'
import { toast } from 'sonner'
import { Lock } from 'lucide-react'

/**
 * 로그인 페이지 컴포넌트
 */
export default function LoginPage() {
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  /**
   * 폼 제출 핸들러
   */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData()
    formData.append('password', password)

    try {
      const result = await loginAction(formData)

      if (result.success) {
        toast.success(result.message)
        router.push('/admin')
        router.refresh()
      } else {
        toast.error(result.message)
      }
    } catch {
      toast.error('로그인 중 오류가 발생했습니다')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-muted/20 relative flex min-h-screen items-center justify-center px-4">
      {/* 배경 장식 */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="bg-primary/5 absolute -top-40 -right-40 h-80 w-80 rounded-full blur-3xl" />
        <div className="bg-primary/5 absolute -bottom-40 -left-40 h-80 w-80 rounded-full blur-3xl" />
      </div>

      <Card className="relative w-full max-w-sm shadow-lg">
        <CardHeader className="space-y-4 pt-6 pb-4 text-center">
          {/* 로고 아이콘 */}
          <div className="bg-primary mx-auto flex h-12 w-12 items-center justify-center rounded-xl shadow-md">
            <Lock className="text-primary-foreground h-5 w-5" />
          </div>
          <div className="space-y-1">
            <CardTitle className="text-xl font-bold">관리자 로그인</CardTitle>
            <p className="text-muted-foreground text-sm">견적서 관리 시스템</p>
          </div>
        </CardHeader>
        <CardContent className="pb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 비밀번호 입력 */}
            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="text-foreground text-sm font-medium"
              >
                비밀번호
              </label>
              <Input
                id="password"
                type="password"
                name="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                disabled={loading}
                autoFocus
                className="h-10 transition-shadow focus-visible:shadow-sm"
                aria-label="관리자 비밀번호"
              />
            </div>
            <Button
              type="submit"
              className="mt-2 h-10 w-full font-medium"
              disabled={loading}
            >
              {loading ? '로그인 중...' : '로그인'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
