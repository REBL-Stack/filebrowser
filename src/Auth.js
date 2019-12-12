import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignInAlt, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
import { useBlockstack } from 'react-blockstack'

export default function Auth (props) {
  const { signIn, signOut } = useBlockstack()
  return (
    <button
      className={["btn", signIn ? "btn-lg btn-primary" : signOut ? "btn-secondary" : null].join(" ")}
      disabled={ !signIn && !signOut }
      onClick={ signIn || signOut }>
      {signIn ? <span><FontAwesomeIcon className="mr-2"
                         icon={faSignInAlt}/>Sign In</span> :
       signOut ? <span><FontAwesomeIcon className="mr-2"
                         icon={faSignOutAlt}/>Logout</span>
               : "..."}
    </button>
    )
}
