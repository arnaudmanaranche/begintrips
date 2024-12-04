import { StarFilledIcon, StarIcon } from '@radix-ui/react-icons'
import type { User } from '@supabase/supabase-js'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
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
        <div className="mb-[80px] grid grid-cols-1 gap-4 px-10 pt-10 lg:grid-cols-4">
          {data?.map((category) => (
            <div
              key={category.id}
              className="relative cursor-pointer rounded-md p-4 capitalize text-black ring-1 ring-slate-200 transition-colors hover:bg-slate-50"
              onClick={() => mutateAsync(category.id)}
            >
              {category.isFavorite ? (
                <StarFilledIcon className="absolute right-3 top-3 text-yellow-500" />
              ) : (
                <StarIcon className="absolute right-3 top-3" />
              )}
              <div className="flex space-x-2">
                <span>{category.emoji}</span>
                <p>{category.name}</p>
              </div>
            </div>
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
