export const GLOBAL_EPOCH_MS = Date.UTC(2026, 0, 1, 0, 0, 0);
export const REAL_MS_PER_GAME_DAY = 30 * 60 * 1000;

export function getGlobalGameClock(now = Date.now()) {
  const elapsed = Math.max(0, now - GLOBAL_EPOCH_MS);
  const totalDays = Math.floor(elapsed / REAL_MS_PER_GAME_DAY);
  const msIntoDay = elapsed % REAL_MS_PER_GAME_DAY;
  const gameHour = Math.floor(msIntoDay / (REAL_MS_PER_GAME_DAY / 24));
  const gameYear = 1987 + Math.floor(totalDays / 360);
  const gameDay = (totalDays % 360) + 1;
  return { gameDay, gameHour, gameYear, totalDays };
}