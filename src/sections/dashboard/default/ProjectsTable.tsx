import { useState, ChangeEvent, MouseEvent } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

// project-imports
import MainCard from 'components/MainCard';

// types
import { KeyedObject } from 'types/root';
import { formateCurrency } from 'utils/currency';
import { useGetProjectWiseFunds } from 'api/dashboard';
import { DebouncedInput, EmptyTable } from 'components/third-party/react-table';

// table columns
interface ColumnProps {
    id: string;
    label: string;
    minWidth: number;
    align?: 'right' | 'left' | 'inherit' | 'center' | 'justify' | undefined;
    format?: (value: number) => string | boolean;
}

const columns: ColumnProps[] = [
    { id: 'project_code', label: 'Code', minWidth: 100 },
    {
        id: 'approved_budget',
        label: 'Approved\u00a0Budget',
        minWidth: 120,
        align: 'right',
        format: (value) => formateCurrency(value)
    },
    {
        id: 'fund_received',
        label: 'Fund\u00a0Received',
        minWidth: 120,
        align: 'right',
        format: (value) => formateCurrency(value)
    },
    {
        id: 'expenditure',
        label: 'Fund\u00a0Spend',
        minWidth: 120,
        align: 'right',
        format: (value) => formateCurrency(value),
    },
    {
        id: 'available',
        label: 'Available',
        minWidth: 120,
        align: 'right',
        format: (value) => formateCurrency(value)
    }
];

// ==============================|| MUI TABLE - STICKY HEADER ||============================== //

export default function ProjectsTable() {
    const theme = useTheme();
    const { projectFundsLoading: isLoading, projectFunds: rows } = useGetProjectWiseFunds();

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [globalFilter, setGlobalFilter] = useState('');

    const handleChangePage = (event: MouseEvent<HTMLElement> | MouseEvent<HTMLButtonElement, MouseEvent> | null, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement> | undefined) => {
        setRowsPerPage(+event?.target?.value!);
        setPage(0);
    };

    const filteredRows = rows?.filter((row: any) => {
        const filterValue = globalFilter.toLowerCase();
        const rowValues = Object.values(row).map((value) => String(value).toLowerCase());
        return rowValues.some((value) => value.includes(filterValue));
    });

    return (
        <MainCard content={false} title="Projects" secondary={<DebouncedInput
            value={globalFilter ?? ''}
            onFilterChange={(value) => setGlobalFilter(String(value))}
            placeholder={`Search ${rows?.length} records...`}
        />}>
            {/* table */}
            <TableContainer sx={{ maxHeight: 430 }}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead
                        sx={{
                            '& th': { borderTop: `1px solid ${theme.palette.divider}`, borderBottom: `2px solid ${theme.palette.divider} !important` }
                        }}
                    >
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell sx={{ minWidth: column.minWidth, position: 'sticky !important' }} key={column.id} align={column.align}>
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {(rows && filteredRows && !isLoading) ? (
                            filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row: KeyedObject) => {
                                return (
                                    <TableRow sx={{ py: 3 }} hover role="checkbox" tabIndex={-1} key={row.id}>
                                        {columns.map((column) => {
                                            const value = row[column.id];
                                            return (
                                                <TableCell key={column.id} align={column.align}>
                                                    {column.format && typeof value === 'number' ? column.format(value) : value}
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                );
                            })
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length}>
                                    <EmptyTable msg="No Data" />
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <Divider />
            {/* table pagination */}
            <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={rows?.length ?? 0}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </MainCard>
    );
}
