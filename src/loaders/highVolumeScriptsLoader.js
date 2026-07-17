import { fetchHighVolumeScripts } from "../services/highVolumeScriptsService"

export const highVolumeScriptsLoader = async () => {
    const result = {
        scripts: { data: null, error: null },
    }

    try {
        const scriptsData = await fetchHighVolumeScripts();
        result.scripts = { data: scriptsData, error: null };
    } catch (error) {
        console.error('High Volume Scripts Error:', error);
        result.scripts = { data: null, error: error.message || 'Failed to load high volume scripts' };
    }

    return result;
};
