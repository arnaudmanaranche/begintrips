export const QUERY_KEYS = {
  JOURNEYS: (userId: string) => ['user', userId, 'journeys'] as const,
  JOURNEY: (journeyId: string) => ['journey', journeyId] as const,
  JOURNEY_DAYS: (journeyId: string) => ['journey', journeyId, 'days'] as const,
}
