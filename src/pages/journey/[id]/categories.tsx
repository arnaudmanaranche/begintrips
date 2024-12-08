import { StarFilledIcon, StarIcon } from '@radix-ui/react-icons'
import type { User } from '@supabase/supabase-js'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import type { GetServerSideProps } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import type { ReactNode } from 'react'
import { defineMessages, useIntl } from 'react-intl'

import {
  getUserFavoriteCategories,
  updateUserFavoriteCategory,
} from '@/api/calls/users'
import { QUERY_KEYS } from '@/api/queryKeys'
import { BottomBar } from '@/components/BottomBar/BottomBar'
import { Button } from '@/components/Button/Button'
import { Sidebar } from '@/components/Sidebar/Sidebar'
import { createClient } from '@/libs/supabase/server-props'
import type { UserFavoriteCategories } from '@/types'
import { SITE_URL } from '@/utils/seo'

interface JourneyCategoriesProps {
  user: User
}

const messages = defineMessages({
  title: {
    id: 'journeyCategoriesTitle',
    defaultMessage: 'My journey | Categories',
  },
})

export default function JourneyCategories({
  user,
}: JourneyCategoriesProps): ReactNode {
  const router = useRouter()
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
    <div className="flex">
      <Head>
        <title>{intl.formatMessage(messages.title)}</title>
        <meta name="title" content={intl.formatMessage(messages.title)} />
        <meta property="og:url" content={`${SITE_URL}`} />
        <meta
          property="og:title"
          content={intl.formatMessage(messages.title)}
        />
        <meta
          name="twitter:title"
          content={intl.formatMessage(messages.title)}
        />
        <meta name="twitter:url" content={`${SITE_URL}`} />
      </Head>
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <nav className="relative hidden min-h-[70px] items-center justify-between border-b-[1px] px-10 lg:flex">
          <div>
            <h2 className="text-3xl font-thin">
              Hello,{` `}
              <span className="text-xl font-normal">
                {user.email?.split('@')[0]}
              </span>
              !
            </h2>
          </div>
          <Button onClick={() => router.push('/account')} isRounded>
            {user.email?.split('@')[0]?.slice(0, 2)}
          </Button>
        </nav>
        <p className="px-10 pt-6 text-gray-600">
          Favorite categories will appear first when adding a new expense or
          activity.
        </p>
        {isPending ? (
          <div className="grid grid-cols-1 gap-4 px-10 pt-10 lg:grid-cols-4">
            <div className="h-[60px] w-full animate-pulse bg-slate-100" />
            <div className="h-[60px] w-full animate-pulse bg-slate-100" />
            <div className="h-[60px] w-full animate-pulse bg-slate-100" />
            <div className="h-[60px] w-full animate-pulse bg-slate-100" />
            <div className="h-[60px] w-full animate-pulse bg-slate-100" />
            <div className="h-[60px] w-full animate-pulse bg-slate-100" />
            <div className="h-[60px] w-full animate-pulse bg-slate-100" />
            <div className="h-[60px] w-full animate-pulse bg-slate-100" />
          </div>
        ) : null}
        <div className="mb-[80px] grid grid-cols-1 gap-6 px-10 pt-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {data?.map((category) => (
            <motion.div
              key={category.id}
              className="group relative cursor-pointer overflow-hidden rounded-lg bg-gray-50 p-6 transition-all hover:shadow-sm"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => mutateAsync(category.id)}
            >
              <motion.div
                className="absolute right-4 top-4"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                {category.isFavorite ? (
                  <StarFilledIcon className="h-6 w-6 text-yellow-500" />
                ) : (
                  <StarIcon className="h-6 w-6 text-gray-400 transition-colors group-hover:text-yellow-500" />
                )}
              </motion.div>
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{category.emoji}</span>
                <h3 className="text-lg capitalize text-gray-800">
                  {category.name}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <BottomBar />
    </div>
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
