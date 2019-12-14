import React, {useCallback} from 'react'
import {useDropzone} from 'react-dropzone'

export default function Dropzone({children, className, handleUpload, options}) {
  const onDrop = useCallback(acceptedFiles => {
    console.log("Uploading...", acceptedFiles)
    handleUpload(acceptedFiles)
  }, [])
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop, className, ...options})

  return (
    <div {...getRootProps()} className="Dropzone mx-5">
      <input {...getInputProps()} />
      { children ||
        <p>Drag 'n' drop some files here, or click to select files</p>}
    </div>
  )
}
