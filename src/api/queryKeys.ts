export const QUERY_KEYS = {
  EXPENSES_BY_DAY: (journeyId: string) =>
    ['journey', journeyId, 'expensesByDay'] as const,
  EXPENSES_BY_CATEGORY: (journeyId: string) =>
    ['journey', journeyId, 'expensesByCategory'] as const,
  JOURNEYS: (userId: string) => ['user', userId, 'journeys'] as const,
  JOURNEY: (journeyId: string) => ['journey', journeyId] as const,
  JOURNEY_BUDGET_SPENT: (journeyId: string) =>
    ['journey', journeyId, 'budgetSpent'] as const,
  JOURNEY_DAYS: (journeyId: string) => ['journey', journeyId, 'days'] as const,
}
