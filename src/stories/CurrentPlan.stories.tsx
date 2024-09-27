import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'

import {
  CurrentPlan,
  type CurrentPlanProps,
} from '@/components/CurrentPlan/CurrentPlan'

const meta = {
  title: 'Current Plan',
  component: CurrentPlan,
  args: {
    isLoading: false,
    credits: 100,
    onCheckout: fn(),
  },
} satisfies Meta<CurrentPlanProps>

export default meta

type Story = StoryObj<typeof meta>

export const Basic: Story = {}
