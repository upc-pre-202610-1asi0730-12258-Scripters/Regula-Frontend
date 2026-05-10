/**
 * @param {Array<{ id: string, weights: Record<string, number> }>} maps
 * @param {string} mapId
 * @returns {Record<string, number>}
 */
export function pickWeightsMap(maps, mapId) {
    const row = (maps || []).find((m) => m.id === mapId)
    return row?.weights || {}
}
