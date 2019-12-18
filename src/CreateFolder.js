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
  const createAction = () => {
    const value = inputRef.current.value
    console.log("SUBMIT:", value)
    submit && submit(value)
    toggle()
    return false
  }
  return (
    <Modal isOpen={open} toggle={toggle} className={className}>
      <Form onSubmit={e => {e.stopPropagation();e.preventDefault();createAction()}}>
        <ModalHeader toggle={toggle}>New Folder</ModalHeader>
        <ModalBody>
          <FormGroup>
            {false && <Label for="exampleEmail">Email</Label>}
            <Input innerRef={inputRef} type="text" name="folder" placeholder="Name of folder"/>
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggle}>Cancel</Button>
          <Button color="primary" type="submit">Create</Button>{' '}
        </ModalFooter>
      </Form>
    </Modal>
  )
}

export default function CreateFolder ({disabled}) {
  const [dummy, createFolder] = useFolders()
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal)
  return(
  <>
    <NewFolderModal open={modal} toggle={toggle} submit={createFolder}/>
    <button className="btn btn-primary" onClick={ toggle }
            disabled={disabled || null}>
      <FontAwesomeIcon className="mr-2" icon={faFolderPlus}/>
      New Folder
    </button>
  </>
  )
}
