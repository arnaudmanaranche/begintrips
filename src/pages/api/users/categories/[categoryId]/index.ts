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

  if (req.method === 'PATCH') {
    const { data: favorite, error: fetchError } = await supabase
      .from('categories_favorites')
      .select('id')
      .eq('user_id', user?.id as string)
      .eq('category_id', req.query.categoryId as string)
      .maybeSingle()

    if (fetchError) {
      res.status(400).json({
        message: fetchError,
      })
    }

    if (favorite) {
      const { error: deleteError } = await supabase
        .from('categories_favorites')
        .delete()
        .eq('id', favorite.id)
        .eq('user_id', user?.id as string)

      if (deleteError) {
        res.status(400).json({
          message: 'Error deleting favorite',
        })
      }

      res.status(204).end()
    } else {
      const { error: insertError } = await supabase
        .from('categories_favorites')
        .insert({
          user_id: user?.id as string,
          category_id: req.query.categoryId as string,
        })

      if (insertError) {
        res.status(400).json({
          message: 'Error inserting favorite',
        })
      }

      res.status(204).end()
    }
  } else {
    res.status(405).json({
      message: 'Method not allowed',
    })
  }
}
