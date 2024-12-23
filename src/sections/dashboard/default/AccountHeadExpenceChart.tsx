import { useEffect, useState, useMemo } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// third-party
import ReactApexChart, { Props as ChartProps } from 'react-apexcharts';

// project-imports
import MainCard from 'components/MainCard';
import { ThemeMode } from 'config';
import { useGetAccountHeadCommon } from 'api/voucher';
import { formateCurrency } from 'utils/currency';

// ==============================|| CHART ||============================== //

function ExpenseDataChart() {
  const theme = useTheme();
  const mode = theme.palette.mode;

  const { accountHeads } = useGetAccountHeadCommon();
  const accountHeadsData = useMemo(() => accountHeads?.map((ah) => ah?.label), [accountHeads]);
  const accountHeadsValue = useMemo(() => accountHeads?.map((ah) => Math.round(Math.random() * 9999).toFixed(0)), [accountHeads]);
  // chart options
  const areaChartOptions = {
    chart: {
      id: 'new-stack-chart',
      type: 'bar',
      stacked: true,
      toolbar: {
        show: false
      },
    },
    grid: {
      strokeDashArray: 4
    },
    dataLabels: {
      enabled: false,
    },
    plotOptions: {
      bar: {
        columnWidth: '80%',
        distributed: true,
        borderRadius: 6,
        borderRadiusApplication: 'end',
      }
    },
    xaxis: {
      crosshairs: {
        width: 1
      }
    },
    tooltip: {
      fixed: {
        enabled: false
      },
      x: {
        show: true
      }
    },
    legend: {
      show: false
    }
  };

  const { primary, secondary } = theme.palette.text;
  const line = theme.palette.divider;

  const [options, setOptions] = useState<ChartProps>(areaChartOptions);

  useEffect(() => {
    setOptions((prevState) => ({
      ...prevState,
      colors: [
        theme.palette.primary.light,
        theme.palette.error.light,
        theme.palette.success.light,
        theme.palette.warning.light,
        theme.palette.info.light,
      ],
      xaxis: {
        categories: accountHeadsData,
        labels: {
          show: false,
        },
        axisBorder: {
          show: false,
          color: line
        },
        axisTicks: {
          show: false
        },
        tickAmount: 11
      },
      yaxis: {
        labels: {
          formatter: (value: any) => {
            return formateCurrency(value);
          },
          style: {
            colors: [secondary]
          }
        }
      },
      grid: {
        borderColor: line
      },
      theme: {
        mode: mode === ThemeMode.DARK ? 'dark' : 'light'
      },
      legend: {
        labels: {
          colors: 'secondary.main'
        }
      }
    }));
  }, [mode, primary, secondary, line, theme, accountHeadsData]);

  const [series, setSeries] = useState([
    {
      name: 'Amount',
      data: [...accountHeadsValue]
    }
  ]);

  useEffect(() => {
    setSeries([
      {
        name: 'Amount',
        data: [...accountHeadsValue]
      }
    ]);
  }, [accountHeadsValue]);

  return <ReactApexChart options={options} series={series as any} type="bar" height={350} />;
}

// ==============================|| CHART WIDGETS - MONTHLY REPORT ||============================== //

export default function AccountHeadExpenceChart() {
  return (
    <MainCard>
      <Grid container spacing={1}>
        <Grid item xs={12} md={12}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
            <Typography variant="h5">Account Head Spendings</Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} md={12}>
          <ExpenseDataChart />
        </Grid>
      </Grid>
    </MainCard>
  );
}
