import { getUserJourneys } from '@/api/calls/users'
import { Button } from '@/components/Button/Button'
import MyJourneys from '@/components/MyJourneys/MyJourneys'
import { createClient } from '@/libs/supabase/client'
import { createClient as createClientServerProps } from '@/libs/supabase/server-props'
import { useOnboardingStore } from '@/stores/onboarding.store'
import type { Journey } from '@/types'
import type { User } from '@supabase/supabase-js'
import { useQuery } from '@tanstack/react-query'
import type { GetServerSidePropsContext } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'

export interface AccountPageProps {
  user: User
  journeys: Journey[]
}

export default function AccountPage({
  user,
  journeys: initialJourneys,
}: AccountPageProps) {
  const supabase = createClient()
  const router = useRouter()
  const { resetJourney } = useOnboardingStore()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    resetJourney()
    router.push('/')
  }

  const { data: journeys, isFetching } = useQuery({
    queryKey: [user.id, 'journeys'],
    queryFn: () => getUserJourneys(),
    initialData: initialJourneys,
  })

  return (
    <div>
      <div className="mx-auto flex max-w-screen-xl px-10 pt-10 xl:px-0">
        <Link href="/" className="text-3xl">
          Planner
          <span className="text-accent">.so</span>
        </Link>
      </div>
      <div className="mx-auto mt-20 max-w-screen-sm px-10 lg:px-0">
        <div className="min-h-[500px]">
          <h1 className="mb-10 text-2xl font-bold">
            Hello, {user.email}&nbsp;!
          </h1>
          <div className="space-y-5">
            <p className="text-xl">My journeys</p>
            <MyJourneys journeys={journeys} isLoading={isFetching} />
          </div>
        </div>
        <div className="flex flex-col space-y-5 md:flex-row md:justify-between md:space-y-0">
          {journeys?.length === 0 ? (
            <Button onClick={() => router.push('/onboarding')}>
              Plan a new journey
            </Button>
          ) : null}
          <Button variant="ghost" onClick={() => handleLogout()}>
            Logout
          </Button>
        </div>
      </div>
    </div>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const supabase = createClientServerProps(context)

  const { data, error } = await supabase.auth.getUser()

  if (error || !data) {
    return {
      redirect: {
        destination: '/welcome',
        permanent: false,
      },
    }
  }

  const journeys = await getUserJourneys()

  return {
    props: {
      user: data.user,
      journeys,
    },
  }
}
