import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { useBlockstack} from 'react-blockstack'
import Main from './Main.js'
import Landing from './Landing.js'

export default function App (props) {
  const { person, signIn } = useBlockstack()
  return (
  <Router>
    {signIn && <Landing/>}
    {person && <Main person={person}/>}
  </Router>
  )
}
