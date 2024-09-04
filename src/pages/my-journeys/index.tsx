import { getUserJourneys } from '@/api/calls/users'
import MyJourneys from '@/components/MyJourneys/MyJourneys'
import { NavBar } from '@/components/NavBar/NavBar'
import { createClient as createClientServerProps } from '@/libs/supabase/server-props'
import type { Journey } from '@/types'
import { GearIcon, PaperPlaneIcon } from '@radix-ui/react-icons'
import type { User } from '@supabase/supabase-js'
import { useQuery } from '@tanstack/react-query'
import type { GetServerSidePropsContext } from 'next'
import Link from 'next/link'

export interface MyJourneysPageProps {
  user: User
  journeys: Journey[]
}

export default function MyJourneysPage({
  user,
  journeys: initialJourneys,
}: MyJourneysPageProps) {
  const { data: journeys, isFetching } = useQuery({
    queryKey: [user.id, 'journeys'],
    queryFn: () => getUserJourneys(),
    initialData: initialJourneys,
  })

  return (
    <div className="relative min-h-screen flex-1 bg-[#faf9f8] pt-10 lg:pt-0">
      <NavBar />
      <div className="mx-auto flex max-w-screen-sm flex-1 flex-col justify-center gap-10 px-10 lg:px-0">
        <p className="text-3xl">My journeys</p>
        <MyJourneys journeys={journeys} isLoading={isFetching} />
      </div>
      <div className="fixed bottom-0 left-0 right-0 bg-white lg:hidden">
        <ul className="flex h-16  items-center justify-around ring-1 ring-slate-200">
          <li className="flex items-center text-accent">
            <Link href="/my-journeys" className="flex flex-col items-center">
              <PaperPlaneIcon className="h-6 w-6" />
              <span>My journeys</span>
            </Link>
          </li>
          <li className="flex items-center">
            <Link
              href="/account"
              className="flex flex-col items-center text-black"
            >
              <GearIcon className="h-6 w-6" />
              <span>Settings</span>
            </Link>
          </li>
        </ul>
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
