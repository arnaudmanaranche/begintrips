import { WELCOME_EMAIL_TEMPLATE } from './templates/welcome'

export enum EMAIL_TEMPLATES {
  WELCOME = 'welcome',
}

const templates = {
  [EMAIL_TEMPLATES.WELCOME]: WELCOME_EMAIL_TEMPLATE,
}

const templatesTitle = {
  [EMAIL_TEMPLATES.WELCOME]: 'Welcome to BeginTrips',
}

export function getEmailTemplate(templateName: keyof typeof templates): string {
  return templates[templateName]
}

export function getTemplateTitle(
  templateName: keyof typeof templatesTitle
): string {
  return templatesTitle[templateName]
}
