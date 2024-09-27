import type { Meta, StoryObj } from '@storybook/react'

import { PaymentStatusTag } from '@/components/PaymentStatusTag/PaymentStatusTag'
import type { PaymentStatusEnum } from '@/types'

const paymentStatuses: PaymentStatusEnum[] = ['succeeded', 'failed', 'refunded']

const meta = {
  title: 'Payment Status Tag',
} satisfies Meta<typeof PaymentStatusTag>

export default meta
type Story = StoryObj<typeof meta>

export const Basic: Story = {
  render: () => {
    return (
      <div className="flex flex-wrap gap-2">
        {paymentStatuses.map((expense) => (
          <PaymentStatusTag key={expense} status={expense} />
        ))}
      </div>
    )
  },
}
