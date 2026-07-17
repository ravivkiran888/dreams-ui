import { fetchBullishSignals } from "../services/bullishSignalsService"

export const bullishLoader = async () => {
    const result = {
        signals: { data: null, error: null },
    }

    try {
        const signalsData = await fetchBullishSignals();
        result.signals = { data: signalsData, error: null };
    } catch (error) {
        console.error('Bullish Signals Error:', error);
        result.signals = { data: null, error: error.message || 'Failed to load bullish signals' };
    }

    return result;
};
