namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: string
    //  Supabase
    NEXT_PUBLIC_SUPABASE_URL: string
    NEXT_PUBLIC_SUPABASE_ANON_KEY: string
    SUPABASE_PROJECT_ID: string
    // Unsplash
    UNSPLASH_ACCESS_KEY: string
    // Mapbox
    NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN: string
  }
}
