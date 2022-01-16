import React, { createContext, useState } from 'react'

export const userContextEmpty = { loggedIn: false, login: undefined, farmId: undefined }

export const UserContext = createContext({
  userData: localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData')!) : userContextEmpty,
  setUserData: (userData: any) => {}
})

export const UserContextProvider = (props: any) => {
  const setUserData = (userData: any) => {
    setState({ ...state, userData: userData })
    localStorage.setItem('userData', JSON.stringify(userData))
  }

  const initState = {
    userData: localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData')!) : userContextEmpty,
    setUserData: setUserData
  }

  // setting context up on start / refresh
  const [state, setState] = useState(initState)

  return (
    <UserContext.Provider value={state}>
      {props.children}
    </UserContext.Provider>
  )
}
