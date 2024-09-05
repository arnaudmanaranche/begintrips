import { CheckCircledIcon, CircleIcon, Cross1Icon } from '@radix-ui/react-icons'
import { motion } from 'framer-motion'
import { useId } from 'react'

import { useJourneyStore } from '@/stores/journey.store'

function useHandleSubmit() {
  const { addItem } = useJourneyStore()
  const id = useId()

  // eslint-disable-next-line
  return (e: any) => {
    if (!e.target.value.length) return

    if (e.key === 'Enter') {
      addItem(e.target.value, id)
      e.target.value = ''
    }
  }
}

export function Checklist() {
  const { checkList, toggleItem, deleteItem } = useJourneyStore()
  const handleSubmit = useHandleSubmit()

  return (
    <div>
      <ul className="space-y-2">
        {checkList.map((element, index) => (
          <motion.li
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="flex items-center justify-between space-x-2"
            key={element.item}
          >
            <div className="flex items-center space-x-2">
              <div className="rounded-full p-2">
                {element.isDone ? (
                  <CheckCircledIcon
                    role="button"
                    onClick={() => toggleItem(element.item)}
                    className={`h-4 w-4  ${
                      element.isDone ? 'stroke-accent' : 'fill-transparent'
                    }`}
                  />
                ) : (
                  <CircleIcon
                    role="button"
                    onClick={() => toggleItem(element.item)}
                    className={`h-4 w-4 ${
                      element.isDone ? 'stroke-accent' : 'fill-transparent'
                    }`}
                  />
                )}
              </div>
              <motion.span
                className="relative truncate"
                style={{
                  // @ts-expect-error TODO
                  '--strike-through': element.isDone ? '1' : '0',
                  opacity: element.isDone ? 0.5 : 1,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <span
                  className={`absolute left-0 top-1/2 w-full border-t-2 border-accent transition-transform duration-300`}
                  style={{
                    transform: `translateY(-50%) scaleX(var(--strike-through))`,
                  }}
                />
                {element.item}
              </motion.span>
            </div>
            <Cross1Icon
              role="button"
              onClick={() => deleteItem(element.item)}
              className="h-4 w-4 stroke-accent"
            />
          </motion.li>
        ))}
      </ul>
      <input
        type="text"
        className="w-full border-t-[1px] p-2 outline-none"
        required
        placeholder="Add item"
        onKeyUp={handleSubmit}
      />
    </div>
  )
}
