import type {
  ClassAttributes,
  HTMLAttributes,
  LiHTMLAttributes,
  ReactNode,
} from 'react'

import { CallToAction } from '@/components/CallToAction/CallToAction'
import { PromotionSection } from '@/components/PromotionSection/PromotionSection'

export const components = {
  PromotionSection,
  CallToAction,
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
  ): ReactNode => <h2 className="my-4 text-3xl text-primary-dark" {...props} />,
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
  table: (props: JSX.IntrinsicAttributes): ReactNode => (
    <table className="w-full" {...props} />
  ),
  thead: (props: JSX.IntrinsicAttributes): ReactNode => (
    <thead className="bg-slate-200" {...props} />
  ),
  th: (props: JSX.IntrinsicAttributes): ReactNode => (
    <th className="w-[200px] p-4 text-left font-medium" {...props} />
  ),
  tr: (props: JSX.IntrinsicAttributes): ReactNode => (
    <tr className="border-b" {...props} />
  ),
  td: (props: JSX.IntrinsicAttributes): ReactNode => (
    <td className="p-4 font-medium" {...props} />
  ),
}
