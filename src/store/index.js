import { configureStore } from '@reduxjs/toolkit';
import bullishReducer from './slices/bullishSlice';
import highVolumeReducer from './slices/highVolumeSlice';
import marketIndicesReducer from './slices/marketIndicesSlice';

export const store = configureStore({
  reducer: {
    bullish: bullishReducer,
    highVolume: highVolumeReducer,
    marketIndices: marketIndicesReducer,
  },
});

export default store;
