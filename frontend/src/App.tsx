import React from 'react';
import {
  Routes,
  Route
} from "react-router-dom";
import Header from './Header';
import NavigationMenu from './NavigationMenu';
const App = () => {
  return (
    <>
      <Header/>
      <NavigationMenu/>
      <Routes>
        <Route path="/" element={ <div>Home page</div> } />
        <Route path="/about" element={ <div>About</div> } />
        <Route path="/contacts" element={ <div>Contacts</div> } />
      </Routes>
    </>
  )
};

export default App;
