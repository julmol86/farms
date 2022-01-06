import Button from 'react-bootstrap/Button';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom'

const Header = () => {
    const { t, i18n } = useTranslation();
    const notUsedLang = i18n.language === 'fi' ? 'en' : 'fi'
    const location = useLocation();
    const changeLanguageHandler = () => {
        i18n.changeLanguage(notUsedLang)
        localStorage.setItem("language", i18n.language)
      }
  
    return(
        <>          
            <div>
                <h1>AgroStat</h1>
            </div>
            <Button variant="success" onClick={changeLanguageHandler}>{notUsedLang}</Button>         
        </>
    )
};

export default Header;