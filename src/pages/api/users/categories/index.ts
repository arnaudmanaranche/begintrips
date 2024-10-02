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
    try {
      const [categoriesResult, favoritesResult] = await Promise.all([
        supabase.from('categories').select('*'),
        supabase
          .from('categories_favorites')
          .select('category_id')
          .eq('user_id', user?.id as string),
      ])

      const { data: categories, error: categoriesError } = categoriesResult
      const { data: favorites, error: favoritesError } = favoritesResult

      if (categoriesError || favoritesError) {
        return res.status(500).json({
          message: 'Error fetching data',
        })
      }

      const favoriteCategoryIds = new Set(
        favorites?.map((fav) => fav.category_id)
      )

      const categoriesWithFavorites = categories?.map((category) => ({
        id: category.id,
        emoji: category.emoji,
        name: category.name,
        isFavorite: favoriteCategoryIds.has(category.id),
      }))

      const orderedCategories = categoriesWithFavorites?.sort(
        (a, b) => Number(b.isFavorite) - Number(a.isFavorite)
      )

      return res.status(200).json(orderedCategories)
    } catch {
      return res.status(500).json({
        message: 'An unexpected error occurred',
      })
    }
  } else {
    // Handle unsupported methods
    return res.status(405).json({
      message: 'Method not allowed',
    })
  }
}
