import Head from 'next/head'
import { useRouter } from 'next/router'

import { Button } from '@/components/Button/Button'

export default function ErrorPage() {
  const router = useRouter()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 px-4">
      <Head>
        <title>Oops! Journey Delayed | Planner.so</title>
      </Head>
      <h1 className="mb-4 text-center text-4xl font-bold">
        Oops! Your journey flight has been delayed
      </h1>
      <p className="mb-8 text-center text-xl">
        We are experiencing some turbulence on our end. Our team of expert
        digital pilots is working to get you back on course.
      </p>
      <p className="mb-8 text-center text-lg">
        While we fix this, why not grab a virtual coffee or stretch your legs?
      </p>
      <Button onClick={() => router.push('/')}>Return to Home</Button>
    </div>
  )
}
