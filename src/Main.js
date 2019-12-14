import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUpload } from '@fortawesome/free-solid-svg-icons'
import { Progress } from 'reactstrap'
import { isNull } from 'lodash/fp'
import {useUpload, useFiles } from './filebrowser'
import Browser from './Browser'
import Dropzone from './Dropzone'

const gaiaMaxFileSize = (25 * 1024 * 1024 - 1)

export default function Main ({ person }) {
  const [files, complete] = useFiles()
  const {handleUpload, progress} = useUpload()
  return (
    <main>
      <Progress hidden={complete && isNull(progress)} animated value={progress ? progress * 100 : 100}/>
      <div className="container-fluid m-auto" style={{maxWidth: "50rem"}}>
        <div className="" style={{minHeight: "50vh"}}>
          {files &&
           <Browser files={files}/>}
         </div>
         <Dropzone className="Dropzone mx-5 h-25"
                   handleUpload={handleUpload}
                   options={{multiple: true, maxSize: gaiaMaxFileSize}}
                   pickDirectory={false}>
           <FontAwesomeIcon className="mr-2 text-secondary" icon={faUpload}/>
         </Dropzone>
      </div>
    </main>
  )
}
