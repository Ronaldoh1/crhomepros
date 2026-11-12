// ============================================
// PDF builder for invoices, change orders and contracts
// ============================================
// Pure JavaScript (pdf-lib), so it runs on Vercel. Replaces the old Python
// script, which failed in production because the server has no python3.

import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from 'pdf-lib'

export type PdfDocType = 'invoice' | 'change-order' | 'contract'

export interface PdfDocData {
  number?: string
  date?: string
  dueDate?: string
  clientName?: string
  clientEmail?: string
  clientPhone?: string
  clientAddress?: string
  propertyAddress?: string
  projectName?: string
  items?: { description?: string; quantity?: number; unitPrice?: number }[]
  taxRate?: number
  freeformDescription?: string
  paymentStructure?: string
  contractTerms?: string
  notes?: string
  /** PNG data URL of Carlos's signature */
  signatureData?: string | null
}

const W = 612
const H = 792
const M = 60 // side margin
const hex = (h: string) => {
  const n = parseInt(h.replace('#', ''), 16)
  return rgb(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255)
}
const BLUE = hex('#1e3a5f')
const GOLD = hex('#c4a45f')
const DARK = hex('#0f172a')
const GRAY = hex('#475569')
const LIGHT = hex('#cbd5e1')
const LINE = hex('#e2e8f0')
const ROW = hex('#f8fafc')
const WHITE = rgb(1, 1, 1)

