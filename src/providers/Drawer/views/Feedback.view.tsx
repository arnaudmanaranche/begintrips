import type { ReactNode } from 'react'
import { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { toast } from 'sonner'
import { Drawer } from 'vaul'

import { postFeedback } from '@/api/calls/feedback'
import { Button } from '@/components/Button/Button'

export function FeedbackView(): ReactNode {
  const [comment, setComment] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handlePostFeedback = async () => {
    setIsLoading(true)

    try {
      await postFeedback({
        comment,
      })
    } catch {
      toast.error(
        <FormattedMessage id="feedbackError" defaultMessage="Error" />
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex h-full w-full grow flex-col rounded-[16px] bg-zinc-50 p-5">
      <div className="mx-auto max-w-md">
        <Drawer.Title
          className="mb-2 text-2xl font-medium text-zinc-900"
          asChild
        >
          <h3>Give us feedback</h3>
        </Drawer.Title>
        <Drawer.Description className="mb-2 text-zinc-600">
          We are always looking for ways to improve our service. Please let us
          know how we can improve your experience.
        </Drawer.Description>
        <form
          onSubmit={(e) => {
            e.preventDefault()
          }}
          className="flex flex-col gap-4"
        >
          <textarea
            name="comment"
            id="comment"
            placeholder="Your message"
            value={comment}
            rows={4}
            onChange={(e) => setComment(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-4 py-2 text-gray-900 placeholder:text-gray-400 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <Button
            onClick={() => {
              handlePostFeedback()
            }}
            isDisabled={!comment || isLoading}
            className="w-full rounded-md bg-accent px-4 py-2 text-white"
          >
            {isLoading ? (
              <FormattedMessage
                id="sendFeedback"
                defaultMessage="Sending feedback..."
              />
            ) : (
              <FormattedMessage
                id="sendFeedback"
                defaultMessage="Send feedback"
              />
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}
