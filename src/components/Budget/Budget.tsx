export function Budget({
  spentBudget,
  totalBudget,
}: {
  spentBudget: number
  totalBudget: number
}) {
  // Calculate the percentage spent
  const percentageSpent =
    totalBudget > 0 ? (spentBudget / totalBudget) * 100 : 0

  // Determine the color based on percentage spent
  let strokeColor = '#4CAF50' // Green
  if (percentageSpent > 90) {
    strokeColor = '#F44336' // Red
  } else if (percentageSpent > 50) {
    strokeColor = '#FF9800' // Orange
  }

  // Determine the offset and fill the circle fully if spent budget exceeds total budget
  const radius = 80
  const circumference = 2 * Math.PI * radius
  const offset = Math.min(
    (percentageSpent / 100) * circumference,
    circumference
  )

  return (
    <div className="relative flex min-h-[200px] items-center justify-center">
      <svg width="200" height="200" viewBox="0 0 200 200" className="absolute">
        <circle
          cx="100"
          cy="100"
          r="80"
          stroke="#e0e0e0"
          strokeWidth="10"
          fill="none"
        />
      </svg>
      <svg width="200" height="200" viewBox="0 0 200 200" className="absolute">
        <circle
          cx="100"
          cy="100"
          r="80"
          stroke={strokeColor}
          strokeWidth="10"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - offset}
        />
      </svg>
      <div className="absolute text-center text-gray-700">
        <div className="text-2xl font-bold">
          {spentBudget > totalBudget
            ? '100%'
            : `${Math.round(percentageSpent)}%`}
        </div>
        <div className="mt-1 text-sm">{`$${spentBudget} of $${totalBudget} spent`}</div>
      </div>
    </div>
  )
}
