import API_BASE_URL from '../config/api';

export const fetchHighVolumeScripts = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/analysis/api/scrips/volumes`);
    if (!response.ok) {
      throw new Error('Failed to fetch high volume scripts');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching high volume scripts:', error);
    throw error;
  }
};
