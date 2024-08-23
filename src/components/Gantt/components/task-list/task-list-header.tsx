import type React from 'react'

export const TaskListHeaderDefault: React.FC<{
  headerHeight: number
  rowWidth: string
  fontFamily: string
  fontSize: string
}> = ({ headerHeight, fontFamily, fontSize, rowWidth }) => {
  return (
    <div
      className="table border-b-2 border-t-2 border-l-2"
      style={{
        fontFamily: fontFamily,
        fontSize: fontSize,
      }}
    >
      <div
        className="table-row list-none"
        style={{
          height: headerHeight - 2,
        }}
      >
        <div
          className="table-cell align-middle"
          style={{
            minWidth: rowWidth,
          }}
        >
          &nbsp;Name
        </div>
        <div
          className="border-r-2 -ml-2"
          style={{
            height: headerHeight * 0.5,
            marginTop: headerHeight * 0.2,
          }}
        />
        <div
          className="table-cell align-middle"
          style={{
            minWidth: rowWidth,
          }}
        >
          &nbsp;From
        </div>
        <div
          className="border-r-2 -ml-2"
          style={{
            height: headerHeight * 0.5,
            marginTop: headerHeight * 0.25,
          }}
        />
        <div
          className="table-cell align-middle"
          style={{
            minWidth: rowWidth,
          }}
        >
          &nbsp;To
        </div>
      </div>
    </div>
  )
}
