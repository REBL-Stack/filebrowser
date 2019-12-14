import React, {useCallback} from 'react'
import {useDropzone} from 'react-dropzone'

export default function Dropzone({children, className, handleUpload}) {
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
