import { CalendarIcon, GlobeIcon, PlusIcon } from '@radix-ui/react-icons'
import type { IWantToStep } from '../IWantTo'

export interface SelectActionProps {
  setCurrentStep: (step: IWantToStep) => void
}

export function SelectAction({ setCurrentStep }: SelectActionProps) {
  return (
    <div className="mt-10 grid grid-cols-2 gap-5">
      <div
        className="flex cursor-pointer flex-col items-center justify-center space-y-2 rounded-lg border-[1px] border-neutral p-4 transition-colors hover:border-accent-dark hover:bg-accent-light/30"
        onClick={() => setCurrentStep('Change dates')}
      >
        <CalendarIcon />
        <span>Change dates</span>
      </div>
      <div
        className="flex cursor-pointer flex-col items-center justify-center space-y-2 rounded-lg border-[1px] border-neutral p-4 transition-colors hover:border-accent-dark hover:bg-accent-light/30"
        onClick={() => setCurrentStep('Select category')}
      >
        <PlusIcon />
        <span>Add manually expense</span>
      </div>
      <div
        className="flex cursor-pointer flex-col items-center justify-center space-y-2 rounded-lg border-[1px] border-neutral p-4 transition-colors hover:border-accent-dark hover:bg-accent-light/30"
        onClick={() => setCurrentStep('Change destination')}
      >
        <GlobeIcon />
        <span>Change destination</span>
      </div>
    </div>
  )
}
