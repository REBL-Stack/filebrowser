import React, {useState, useCallback} from 'react'
import { useFile } from 'react-blockstack'
import { trimEnd } from 'lodash'
import { isNumber, isEmpty, isNull, split, compose, partial } from 'lodash/fp'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDownload, faFile, faFolder, faTrash } from '@fortawesome/free-solid-svg-icons'
import {useSave, useFilter, useMatchGlobal, useTrash, useLocal, useBrowser, useItem, useSelected } from './filebrowser'

import './Browser.css'

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
  // console.log("Match:", start, end, text, result)
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

function DownloadAction ({saving, setSaving}) {
  return (
    <button className="btn btn-secondary my-0"
            disabled={saving}
            title="Download file"
            onClick={() => setSaving(true)}>
      <FontAwesomeIcon className="dropzone-icon" icon={faDownload}/>
    </button>
  )
}

function FileRow ({item}) {
  const [match] = useMatchGlobal()
  const [filter] = useFilter(match)
  const {isDir, fileName, localName, root} = item
  const {openAction} = useItem(item)
  const [saving, setSaving] = useState(false)
  const matching = fileName && filter && filter(fileName)
  const [exists, doTrash] = useTrash(item)
  const [selected, toggleSelected] = useSelected(fileName)
  console.log("FileRow:", matching, item)
  return (
    <tr className={[!isNull(matching) ? "d-flex" : "d-none",
                    !(exists === true) ? "text-muted" : "text-dark",
                    selected ? "table-active" : ""].join(" ")}
        onClick={toggleSelected}>
      <th className="flex-grow-1 align-bottom">
        <a name={localName} href={openAction ? "#" : null}
           onClick={openAction ? (e) => {openAction(); e.stopPropagation()} : null}>
          <FontAwesomeIcon className="mr-2" icon={isDir ? faFolder : faFile}/>
          <MarkedMatch text={localName} match={filter}/>
        </a>
      </th>
      <td className="action-cell align-middle py-1">
        {saving &&
        <ExportFile filepath={fileName} onCompletion={() => setSaving(false)}/>}
        {!isDir &&
          <DownloadAction {...{setSaving, saving}}/>}
        <button className="btn btn-warning my-0"
                disabled={saving}
                title="Delete file"
                onClick={() => doTrash()}>
          <FontAwesomeIcon icon={faTrash}/>
        </button>
      </td>
    </tr>
  )
}

export default function Browser ({items}) {
  // Items is a sorted array
  return (
    <table className="Browser table table-hover border-bottom-dark mt-2">
      <tbody>
        {isEmpty(items) &&
          <div className="alert alert-dark">
            Empty...
          </div>}
        {items && items.map( (item) =>
         <FileRow key={item.fileName} item={item}/> )}
      </tbody>
    </table>
  )
}
