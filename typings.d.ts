namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: string
    // Supabase
    NEXT_PUBLIC_SUPABASE_URL: string
    NEXT_PUBLIC_SUPABASE_ANON_KEY: string
    SUPABASE_PROJECT_ID: string
    // Mapbox
    NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN: string
    // Ticketmaster
    NEXT_PUBLIC_TICKETMASTER_CONSUMER_KEY: string
    NEXT_PUBLIC_TICKETMASTER_CONSUMER_SECRET: string
    // Stripe
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: string
    STRIPE_SECRET_KEY: string
    STRIPE_WEBHOOK_SECRET: string
  }
}
