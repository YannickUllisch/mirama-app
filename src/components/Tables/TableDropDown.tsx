import { TableCell, TableRow } from '@src/components/ui/table'
import { Button } from '@src/components/ui/button'

const TableDropDown = () => {
  return (
    <>
      <TableRow key={1}>
        <TableCell>{'test'}</TableCell>
        <TableCell>{'test2'}</TableCell>
        <TableCell>
          <Button>Test</Button>
        </TableCell>
      </TableRow>
    </>
  )
}

export default TableDropDown
