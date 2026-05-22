export function Footer() {
  return (
    <footer className="border-t">
      <div className="container mx-auto px-4 py-5">
        <div className="flex flex-col items-center justify-between gap-2 sm:flex-row">
          <p className="text-muted-foreground text-xs">
            © {new Date().getFullYear()} 견적서 시스템. All rights reserved.
          </p>
          <p className="text-muted-foreground/60 text-xs">Powered by Notion</p>
        </div>
      </div>
    </footer>
  )
}
