import React, {useRef, useState, useEffect} from 'react'
import { useFile, useFilesList } from 'react-blockstack'
import {useSave, useFilter, useMatchGlobal} from './filebrowser'

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
      <>{text} <code>{JSON.stringify(result)}</code></>
  )
}

function FileRow ({item, filter}) {
  const filename = item && item.fileName
  const [saving, setSaving] = useState(false)
  return (
    <tr>
      <th><MarkedMatch text={filename} match={filter}/></th>
      <td>
        {saving &&
        <ExportFile filepath={filename} onCompletion={() => setSaving(false)}/>}
        <button className="btn btn-primary"
                disabled={saving}
                onClick={() => setSaving(true)}>
              Download
        </button>
      </td>
    </tr>
  )
}

function Table ({data, filter}) {
  return (
    <table className="table">
      <tbody>
        {data.map( (item) =>
         <FileRow key={item.fileName} item={item} filter={filter}/> )}
      </tbody>
    </table>
  )
}

export default function Main ({ person }) {
  const [files] = useFilesList()
  const [match] = useMatchGlobal()
  const [filter] = useFilter(match)
  const data = files
       .filter(filter || (() => true))
       .map((name) => ({fileName: name, fileSize: 0}))
  return (
    <main>
      <Table data={data} filter={filter}/>
    </main>
  )
}
