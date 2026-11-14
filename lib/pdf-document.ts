// ============================================
// PDF builder for invoices, change orders and contracts (branded layout)
// ============================================
// Pure JavaScript (pdf-lib), so it runs on Vercel. Replaces the old Python
// script, which failed in production because the server has no python3.

import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from 'pdf-lib'
import { LOGO_PNG_BASE64 } from './logo-data'

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
  /** The client's electronic signature (contracts signed on their page) */
  clientSignature?: { dataUrl?: string; name?: string; signedAt?: string; ip?: string } | null
}

const W = 612
const H = 792
const M = 60 // side margin
const hex = (h: string) => {
  const n = parseInt(h.replace('#', ''), 16)
  return rgb(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255)
}
const BLUE = hex('#0b1b33') // brand navy
const GOLD = hex('#fd9b14') // brand orange (from the logo)
const GOLD_DARK = hex('#b45309') // orange that reads on white
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
    page.drawRectangle({ x: 0, y: 40, width: W, height: 2, color: GOLD })
    center('CR HOME PROS  |  C&R General Services Inc.', 23, 8, bold, WHITE)
    center('(571) 237-7164  |  crhomepros@gmail.com  |  crhomepros.com  |  MHIC #05-132359', 11, 7, font, WHITE)
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
    page.drawRectangle({ x: M, y: y - 1, width: 14, height: 3, color: GOLD })
    text(s, M + 20, y - 3, size, bold, BLUE)
    y -= 20
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
  const HEAD = 118
  page.drawRectangle({ x: 0, y: H - HEAD, width: W, height: HEAD, color: BLUE })
  page.drawRectangle({ x: 0, y: H - HEAD - 3, width: W, height: 3, color: GOLD })
  try {
    const logo = await pdf.embedPng(Buffer.from(LOGO_PNG_BASE64, 'base64'))
    const lw = 150
    page.drawImage(logo, { x: M - 4, y: H - 98, width: lw, height: (logo.height / logo.width) * lw })
  } catch {
    text('CR HOME PROS', M, H - 62, 22, bold, WHITE)
  }
  right(label, W - M, H - 50, corrected ? 15 : 22, bold, GOLD)
  right(`No. ${d.number || ''}`, W - M, H - 68, 10, bold, WHITE)
  right('Licensed  |  Insured  |  Bonded', W - M, H - 86, 7.5, font, WHITE)
  right('MHIC #05-132359  |  #109350', W - M, H - 97, 7.5, font, WHITE)

  // Date strip
  y = H - HEAD - 30
  const cell = (title: string, value: string, x: number) => {
    text(title, x, y, 7, bold, GOLD_DARK)
    text(value, x, y - 13, 10.5, bold)
  }
  cell('DATE', d.date || '', M)
  if (d.dueDate) cell('DUE', d.dueDate, M + 110)
  if (d.projectName) {
    const pj = wrap(d.projectName, W - M - (M + (d.dueDate ? 220 : 110)), 10.5, bold)[0] || ''
    cell('PROJECT', pj, M + (d.dueDate ? 220 : 110))
  }
  y -= 34

  // ── Client / property cards ─────────────────
  const clientLines = [
    ...wrap(d.clientAddress || '', 205, 9.5).filter(Boolean),
    ...(d.clientPhone ? [d.clientPhone] : []),
    ...(d.clientEmail ? [d.clientEmail] : []),
  ]
  const propLines = d.propertyAddress ? wrap(d.propertyAddress, 205, 9.5).filter(Boolean) : []
  const cardH = 44 + Math.max(clientLines.length, propLines.length) * 13
  const cardW = (W - 2 * M - 16) / 2
  const cardBox = (x: number, title: string, name: string, lines: string[]) => {
    page.drawRectangle({ x, y: y - cardH, width: cardW, height: cardH, color: ROW, borderColor: LINE, borderWidth: 0.6 })
    page.drawRectangle({ x, y: y - cardH, width: 3, height: cardH, color: GOLD })
    text(title, x + 14, y - 16, 7, bold, GOLD_DARK)
    if (name) text(name, x + 14, y - 31, 11.5, bold)
    lines.forEach((l, i) => text(l, x + 14, y - (name ? 45 : 31) - i * 13, 9.5, font, GRAY))
  }
  cardBox(M, type === 'invoice' ? 'BILL TO' : 'CLIENT', d.clientName || '', clientLines)
  if (propLines.length) cardBox(M + cardW + 16, 'JOB ADDRESS', '', propLines)
  else cardBox(M + cardW + 16, 'FROM', 'CR Home Pros', ['C&R General Services Inc.', '(571) 237-7164', 'crhomepros@gmail.com'].slice(0, Math.max(3, clientLines.length)))
  y -= cardH + 26

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
    y -= 16
    page.drawRectangle({ x: W - M - 230, y: y - 12, width: 230, height: 34, color: BLUE })
    page.drawRectangle({ x: W - M - 230, y: y - 12, width: 4, height: 34, color: GOLD })
    text(type === 'invoice' ? 'TOTAL DUE' : 'TOTAL', W - M - 214, y, 9, bold, GOLD)
    right(money(total), W - M - 12, y - 2, 15, bold, WHITE)
    y -= 46
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
  const embedSig = async (src?: string | null) => {
    if (!src) return null
    try {
      // Either a signature made in the portal (data URL) or the saved one (https link)
      const bytes = src.startsWith('data:image/png')
        ? Buffer.from(src.split(',')[1], 'base64')
        : /^https:\/\/firebasestorage\.googleapis\.com\//.test(src)
          ? Buffer.from(await (await fetch(src)).arrayBuffer())
          : null
      return bytes ? await pdf.embedPng(bytes) : null
    } catch {
      return null // unreadable signature image: leave the line blank
    }
  }
  const cs = d.clientSignature || null
  need(cs ? 175 : 150)
  y -= 20
  page.drawLine({ start: { x: M, y }, end: { x: W - M, y }, thickness: 0.5, color: LINE })
  y -= 26
  text('PROVIDED AND GUARANTEED BY', M, y, 7.5, bold, GOLD_DARK)
  text('ACCEPTED AND AGREED', 320, y, 7.5, bold, GOLD_DARK)
  const sigLine = y - 46
  const mine = await embedSig(d.signatureData)
  if (mine) {
    const scale = Math.min(180 / mine.width, 38 / mine.height)
    page.drawImage(mine, { x: M, y: sigLine + 2, width: mine.width * scale, height: mine.height * scale })
  }
  const theirs = await embedSig(cs?.dataUrl)
  if (theirs) {
    const scale = Math.min(200 / theirs.width, 38 / theirs.height)
    page.drawImage(theirs, { x: 320, y: sigLine + 2, width: theirs.width * scale, height: theirs.height * scale })
  }
  page.drawLine({ start: { x: M, y: sigLine }, end: { x: 250, y: sigLine }, thickness: 0.7, color: DARK })
  page.drawLine({ start: { x: 320, y: sigLine }, end: { x: W - M, y: sigLine }, thickness: 0.7, color: DARK })
  text('Carlos Hernandez', M, sigLine - 14, 10, bold)
  text('President, CRGS, Inc.', M, sigLine - 27, 9, font, GRAY)
  text(`Date: ${mine ? d.date || '' : '_______________'}`, M, sigLine - 40, 9, font, GRAY)
  text(cs?.name || d.clientName || '', 320, sigLine - 14, 10, bold)
  if (cs?.signedAt) {
    const when = new Date(cs.signedAt)
    const stamp = isNaN(when.getTime()) ? cs.signedAt : when.toLocaleString('en-US', { timeZone: 'America/New_York', dateStyle: 'long', timeStyle: 'short' }) + ' ET'
    text(`Signed electronically: ${stamp}`, 320, sigLine - 27, 8.5, font, GRAY)
    if (cs.ip) text(`From IP address ${cs.ip}`, 320, sigLine - 39, 7.5, font, GRAY)
  } else {
    text('Date: _______________', 320, sigLine - 27, 9, font, GRAY)
  }

  return pdf.save()
}
