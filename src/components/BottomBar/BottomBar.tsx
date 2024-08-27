import {
  BookmarkIcon,
  FileIcon,
  GearIcon,
  PaperPlaneIcon,
} from '@radix-ui/react-icons'

export function BottomBar() {
  return (
    <div className="initial fixed bottom-0 left-0 right-0 bg-slate-50 lg:hidden">
      <ul className="flex items-center justify-between p-6">
        <li>
          <PaperPlaneIcon className="h-6 w-6" />
        </li>
        <li>
          <BookmarkIcon className="h-6 w-6" />
        </li>
        <li>
          <FileIcon className="h-6 w-6" />
        </li>
        <li>
          <GearIcon className="h-6 w-6" />
        </li>
      </ul>
    </div>
  )
}
