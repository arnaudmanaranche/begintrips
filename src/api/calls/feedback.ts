import { apiInstance } from '@/api/config'

export const postFeedback = async ({
  comment,
}: {
  comment: string
}): Promise<void> => {
  if (!comment) {
    throw new Error('feedback.comment')
  }

  await apiInstance.post('/feedback', {
    content: comment,
  })
}
