import { SearchBoxCore, SessionToken } from '@mapbox/search-js-core'
import type { MutableRefObject } from 'react'
import { useEffect, useRef } from 'react'

export const useSearchDestination = (): {
  searchBoxRef: MutableRefObject<SearchBoxCore | null>
  sessionTokenRef: MutableRefObject<'' | SessionToken | undefined>
} => {
  const searchBoxRef = useRef<SearchBoxCore | null>(null)
  const sessionTokenRef = useRef<SessionToken | ''>()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const searchBoxInstance = new SearchBoxCore({
        accessToken: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN,
        language: 'en',
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
  }, [])

  return {
    searchBoxRef,
    sessionTokenRef,
  }
}
