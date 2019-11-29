import React from 'react'
import {useMatchGlobal} from './filebrowser'

export default function Search (props) {
  const [match, setMatch] = useMatchGlobal()
  return (
    <div className="Search">
        <input className="form-control" type="text"
               value={match} placeholder="Filter files..."
               aria-label="file filter"
               onInput={(e) => setMatch(e.target.value)}/>
    </div>
  )
}
