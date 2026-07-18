import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchBullishSignals } from '../../services/bullishSignalsService';

const STALE_TIME_MS = 4 * 60 * 1000;

export const fetchBullishSignalsData = createAsyncThunk(
  'bullish/fetchBullishSignalsData',
  async (_, { rejectWithValue }) => {
    try {
      return await fetchBullishSignals();
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to load bullish signals');
    }
  },
  {
    condition: (arg = {}, { getState }) => {
      const { status, lastFetchedAt } = getState().bullish;
      const forceRefresh = Boolean(arg?.force);

      if (forceRefresh) {
        return true;
      }

      if (status === 'loading') {
        return false;
      }

      if (!lastFetchedAt) {
        return true;
      }

      return Date.now() - lastFetchedAt > STALE_TIME_MS;
    },
  }
);

const bullishSlice = createSlice({
  name: 'bullish',
  initialState: {
    data: null,
    error: null,
    status: 'idle',
    lastFetchedAt: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBullishSignalsData.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchBullishSignalsData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
        state.lastFetchedAt = Date.now();
      })
      .addCase(fetchBullishSignalsData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message || 'Failed to load bullish signals';
      });
  },
});

export default bullishSlice.reducer;
