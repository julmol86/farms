import React from 'react'
import Button from 'react-bootstrap/Button'
import { useTranslation } from 'react-i18next'

const Header = () => {
  const { i18n } = useTranslation()
  const notUsedLang = i18n.language === 'fi' ? 'en' : 'fi'
  const changeLanguageHandler = () => {
    i18n.changeLanguage(notUsedLang)
    localStorage.setItem('language', i18n.language)
  }

  return (
        <>
            <div>
                <h1>AgroStat</h1>
            </div>
            <Button variant="success" onClick={changeLanguageHandler}>{notUsedLang}</Button>
        </>
  )
}

export default Header
