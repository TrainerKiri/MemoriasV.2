const SPOTIFY_API_URL = 'https://api.spotify.com/v1';

export async function searchTracks(query) {
    try {
        const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/spotify-search?q=${encodeURIComponent(query)}`);
        if (!response.ok) {
            throw new Error('Failed to search tracks');
        }
        const data = await response.json();
        if (data.error) {
            throw new Error(data.error.message || 'Failed to search tracks');
        }
        return data;
    } catch (error) {
        console.error('Error searching tracks:', error);
        throw error;
    }
}