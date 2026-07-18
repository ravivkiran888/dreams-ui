import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchHighVolumeScripts } from '../../services/highVolumeScriptsService';

const STALE_TIME_MS = 4 * 60 * 1000;

export const fetchHighVolumeScriptsData = createAsyncThunk(
  'highVolume/fetchHighVolumeScriptsData',
  async (_, { rejectWithValue }) => {
    try {
      return await fetchHighVolumeScripts();
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to load high volume scripts');
    }
  },
  {
    condition: (arg = {}, { getState }) => {
      const { status, lastFetchedAt } = getState().highVolume;
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

const highVolumeSlice = createSlice({
  name: 'highVolume',
  initialState: {
    data: null,
    error: null,
    status: 'idle',
    lastFetchedAt: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHighVolumeScriptsData.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchHighVolumeScriptsData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
        state.lastFetchedAt = Date.now();
      })
      .addCase(fetchHighVolumeScriptsData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message || 'Failed to load high volume scripts';
      });
  },
});

export default highVolumeSlice.reducer;
