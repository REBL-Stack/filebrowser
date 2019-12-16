import React from 'react'
import { Breadcrumb, BreadcrumbItem } from 'reactstrap'

export default function BrowserTrail ({trail, onChange, title}) {
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
