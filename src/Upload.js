import React, {useRef, useState, useEffect, useCallback} from 'react'
import {fromEvent} from 'file-selector'

function dispatch (event) {
  // stand in
  switch (event.action) {
    case "upload":
      const files = event.files
      break;
    default: break
  }
}

export default function Upload ({className, uploadFiles}) {
  const fileUploader = useRef(null)
  // const [, dispatch] = useBrowser()
  const upload = (files) => dispatch({action: "upload", files: files})
  const onFileChange = (evt) => {
    fromEvent(evt).then(upload)
  }
  const uploadFile = () => {
    fileUploader.current.click()
  }
  return (
    <div className="Upload">
        <input ref={fileUploader} type="file" onChange={ onFileChange } style={{display: 'none'}}/>
        <button className="btn btn-primary" onClick={ uploadFile }>
          Upload
        </button>
    </div>
  )
}
