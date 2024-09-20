/* eslint-disable @typescript-eslint/no-require-imports */
const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const { exec } = require('child_process')
const ora = require('ora')

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

interface ProductPlanProps {
  items: string[]
  price: number
  title: string
  externalProductId: string
  mode: string
  internalProductId: string
  isDisabled: boolean
  isMostPopular: boolean
}

const parseItems = (items: string) => {
  try {
    const correctedItems = items.replace(/'/g, '"')
    return JSON.parse(correctedItems)
  } catch (error) {
    console.error('Error parsing items:', error)
    return []
  }
}

const fetchProductPlans = async (): Promise<
  Record<string, ProductPlanProps>
> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(`Error fetching products: ${error.message}`)
  }

  const productPlans: Record<string, ProductPlanProps> = {}

  data?.forEach(
    (product: {
      title: string
      items: string
      price: number
      external_product_id: string
      type: string
      id: string
      is_disabled: boolean
      is_most_popular: boolean
    }) => {
      const planKey = product.title.replace(/\s+/g, '_').toUpperCase() // e.g., 'Journey Pack' -> 'JOURNEY_PACK'

      productPlans[planKey] = {
        items: parseItems(product.items),
        price: product.price,
        title: product.title,
        externalProductId: product.external_product_id || '',
        mode: product.type === 'monthly' ? 'subscription' : 'payment',
        internalProductId: product.id,
        isDisabled: product.is_disabled,
        isMostPopular: product.is_most_popular,
      }
    }
  )

  return productPlans
}

const main = async () => {
  const spinner = ora('Fetching product plans...').start()
  const productPlans = await fetchProductPlans()
  spinner.succeed('Product plans')

  const fileContent = `import type { ProductPlanProps } from '@/types'

export const PLANS: Record<string, ProductPlanProps> = ${JSON.stringify(productPlans, null, 2)};
`

  spinner.start('Writing to plan.ts...')
  fs.writeFileSync('src/utils/product-plans.ts', fileContent, 'utf8')
  spinner.succeed('`product-plans.ts` file has been created')

  spinner.start('Linting plan.ts...')
  exec(
    'prettier --write --log-level=silent src/utils/product-plans.ts',
    (error: { message: string }) => {
      if (error) {
        spinner.fail(`Error running Prettier: ${error.message}`)
        return
      }

      spinner.succeed('Prettier formatting completed')
    }
  )
}

main()
