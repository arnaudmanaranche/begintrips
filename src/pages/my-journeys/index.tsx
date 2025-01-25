import {
  PaperPlaneIcon,
  PersonIcon,
  PlusCircledIcon,
} from '@radix-ui/react-icons'
import { useQuery } from '@tanstack/react-query'
import type { GetServerSideProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import type { ReactNode } from 'react'
import { defineMessages, FormattedMessage, useIntl } from 'react-intl'

import { getUserJourneys } from '@/api/calls/users'
import { QUERY_KEYS } from '@/api/queryKeys'
import { Button } from '@/components/Button/Button'
import MyJourneys from '@/components/MyJourneys/MyJourneys'
import { NavBar } from '@/components/NavBar/NavBar'
import { createClient as createClientServerProps } from '@/libs/supabase/server-props'
import type { Journey, User } from '@/types'
import { SITE_URL } from '@/utils/seo'

interface MyJourneysPageProps {
  user: User
  journeys: Journey[]
}

const messages = defineMessages({
  title: {
    id: 'myJourneysPageTitle',
    defaultMessage: 'Begintrips | My journeys',
  },
})

export default function MyJourneysPage({
  user,
  journeys: initialJourneys,
}: MyJourneysPageProps): ReactNode {
  const { data: journeys, isFetching } = useQuery({
    queryKey: QUERY_KEYS.JOURNEYS(user.id),
    queryFn: () => getUserJourneys(),
    initialData: initialJourneys,
  })
  const router = useRouter()
  const intl = useIntl()

  return (
    <div className="relative min-h-screen flex-1 bg-white pt-10 lg:pt-0">
      <Head>
        <title>{intl.formatMessage(messages.title)}</title>
        <meta name="title" content={intl.formatMessage(messages.title)} />
        <meta property="og:url" content={`${SITE_URL}/my-journeys`} />
        <meta
          property="og:title"
          content={intl.formatMessage(messages.title)}
        />
        <meta
          name="twitter:title"
          content={intl.formatMessage(messages.title)}
        />
        <meta name="twitter:url" content={`${SITE_URL}/my-journeys`} />
      </Head>
      <NavBar />
      <div className="mx-auto flex max-w-screen-sm flex-1 flex-col justify-center gap-10 px-10 lg:px-0">
        <p className="text-3xl font-bold">
          <FormattedMessage id="myJourneys" defaultMessage="My journeys" />
        </p>
        <MyJourneys journeys={journeys} isLoading={isFetching} />
      </div>
      <div className="mt-14 flex justify-center pb-[80px]">
        {user.credits > 0 && journeys?.length > 0 ? (
          <Button
            icon={<PlusCircledIcon />}
            onClick={() => {
              router.push('/onboarding')
            }}
          >
            <FormattedMessage
              id="planANewJourney"
              defaultMessage="Plan a new journey"
            />
          </Button>
        ) : null}
      </div>
      <div className="fixed bottom-0 left-0 right-0 bg-white lg:hidden">
        <ul className="flex h-16 items-center justify-around ring-1 ring-slate-200">
          <li className="flex items-center">
            <Link
              href="/my-journeys"
              className="flex flex-col items-center text-primary"
            >
              <PaperPlaneIcon className="h-6 w-6" />
              <span>
                <FormattedMessage
                  id="myJourneys"
                  defaultMessage="My journeys"
                />
              </span>
            </Link>
          </li>
          <li className="flex items-center">
            <Link
              href="/account"
              className="flex flex-col items-center text-black"
            >
              <PersonIcon className="h-6 w-6" />
              <span>
                <FormattedMessage id="myAccount" defaultMessage="My account" />
              </span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  )
}

export const getServerSideProps = (async (context) => {
  const supabase = createClientServerProps(context)

  const { data: auth, error } = await supabase.auth.getUser()

  if (error || !auth) {
    return {
      redirect: {
        destination: '/welcome',
        permanent: false,
      },
    }
  }

  const journeys = await getUserJourneys()
  const { data: userEntity } = await supabase
    .from('users')
    .select('*')
    .eq('id', auth.user.id)
    .single()

  return {
    props: {
      user: {
        ...userEntity,
        email: auth.user.email,
      },
      journeys,
    },
  }
}) satisfies GetServerSideProps
