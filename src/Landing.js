import React from 'react'
import { useBlockstack} from 'react-blockstack'
import { BlockstackButton } from 'react-blockstack-button'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter,
         Form, FormGroup, Label, Input } from 'reactstrap';

export default function Landing ({className}) {
  const {signIn} = useBlockstack()
  const open = signIn
  const toggle = null
  return (
  <Modal isOpen={open} toggle={toggle} className={["Landing", className].join(" ")}>
    <ModalHeader toggle={toggle} className="mx-auto">
      FileBrowser
    </ModalHeader>
    <ModalBody>
      <div className="panel-landing text-center mt-5">

        <p className="lead">
          The FileBrowser is for software developers to browse the online data files
          stored by their web apps during the development stage.
          It provides a behind-the-curtain view of
          the data, similar to how the Storage Inspector in the web browser
          can show the data the apps store locally your browser.</p>
          <p>You can check out its functionality by signing in below
          and upload, browse, and download files. For security and privacy,
          all files are encrypted in
          the browser before transmission to the online storage.</p>
        <p>For use during app development, download
           the <a href="https://github.com/REBL-Stack/" target="_blank" rel="noopener noreferrer">repository</a> and
           run it with <code>npm start</code> on the same localhost
           port as your app. Sign in to browse its online files.
        </p>
        <p className="lead">
          <BlockstackButton onClick={ signIn }/>
        </p>
      </div>
    </ModalBody>
  </Modal>
    )
}
