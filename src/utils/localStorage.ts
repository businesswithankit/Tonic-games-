import { Game, RecentPlayItem } from '../types';

const RECENTLY_PLAYED_KEY = 'games_tonic_recently_played';
const RECENT_SEARCHES_KEY = 'games_tonic_recent_searches';

export const getRecentlyPlayed = (): RecentPlayItem[] => {
  try {
    const data = localStorage.getItem(RECENTLY_PLAYED_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Failed to parse recently played games', e);
    return [];
  }
};

export const addRecentlyPlayed = (game: Game): RecentPlayItem[] => {
  try {
    const list = getRecentlyPlayed();
    const filtered = list.filter((item) => item.id !== game.id);
    const newItem: RecentPlayItem = {
      id: game.id,
      title: game.title,
      thumbnail: game.thumbnail,
      playUrl: game.playUrl,
      category: game.category,
      orientation: game.orientation,
      lastPlayedAt: new Date().toISOString(),
    };
    const updated = [newItem, ...filtered].slice(0, 12);
    localStorage.setItem(RECENTLY_PLAYED_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to save recently played game', e);
    return [];
  }
};

export const getRecentSearches = (): string[] => {
  try {
    const data = localStorage.getItem(RECENT_SEARCHES_KEY);
    return data ? JSON.parse(data) : ['Action', 'Cyber', 'Racing', 'Arcade', 'Puzzle'];
  } catch (e) {
    return ['Action', 'Cyber', 'Racing', 'Arcade', 'Puzzle'];
  }
};

export const addRecentSearch = (query: string): string[] => {
  if (!query || !query.trim()) return getRecentSearches();
  const trimmed = query.trim();
  try {
    const searches = getRecentSearches();
    const filtered = searches.filter((item) => item.toLowerCase() !== trimmed.toLowerCase());
    const updated = [trimmed, ...filtered].slice(0, 10);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    return [];
  }
};

export const clearRecentSearches = (): void => {
  try {
    localStorage.removeItem(RECENT_SEARCHES_KEY);
  } catch (e) {
    console.error('Failed to clear recent searches', e);
  }
};
