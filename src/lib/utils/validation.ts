// Notion은 UUID v4 외에도 다른 버전 UUID를 사용하므로 형식만 검사
const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

const UUID_NO_HYPHENS_REGEX = /^[0-9a-f]{32}$/i

export function isValidNotionPageId(id: string): boolean {
  return UUID_REGEX.test(id) || UUID_NO_HYPHENS_REGEX.test(id)
}

export function normalizeNotionPageId(id: string): string {
  if (UUID_REGEX.test(id)) return id

  if (UUID_NO_HYPHENS_REGEX.test(id)) {
    return `${id.slice(0, 8)}-${id.slice(8, 12)}-${id.slice(12, 16)}-${id.slice(16, 20)}-${id.slice(20)}`
  }

  return id
}
