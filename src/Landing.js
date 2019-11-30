import React from 'react'
import { useBlockstack} from 'react-blockstack'
import { BlockstackButton } from 'react-blockstack-button'

export default function Landing (props) {
  const {signIn} = useBlockstack()
  return (
      <div className="panel-landing text-center mt-5">
        <h1 className="landing-heading">REBL FileBrowser</h1>
        <p className="lead">
          The FileBrowser is for software developers to browse the online files of
          your apps. You can check out its functionality by signing in below
          and upload, browse, and download files.</p>
        <p>For use during app development, download
           the <a href="https://github.com/REBL-Stack/" target="_blank">repository</a> and
           run it with <code>npm start</code> on the same localhost
           port as your app. Sign on to browse the files of your app.
        </p>
        <p className="lead">
          <BlockstackButton onClick={ signIn }/>
        </p>
      </div>
    )
}
