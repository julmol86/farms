import React from 'react'
import Button from 'react-bootstrap/Button'
import { ButtonGroup } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

const Header = () => {
  const { t, i18n } = useTranslation()
  const notUsedLang = i18n.language === 'fi' ? 'en' : 'fi'
  const changeLanguageHandler = () => {
    i18n.changeLanguage(notUsedLang)
    localStorage.setItem('language', i18n.language)
  }
  const navigate = useNavigate()
  const signUp = () => {
    navigate('/signup')
  }

  return (
        <>
            {/* <div> */}
            <h1>AgroStat</h1>
            {/* </div> */}
            <ButtonGroup className = "header">
              <Button variant="success" onClick={changeLanguageHandler}>{notUsedLang}</Button>
              <Button variant="success" /* onClick={signIn} */>{t('header.signin')}</Button>
              <Button variant="success" onClick={signUp}> {t('header.signup')}</Button>

            </ButtonGroup>
        </>
  )
}

export default Header
