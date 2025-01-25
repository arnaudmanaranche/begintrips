import '@schedule-x/theme-default/dist/index.css'

import type { CalendarEventExternal } from '@schedule-x/calendar'
import { createViewDay, createViewWeek } from '@schedule-x/calendar'
import { createEventModalPlugin } from '@schedule-x/event-modal'
import { createEventsServicePlugin } from '@schedule-x/events-service'
import { ScheduleXCalendar, useCalendarApp } from '@schedule-x/react'
import { addHours, format, isAfter, isBefore } from 'date-fns'
import { useRouter } from 'next/router'
import type { ReactNode } from 'react'
import { useCallback, useEffect, useState } from 'react'

import { useDrawerActions } from '@/providers/Drawer/Drawer.Provider'
import type { JourneyPage } from '@/types'
import { formatDate } from '@/utils/date'

interface CalendarAppProps {
  events: JourneyPage
}

export function Calendar({ events }: CalendarAppProps): ReactNode {
  const router = useRouter()
  const { setIsOpen, setCurrentType, setSelectedExpense, ref } =
    useDrawerActions()
  const eventsServicePlugin = useState(() => createEventsServicePlugin())[0]

  const handleOnClickDateTime = useCallback(
    (dateTime: string) => {
      const date = new Date(dateTime)
      const formattedStart = format(date, 'yyyy-MM-dd')
      const formattedStartTime = format(date, 'HH:mm')
      const formattedEndTime = format(addHours(date, 1), 'HH:mm')

      setIsOpen(true)
      setCurrentType('AddExpense')
      setSelectedExpense({
        startDate: formattedStart,
        startTime: formattedStartTime,
        endTime: formattedEndTime,
        name: '',
        amount: 0,
        categories: {
          name: '',
        },
      })
    },
    [setCurrentType, setIsOpen, setSelectedExpense]
  )

  const calendar = useCalendarApp(
    {
      views: [createViewDay(), createViewWeek()],
      calendars: {
        personal: {
          colorName: 'personal',
          lightColors: {
            main: '#F85231',
            container: '#FF6E4E',
            onContainer: '#fff',
          },
        },
      },
      selectedDate: events.journey.departureDate,
      events: events?.calendarExpenses,
      locale: router.locale === 'fr' ? 'fr-FR' : 'en-US',
      callbacks: {
        onClickDateTime(dateTime) {
          if (
            isBefore(new Date(dateTime), events.journey.departureDate) ||
            isAfter(
              formatDate(new Date(dateTime), 'yyyy-MM-dd', true),
              formatDate(
                new Date(events.journey.returnDate),
                'yyyy-MM-dd',
                true
              )
            )
          ) {
            return
          } else {
            handleOnClickDateTime(dateTime)

            ref.current = (e: CalendarEventExternal) => {
              eventsServicePlugin.add({
                ...e,
                id: '14fc1a11-b7c0-4d2a-9b1a-f7b720128e03',
                end: e.endDate,
                start: e.startDate,
                title: e.name,
                calendarId: 'personal',
              })
              const newEvents = eventsServicePlugin.getAll()
              eventsServicePlugin.set(newEvents)
            }
          }
        },
        onEventClick(event) {
          setIsOpen(true)
          setCurrentType('EditExpense')
          setSelectedExpense({
            startDate: format(new Date(event.start), 'yyyy-MM-dd'),
            startTime: format(new Date(event.start), 'HH:mm'),
            endTime: format(new Date(event.end), 'HH:mm'),
            name: event.title as string,
            amount: event.amount as number,
            id: event.id as string,
            category_id: event.category_id,
            categories: {
              name: event.categoryName,
            },
          })

          ref.current = (
            e: CalendarEventExternal,
            action: 'patch' | 'delete'
          ) => {
            if (action === 'patch') {
              eventsServicePlugin.update({
                ...e,
                end: e.endDate,
                start: e.startDate,
                title: e.name,
                calendarId: 'personal',
              })
            } else if (action === 'delete') {
              eventsServicePlugin.remove(e.id)
            }

            const newEvents = eventsServicePlugin.getAll()

            eventsServicePlugin.set(newEvents)
          }
        },
      },
    },
    [createEventModalPlugin(), eventsServicePlugin]
  )

  useEffect(() => {
    calendar.eventsService.getAll()
  }, [calendar.eventsService])

  return <ScheduleXCalendar calendarApp={calendar} />
}
