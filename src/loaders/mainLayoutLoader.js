import { fetchSectors } from "../services/sectorService"

export const mainLayoutLoader = async () => {
    const result = {
        marketIndices: { data: null, error: null },
    }

    try {
        const sectors = await fetchSectors();
        result.marketIndices = { data: sectors, error: null };
    } catch (error) {
        console.error('Market Indices Error:', error);
        result.marketIndices = { data: null, error: error.message || 'Failed to load market indices' };
    }

    return result;
};
