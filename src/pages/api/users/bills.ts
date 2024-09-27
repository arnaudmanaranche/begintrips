import type { NextApiRequest, NextApiResponse } from 'next'

import createClient from '@/libs/supabase/api'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const supabase = createClient(req, res)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (req.method === 'GET') {
    const { data } = await supabase
      .from('payments')
      .select('id, status, created_at')
      .eq('user_id', user?.id as string)
      .order('created_at', { ascending: false })

    res.status(200).json(data)
  } else {
    res.status(405).json({
      message: 'Method not allowed',
    })
  }
}
