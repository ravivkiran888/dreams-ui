import { fetchSectors } from "../services/sectorService"

export const dashboardLoader = async () => {
    const result = {
        marketIndices: { data: null, error: null },
        // Add other components here
        // news: { data: null, error: null },
        // charts: { data: null, error: null },
    }

    try {
        const sectors = await fetchSectors();
        result.marketIndices = { data: sectors, error: null };
    } catch (error) {
        console.error('Market Indices Error:', error);
        result.marketIndices = { data: null, error: error.message || 'Failed to load market indices' };
    }

    // Fetch other component data here
    // try {
    //     const news = await fetchNews();
    //     result.news = { data: news, error: null };
    // } catch (error) {
    //     result.news = { data: null, error: error.message };
    // }

    return result;
};
