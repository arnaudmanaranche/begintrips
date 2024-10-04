import { BookmarkIcon, FileIcon, PaperPlaneIcon } from '@radix-ui/react-icons'
import { FormattedMessage } from 'react-intl'

export const jounryeNavigationItems = [
  {
    href: '/journey/[id]',
    icon: PaperPlaneIcon,
    label: <FormattedMessage id="myJourney" defaultMessage="My journey" />,
    isEnabled: true,
  },
  {
    href: '/journey/[id]/categories',
    icon: BookmarkIcon,
    label: <FormattedMessage id="categories" defaultMessage="Categories" />,
    isEnabled: true,
  },
  {
    href: '/journey/[id]/documents',
    icon: FileIcon,
    label: <FormattedMessage id="documents" defaultMessage="Documents" />,
    isEnabled: false,
  },
]
