import API_BASE_URL from '../config/api';

export const fetchSectors = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/analysis/api/signals/sectors`);
    if (!response.ok) {
      throw new Error('Failed to fetch sectors');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching sectors:', error);
    throw error;
  }
};
