/**
 * Mapping between the frontend's cylinder weight keys ('5' | '10' | '15' | '45')
 * and the backend's ECylinderType enum values ('Kg5' | 'Kg10' | 'Kg15' | 'Kg45').
 */
const KG_TO_BACKEND_CYLINDER_TYPE = {
    '5': 'Kg5',
    '10': 'Kg10',
    '15': 'Kg15',
    '45': 'Kg45',
}

const BACKEND_CYLINDER_TYPE_TO_LABEL = {
    Kg5: '5 kg',
    Kg10: '10 kg',
    Kg15: '15 kg',
    Kg45: '45 kg',
}

const BACKEND_CYLINDER_TYPE_TO_KG = {
    Kg5: '5',
    Kg10: '10',
    Kg15: '15',
    Kg45: '45',
}

// EOutboundType (backend) <-> exit-kind keys used by the exit form.
const OUTBOUND_TYPE_TO_BACKEND = {
    venta: 'DirectSale',
    entrega: 'HomeDelivery',
    devol: 'ReturnToSupplier',
}

const OUTBOUND_TYPE_TO_LABEL = {
    DirectSale: 'Venta directa',
    HomeDelivery: 'Entrega a domicilio',
    ReturnToSupplier: 'Devolución a proveedor',
}

export function kgKeyToBackendCylinderType(kgKey) {
    return KG_TO_BACKEND_CYLINDER_TYPE[kgKey] ?? null
}

export function backendCylinderTypeToLabel(cylinderType) {
    return BACKEND_CYLINDER_TYPE_TO_LABEL[cylinderType] ?? cylinderType
}

export function backendCylinderTypeToKgKey(cylinderType) {
    return BACKEND_CYLINDER_TYPE_TO_KG[cylinderType] ?? null
}

export function exitKindToOutboundType(exitKind) {
    return OUTBOUND_TYPE_TO_BACKEND[exitKind] ?? null
}

export function outboundTypeToLabel(outboundType) {
    return OUTBOUND_TYPE_TO_LABEL[outboundType] ?? outboundType
}
