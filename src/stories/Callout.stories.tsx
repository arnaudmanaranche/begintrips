import { Callout } from '@/components/Callout/Callout'
import type { Meta, StoryObj } from '@storybook/react'

const meta = {
  title: 'Callout',
  component: Callout,
  args: {
    children: 'Callout',
    type: 'danger',
  },
} satisfies Meta<typeof Callout>

export default meta
type Story = StoryObj<typeof meta>

export const Basic: Story = {
  render: (args) => {
    return (
      <div className="flex flex-col space-y-4">
        <div className="space-y-4">
          <p className="text-4xl font-medium">Danger</p>
          <Callout.Danger {...args} />
        </div>
        <div className="space-y-4">
          <p className="text-4xl font-medium">Info</p>
          <Callout.Info {...args} />
        </div>
      </div>
    )
  },
}
