import { Input } from '@/components/Input/Input'
import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { useState } from 'react'

const meta = {
  title: 'Input',
  component: Input,
  args: {
    label: 'Email',
    id: 'email',
    type: 'text',
    onChange: fn(),
  },
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Basic: Story = {
  render: function Render(args) {
    const [value, setValue] = useState('')

    return (
      <div className="mt-6">
        <Input
          {...args}
          onChange={(e) => setValue(e.target.value)}
          value={value}
        />
      </div>
    )
  },
}
