export const QUERY_KEYS = {
  JOURNEYS: (userId: string) => ['user', userId, 'journeys'] as const,
  JOURNEY: (journeyId: string) => ['journey', journeyId] as const,
  JOURNEY_DAYS: (journeyId: string) => ['journey', journeyId, 'days'] as const,
  USER_BILLS: (userId: string) => ['user', userId, 'bills'] as const,
  USER_FAVORITE_CATEGORIES: () => ['user', 'favoriteCategories'] as const,
}
