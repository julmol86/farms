import React, { useContext } from 'react'
import Button from 'react-bootstrap/Button'
import { ButtonGroup } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { UserContext, userContextEmpty } from './UserContext'

const Header = () => {
  const { t, i18n } = useTranslation()
  const notUsedLang = i18n.language === 'fi' ? 'en' : 'fi'
  const { userData, setUserData } = useContext(UserContext)
  const changeLanguageHandler = () => {
    i18n.changeLanguage(notUsedLang)
    localStorage.setItem('language', i18n.language)
  }
  const navigate = useNavigate()
  const signUp = () => {
    navigate('/signup')
  }
  const signIn = () => {
    navigate('/signin')
  }
  const signOut = () => {
    setUserData(userContextEmpty)
    navigate('/signin')
  }

  return (
        <>
            {/* <div> */}
            <h1>AgroStat</h1>
            {/* </div> */}
            <ButtonGroup className = "header">
              <Button variant="success" onClick={changeLanguageHandler}>{notUsedLang}</Button>
              {userData.loggedIn
                ? (
                <>
                  <Button variant="success" onClick={signOut}>{t('header.signout')}</Button>
                  <span>{t('header.welcome') + ', ' + userData.login}</span>
                </>
                  )
                : (
                <>
                  <Button variant="success" onClick={signIn}>{t('header.signin')}</Button>
                  <Button variant="success" onClick={signUp}> {t('header.signup')}</Button>
                </>
                  )}
            </ButtonGroup>
        </>
  )
}

export default Header
