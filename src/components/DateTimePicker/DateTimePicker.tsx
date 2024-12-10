import 'react-day-picker/style.css'

import type { ReactNode } from 'react'
import type { DateRange } from 'react-day-picker'
import { DayPicker } from 'react-day-picker'

interface BaseProps {
  minDate: Date
  maxDate: Date
}

interface RangeModeProps extends BaseProps {
  mode: 'range'
  onSelectDate: (date: DateRange | undefined) => void
  selectedDates: DateRange | undefined
}

interface SingleModeProps extends BaseProps {
  mode: 'single'
  onSelectDate: (date: Date | undefined) => void
  selectedDates: Date | undefined
}

type InputTimeProps = RangeModeProps | SingleModeProps

export function InputTime(props: InputTimeProps): ReactNode {
  const { minDate, maxDate, mode } = props

  if (mode === 'range') {
    const { selectedDates, onSelectDate } = props as RangeModeProps

    return (
      <DayPicker
        mode="range"
        required
        selected={selectedDates}
        onSelect={onSelectDate}
        disabled={{
          before: minDate,
          after: maxDate,
        }}
      />
    )
  }

  const { selectedDates, onSelectDate } = props as SingleModeProps

  return (
    <DayPicker
      mode="single"
      selected={selectedDates}
      onSelect={onSelectDate}
      disabled={{
        before: minDate,
        after: maxDate,
      }}
    />
  )
}
