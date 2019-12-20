import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUpload, faSitemap, faHome } from '@fortawesome/free-solid-svg-icons'
import { isNull, isEmpty } from 'lodash/fp'
import { Progress, Breadcrumb, BreadcrumbItem } from 'reactstrap'
import {useUpload, useFiles, useBrowser, useLocalItems, useStarred, useStarredItem } from './filebrowser'
import Browser from './Browser'
import Dropzone from './Dropzone'
import BrowserTrail from './Trail'
import Upload from './Upload'
import CreateFolder from './CreateFolder'

const gaiaMaxFileSize = (25 * 1024 * 1024 - 1)  // FIX: Get from SDK

function StarredItem ({item}) {
  const [starred, toggleStarred] = useStarredItem(item)
  // console.log("STARRED:", item)
  return (
    <a className="list-group-item list-group-item-action" hidden={!starred || null}>
      {item.pathname}
    </a>
  )
}

function Sidebar ({files}) {
  return (
  <div className="navbar-light mh-100" style={{minWidth: "13em"}}>
    <div className="d-flex flex-column h-100">
      <div className="pt-5 text-center" style={{minHeight: "12em"}}>
        <div className="mx-auto d-inline-block">
          <div className="text-left">
            <CreateFolder/>
            <Upload/>
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

export default function Main () {
  const [files, complete] = useFiles()
  const {handleUpload, progress} = useUpload()
  const {trail, setTrail, root} = useBrowser()
  const items = useLocalItems(files, root)
  console.log("Trail:", trail)
  return (
  <main className="vw-100 h-100 d-flex flex-row">
    <Sidebar files={files}/>
    <div className="w-100 d-flex flex-column">
      <div className="w-100 navbar-fixed">
        <BrowserTrail title={<FontAwesomeIcon icon={faHome} style={isEmpty(trail) ? {visibility: "hidden"} : null }/> }
                      trail={trail} onChange={setTrail}/>
        <Progress hidden={complete && isNull(progress)} animated value={progress ? progress * 100 : 100}/>
      </div>
      <div className="w-100 overflow-auto grow-1 d-flex flex-column">
        <div className="pb-5">
          {!isEmpty(items) &&
           <Browser items={items}/>}
           <Dropzone className={["Dropzone mx-5 grow-1", isEmpty(items) ? "mh-100" : "h-25"].join(" ")}
                     handleUpload={handleUpload}
                     options={{multiple: true, maxSize: gaiaMaxFileSize}}
                     pickDirectory={false}>
             <FontAwesomeIcon className="mr-2 text-secondary" icon={faUpload}/>
           </Dropzone>
        </div>
      </div>
    </div>
  </main>
  )
}
