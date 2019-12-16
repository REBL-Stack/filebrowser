import React, {useCallback} from 'react'
import {useDropzone} from 'react-dropzone'

export default function Dropzone({children, className, handleUpload, options, pickDirectory}) {
  const onDrop = useCallback(acceptedFiles => {
    console.log("Uploading...", acceptedFiles)
    handleUpload(acceptedFiles)
  }, [handleUpload])
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop, ...options})
  const directoriesProps = pickDirectory  && {webkitdirectory: "", mozdirectory: "", directory: ""}
  return (
    <div {...getRootProps({className: ["Dropzone", isDragActive ? "dragging" : "", className].join(" ")})}>
      <input {...getInputProps({...directoriesProps})}/>
      { children ||
        <p>Drag 'n' drop some files here, or click to select files</p>}
    </div>
  )
}
