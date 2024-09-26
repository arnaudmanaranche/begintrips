import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import type { ReactNode } from 'react'

import { getUserPayments } from '@/api/calls/users'
import { QUERY_KEYS } from '@/api/queryKeys'
import { PaymentStatusTag } from '@/components/PaymentStatusTag/PaymentStatusTag'

interface PaymentModalViewProps {
  userId: string
}

export function PaymentModalView({ userId }: PaymentModalViewProps): ReactNode {
  const { data: payments, isFetching } = useQuery({
    queryKey: QUERY_KEYS.USER_BILLS(userId),
    queryFn: () => getUserPayments(),
  })

  if (isFetching || !payments) {
    return (
      <div className="mx-auto flex max-w-screen-sm flex-col">
        <div className="h-[30px] w-full animate-pulse bg-slate-100" />
        <div className="space-y-2">
          <div className="h-[20px] w-full animate-pulse bg-slate-100" />
          <div className="h-[20px] w-full animate-pulse bg-slate-100" />
          <div className="h-[20px] w-full animate-pulse bg-slate-100" />
          <div className="h-[20px] w-full animate-pulse bg-slate-100" />
          <div className="h-[20px] w-full animate-pulse bg-slate-100" />
          <div className="h-[20px] w-full animate-pulse bg-slate-100" />
        </div>
      </div>
    )
  }

  return (
    <div className="mt-6 flex flex-col gap-6">
      <table>
        <thead>
          <tr className=" text-left">
            <th className="px-4 py-2 font-thin">Amount</th>
            <th className="px-4 py-2 font-thin">Date</th>
            <th className="px-4 py-2 font-thin">Status</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => (
            <tr
              key={payment.id}
              className="border-b-[1px] border-gray-50 hover:bg-gray-50"
            >
              <td className="px-4 py-2 font-light text-accent">$29</td>
              <td className="px-4 py-2 font-light">
                {format(new Date(payment.created_at as string), 'MM-dd-yyyy')}
              </td>
              <td className="px-4 py-2">
                <PaymentStatusTag status={payment.status!} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}