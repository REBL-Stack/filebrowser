import React, {useState} from 'react'
import { useFile } from 'react-blockstack'
import { isNumber } from 'lodash'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDownload, faFile, faTrash } from '@fortawesome/free-solid-svg-icons'
import {useSave, useFilter, useMatchGlobal, useTrash } from './filebrowser'


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
  console.log("Match:", start, end, text, result)
  return (
    isNumber(start) ?
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
  const [exists, doTrash] = useTrash(filename)
  return (
    <tr className={matching ? "d-flex" : "d-none"}>
      <th className="flex-grow-1 align-bottom">
        <FontAwesomeIcon className="mr-2" icon={faFile}/>
        <MarkedMatch text={filename} match={filter}/>
        {!matching && "HIDDEN"}
      </th>
      <td className="action-cell align-middle py-1">
        {saving &&
        <ExportFile filepath={filename} onCompletion={() => setSaving(false)}/>}
        <button className="btn btn-secondary my-0"
                disabled={saving}
                title="Download file"
                onClick={() => setSaving(true)}>
          <FontAwesomeIcon className="dropzone-icon" icon={faDownload}/>
        </button>
        <button className="btn btn-warning my-0"
                disabled={saving}
                title="Delete file"
                onClick={() => doTrash()}>
          <FontAwesomeIcon className="dropzone-icon" icon={faTrash}/>
        </button>
      </td>
    </tr>
  )
}

function Table ({data}) {
  return (
    <table className="table border-bottom-dark mt-2">
      <tbody>
        {data.map( (item) =>
         <FileRow key={item.fileName} item={item}/> )}
      </tbody>
    </table>
  )
}

export default function Browser (props) {
  return Table(props)
}
