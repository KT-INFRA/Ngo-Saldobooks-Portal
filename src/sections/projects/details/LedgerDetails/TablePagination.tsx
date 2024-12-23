/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useMemo, useCallback } from 'react';

// material-ui
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Pagination from '@mui/material/Pagination';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// third-party
import { Updater } from '@tanstack/react-table';

interface TablePaginationProps {
  setPageSize: (updater: Updater<number>) => void;
  setPageIndex: (updater: Updater<number>) => void;
  getPageCount: () => number;
  getPageSize: () => number;
  getPage: () => number;
  initialPageSize?: number;
}

// ==============================|| TABLE PAGINATION ||============================== //

export default function TablePagination({
  setPageIndex,
  setPageSize,
  getPageCount,
  getPageSize,
  getPage,
  initialPageSize
}: TablePaginationProps) {
  const [open, setOpen] = useState(false);

  const options = useMemo(() => {
    const baseOptions = [5, 10, 25, 50, 100];
    return initialPageSize ? Array.from(new Set([...baseOptions, initialPageSize])) : baseOptions;
  }, [initialPageSize]);

  useEffect(() => {
    setPageSize(initialPageSize || options[0]);
  }, [initialPageSize, options, setPageSize]);

  const handleClose = useCallback(() => setOpen(false), []);
  const handleOpen = useCallback(() => setOpen(true), []);
  const handleChangePagination = useCallback((event: React.ChangeEvent<unknown>, value: number) => setPageIndex(value), []);
  const handleChange = useCallback((event: SelectChangeEvent<number>) => setPageSize(Number(event.target.value)), []);

  return (
    <Grid spacing={1} container alignItems="center" justifyContent="space-between" sx={{ width: 'auto' }}>
      <Grid item>
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="caption" color="secondary">
            Rows per page
          </Typography>
          <FormControl sx={{ m: 1 }}>
            <Select
              id="demo-controlled-open-select"
              open={open}
              onClose={handleClose}
              onOpen={handleOpen}
              value={getPageSize()}
              onChange={handleChange}
              size="small"
              sx={{ '& .MuiSelect-select': { py: 0.75, px: 1.25 } }}
            >
              {options.map((option: number) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </Grid>
      <Grid item sx={{ mt: { xs: 2, sm: 0 } }}>
        <Pagination
          sx={{ '& .MuiPaginationItem-root': { my: 0.5 } }}
          count={getPageCount()}
          page={getPage()}
          onChange={handleChangePagination}
          color="primary"
          variant="combined"
          showFirstButton
          showLastButton
        />
      </Grid>
    </Grid>
  );
}
