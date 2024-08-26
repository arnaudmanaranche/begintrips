import { hasJourneyPassed } from '@/utils/has-journey-passed'

describe('hasJourneyPassed', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2024-01-01'))
  })

  it('should return true if the journey has passed', () => {
    const departureDate = new Date('2023-12-31')

    expect(hasJourneyPassed(departureDate)).toBe(true)
  })
  it('should return false if the journey has not passed', () => {
    const departureDate = new Date('2024-01-02')

    expect(hasJourneyPassed(departureDate)).toBe(false)
  })
})
