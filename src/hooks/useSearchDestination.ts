import { SearchBoxCore, SessionToken } from '@mapbox/search-js-core'
import { useRouter } from 'next/router'
import type { MutableRefObject } from 'react'
import { useEffect, useRef } from 'react'

export const useSearchDestination = (): {
  searchBoxRef: MutableRefObject<SearchBoxCore | null>
  sessionTokenRef: MutableRefObject<'' | SessionToken | undefined>
} => {
  const searchBoxRef = useRef<SearchBoxCore | null>(null)
  const sessionTokenRef = useRef<SessionToken | ''>()
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const searchBoxInstance = new SearchBoxCore({
        accessToken: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN,
        language: router.locale,
        types: 'city',
        limit: 7,
      })
      const sessionToken = new SessionToken()

      searchBoxRef.current = searchBoxInstance
      sessionTokenRef.current = sessionToken

      return () => {
        if (searchBoxRef.current) {
          searchBoxRef.current = null
          sessionTokenRef.current = ''
        }
      }
    }
  }, [router.locale])

  return {
    searchBoxRef,
    sessionTokenRef,
  }
}
