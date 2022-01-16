import React, { useContext } from 'react'
import Button from 'react-bootstrap/Button'
import { ButtonGroup } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { UserContext, userContextEmpty } from './UserContext'

// notification library imports
import { toast } from 'react-toastify'

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
    toast.success(t('logout.success'), {
      position: 'top-center'
    })
  }

  return (
        <>
            {/* <div> */}
            <h1>AgroStat</h1>
            {/* </div> */}
            <ButtonGroup className = "header">
              <Button variant="success" onClick={changeLanguageHandler} data-testid='header-lang'>{notUsedLang}</Button>
            </ButtonGroup>
              {userData.loggedIn
                ? (
                <>
                  <ButtonGroup className = "header">
                    <Button variant="success" onClick={signOut}>{t('header.signout')}</Button>
                  </ButtonGroup>
                  <span className = "spanheader">{t('header.welcome') + ', ' + userData.login}</span>
                </>
                  )
                : (
                <>
                  <ButtonGroup className = "header">
                    <Button variant="success" onClick={signIn}>{t('header.signin')}</Button>
                    <Button variant="success" onClick={signUp}> {t('header.signup')}</Button>
                  </ButtonGroup>
                </>
                  )}
            {/* </ButtonGroup> */}
        </>
  )
}

export default Header
