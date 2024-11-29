import { useFaq } from '../homepage'

interface FaqSchema {
  '@context': string
  '@type': string
  mainEntity: {
    '@type': string
    name: string
    acceptedAnswer: {
      '@type': string
      text: string
    }
  }[]
}

export const useFaqSchema = (): FaqSchema => {
  const faq = useFaq()

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map(({ title, subtitle }) => {
      return {
        '@type': 'Question',
        name: title,
        acceptedAnswer: {
          '@type': 'Answer',
          text: subtitle,
        },
      }
    }),
  }
}
