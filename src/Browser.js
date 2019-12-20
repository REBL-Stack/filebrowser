import React, {useState, useCallback} from 'react'
import { useFile } from 'react-blockstack'
import { trimEnd } from 'lodash'
import { isNumber, isEmpty, isNull, split, compose, partial } from 'lodash/fp'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDownload, faFile, faFolder, faTrash, faStar } from '@fortawesome/free-solid-svg-icons'
import {useSave, useFilter, useMatchGlobal, useTrash, useBrowser, useItem, useSelected,
        useStarredItem } from './filebrowser'

import './Browser.css'

const noPropagation = (f) => (e) => {e.stopPropagation(); f(); return false}

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

function DownloadAction ({pathname, disabled, action}) {
  const [saving, setSaving] = useState(false)
  return (
  <>
    {saving &&
     <ExportFile filepath={pathname} onCompletion={() => setSaving(false)}/>}
    <button className="btn btn-secondary my-0"
            disabled={saving || null}
            title="Download file"
            onClick={() => setSaving(true)}>
      <FontAwesomeIcon icon={faDownload}/>
    </button>
  </>
  )
}


function FileRow ({item}) {
  const [match] = useMatchGlobal()
  const [filter] = useFilter(match)
  const {isDir, localName, root, pathname} = item
  const fileName = pathname // eliminate fileName
  const {openAction} = useItem(item)
  const [exists, doTrash] = useTrash(item)
  const matching = fileName && filter && filter(fileName)
  const [selected, toggleSelected] = useSelected(fileName)
  const [starred, toggleStarred] = useStarredItem(fileName)
  //console.log("FileRow:", matching, item)
  return (
    <tr className={[!isNull(matching) ? "d-flex" : "d-none",
                    !(exists === true) ? "text-muted" : "text-dark",
                    selected ? "table-active" : ""].join(" ")}
        onClick={toggleSelected}>
      <td className="Pathname flex-grow-1 align-bottom">
        <a name={localName} href={openAction ? "#" : null}
           onClick={openAction ? noPropagation(openAction) : null}>
          <FontAwesomeIcon className="mr-1 icon" icon={isDir ? faFolder : faFile}
                           style={{minWidth: "2rem"}}/>
          <FontAwesomeIcon className={["mr-3 star", starred ? "active" : ""].join(" ")}
                           onClick={noPropagation(toggleStarred)}
                           icon={faStar}/>
          <MarkedMatch text={localName} match={filter}/>
        </a>
      </td>
      <td className="action-cell align-middle">
        {!isDir &&
          <DownloadAction pathname={fileName}/>}
        <button className="btn btn-warning my-0"
                // disabled={saving}
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
    <table className="Browser table table-hover table-striped border-bottom-dark mt-2">
      <tbody>
        {isEmpty(items) &&
          <div className="alert alert-dark">
            Empty...
          </div>}
        {items && items.map( (item) =>
         <FileRow key={item.pathname} item={item}/> )}
      </tbody>
    </table>
  )
}
