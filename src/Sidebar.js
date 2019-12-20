import React from 'react'
import Upload from './Upload'
import CreateFolder from './CreateFolder'
import {useStarred, useStarredItem } from './filebrowser'

function StarredItem ({item}) {
  const [starred, toggleStarred] = useStarredItem(item)
  // console.log("STARRED:", item)
  return (
    <a className="list-group-item list-group-item-action" hidden={!starred || null}>
      {item.pathname}
    </a>
  )
}

export default function Sidebar ({className, files}) {
  return (
  <div className={["navbar-dark bg-dark text-light", className]} //  mh-100
       style={{minWidth: "13em", position: "relative",
               height: "100vh", top: "-58px", paddingTop: "58px", opacity: 0.8}}>
    <div className="d-flex flex-column h-100">
      <div className="pt-5 text-center" style={{minHeight: "12em"}}>
        <div className="mx-auto d-inline-block">
          <div className="text-left">
            <CreateFolder className="text-secondary"/>
            <Upload className="text-secondary"/>
          </div>
        </div>
      </div>
      <hr className="w-100"/>
      <div className="flex-grow-1 overflow-auto">
        <div hidden={null} className="list-group">
        {false && files && files.map( (item) =>
         <StarredItem key={item.pathname} item={item}/>)}
        </div>
      </div>
      <div className="align-self-center mb-3 mt-1 text-muted">
        <small>&copy;2019 REBL Alliance</small>
      </div>
    </div>
  </div>
  )
}
