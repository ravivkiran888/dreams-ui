import { API_BASE_URL } from '../config/api'

export const fetchBullishSignals = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/analysis/api/signals/bullish`);
        if (!response.ok) {
            throw new Error(`Failed to fetch bullish signals: ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching bullish signals:', error);
        throw error;
    }
};
