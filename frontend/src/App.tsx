import React from 'react'
import {
  Routes,
  Route
} from 'react-router-dom'
import Header from './Header'
import NavigationMenu from './NavigationMenu'
import Statistics from './Statistics'
import AggregateStatistics from './AggregateStatistics'
import SignUp from './SignUp'

const App = () => {
  return (
    <>
      <Header/>
      <NavigationMenu/>
      <Routes>
        <Route path="/" element={ <div>Home page</div> } />
        <Route path="/stats" element={ <Statistics/> } />
        <Route path="/aggregatestats" element={ <AggregateStatistics/> } />
        <Route path="/about" element={ <div>About</div> } />
        <Route path="/contacts" element={ <div>Contacts</div> } />
        <Route path="/signup" element={ <SignUp/> } />
      </Routes>
    </>
  )
}

export default App
