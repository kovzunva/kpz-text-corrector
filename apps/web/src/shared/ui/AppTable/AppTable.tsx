import React from 'react';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import styles from './AppTable.module.css';

export interface AppColumn<T> {
  readonly key: string;
  readonly header: string;
  readonly render: (row: T) => React.ReactNode;
}

export interface AppTableProps<T> {
  readonly columns: readonly AppColumn<T>[];
  readonly data: readonly T[];
  readonly getRowId: (row: T) => string;
  readonly customClassName?: string;
}

export function AppTable<T>({
  columns,
  data,
  getRowId,
  customClassName = '',
}: AppTableProps<T>): React.JSX.Element {
  const containerClass = [styles.appTableContainer, customClassName]
    .filter(Boolean)
    .join(' ');

  return (
    <TableContainer className={containerClass}>
      <Table className={styles.appTable}>
        <TableHead className={styles.appTableHead}>
          <TableRow>
            {columns.map((col) => (
              <TableCell key={col.key} className={`${styles.appTableCell} ${styles.appTableHeaderCell}`}>
                {col.header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow key={getRowId(row)} className={styles.appTableRow}>
              {columns.map((col) => (
                <TableCell key={col.key} className={styles.appTableCell}>
                  {col.render(row)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
