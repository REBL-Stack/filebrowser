import React from 'react'
import { useBlockstack} from 'react-blockstack'
import { BlockstackButton } from 'react-blockstack-button'

export default function Landing (props) {
  const {signIn} = useBlockstack()
  return (
      <div className="panel-landing text-center mt-5">
        <h1 className="landing-heading">Hello, Blockstack!</h1>
        <p className="lead">
          <BlockstackButton onClick={ signIn }/>
        </p>
      </div>
    )
}
