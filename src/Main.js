import React, {useRef, useState, useEffect, useCallback} from 'react'
import { useFile, useFilesList } from 'react-blockstack'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDownload } from '@fortawesome/free-solid-svg-icons'
import {useSave, useFilter, useMatchGlobal, useFiles, useUpload} from './filebrowser'
import {useDropzone} from 'react-dropzone'

function ExportFile ({filepath, onCompletion}) {
  const [content] = useFile(filepath)
  const {progress} = useSave(content, filepath, onCompletion)
  console.log("PROGRESS:", progress)
  return(
    <div className="progress">
      <div className="progress-bar progress-bar-striped progress-bar-animated"
           role="progressbar" aria-valuenow={progress} aria-valuemin="0" aria-valuemax="100"
           style={{width: "" + progress +"%", height: "100%"}}></div>
    </div>
  )
}

function MarkedMatch ({text, match}) {
  const result = text && match && match(text)
  const start = result && result.index
  const end = result && (start + result[0].length)
  return (
    start ?
      <>{text.substring(0, start)}
          <mark style={{paddingLeft: 0, paddingRight: 0}}>
          {text.substring(start, end)}
          </mark>
          {text.substring(end)}
      </>
      :
      <>{text}</>
  )
}

function FileRow ({item}) {
  const [match] = useMatchGlobal()
  const [filter] = useFilter(match)
  const filename = item && item.fileName
  const [saving, setSaving] = useState(false)
  const matching = filename && filter && filter(filename)
  return (
    <tr hidden={!matching} className="d-flex">
      <th className="flex-grow-1">
        <MarkedMatch text={filename} match={filter}/>
      </th>
      <td className="download-cell">
        {saving &&
        <ExportFile filepath={filename} onCompletion={() => setSaving(false)}/>}
        <button className="btn btn-primary"
                disabled={saving}
                title="Download file"
                onClick={() => setSaving(true)}>
          <FontAwesomeIcon className="mr-2" icon={faDownload}/>
        </button>
      </td>
    </tr>
  )
}

function Table ({data}) {
  return (
    <table className="table table-striped">
      <tbody>
        {data.map( (item) =>
         <FileRow key={item.fileName} item={item}/> )}
      </tbody>
    </table>
  )
}

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
    <main className="vh-100">
        <div className="h-50">
          {data &&
           <Table data={data}/>}
         </div>
         <Dropzone className="mx-5 h-25"
                   handleUpload={handleUpload}>

         </Dropzone>
    </main>
  )
}
