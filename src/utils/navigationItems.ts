import { BookmarkIcon, FileIcon, PaperPlaneIcon } from '@radix-ui/react-icons'

export const jounryeNavigationItems = [
  {
    href: '/journey/[id]',
    icon: PaperPlaneIcon,
    label: 'My journey',
    isEnabled: true,
  },
  {
    href: '/journey/[id]/categories',
    icon: BookmarkIcon,
    label: 'Categories',
    isEnabled: true,
  },
  {
    href: '/journey/[id]/documents',
    icon: FileIcon,
    label: 'Documents',
    isEnabled: false,
  },
]
