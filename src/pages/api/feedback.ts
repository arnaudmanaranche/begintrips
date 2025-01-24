import type { NextApiRequest, NextApiResponse } from 'next'

import createClient from '@/libs/supabase/api'

interface FeedbackResponse {
  id: string
  appId: string
  archived: boolean
  churnRisk: boolean
  content: string
  createdAt: string
  customerId: string
  customerUsername: string | null
  isQualitative: boolean
  isValid: boolean
  sentiment: number
  suggestedAction: string
  tag: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const supabase = createClient(req, res)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { content } = req.body

  if (!user?.id) {
    return res.status(401).json({ message: 'User not authenticated' })
  }

  const response = await fetch('https://feeedbackr.com/api/feedbacks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.FEEEDBACKR_API_KEY,
    },
    body: JSON.stringify({
      appId: process.env.FEEEDBACKR_APP_ID,
      content,
      customerId: user.id,
    }),
  })

  const data = (await response.json()) as FeedbackResponse

  if (data.id) {
    return res.status(201).json({ message: 'Feedback sent successfully' })
  }

  return res.status(500).json({ message: 'Feedback not sent' })
}
