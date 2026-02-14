import { NextRequest, NextResponse } from 'next/server'
import {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  HeadingLevel, AlignmentType, BorderStyle, WidthType, ShadingType,
} from 'docx'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      clientName, clientPhone, clientEmail, clientAddress,
      serviceType, serviceName, tierLabel,
      estimateMin, estimateMax,
      description, notes, startDate, estimatedCompletion,
      beforeImageUrls = [], afterImageUrls = [],
    } = body

    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    const border = { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' }
    const borders = { top: border, bottom: border, left: border, right: border }
    const cellMargins = { top: 80, bottom: 80, left: 120, right: 120 }

    const infoRow = (label: string, value: string) => {
      return new TableRow({
        children: [
          new TableCell({
            borders,
            width: { size: 2800, type: WidthType.DXA },
            shading: { fill: 'F0F4F8', type: ShadingType.CLEAR },
            margins: cellMargins,
            children: [new Paragraph({ children: [new TextRun({ text: label, bold: true, font: 'Arial', size: 20 })] })],
          }),
          new TableCell({
            borders,
            width: { size: 6560, type: WidthType.DXA },
            margins: cellMargins,
            children: [new Paragraph({ children: [new TextRun({ text: value || 'N/A', font: 'Arial', size: 20 })] })],
          }),
        ],
      })
    }

    const estimateStr = estimateMin && estimateMax
      ? `$${Number(estimateMin).toLocaleString()} - $${Number(estimateMax).toLocaleString()}`
      : 'To be determined'

    const doc = new Document({
      styles: {
        default: { document: { run: { font: 'Arial', size: 22 } } },
        paragraphStyles: [
          {
            id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true,
            run: { size: 36, bold: true, font: 'Arial', color: '1E2A85' },
            paragraph: { spacing: { before: 240, after: 240 }, outlineLevel: 0 },
          },
          {
            id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true,
            run: { size: 28, bold: true, font: 'Arial', color: '2A3AA6' },
            paragraph: { spacing: { before: 200, after: 120 }, outlineLevel: 1 },
          },
        ],
      },
      sections: [
        {
          properties: {
            page: {
              size: { width: 12240, height: 15840 },
              margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
            },
          },
          children: [
            // Company Header
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { after: 60 },
              children: [new TextRun({ text: 'CR HOME PROS', bold: true, size: 40, font: 'Arial', color: '1E2A85' })],
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { after: 60 },
              children: [new TextRun({ text: 'CR Home Pros LLC', size: 20, font: 'Arial', color: '666666' })],
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { after: 60 },
              children: [new TextRun({ text: '(240) 560-1498  |  crhomepros.com', size: 18, font: 'Arial', color: '888888' })],
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { after: 200 },
              children: [new TextRun({ text: 'MHIC #05-132359  |  MHIC #109350', size: 16, font: 'Arial', color: '888888' })],
            }),

            // Divider
            new Paragraph({
              border: { bottom: { style: BorderStyle.SINGLE, size: 2, color: 'C4A052' } },
              spacing: { after: 300 },
              children: [],
            }),

            // Project Title
            new Paragraph({
              heading: HeadingLevel.HEADING_1,
              children: [new TextRun({ text: `Project: ${clientName}` })],
            }),
            new Paragraph({
              spacing: { after: 200 },
              children: [new TextRun({ text: `Created: ${today}`, color: '888888', size: 18, font: 'Arial' })],
            }),

            // Client Information Table
            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun('Client Information')] }),
            new Table({
              width: { size: 9360, type: WidthType.DXA },
              columnWidths: [2800, 6560],
              rows: [
                infoRow('Name', clientName),
                infoRow('Phone', clientPhone),
                infoRow('Email', clientEmail),
                infoRow('Address', clientAddress),
              ],
            }),

            new Paragraph({ spacing: { before: 300 }, children: [] }),

            // Service & Estimate Table
            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun('Service & Estimate')] }),
            new Table({
              width: { size: 9360, type: WidthType.DXA },
              columnWidths: [2800, 6560],
              rows: [
                infoRow('Service', serviceName || serviceType || 'N/A'),
                infoRow('Scope', tierLabel || 'N/A'),
                infoRow('Estimated Range', estimateStr),
                infoRow('Start Date', startDate || 'TBD'),
                infoRow('Est. Completion', estimatedCompletion || 'TBD'),
              ],
            }),

            new Paragraph({ spacing: { before: 300 }, children: [] }),

            // Job Description
            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun('Job Description')] }),
            new Paragraph({
              spacing: { after: 200 },
              children: [new TextRun({ text: description || 'No description provided.', font: 'Arial', size: 22 })],
            }),

            // Notes
            ...(notes
              ? [
                  new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun('Internal Notes')] }),
                  new Paragraph({
                    spacing: { after: 200 },
                    children: [new TextRun({ text: notes, font: 'Arial', size: 22, italics: true, color: '666666' })],
                  }),
                ]
              : []),

            // Photo Reference URLs
            ...(beforeImageUrls.length > 0 || afterImageUrls.length > 0
              ? [
                  new Paragraph({ spacing: { before: 300 }, children: [] }),
                  new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun('Photo References')] }),
                  ...(beforeImageUrls.length > 0
                    ? [
                        new Paragraph({
                          spacing: { after: 60 },
                          children: [new TextRun({ text: `Before Photos: ${beforeImageUrls.length} uploaded`, bold: true, font: 'Arial', size: 20 })],
                        }),
                        ...beforeImageUrls.map(
                          (url: string) =>
                            new Paragraph({
                              spacing: { after: 40 },
                              children: [new TextRun({ text: url, font: 'Arial', size: 16, color: '2A3AA6' })],
                            })
                        ),
                      ]
                    : []),
                  ...(afterImageUrls.length > 0
                    ? [
                        new Paragraph({
                          spacing: { before: 120, after: 60 },
                          children: [new TextRun({ text: `After Photos: ${afterImageUrls.length} uploaded`, bold: true, font: 'Arial', size: 20 })],
                        }),
                        ...afterImageUrls.map(
                          (url: string) =>
                            new Paragraph({
                              spacing: { after: 40 },
                              children: [new TextRun({ text: url, font: 'Arial', size: 16, color: '2A3AA6' })],
                            })
                        ),
                      ]
                    : []),
                ]
              : []),

            // Footer
            new Paragraph({ spacing: { before: 600 }, children: [] }),
            new Paragraph({
              border: { top: { style: BorderStyle.SINGLE, size: 1, color: 'DDDDDD' } },
              spacing: { before: 200 },
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: 'CR Home Pros  |  Crafting Your Ideal Home Space  |  Licensed & Insured',
                  size: 16, font: 'Arial', color: '999999',
                }),
              ],
            }),
          ],
        },
      ],
    })

    const buffer = await Packer.toBuffer(doc)
    const uint8 = new Uint8Array(buffer)

    return new NextResponse(uint8, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="Project-${clientName?.replace(/\s+/g, '-') || 'New'}.docx"`,
      },
    })
  } catch (error: any) {
    console.error('Project generate error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
