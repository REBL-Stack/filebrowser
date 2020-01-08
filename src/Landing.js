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
          The FileBrowser is for Blockstack software developers to browse the online data files
          stored by their web apps during the development stage.
          It provides a behind-the-curtain view of
          the data stored in <i title="Gaia is the online storage used by Blockstack apps">Gaia</i>, similar to how the Storage Inspector in the web browser
          can show the data the apps store locally your browser.</p>
          <p>You can check out its functionality by signing in below
          and upload, browse, and download files. For security and privacy,
          all files are encrypted in
          the browser before transmission to the online storage.</p>
        <p>See
          the <a href="https://github.com/REBL-Stack/Filebrowser/">README</a> file
          for instructions about how to build the Filebrowser on your computer
          to view the files of your apps.
        </p>
        <p className="lead">
          <BlockstackButton onClick={ signIn }/>
        </p>
      </div>
    </ModalBody>
  </Modal>
    )
}
