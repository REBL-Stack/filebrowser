import React from 'react'
import { useBlockstack } from 'react-blockstack'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import {useMatchGlobal} from './filebrowser'

export default function Search (props) {
  const { userData } = useBlockstack()
  const [match, setMatch] = useMatchGlobal()
  return (
    userData &&
    <div className="Search">
      <FontAwesomeIcon className="mr-2 text-primary" icon={faSearch}/>
      <input className="form-control" type="text"
             value={match} placeholder="Filter files..."
             aria-label="file filter"
             onInput={(e) => setMatch(e.target.value)}/>
    </div>
  )
}
