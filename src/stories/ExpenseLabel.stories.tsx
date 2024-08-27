import { ExpenseLabel } from '@/components/ExpenseLabel/ExpenseLabel'
import { mappedExpensesWithColors } from '@/utils/expense-labels'
import type { Meta, StoryObj } from '@storybook/react'

const meta = {
  title: 'Expense Label',
  component: ExpenseLabel,
  args: {
    expenseCategory: 'restaurant',
  },
} satisfies Meta<typeof ExpenseLabel>

export default meta
type Story = StoryObj<typeof meta>

export const Basic: Story = {
  render: (args) => {
    return (
      <div className="flex flex-wrap gap-2">
        {mappedExpensesWithColors.map((expense) => (
          <ExpenseLabel
            key={expense.category}
            {...args}
            expenseCategory={expense.category}
          />
        ))}
      </div>
    )
  },
}
