import PDFDocument from 'pdfkit'

export function buildPredictionPdf({ ticker, createdAt, request, result }) {
  const doc = new PDFDocument({ margin: 40 })
  doc.fontSize(18).text('CausalCast Prediction Report', { align: 'center' })
  doc.moveDown()
  doc.fontSize(12).text(`Ticker: ${ticker || 'N/A'}`)
  doc.text(`Created: ${new Date(createdAt).toLocaleString()}`)
  doc.moveDown()
  doc.fontSize(14).text('Inputs')
  doc.fontSize(10).text(JSON.stringify(request, null, 2))
  doc.moveDown()
  doc.fontSize(14).text('Results')
  doc.fontSize(10).text(JSON.stringify(result, null, 2))
  doc.end()
  return doc
}


