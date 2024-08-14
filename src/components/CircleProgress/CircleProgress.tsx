import { useOnboardingStore } from "@/stores/onboarding.store";

export const CircularProgress = ({
  size = 150,
  strokeWidth = 10,
  color = "#4caf50",
}) => {
  const journey = useOnboardingStore((state) => state.journey);
  const budget = useOnboardingStore((state) => state.budget);
  const cbudget = journey.days.reduce((acc, day) => {
    return (
      acc +
      day.expenses.reduce((acc, expense) => {
        return acc + Number(expense.amount);
      }, 0)
    );
  }, 0);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (cbudget / budget) * circumference;

  return (
    <div>
      {cbudget > budget && (
        <p className="text-sm text-red-500">You are over budget</p>
      )}
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e6e6e6"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dy=".3em"
          fontSize="1em"
          fill={color}
        >
          {cbudget}$ / {budget}$
        </text>
      </svg>
    </div>
  );
};
