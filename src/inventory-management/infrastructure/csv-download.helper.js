function escapeCsvCell(value) {
    const s = value == null ? '' : String(value)
    if (/[",\n\r]/.test(s)) {
        return `"${s.replace(/"/g, '""')}"`
    }
    return s
}

/**
 * Descarga un CSV UTF-8 con BOM (compatible con Excel).
 * @param {string} filename
 * @param {{ header: string, value: (row: object) => string | number }[]} columns
 * @param {object[]} rows
 */
export function downloadCsv(filename, columns, rows) {
    const header = columns.map((c) => escapeCsvCell(c.header)).join(',')
    const lines = rows.map((row) =>
        columns.map((c) => escapeCsvCell(c.value(row))).join(','),
    )
    const bom = '\uFEFF'
    const blob = new Blob([bom + header + '\n' + lines.join('\n')], {
        type: 'text/csv;charset=utf-8;',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.rel = 'noopener'
    a.click()
    URL.revokeObjectURL(url)
}

/**
 * Abre una ventana imprimible con HTML simple.
 */
export function printHtmlDocument(title, bodyInnerHtml) {
    const w = window.open('', '_blank', 'noopener,noreferrer')
    if (!w) {
        return
    }
    const doc = w.document
    doc.open()
    doc.write(`<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8"/>
  <title>${escapeHtml(title)}</title>
  <style>
    body { font-family: Inter, system-ui, sans-serif; padding: 16px; color: #111; }
    h1 { font-size: 18px; margin: 0 0 12px; color: #172d40; }
    table { border-collapse: collapse; width: 100%; font-size: 11px; }
    th, td { border: 1px solid #e8ecf0; padding: 6px 8px; text-align: left; vertical-align: top; }
    th { background: #172d40; color: #fff; font-weight: 700; }
    tr:nth-child(even) td { background: #f8f8fb; }
  </style>
</head>
<body>
  <h1>${escapeHtml(title)}</h1>
  ${bodyInnerHtml}
</body>
</html>`)
    doc.close()
    w.focus()
    w.print()
}

function escapeHtml(s) {
    return String(s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
}
