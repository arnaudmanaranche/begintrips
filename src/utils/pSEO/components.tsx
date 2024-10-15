import type {
  ClassAttributes,
  HTMLAttributes,
  LiHTMLAttributes,
  ReactNode,
} from 'react'

import { PromotionSection } from '@/components/PromotionSection/PromotionSection'

export const components = {
  PromotionSection,
  h1: (
    props: JSX.IntrinsicAttributes &
      ClassAttributes<HTMLHeadingElement> &
      HTMLAttributes<HTMLHeadingElement>
  ): ReactNode => (
    <h1 className="text-center text-5xl leading-normal" {...props} />
  ),
  h2: (
    props: JSX.IntrinsicAttributes &
      ClassAttributes<HTMLHeadingElement> &
      HTMLAttributes<HTMLHeadingElement>
  ): ReactNode => <h2 className="my-4 text-3xl text-accent-dark" {...props} />,
  h3: (
    props: JSX.IntrinsicAttributes &
      ClassAttributes<HTMLHeadingElement> &
      HTMLAttributes<HTMLHeadingElement>
  ): ReactNode => <h2 className="my-4 text-xl" {...props} />,
  p: (
    props: JSX.IntrinsicAttributes &
      ClassAttributes<HTMLParagraphElement> &
      HTMLAttributes<HTMLParagraphElement>
  ): ReactNode => <p className="my-6 line-clamp-6 text-base" {...props} />,
  ul: (
    props: JSX.IntrinsicAttributes &
      ClassAttributes<HTMLUListElement> &
      HTMLAttributes<HTMLUListElement>
  ): ReactNode => <ul className="list-inside list-disc" {...props} />,
  li: (
    props: JSX.IntrinsicAttributes &
      ClassAttributes<HTMLLIElement> &
      LiHTMLAttributes<HTMLLIElement>
  ): ReactNode => <li className="text-base" {...props} />,
}
