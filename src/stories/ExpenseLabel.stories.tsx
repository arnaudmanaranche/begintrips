import { ExpenseLabel } from '@/components/ExpenseLabel/ExpenseLabel'
import type { Meta, StoryObj } from '@storybook/react'
import { ExpenseCategoryEnum } from '@/types'
import { mappedExpensesWithColors } from '@/utils/expense-labels'

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
          <ExpenseLabel {...args} expenseCategory={expense.category} />
        ))}
      </div>
    )
  },
}
