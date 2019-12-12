import React, {useRef, useState, useEffect, useCallback} from 'react'
import {fromEvent} from 'file-selector'
import { useBlockstack } from 'react-blockstack'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUpload } from '@fortawesome/free-solid-svg-icons'
import {injectFile, useUpload} from './filebrowser'

export default function Upload ({className, uploadFiles}) {
  const { userData, userSession } = useBlockstack()
  const fileUploader = useRef(null)
  // const [, dispatch] = useBrowser()
  const upload = (files) => {
    files.forEach( (file) => {
        const name = file.name
        const pathname = name
        const reader = new FileReader()
        reader.onload = () => {
          const content = reader.result
          userSession.putFile(pathname, content)
          .then(() => injectFile(pathname))
          .catch(err => console.warn("Failed to upload file:", err))
        }
      reader.readAsArrayBuffer(file)
      }
  )}
  const onFileChange = (evt) => {
    fromEvent(evt).then(upload)
  }
  const uploadFile = () => {
    fileUploader.current.click()
  }
  return (
    userData &&
    <div className="Upload">
        <input ref={fileUploader} type="file" onChange={ onFileChange } style={{display: 'none'}}/>
        <button className="btn btn-primary" onClick={ uploadFile }>
          <FontAwesomeIcon className="mr-2" icon={faUpload}/>
          Upload
        </button>
    </div>
  )
}
