import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUpload, faSitemap, faHome } from '@fortawesome/free-solid-svg-icons'
import { isNull, isEmpty } from 'lodash/fp'
import { Progress, Breadcrumb, BreadcrumbItem } from 'reactstrap'
import {useUpload, useFiles, useBrowser, useLocal } from './filebrowser'
import Browser from './Browser'
import Dropzone from './Dropzone'
import BrowserTrail from './Trail'

const gaiaMaxFileSize = (25 * 1024 * 1024 - 1)

export default function Main ({ person }) {
  const [files, complete] = useFiles()
  const {handleUpload, progress} = useUpload()
  const {trail, setTrail, root} = useBrowser()
  const items = useLocal(files, root)
  console.log("Trail:", trail)
  return (
  <main className="vw-100 h-100 d-flex flex-row">
    <div className="navbar-light mh-100" style={{minWidth: "3em"}}>
    </div>
    <div className="w-100 d-flex flex-column">
      <div className="w-100 navbar-fixed">
        <Progress hidden={complete && isNull(progress)} animated value={progress ? progress * 100 : 100}/>
        <BrowserTrail title={<FontAwesomeIcon icon={faHome} style={(trail.length == 0) ? {visibility: "hidden"} : null }/> }
                      trail={trail} onChange={setTrail}/>
      </div>
      <div className="w-100 overflow-auto grow-1">
        <div className="pb-5">
          {!isEmpty(items) &&
           <Browser items={items}/>}
           <Dropzone className={["Dropzone mx-5", isEmpty(items) ? "h-75" : "h-25"].join(" ")}
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