/** Money, always to the cent */
export const money = (n: number) =>
  `$${(Math.round((Number(n) || 0) * 100) / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

// The built-in fonts only cover Latin-1; anything else (emoji etc.) becomes "?"
const clean = (s: unknown) =>
  String(s ?? '')
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/•/g, '-')
    .replace(/…/g, '...')
    .replace(/\t/g, '    ')
    .replace(/[^\x20-\x7E\xA0-\xFF–—\n]/g, '?')

export async function buildDocumentPdf(type: PdfDocType, raw: PdfDocData): Promise<Uint8Array> {
  const d = raw || {}
  const pdf = await PDFDocument.create()
  const font = await pdf.embedFont(StandardFonts.Helvetica)
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold)
  const baseLabel = { invoice: 'INVOICE', 'change-order': 'CHANGE ORDER', contract: 'CONTRACT' }[type] || 'DOCUMENT'
  // A document sent again after a fix carries a number ending in -CORRECTED
  const corrected = /-CORRECTED$/i.test(String(d.number || ''))
  const label = corrected ? `CORRECTED ${baseLabel}` : baseLabel
  pdf.setTitle(`${label} ${clean(d.number)}`)
  pdf.setAuthor('CR Home Pros')

  let page!: PDFPage
  let y = 0

  const text = (s: string, x: number, yy: number, size: number, f: PDFFont = font, color = DARK) =>
    page.drawText(clean(s), { x, y: yy, size, font: f, color })
  const right = (s: string, xRight: number, yy: number, size: number, f: PDFFont = font, color = DARK) => {
    const t = clean(s)
    page.drawText(t, { x: xRight - f.widthOfTextAtSize(t, size), y: yy, size, font: f, color })
  }
  const center = (s: string, yy: number, size: number, f: PDFFont, color = DARK) => {
    const t = clean(s)
    page.drawText(t, { x: (W - f.widthOfTextAtSize(t, size)) / 2, y: yy, size, font: f, color })
  }
  const wrap = (s: string, width: number, size: number, f: PDFFont = font): string[] => {
    const out: string[] = []
    for (const para of clean(s).split('\n')) {
      let line = ''
      for (const word of para.split(/\s+/).filter(Boolean)) {
        const next = line ? `${line} ${word}` : word
        if (f.widthOfTextAtSize(next, size) > width && line) {
          out.push(line)
          line = word
        } else line = next
      }
      out.push(line)
    }
    return out
  }

  const footer = () => {
    page.drawRectangle({ x: 0, y: 0, width: W, height: 40, color: BLUE })
    center('C&R GENERAL SERVICES INC.  |  We Are In This Business For You', 22, 8, bold, GOLD)
    center('(571) 237-7164  |  crhomepros@gmail.com  |  MHIC #05-132359', 10, 7, font, LIGHT)
  }
  const newPage = () => {
    page = pdf.addPage([W, H])
    footer()
    y = H - 60
  }
  /** Start a new page if fewer than `space` points remain above the footer */
  const need = (space: number) => {
    if (y - space < 60) newPage()
  }
  const heading = (s: string, size = 11) => {
    need(40)
    text(s, M, y, size, bold, BLUE)
    y -= 17
  }
  const paragraph = (s: string, size: number, color = DARK, lead = size + 4.5, x = M) => {
    for (const line of wrap(s, W - M - x, size)) {
      need(lead)
      if (line) text(line, x, y, size, font, color)
      y -= lead
    }
  }

  // ── Header ──────────────────────────────────
  newPage()
  page.drawRectangle({ x: 0, y: H - 120, width: W, height: 120, color: BLUE })
  text('C&R', M, H - 55, 26, bold, WHITE)
  text('General Services Inc.', M, H - 72, 11, font, WHITE)
  text('Licensed  |  Insured  |  Bonded', M, H - 86, 8, font, GOLD)
  text('www.crgenserv.com  |  (571) 237-7164  |  crhomepros@gmail.com', M, H - 100, 7, font, LIGHT)
  right(label, W - M, H - 55, corrected ? 15 : 18, bold, GOLD)
  right(`#${d.number || ''}`, W - M, H - 75, 10, font, WHITE)
  page.drawRectangle({ x: 0, y: H - 124, width: W, height: 4, color: GOLD })

  y = H - 155
  text(`Date: ${d.date || ''}`, M, y, 10)
  if (d.dueDate) right(`Due: ${d.dueDate}`, W - M, y, 10)
  y -= 30

  // ── Client / property ───────────────────────
  const topY = y
  text('CLIENT', M, y, 11, bold, BLUE)
  y -= 16
  text(d.clientName || '', M, y, 12, bold)
  y -= 15
  for (const line of wrap(d.clientAddress || '', 220, 10)) {
    if (!line) continue
    text(line, M, y, 10, font, GRAY)
    y -= 14
  }
  if (d.clientPhone) { text(`Phone: ${d.clientPhone}`, M, y, 10, font, GRAY); y -= 14 }
  if (d.clientEmail) { text(`Email: ${d.clientEmail}`, M, y, 10, font, GRAY); y -= 14 }

  if (d.propertyAddress) {
    let py = topY
    text('PROPERTY', 320, py, 11, bold, BLUE)
    py -= 16
    for (const line of wrap(d.propertyAddress, W - M - 320, 10)) {
      if (!line) continue
      text(line, 320, py, 10)
      py -= 14
    }
    y = Math.min(y, py)
  }
  y -= 12

  if (d.projectName) {
    heading('PROJECT')
    paragraph(d.projectName, 10)
    y -= 8
  }

  // ── Items ───────────────────────────────────
  const items = (d.items || []).filter((i) => i && (i.description || i.unitPrice))
  const priced = items.length > 0 && items[0].unitPrice !== undefined && items[0].unitPrice !== null

  if (priced) {
    const cols = [30, 252, 40, 80, 90] // #, description, qty, unit price, amount
    const xs = cols.reduce<number[]>((acc, w, i) => [...acc, i === 0 ? M : acc[i - 1] + cols[i - 1]], [])
    const tableW = cols.reduce((a, b) => a + b, 0)
    const drawHead = () => {
      need(50)
      page.drawRectangle({ x: M, y: y - 8, width: tableW, height: 24, color: BLUE })
      text('#', xs[0] + 10, y, 9, bold, WHITE)
      text('Description', xs[1] + 8, y, 9, bold, WHITE)
      right('Qty', xs[2] + cols[2] - 8, y, 9, bold, WHITE)
      right('Unit Price', xs[3] + cols[3] - 8, y, 9, bold, WHITE)
      right('Amount', xs[4] + cols[4] - 8, y, 9, bold, WHITE)
      y -= 24
    }
    drawHead()
    let subtotal = 0
    items.forEach((item, i) => {
      const qty = Number(item.quantity ?? 1) || 0
      const price = Math.round((Number(item.unitPrice) || 0) * 100) / 100
      const amount = Math.round(qty * price * 100) / 100
      subtotal += amount
      const lines = wrap(item.description || '', cols[1] - 16, 9)
      const rowH = Math.max(24, lines.length * 12 + 12)
      if (y - rowH < 70) { newPage(); drawHead() }
      page.drawRectangle({ x: M, y: y + 16 - rowH, width: tableW, height: rowH, color: i % 2 ? ROW : WHITE, borderColor: LINE, borderWidth: 0.5 })
      text(String(i + 1), xs[0] + 10, y, 9)
      lines.forEach((l, li) => text(l, xs[1] + 8, y - li * 12, 9))
      right(String(qty), xs[2] + cols[2] - 8, y, 9)
      right(money(price), xs[3] + cols[3] - 8, y, 9)
      right(money(amount), xs[4] + cols[4] - 8, y, 9)
      y -= rowH
    })
    y -= 12

    subtotal = Math.round(subtotal * 100) / 100
    const taxRate = Number(d.taxRate) || 0
    const tax = Math.round(subtotal * taxRate) / 100
    const total = Math.round((subtotal + tax) * 100) / 100
    need(80)
    right(`Subtotal:  ${money(subtotal)}`, W - M, y, 10, font, GRAY)
    y -= 16
    if (taxRate > 0) {
      right(`Tax (${taxRate}%):  ${money(tax)}`, W - M, y, 10, font, GRAY)
      y -= 16
    }
    y -= 6
    page.drawRectangle({ x: W - M - 210, y: y - 8, width: 210, height: 26, color: BLUE })
    right(`TOTAL:  ${money(total)}`, W - M - 8, y, 13, bold, WHITE)
    y -= 38
  } else if (items.length) {
    heading('SCOPE OF WORK')
    items.forEach((item, i) => {
      const lines = wrap(item.description || '', W - 2 * M - 30, 9.5)
      lines.forEach((l, li) => {
        need(14)
        if (li === 0) text(`${i + 1}.`, M + 8, y, 9.5)
        text(l, M + 28, y, 9.5)
        y -= 14
      })
      y -= 4
    })
  }

  if (d.freeformDescription) { y -= 4; paragraph(d.freeformDescription, 9.5) }
  if (d.paymentStructure) { y -= 8; heading('PAYMENT STRUCTURE'); paragraph(d.paymentStructure, 9.5) }
  if (d.contractTerms) { y -= 8; heading('TERMS & CONDITIONS'); paragraph(d.contractTerms, 8.5, DARK, 12.5) }
  if (d.notes) { y -= 8; heading('NOTES', 10); paragraph(d.notes, 9, GRAY, 13) }

  // ── Signatures ──────────────────────────────
  need(150)
  y -= 20
  page.drawLine({ start: { x: M, y }, end: { x: W - M, y }, thickness: 0.5, color: LINE })
  y -= 26
  text('Provided and Guaranteed by:', M, y, 10, bold)
  text('Accepted and Agreed:', 320, y, 10, bold)
  const sigLine = y - 42
  if (d.signatureData) {
    try {
      // Either a drawn signature (data URL) or the saved one (https link)
      const bytes = d.signatureData.startsWith('data:image/png')
        ? Buffer.from(d.signatureData.split(',')[1], 'base64')
        : /^https:\/\//.test(d.signatureData)
          ? Buffer.from(await (await fetch(d.signatureData)).arrayBuffer())
          : null
      if (bytes) {
        const png = await pdf.embedPng(bytes)
        const scale = Math.min(180 / png.width, 36 / png.height)
        page.drawImage(png, { x: M, y: sigLine + 2, width: png.width * scale, height: png.height * scale })
      }
    } catch {
      // unreadable signature image: leave the line blank
    }
  }
  page.drawLine({ start: { x: M, y: sigLine }, end: { x: 250, y: sigLine }, thickness: 0.7, color: DARK })
  page.drawLine({ start: { x: 320, y: sigLine }, end: { x: W - M, y: sigLine }, thickness: 0.7, color: DARK })
  text('Carlos Hernandez', M, sigLine - 14, 10, bold)
  text('President, CRGS, Inc.', M, sigLine - 27, 9, font, GRAY)
  text(`Date: ${d.signatureData ? d.date || '' : '_______________'}`, M, sigLine - 40, 9, font, GRAY)
  text(d.clientName || '', 320, sigLine - 14, 10, bold)
  text('Date: _______________', 320, sigLine - 27, 9, font, GRAY)

  return pdf.save()
}
