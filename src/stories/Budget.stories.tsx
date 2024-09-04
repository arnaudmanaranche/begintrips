import { Budget } from '@/components/Budget/Budget'
import type { Meta, StoryObj } from '@storybook/react'

const meta = {
  title: 'Budget',
  component: Budget,
  args: {},
} satisfies Meta<typeof Budget>

export default meta

type Story = StoryObj<typeof meta>

export const Basic: Story = {
  args: {
    budgetSpent: 100,
    totalBudget: 2000,
  },
}
