import '@schedule-x/theme-default/dist/index.css'

import type { CalendarEventExternal } from '@schedule-x/calendar'
import {
  createViewDay,
  createViewMonthAgenda,
  createViewMonthGrid,
  createViewWeek,
} from '@schedule-x/calendar'
import { createEventModalPlugin } from '@schedule-x/event-modal'
import { createEventsServicePlugin } from '@schedule-x/events-service'
import { ScheduleXCalendar, useNextCalendarApp } from '@schedule-x/react'
import type { ReactNode } from 'react'
import { useEffect } from 'react'

export function CalendarApp(): ReactNode {
  const events: CalendarEventExternal[] = [
    {
      id: '1',
      title: 'Event 1',
      start: '2024-12-08 10:00',
      end: '2024-12-08 12:00',
      color: '#FF0000',
    },
  ]

  const plugins = [createEventsServicePlugin(), createEventModalPlugin()]

  const calendar = useNextCalendarApp(
    {
      views: [
        createViewDay(),
        createViewWeek(),
        createViewMonthGrid(),
        createViewMonthAgenda(),
      ],
      events: events,
      callbacks: {
        onClickDateTime(dateTime) {
          console.log('onClickDateTime', dateTime)
        },
      },
    },
    plugins
  )

  useEffect(() => {
    calendar?.eventsService?.getAll()
  }, [calendar?.eventsService])

  return (
    <div className="hidden border-b-[1px] bg-gray-50 p-6 lg:block">
      <div>
        <ScheduleXCalendar calendarApp={calendar} />
      </div>
    </div>
  )
}
