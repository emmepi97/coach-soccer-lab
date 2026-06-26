export const PLAN_CODES = ['free','pro','team','founder'];
export const DEFAULT_PLAN_LIMITS = {
  free: { max_seasons: 1, max_players: 30, max_observations: 50, max_staff_members: 1 },
  pro: { max_seasons: 999, max_players: 500, max_observations: 999999, max_staff_members: 1 },
  team: { max_seasons: 999, max_players: 999999, max_observations: 999999, max_staff_members: 10 },
  founder: { max_seasons: 999999, max_players: 999999, max_observations: 999999, max_staff_members: 999 }
};
