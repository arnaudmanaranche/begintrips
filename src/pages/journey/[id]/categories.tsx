import { StarIcon } from '@radix-ui/react-icons'
import type { User } from '@supabase/supabase-js'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import clsx from 'clsx'
import { AnimatePresence, motion } from 'framer-motion'
import type { GetServerSideProps } from 'next'
import type { ReactNode } from 'react'
import { defineMessages, useIntl } from 'react-intl'

import {
  getUserFavoriteCategories,
  updateUserFavoriteCategory,
} from '@/api/calls/users'
import { QUERY_KEYS } from '@/api/queryKeys'
import { DashboardLayout } from '@/components/DashboardLayout/DashboardLayout'
import { createClient } from '@/libs/supabase/server-props'
import type { UserFavoriteCategories } from '@/types'

interface JourneyCategoriesProps {
  user: User
}

const messages = defineMessages({
  categoriesDescription: {
    id: 'journeyCategoriesDescription',
    defaultMessage:
      'Favorite categories will appear first when adding a new expense or activity.',
  },
})

export default function JourneyCategories({
  user,
}: JourneyCategoriesProps): ReactNode {
  const intl = useIntl()
  const queryClient = useQueryClient()
  const { data, isPending } = useQuery({
    queryKey: QUERY_KEYS.USER_FAVORITE_CATEGORIES(),
    queryFn: () => getUserFavoriteCategories(),
  })

  const { mutateAsync } = useMutation({
    mutationFn: (categoryId: string) => updateUserFavoriteCategory(categoryId),
    onMutate: async (categoryId: string) => {
      const previousUserFavoriteCategories = queryClient.getQueryData<
        UserFavoriteCategories[]
      >(QUERY_KEYS.USER_FAVORITE_CATEGORIES())

      queryClient.setQueryData<UserFavoriteCategories[]>(
        QUERY_KEYS.USER_FAVORITE_CATEGORIES(),
        (oldData) => {
          if (!oldData) return oldData

          const updatedCategories = oldData.map((category) =>
            category.id === categoryId
              ? { ...category, isFavorite: !category.isFavorite }
              : category
          )

          if (
            updatedCategories.some((category) => category.id === categoryId)
          ) {
            return updatedCategories
          }

          const targetCategory = oldData.find(
            (category) => category.id === categoryId
          )
          if (!targetCategory) return oldData

          return [
            ...oldData,
            {
              ...targetCategory,
              isFavorite: true,
              user_id: user?.id as string,
            },
          ]
        }
      )

      return { previousUserFavoriteCategories }
    },
    onError: (err, _, context) => {
      queryClient.setQueryData(
        QUERY_KEYS.USER_FAVORITE_CATEGORIES(),
        context?.previousUserFavoriteCategories
      )
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.USER_FAVORITE_CATEGORIES(),
      })
    },
  })

  return (
    <DashboardLayout>
      <p className="px-10 pt-6 text-lg text-black">
        {intl.formatMessage(messages.categoriesDescription)}
      </p>
      {isPending || !data ? (
        <div className="grid grid-cols-1 gap-4 px-10 pt-10 lg:grid-cols-4">
          <div className="h-[60px] w-full animate-pulse rounded-md bg-slate-200" />
          <div className="h-[60px] w-full animate-pulse rounded-md bg-slate-200" />
          <div className="h-[60px] w-full animate-pulse rounded-md bg-slate-200" />
          <div className="h-[60px] w-full animate-pulse rounded-md bg-slate-200" />
          <div className="h-[60px] w-full animate-pulse rounded-md bg-slate-200" />
          <div className="h-[60px] w-full animate-pulse rounded-md bg-slate-200" />
          <div className="h-[60px] w-full animate-pulse rounded-md bg-slate-200" />
          <div className="h-[60px] w-full animate-pulse rounded-md bg-slate-200" />
        </div>
      ) : (
        <motion.div
          className="mb-[80px] grid grid-cols-2 gap-6 px-10 pt-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          layout
        >
          <AnimatePresence>
            {data.map((category) => (
              <motion.div
                key={category.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                <motion.button
                  onClick={() => mutateAsync(category.id)}
                  className={clsx(
                    'bg-card text-card-foreground hover:text-accent-foreground hover:bg-accent flex w-full items-center justify-between rounded-lg border p-4 shadow-sm transition-colors',
                    category.isFavorite && 'border-primary'
                  )}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="text-xl"
                      role="img"
                      aria-label={category.name}
                    >
                      {category.emoji}
                    </span>
                    <span className="font-medium">{category.name}</span>
                  </div>
                  <div>
                    <StarIcon
                      className={clsx(
                        'h-5 w-5 transition-colors',
                        category.isFavorite
                          ? 'fill-primary text-primary'
                          : 'text-muted-foreground'
                      )}
                    />
                  </div>
                </motion.button>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </DashboardLayout>
  )
}

export const getServerSideProps = (async (context) => {
  const supabase = createClient(context)

  const { data, error } = await supabase.auth.getUser()

  if (error || !data) {
    return {
      redirect: {
        destination: '/welcome',
        permanent: false,
      },
    }
  }

  return {
    props: {
      user: data.user,
    },
  }
}) satisfies GetServerSideProps<{ user: User | null }>
