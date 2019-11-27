import React, {useRef} from 'react'
import { useFile, useFilesList } from 'react-blockstack'
import {useTable,
        useGroupBy,
        useFilters,
        useSortBy,
        useExpanded} from 'react-table'

function DefaultColumnFilter({
  column: { filterValue, preFilteredRows, setFilter },
}) {
  const count = preFilteredRows.length

  return (
    <input
      value={filterValue || ''}
      onChange={e => {
        setFilter(e.target.value || undefined) // Set undefined to remove the filter entirely
      }}
      placeholder={`Search ${count} records...`}
    />
  )
}

function Table({ columns, data, filterTypes }) {
  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state
  } = useTable({
    columns,
    data,
    filterTypes
  }, useFilters)
  return (
  <>
    <code>{JSON.stringify(state.filters, null, 2)}</code>
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th {...column.getHeaderProps()}>
                {column.render('Header')}
                <div>{column.canFilter ? column.render('Filter') : null}</div>
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map(
          (row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                })}
              </tr>
            )}
        )}
      </tbody>
    </table>
  </>
  )
}

const initColumns = [
    {
      Header: 'Files',
      Filter: DefaultColumnFilter,
      columns: [
        {
          Header: 'Name',
          accessor: 'fileName',
          Filter: DefaultColumnFilter,
        },
        {
          Header: 'Size',
          accessor: 'fileSize',
          Filter: DefaultColumnFilter,
        },
      ],
    }]

const initFilters = {
      text: (rows, id, filterValue) => {
        return rows.filter(row => {
          const rowValue = row.values[id]
          return rowValue !== undefined
            ? String(rowValue)
                .toLowerCase()
                .startsWith(String(filterValue).toLowerCase())
            : true
        })
      },
    }

export default function Main ({ person }) {
  const [files] = useFilesList()
  const columns = React.useMemo(() => initColumns)
  const data = files.map((name) => ({fileName: name, fileSize: 0}))
  const filterTypes = React.useMemo(() => initFilters)
  return (
    <main>
      <Table columns={columns} data={data} filterTypes={filterTypes}/>
    </main>
  )
}
