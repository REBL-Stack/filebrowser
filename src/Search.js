import React from 'react'
import { useBlockstack } from 'react-blockstack'
import {useMatchGlobal} from './filebrowser'

export default function Search (props) {
  const { userData } = useBlockstack()
  const [match, setMatch] = useMatchGlobal()
  return (
    userData &&
    <div className="Search">
        <input className="form-control" type="text"
               value={match} placeholder="Filter files..."
               aria-label="file filter"
               onInput={(e) => setMatch(e.target.value)}/>
    </div>
  )
}
