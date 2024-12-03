import type { NextApiRequest, NextApiResponse } from 'next'
import { Resend } from 'resend'

import {
  EMAIL_TEMPLATES,
  getEmailTemplate,
  getTemplateTitle,
} from '@/utils/emails/get-template'

const resend = new Resend(process.env.RESEND_API_KEY)

const SENDER = 'BeginTrips <contact@begintrips.com>'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { email, template } = req.body

    const data = await resend.emails.send({
      from: SENDER,
      to: email,
      subject: getTemplateTitle(
        EMAIL_TEMPLATES[template as keyof typeof EMAIL_TEMPLATES]
      ),
      html: getEmailTemplate(
        EMAIL_TEMPLATES[template as keyof typeof EMAIL_TEMPLATES]
      ),
    })

    return res.status(200).json({ data })
  } catch (error) {
    return res.status(500).json({ error })
  }
}
