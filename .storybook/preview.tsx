import type { Preview } from '@storybook/react'
import { IntlProvider } from 'react-intl'
import '../src/styles/globals.css'
import React from 'react'

import enMessages from '../assets/translations/en.json'
import frMessages from '../assets/translations/fr.json'

const messages = {
  en: enMessages,
  fr: frMessages,
}

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story) => (
      <IntlProvider messages={messages['en']} locale="en" defaultLocale="en">
        <div>
          <Story />
        </div>
      </IntlProvider>
    ),
  ],
}

export default preview
