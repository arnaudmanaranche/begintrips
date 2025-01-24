import type { ReactNode } from 'react'

import { BottomBar } from '../BottomBar/BottomBar'
import { Sidebar } from '../Sidebar/Sidebar'

interface DashboardLayoutProps {
  children: ReactNode
}

export const DashboardLayout = ({
  children,
}: DashboardLayoutProps): ReactNode => {
  return (
    <>
      <div className="flex h-screen bg-[#113B57]">
        <Sidebar />
        <div className="flex flex-1 flex-col lg:ml-60">
          <main className="flex-1 overflow-y-auto overflow-x-hidden bg-white">
            <div className="container mx-auto py-8">{children}</div>
          </main>
        </div>
      </div>
      <BottomBar />
    </>
  )
}
