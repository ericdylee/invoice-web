import type { Invoice } from './invoice'

export type InvoiceFetchResult =
  | { success: true; data: Invoice }
  | { success: false; error: InvoiceError }

export interface InvoiceError {
  code: 'NOT_FOUND' | 'INVALID_ID' | 'API_ERROR' | 'UNAUTHORIZED'
  message: string
}
