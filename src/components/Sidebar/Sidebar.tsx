import { BookmarkIcon, FileIcon, PaperPlaneIcon } from '@radix-ui/react-icons'
import { type ReactNode } from 'react'

export function Sidebar(): ReactNode {
  return (
    <div className="hidden h-screen flex-col border-r-[1px] lg:flex">
      <div className="px-6 pt-5 text-3xl">
        Planner
        <span className="text-accent">.so</span>
      </div>
      <ul className="flex flex-col justify-center pt-20">
        <li className="flex w-full items-center space-x-2 border-l-4 border-accent bg-accent-light/10 px-6 py-4 text-accent">
          <PaperPlaneIcon className="h-5 w-5 text-accent" />
          <span>My journey</span>
        </li>
        <li className="flex w-full items-center space-x-2 border-l-4 border-l-white bg-white px-6 py-4 text-black/50">
          <BookmarkIcon className="h-5 w-5" />
          <div className="flex items-center space-x-2">
            <span>Categories</span>
            <span className="rounded-md bg-accent px-2 text-xs text-white">
              Soon
            </span>
          </div>
        </li>
        <li className="flex w-full items-center space-x-2 border-l-4 border-l-white bg-white px-6 py-4 text-black/50">
          <FileIcon className="h-5 w-5" />
          <div className="flex items-center space-x-2">
            <span>Documents</span>
            <span className="rounded-md bg-accent px-2 text-xs text-white">
              Soon
            </span>
          </div>
        </li>
      </ul>
    </div>
  )
}
