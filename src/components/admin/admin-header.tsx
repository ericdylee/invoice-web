import { LogoutButton } from './logout-button'
import { FileText } from 'lucide-react'

export function AdminHeader() {
  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/80 sticky top-0 z-50 border-b backdrop-blur">
      <div className="flex h-14 items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-lg shadow-sm">
            <FileText className="text-primary-foreground h-4 w-4" />
          </div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-semibold tracking-tight">
              견적서 관리
            </h1>
            <span className="bg-secondary text-secondary-foreground rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase">
              Admin
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <LogoutButton />
        </div>
      </div>
    </header>
  )
}
