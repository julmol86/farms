import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import translationFi from './locales/fi.json'
import translationEn from './locales/en.json'

const resources = {
  fi: {
    translation: translationFi
  },
  en: {
    translation: translationEn
  }
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: localStorage.getItem('language') ?? 'fi',
    debug: true
  })

export default i18n
