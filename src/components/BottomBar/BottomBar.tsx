import {
  BookmarkIcon,
  FileIcon,
  GearIcon,
  PaperPlaneIcon,
} from '@radix-ui/react-icons'
import Link from 'next/link'

export function BottomBar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white lg:hidden">
      <ul className="flex h-16  items-center justify-around ring-1 ring-slate-200">
        <li className="flex flex-col items-center space-y-2">
          <PaperPlaneIcon className="h-6 w-6 text-accent" />
          <span className="text-xs text-accent">My journey</span>
        </li>
        <li className="flex flex-col items-center space-y-2">
          <BookmarkIcon className="h-6 w-6 text-black/50" />
          <span className="rounded-md bg-accent px-2 text-xs text-white">
            Soon
          </span>
        </li>
        <li className="flex flex-col items-center space-y-2">
          <FileIcon className="h-6 w-6 text-black/50" />
          <span className="rounded-md bg-accent px-2 text-xs text-white">
            Soon
          </span>
        </li>
        <li>
          <Link
            href="/account"
            className="flex flex-col items-center space-y-2"
          >
            <GearIcon className="h-6 w-6 text-black" />
            <span className="text-xs text-black">Account</span>
          </Link>
        </li>
      </ul>
    </div>
  )
}
