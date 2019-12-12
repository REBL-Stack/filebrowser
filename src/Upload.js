import React, {useRef, useState, useEffect, useCallback} from 'react'
import {fromEvent} from 'file-selector'
import { useBlockstack } from 'react-blockstack'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUpload } from '@fortawesome/free-solid-svg-icons'
import { useUpload} from './filebrowser'

export default function Upload ({className, uploadFiles}) {
  const { userData, userSession } = useBlockstack()
  // const [, dispatch] = useBrowser()
  const {uploadAction, inputProps} = useUpload()
  return (
    userData &&
    <div className="Upload">
        <input {...inputProps}/>
        <button className="btn btn-primary" onClick={ uploadAction }>
          <FontAwesomeIcon className="mr-2" icon={faUpload}/>
          Upload
        </button>
    </div>
  )
}
