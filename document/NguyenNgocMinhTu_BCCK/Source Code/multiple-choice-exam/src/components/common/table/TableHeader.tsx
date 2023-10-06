import { styled, TableCell, TableHead, TableRow } from '@mui/material';
import type { FC } from 'react';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 600,
  padding: '16px 20px',
  color: theme.palette.grey[900],
}));

type TableHeaderProps = {
  heading: any[];
};

const TableHeader: FC<TableHeaderProps> = (props) => {
  const { heading } = props;

  return (
    <TableHead sx={{ backgroundColor: 'grey.200' }}>
      <TableRow>
        {heading.map((headCell) => (
          <StyledTableCell key={headCell.id} align={headCell.align}>
            {headCell.label}
          </StyledTableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

export default TableHeader;
