import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { useState } from 'react'

import { Input } from '@/components/Input/Input'

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
      <div className="mt-6 space-y-10">
        <div className="space-y-8">
          <p className="text-4xl font-medium">Default</p>
          <Input
            {...args}
            onChange={(e) => setValue(e.target.value)}
            value={value}
          />
        </div>
        <div className="space-y-8">
          <p className="text-4xl font-medium">With value</p>
          <Input
            {...args}
            onChange={(e) => setValue(e.target.value)}
            value="Azerty123@@@"
            label="Password"
            type="password"
            id="password"
          />
        </div>
        <div className="space-y-8">
          <p className="text-4xl font-medium">Disabled</p>
          <Input
            isDisabled
            {...args}
            value="Disabled"
            label="Disabled"
            id="disabled"
            type="text"
          />
        </div>
      </div>
    )
  },
}
