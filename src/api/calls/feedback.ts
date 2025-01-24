import { apiInstance } from '@/api/config'

export const postFeedback = async ({
  comment,
}: {
  comment: string
}): Promise<void> => {
  await apiInstance.post('/feedback', {
    content: comment,
  })
}
