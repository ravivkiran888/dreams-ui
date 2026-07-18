import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchSectors } from '../../services/sectorService';

const STALE_TIME_MS = 4 * 60 * 1000;

export const fetchMarketIndices = createAsyncThunk(
  'marketIndices/fetchMarketIndices',
  async (_, { rejectWithValue }) => {
    try {
      return await fetchSectors();
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to load market indices');
    }
  },
  {
    condition: (arg = {}, { getState }) => {
      const { status, lastFetchedAt } = getState().marketIndices;
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

const marketIndicesSlice = createSlice({
  name: 'marketIndices',
  initialState: {
    data: [],
    error: null,
    status: 'idle',
    lastFetchedAt: null,
    selectedSector: null,
  },
  reducers: {
    setSelectedSector: (state, action) => {
      const sector = typeof action.payload === 'string' ? action.payload.trim() : '';
      state.selectedSector = sector || null;
    },
    clearSelectedSector: (state) => {
      state.selectedSector = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMarketIndices.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchMarketIndices.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = Array.isArray(action.payload) ? action.payload : [];
        state.lastFetchedAt = Date.now();
      })
      .addCase(fetchMarketIndices.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message || 'Failed to load market indices';
      });
  },
});

export const { setSelectedSector, clearSelectedSector } = marketIndicesSlice.actions;

export default marketIndicesSlice.reducer;
