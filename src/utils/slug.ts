import { Game } from '../types';

/**
 * Generates a clean, lowercase base slug from a game title.
 */
export function getBaseSlug(title: string): string {
  if (!title) return 'game';
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters except hyphens and spaces
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with a single hyphen
    .replace(/^-+|-+$/g, '') || 'game'; // Trim hyphens from both ends
}

/**
 * Gets a stable, unique, and collision-free slug for a game based on all loaded games.
 */
export function getGameSlug(game: Game, allGames: Game[] = []): string {
  const baseSlug = getBaseSlug(game.title);

  // Filter games with the same base slug (ignoring status if we want globally unique slugs)
  const duplicates = allGames
    .filter((g) => getBaseSlug(g.title) === baseSlug)
    .sort((a, b) => a.id.localeCompare(b.id)); // Stable sorting by Firestore ID

  if (duplicates.length <= 1) {
    return baseSlug;
  }

  // Find the stable index of the current game among duplicates
  const index = duplicates.findIndex((g) => g.id === game.id);
  if (index <= 0) {
    return baseSlug;
  }

  // Suffix index starting from 2
  return `${baseSlug}-${index + 1}`;
}

/**
 * Finds a game by its generated slug.
 */
export function findGameBySlug(slug: string, allGames: Game[]): Game | null {
  if (!slug) return null;
  
  // Find a precise match by evaluating slugs of all games
  const matched = allGames.find((g) => getGameSlug(g, allGames) === slug);
  return matched || null;
}
