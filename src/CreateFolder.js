import React, { useState, useRef } from 'react'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter,
         Form, FormGroup, Label, Input } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolderPlus } from '@fortawesome/free-solid-svg-icons'
import { useFolders } from './filebrowser'

function NewFolderModal (props) {
  const {
    buttonLabel,
    className,
    open,
    toggle,
    submit
  } = props
  const inputRef = useRef()
  const createAction = (e) => {
    const value = inputRef.current.value
    console.log("SUBMIT:", value)
    e.stopPropagation()
    e.preventDefault()
    submit && submit(value)
    toggle()
    return false
  }
  return (
    <Modal isOpen={open} toggle={toggle} className={className}>
      <Form action="#" onSubmit={createAction}>
        <ModalHeader toggle={toggle}>New Folder</ModalHeader>
        <ModalBody>
          <FormGroup>
            {false && <Label for="exampleEmail">Email</Label>}
            <Input innerRef={inputRef} type="text" name="folder" placeholder="Name of folder"/>
          </FormGroup>
          <div className="mr-auto text-muted"><small>Empty folders
          are deleted&nbsp;on&nbsp;reload.</small></div>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggle}>Cancel</Button>
          <Button color="primary" type="submit" onClick={createAction}>Create</Button>{' '}
        </ModalFooter>
      </Form>
    </Modal>
  )
}

export default function CreateFolder ({disabled, className}) {
  const [dummy, createFolder] = useFolders()
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal)
  return(
  <>
    <NewFolderModal open={modal} toggle={toggle} submit={createFolder}/>
    <button className="btn btn-secondary" onClick={ toggle }
            disabled={disabled || null}>
      <FontAwesomeIcon className="mr-2" icon={faFolderPlus}/>
      New Folder
    </button>
  </>
  )
}
