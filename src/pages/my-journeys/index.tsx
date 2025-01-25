import { PlusCircledIcon } from '@radix-ui/react-icons'
import { useQuery } from '@tanstack/react-query'
import type { GetServerSideProps } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import type { ReactNode } from 'react'
import { defineMessages, FormattedMessage, useIntl } from 'react-intl'

import { getUserJourneys } from '@/api/calls/users'
import { QUERY_KEYS } from '@/api/queryKeys'
import { AccountBottomBar } from '@/components/AccountBottomBar/AccountBottomBar'
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
    <div className="relative min-h-screen flex-1 bg-[#faf9f8] pt-10 lg:pt-0">
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
      <AccountBottomBar />
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
