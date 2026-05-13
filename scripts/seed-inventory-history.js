import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dbPath = path.join(__dirname, '..', 'src', 'inventory-management', 'infrastructure', 'fixtures', 'db.json')

const origins = [
    'Planta Callao Norte',
    'Planta Central Lima',
    'Dist. San Miguel',
    'Almacén Huánuco',
    'Proveedor Externo',
]
const motivos = [
    'Reposición de stock',
    'Pedido distribución',
    'Traslado interno',
    'Ajuste inventario',
    'Devolución cliente',
]
const users = ['Admin', 'Operador 1', 'Operador 2', 'Supervisora']
const kg = [
    { k: '5', l: 'Balón 5 kg' },
    { k: '10', l: 'Balón 10 kg' },
    { k: '15', l: 'Balón 15 kg' },
    { k: '45', l: 'Cilindro 45 kg' },
]

let n = 372
const enterpriseMovements = []
for (let i = 0; i < 143; i++) {
    const tipo = i % 3 === 0 ? 'Salida' : 'Entrada'
    const w = kg[i % 4]
    const day = 1 + (i % 28)
    const h = 8 + (i % 10)
    const m = (i * 7) % 60
    const s = (i * 13) % 60
    const ts = `2025-06-${String(day).padStart(2, '0')}T${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
    const qty = tipo === 'Entrada' ? 10 + (i % 40) * 2 : 5 + (i % 15)
    enterpriseMovements.push({
        id: `MOV-${String(n--).padStart(5, '0')}`,
        timestamp: ts,
        tipo,
        tipoBalonKey: w.k,
        tipoBalonLabel: w.l,
        cantidad: qty,
        cantidadSign: tipo === 'Entrada' ? 1 : -1,
        procedenciaDestino: origins[i % origins.length],
        motivo: motivos[i % motivos.length],
        usuarioNombre: users[i % users.length],
        usuarioAvatar: null,
        observaciones: i % 4 === 0 ? 'Lote AL-2025-06' : '',
    })
}
enterpriseMovements.sort((a, b) => b.id.localeCompare(a.id))

const provs = [
    'GasPro S.A.',
    'Repsol Distribución',
    'Venta directa',
    'Entrega a domicilio',
    'Devolución a proveedor',
]
const resp = [
    ['Carlos Mendoza', true],
    ['A. Torres', false],
    ['L. Ramos', false],
    ['C. Mendoza', true],
]
let did = 47
const distributorMovements = []
for (let i = 0; i < 47; i++) {
    const tipo = i % 2 === 0 ? 'Entrada' : 'Salida'
    const w = kg[i % 4]
    const day = 1 + (i % 28)
    const ts = `2024-06-${String(day).padStart(2, '0')}T${String(9 + (i % 8)).padStart(2, '0')}:${String((i * 11) % 60).padStart(2, '0')}:00`
    const qty = tipo === 'Entrada' ? 20 + (i % 30) : 5 + (i % 20)
    const label = w.l.replace('Balón ', '').replace('Cilindro ', '')
    distributorMovements.push({
        id: String(did--).padStart(4, '0'),
        timestamp: ts,
        tipo,
        tipoBalonLabel: label,
        cantidad: qty,
        cantidadSign: tipo === 'Entrada' ? 1 : -1,
        proveedorTipoSalida: provs[i % provs.length],
        responsableNombre: resp[i % resp.length][0],
        responsableIsOwner: resp[i % resp.length][1],
    })
}

const modulos = ['Inventario', 'Distribución', 'Administración']
const tipos = ['UPDATE', 'INSERT', 'ANULACIÓN']
const auditLogs = []
let aid = 341
const samples = [
    ['Inventario', 'UPDATE', 'stock.balon_10kg lote: L-2025-06', 'Admin', '128', '170', 'voidable'],
    ['Inventario', 'INSERT', 'mov.entrada qty: 50, tipo: 10kg', 'Admin', '—', '+50', 'voidable'],
    ['Inventario', 'UPDATE', 'stock.balon_45kg lote: OC-2025-118', 'Supervisora', '32', '47', 'voidable'],
    ['Distribución', 'ANULACIÓN', 'mov.salida #AUD-00331 guia: G-4421', 'Admin', '80', 'ANULADO', 'voided'],
    ['Inventario', 'INSERT', 'mov.salida qty: 20, tipo: 5kg', 'Operador 1', '—', '-20', 'voidable'],
    ['Administración', 'UPDATE', 'usuarios.permisos uid: usr_009', 'Admin', 'operador', 'supervisor', 'voidable'],
    ['Inventario', 'INSERT', 'mov.entrada qty: 100, tipo: 5kg', 'Operador 2', '—', '+100', 'not_voidable'],
]
const times = ['14:32:05', '14:30:11', '09:15:30', '16:48:22', '11:05:47', '08:00:11', '08:00:11']
samples.forEach((r, i) => {
    auditLogs.push({
        id: `AUD-${String(aid--).padStart(5, '0')}`,
        modulo: r[0],
        tipoOperacion: r[1],
        datosIngresados: r[2],
        usuarioNombre: r[3],
        fechaHora: `2025-06-${String(28 - i).padStart(2, '0')} ${times[i]}`,
        valorAnterior: r[4],
        valorNuevo: r[5],
        accionEstado: r[6],
    })
})
for (let i = 7; i < 87; i++) {
    const mo = modulos[i % 3]
    const op = tipos[i % 3]
    const vn = i % 2 === 0 ? String(50 + i) : `+${10 + i}`
    auditLogs.push({
        id: `AUD-${String(aid--).padStart(5, '0')}`,
        modulo: mo,
        tipoOperacion: op,
        datosIngresados: `stock.reg_${i} ref: R-2025-${String(i).padStart(3, '0')}`,
        usuarioNombre: users[i % users.length],
        fechaHora: `2025-06-${String(1 + (i % 28)).padStart(2, '0')} ${String(8 + (i % 12)).padStart(2, '0')}:${String((i * 5) % 60).padStart(2, '0')}:00`,
        valorAnterior: op === 'INSERT' ? '—' : String(10 + i),
        valorNuevo: vn,
        accionEstado: i % 11 === 0 ? 'voided' : i % 13 === 0 ? 'not_voidable' : 'voidable',
    })
}
auditLogs.sort((a, b) => b.id.localeCompare(a.id))

const base = JSON.parse(fs.readFileSync(dbPath, 'utf8'))

const enterpriseStockRows = [
    {
        "id": "1",
        "badgeLabel": "5kg",
        "tipoNombre": "Balón estándar 5 kg",
        "disponible": 150,
        "enTransito": 20,
        "observado": 5,
        "fueraServicio": 0,
        "total": 175,
        "warnDisponible": false,
        "warnObservado": true,
        "highlightDisponible": false,
        "highlightObservado": false
    },
    {
        "id": "2",
        "badgeLabel": "10kg",
        "tipoNombre": "Balón doméstico 10 kg",
        "disponible": 300,
        "enTransito": 50,
        "observado": 10,
        "fueraServicio": 2,
        "total": 362,
        "warnDisponible": false,
        "warnObservado": false,
        "highlightDisponible": true,
        "highlightObservado": false
    },
    {
        "id": "3",
        "badgeLabel": "15kg",
        "tipoNombre": "Balón industrial 15 kg",
        "disponible": 40,
        "enTransito": 10,
        "observado": 2,
        "fueraServicio": 0,
        "total": 52,
        "warnDisponible": true,
        "warnObservado": false,
        "highlightDisponible": false,
        "highlightObservado": false
    },
    {
        "id": "4",
        "badgeLabel": "45kg",
        "tipoNombre": "Cilindro industrial 45 kg",
        "disponible": 80,
        "enTransito": 5,
        "observado": 1,
        "fueraServicio": 1,
        "total": 87,
        "warnDisponible": false,
        "warnObservado": false,
        "highlightDisponible": false,
        "highlightObservado": false
    }
]

const distributorStockCards = [
    {
        "id": "dist-1",
        "title": "Stock 5 kg",
        "subtitle": "Balón de fierro estándar",
        "unidades": 45,
        "statusKey": "ok",
        "statusLabel": "Stock óptimo",
        "accent": "success",
        "footerHint": "Actualizado hace 5 min",
        "showRegistrarEntrada": false
    },
    {
        "id": "dist-2",
        "title": "Stock 10 kg",
        "subtitle": "Uso doméstico regular",
        "unidades": 12,
        "statusKey": "low",
        "statusLabel": "Stock bajo",
        "accent": "warning",
        "footerHint": "Actualizado hace 15 min",
        "showRegistrarEntrada": true
    },
    {
        "id": "dist-3",
        "title": "Stock 15 kg",
        "subtitle": "Uso comercial / restaurantes",
        "unidades": 0,
        "statusKey": "empty",
        "statusLabel": "Agotado",
        "accent": "danger",
        "footerHint": "Sin stock desde ayer",
        "showRegistrarEntrada": true
    },
    {
        "id": "dist-4",
        "title": "Stock 45 kg",
        "subtitle": "Cilindro industrial",
        "unidades": 8,
        "statusKey": "ok",
        "statusLabel": "Stock suficiente",
        "accent": "success",
        "footerHint": "Actualizado hace 1 hora",
        "showRegistrarEntrada": false
    }
]

base.enterpriseStockRows = enterpriseStockRows
base.distributorStockCards = distributorStockCards
base.enterpriseMovements = enterpriseMovements
base.distributorMovements = distributorMovements
base.auditLogs = auditLogs
fs.writeFileSync(dbPath, `${JSON.stringify(base, null, 2)}\n`)
console.log(
    `Wrote enterpriseStockRows=${enterpriseStockRows.length}, distributorStockCards=${distributorStockCards.length}, enterpriseMovements=${enterpriseMovements.length}, distributorMovements=${distributorMovements.length}, auditLogs=${auditLogs.length}`,
)