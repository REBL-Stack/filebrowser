import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUpload, faSitemap, faHome } from '@fortawesome/free-solid-svg-icons'
import { Progress, Breadcrumb, BreadcrumbItem } from 'reactstrap'
import { isNull, isEmpty } from 'lodash/fp'
import {useUpload, useFiles, useBrowser, useLocal } from './filebrowser'
import Browser from './Browser'
import Dropzone from './Dropzone'

const gaiaMaxFileSize = (25 * 1024 * 1024 - 1)

function BrowserTrail ({trail, onChange, title}) {
  return (
    <div className="BrowserTrail">
      <Breadcrumb>
        {title &&
          <BreadcrumbItem key={0}>
            {trail.length > 0
             ? <a href="#" onClick={() => onChange([])}>{title}</a>
             : title}
          </BreadcrumbItem>}
        {[...Array(trail.length).keys()].map((ix) =>
         <BreadcrumbItem key={ix+1}>
           {(ix < trail.length - 1)
            ? <a href="#" onClick={() => onChange(trail.slice(0, ix+1))}>
                {trail[ix]}
              </a>
            : trail[ix]}
          </BreadcrumbItem>)}
      </Breadcrumb>
    </div>
  )
}

export default function Main ({ person }) {
  const [files, complete] = useFiles()
  const {handleUpload, progress} = useUpload()
  const {trail, setTrail, root} = useBrowser()
  const items = useLocal(files, root)
  return (
  <main className="position-fixed vw-100 h-100 d-flex flex-row">
    <div className="navbar-light mh-100" style={{minWidth: "3em"}}>
    </div>
    <div className="w-100 d-flex flex-column">
      <div className="w-100">
        <Progress hidden={complete && isNull(progress)} animated value={progress ? progress * 100 : 100}/>
        <BrowserTrail title={<FontAwesomeIcon icon={faHome} style={(trail.length == 0) ? {visibility: "none"} : null }/> }
                      trail={trail} onChange={setTrail}/>
      </div>
      <div className="w-100 overflow-auto grow-1">
        <div className="mh-100 inspect">
          {!isEmpty(items) &&
            <div className="">
              <Browser items={items}/>
            </div>}
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
