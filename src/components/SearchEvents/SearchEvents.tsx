import { MagnifyingGlassIcon } from '@radix-ui/react-icons'
import clsx from 'clsx'
import { motion } from 'framer-motion'
import Image from 'next/image'
import type { ReactNode } from 'react'
import { useState } from 'react'

import { useCreateExpense } from '@/api/hooks/createExpense'
import { useSearchEvents } from '@/libs/ticketmaster/client'
import type { Day, Journey } from '@/types'
import { formatDate } from '@/utils/date'
import { hasJourneyPassed } from '@/utils/has-journey-passed'

interface SearchEventsProps {
  journey: Journey
  days: Day[]
}

export function SearchEvents({ journey, days }: SearchEventsProps): ReactNode {
  const { events, isLoading, error, searchEvents } = useSearchEvents()
  const [searchValue, setSearchValue] = useState('')
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const { handleCreateExpense } = useCreateExpense({})

  return (
    <>
      {hasJourneyPassed(new Date(journey?.departureDate as string)) ? null : (
        <div className="flex space-x-2 border-x-[1px] px-10 py-6">
          <MagnifyingGlassIcon className="h-6 w-6 text-black/70" />
          <input
            className="min-w-[220px] text-black/70 outline-none"
            type="text"
            placeholder="Search for events, concerts..."
            defaultValue={searchValue}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => {
              setIsSearchFocused(false)
            }}
            onChange={(e) => {
              setSearchValue(e.target.value)
              searchEvents({
                query: e.target.value,
                startDate: formatDate(
                  new Date(journey.departureDate),
                  "yyyy-MM-dd'T'HH:mm:ss'Z'"
                ),
                endDate: formatDate(
                  new Date(journey.returnDate),
                  "yyyy-MM-dd'T'HH:mm:ss'Z'"
                ),
                city: journey.destination,
              })
            }}
          />
        </div>
      )}
      <div
        className={clsx(
          'absolute left-0 right-0 top-[100%] h-screen bg-black/30 transition-all duration-200',
          isSearchFocused ? 'visible opacity-100' : 'invisible opacity-0'
        )}
      />
      <motion.div
        className="absolute left-0 right-0 top-[100%] flex max-h-[600px] min-h-[400px] overflow-y-scroll bg-white p-10 shadow-lg"
        initial={{ opacity: 0, y: 0, visibility: 'hidden' }}
        animate={
          isSearchFocused
            ? { opacity: 1, y: 0, zIndex: 100, visibility: 'visible' }
            : { opacity: 0, y: 0, visibility: 'hidden' }
        }
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        {isLoading ? (
          <div className="grid w-full grid-cols-12 gap-4 p-6">
            <div className="col-span-3 h-[200px] animate-pulse rounded-lg bg-slate-200" />
            <div className="col-span-3 h-[200px] animate-pulse rounded-lg bg-slate-200" />
            <div className="col-span-3 h-[200px] animate-pulse rounded-lg bg-slate-200" />
            <div className="col-span-3 h-[200px] animate-pulse rounded-lg bg-slate-200" />
            <div className="col-span-3 h-[200px] animate-pulse rounded-lg bg-slate-200" />
            <div className="col-span-3 h-[200px] animate-pulse rounded-lg bg-slate-200" />
            <div className="col-span-3 h-[200px] animate-pulse rounded-lg bg-slate-200" />
            <div className="col-span-3 h-[200px] animate-pulse rounded-lg bg-slate-200" />
          </div>
        ) : error ? (
          <div className="flex w-full items-center justify-center">
            <span className="text-xl text-black/30">
              An error occurred while fetching events. Please try again later.
            </span>
          </div>
        ) : searchValue !== '' && events.length > 0 ? (
          <div
            className={`grid w-full gap-4 ${
              events.length === 0 ? 'grid-cols-1' : 'grid-cols-12'
            }`}
          >
            {events.map((event) => (
              <div
                key={event.id}
                className="pointer-events-auto col-span-3 space-y-2"
                onClick={() => {
                  const dayId = days?.find(
                    (day) =>
                      day.startDate ===
                      formatDate(
                        new Date(event.dates?.start.dateTime as string),
                        'yyyy-MM-dd'
                      )
                  )?.id

                  if (!dayId) {
                    return
                  }

                  handleCreateExpense({
                    expense: {
                      dayId,
                      amount:
                        event.priceRanges?.[0].max ||
                        event.priceRanges?.[0].min ||
                        0,
                      name: event.name,
                      startDate: event.dates?.start.dateTime as string,
                      category_id: '',
                      categories: {
                        name: 'other',
                      },
                      journeyId: journey.id,
                    },
                  })
                  setIsSearchFocused(false)
                }}
              >
                <Image
                  className="rounded-md"
                  src={event.images?.[0].url || ''}
                  alt={event.name}
                  width={event.images?.[0].width}
                  height={event.images?.[0].height}
                />
                <div>
                  <p>{event.name}</p>
                  <p className="text-sm">
                    {formatDate(
                      new Date(event.dates?.start.dateTime as string),
                      'dd MMMM yyyy - HH:mm'
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex w-full items-center justify-center">
            <span className="text-xl text-black/30">No events found</span>
          </div>
        )}
      </motion.div>
    </>
  )
}
