import React, { useMemo, useState, useEffect, Fragment } from "react";
import {
  Table,
  TableBody,
  TableContainer,
  TableCell,
  TableHead,
  TableRow,
  Pagination,
  Stack,
  Skeleton,
  Divider,
  TextField,
  Grid,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  flexRender,
  useReactTable,
  ColumnDef,
  HeaderGroup,
  getExpandedRowModel,
  getCoreRowModel,
} from "@tanstack/react-table";
import ScrollX from "components/ScrollX";
import MainCard from "components/MainCard";
import { formateCurrency } from "utils/currency";
import { useGetAccountHead, useGetProjectFinancialYear } from "api/project";
import { useGetProjectDetailsContext } from "pages/projects/utils";
import Autocomplete from "@mui/material/Autocomplete";
import { ProjectAccountHead } from "types/project";

function ReactTable({
  columns,
  data,
  loading,
}: {
  columns: ColumnDef<ProjectAccountHead>[];
  data: ProjectAccountHead[];
  loading: boolean;
}) {
  const table = useReactTable({
    data,
    columns,
    getRowCanExpand: () => true,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
  });

  if (loading) {
    return (
      <Table size="small">
        <TableHead>
          {table.getHeaderGroups().map((headerGroup: HeaderGroup<any>) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableCell key={header.id}>
                  <Skeleton animation="wave" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableHead>
        <TableBody>
          {[...Array(5)].map((_, index) => (
            <TableRow key={index}>
              {[...Array(8)].map((_, colIndex) => (
                <TableCell key={colIndex}>
                  <Skeleton animation="wave" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }

  return (
    <MainCard sx={{ m: 0, p: 1 }} content={false} border={false}>
      <ScrollX>
        <TableContainer>
          <Table size="small">
            <TableHead>
              {table.getHeaderGroups().map((headerGroup: HeaderGroup<any>) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableCell
                      key={header.id}
                      {...header.column.columnDef.meta}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableHead>
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <Fragment key={row.id}>
                  <TableRow>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} {...cell.column.columnDef.meta}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                </Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Divider sx={{ borderStyle: "dashed" }} />
        <Stack sx={{ p: 2 }} alignItems="flex-end">
          <Pagination
            count={table.getPageCount()}
            page={table.getState().pagination.pageIndex + 1}
            onChange={(e, page) => table.setPageIndex(page - 1)}
            variant="contained"
            color="primary"
          />
        </Stack>
      </ScrollX>
    </MainCard>
  );
}

export default function ProjectAccounthead() {
  const { projectId } = useGetProjectDetailsContext();
  console.log("projectId", projectId);

  const { financialYears = [] } = useGetProjectFinancialYear(projectId);

  const [selectedFinancialYear, setSelectedFinancialYear] =
    useState<string>("");

  const { accountHeadData, isLoading, refetch } = useGetAccountHead(
    projectId,
    selectedFinancialYear
  );

  const theme = useTheme();

  useEffect(() => {
    if (projectId && selectedFinancialYear) {
      refetch();
    }
  }, [projectId, selectedFinancialYear, refetch]);

  const columns = useMemo<ColumnDef<ProjectAccountHead>[]>(
    () => [
      {
        header: "Account Head",
        accessorKey: "account_head",
        cell: (cell) => (cell.getValue() ? cell.getValue() : "-"),
      },
      {
        header: "Credit",
        accessorKey: "total_amount.credit",
        meta: { className: "cell-right" },
        cell: (cell) => formateCurrency(Number(cell.getValue())),
      },
      {
        header: "Debit",
        accessorKey: "total_amount.debit",
        meta: { className: "cell-right" },
        cell: (cell) => formateCurrency(Number(cell.getValue())),
      },
    ],
    []
  );

  return (
    <>
      <Grid container gap={1} sx={{ mb: "30px" }}>
        <Grid item xs={12} sm={2.5}>
          <Autocomplete
            key={selectedFinancialYear?.toString()}
            sx={{
              "& .MuiInputBase-root": { height: "48px" },
              "& .MuiOutlinedInput-root": { padding: 0 },
              "& .MuiAutocomplete-inputRoot": { padding: "0 14px" },
            }}
            onChange={(_e, option) => {
              setSelectedFinancialYear(option?.value);
            }}
            defaultValue={financialYears.find(
              (item) => item.value === selectedFinancialYear?.toString()
            )}
            isOptionEqualToValue={(option, value) =>
              option.value === value.value
            }
            id="financialYear"
            options={financialYears}
            renderInput={(params) => (
              <TextField
                name="financialYear"
                placeholder="Select Financial Year"
                {...params}
              />
            )}
          />
        </Grid>
      </Grid>

      <ReactTable
        columns={columns}
        data={accountHeadData}
        loading={isLoading}
      />
    </>
  );
}
