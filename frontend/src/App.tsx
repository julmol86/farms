import React, { useContext } from 'react'
import {
  Routes,
  Route
} from 'react-router-dom'
import Header from './Header'
import NavigationMenu from './NavigationMenu'
import Statistics from './Statistics'
import AggregateStatistics from './AggregateStatistics'
import SignUp from './SignUp'
import SignIn from './SignIn'
import Maps from './Maps'
import Farmdata from './Farmdata'
import { UserContext } from './UserContext'

// notification library imports
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const App = () => {
  const { userData } = useContext(UserContext)

  return (
    <>
      <Header/>
      <NavigationMenu/>
      <Routes>
        <Route path="/" element={ <Maps/> } />
        <Route path="/stats" element={ <Statistics/> } />
        <Route path="/aggregatestats" element={ <AggregateStatistics/> } />
        <Route path="/farmdata" element={ userData.loggedIn ? <Farmdata/> : <SignIn/> } />
        <Route path="/contacts" element={ <div>Contacts</div> } />
        <Route path="/signup" element={ <SignUp/> } />
        <Route path="/signin" element={ <SignIn/> } />
      </Routes>
      <ToastContainer />
    </>
  )
}

export default App
