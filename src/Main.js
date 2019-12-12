import React, {useRef, useState, useEffect, useCallback} from 'react'
import { useFile, useFilesList } from 'react-blockstack'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDownload, faFile, faUpload } from '@fortawesome/free-solid-svg-icons'
import {useDropzone} from 'react-dropzone'
import {useUpload, useFiles } from './filebrowser'
import Browser from './Browser'

function Dropzone({children, className, handleUpload}) {
  const onDrop = useCallback(acceptedFiles => {
    console.log("Uploading...")
    handleUpload(acceptedFiles)
  }, [])
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop, className})

  return (
    <div {...getRootProps()} className="Dropzone mx-5">
      <input {...getInputProps()} />
      {
        (isDragActive ) &&
          <p>Drop the files here ...</p>}
      { children ||
        <p>Drag 'n' drop some files here, or click to select files</p>}
    </div>
  )
}

export default function Main ({ person }) {
  const files = useFiles()
  const {handleUpload} = useUpload()
  const data = files
       .map((name) => ({fileName: name, fileSize: 0}))
  return (
    <main className="vh-100 m-auto" style={{maxWidth: "50rem"}}>
        <div className="h-50">
          {data &&
           <Browser data={data}/>}
         </div>
         <Dropzone className="mx-5 h-25"
                   handleUpload={handleUpload}>
           <FontAwesomeIcon className="mr-2 text-secondary" icon={faUpload}/>
         </Dropzone>
    </main>
  )
}
