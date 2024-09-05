import type { Meta, StoryObj } from '@storybook/react'

import { Budget } from '@/components/Budget/Budget'

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
