import {
  ArchiveIcon,
  CheckCircledIcon,
  CircleIcon,
  Cross1Icon,
  StarFilledIcon,
  StarIcon,
} from '@radix-ui/react-icons'
import { ar } from 'date-fns/locale'
import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { useId, useState } from 'react'
import { useIntl } from 'react-intl'

import { useJourneyStore } from '@/stores/journey.store'

function useHandleSubmit() {
  const { addItem } = useJourneyStore()
  const id = useId()

  return (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
      addItem(e.currentTarget.value.trim(), id)
      e.currentTarget.value = ''
    }
  }
}

export function Checklist(): ReactNode {
  const { checkList, toggleItem, deleteItem, toggleFavorite, archiveItem } =
    useJourneyStore()
  const handleSubmit = useHandleSubmit()
  const intl = useIntl()
  const [showArchived, setShowArchived] = useState(false)

  const sortedCheckList = checkList.sort((a, b) => {
    if (a.isFavorite === b.isFavorite) return 0
    return a.isFavorite ? -1 : 1
  })

  const activeItems = sortedCheckList.filter((item) => !item.isArchived)
  const archivedItems = sortedCheckList.filter((item) => item.isArchived)

  return (
    <div className="rounded-lg bg-white p-4">
      {activeItems.length > 0 ? (
        <ul className="mb-4 space-y-3">
          {activeItems.map((element, index) => (
            <motion.li
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-center justify-between rounded-md bg-gray-50 p-2"
              key={element.item}
            >
              <div className="flex flex-grow items-center space-x-3">
                <button
                  onClick={() => toggleItem(element.item)}
                  className="focus:outline-none"
                >
                  {element.isDone ? (
                    <CheckCircledIcon className="h-5 w-5 text-green-500" />
                  ) : (
                    <CircleIcon className="h-5 w-5 text-gray-400" />
                  )}
                </button>
                <span
                  className={`${element.isDone ? 'text-gray-400 line-through' : 'text-gray-700'} transition-all duration-200`}
                >
                  {element.item}
                </span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => toggleFavorite(element.item)}
                  className="text-yellow-500 transition-colors duration-200 hover:text-yellow-700"
                >
                  {element.isFavorite ? (
                    <StarFilledIcon className="h-4 w-4" />
                  ) : (
                    <StarIcon className="h-4 w-4" />
                  )}
                </button>
                <button
                  onClick={() => archiveItem(element.item)}
                  className="text-blue-500 transition-colors duration-200 hover:text-blue-700"
                >
                  <ArchiveIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => deleteItem(element.item)}
                  className="text-red-500 transition-colors duration-200 hover:text-red-700"
                >
                  <Cross1Icon className="h-4 w-4" />
                </button>
              </div>
            </motion.li>
          ))}
        </ul>
      ) : null}
      {archivedItems.length > 0 ? (
        <button
          onClick={() => setShowArchived(!showArchived)}
          className="mb-4 text-blue-500 hover:text-blue-700"
        >
          {showArchived ? 'Hide Archived' : 'Show Archived'}
        </button>
      ) : null}
      {showArchived ? (
        <ul className="mb-4 space-y-3">
          {archivedItems.map((element, index) => (
            <motion.li
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-center justify-between rounded-md bg-gray-100 p-2"
              key={element.item}
            >
              <span className="text-gray-500">{element.item}</span>
              <button
                onClick={() => archiveItem(element.item)}
                className="text-blue-500 transition-colors duration-200 hover:text-blue-700"
              >
                <ArchiveIcon className="h-4 w-4" />
              </button>
            </motion.li>
          ))}
        </ul>
      ) : null}
      <input
        type="text"
        className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder={intl.formatMessage({
          id: 'checklistPlaceholder',
          defaultMessage: 'Add an item and press Enter',
        })}
        onKeyDown={handleSubmit}
      />
    </div>
  )
}
