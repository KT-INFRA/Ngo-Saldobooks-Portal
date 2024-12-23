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
import { useGetLoanProviders } from 'api/dashboard';
import { formateCurrency } from 'utils/currency';

// ==============================|| CHART ||============================== //

function LoanDataChart() {
    const theme = useTheme();
    const mode = theme.palette.mode;

    const { loanProviders, loanProvidersLoading, loanProvidersEmpty } = useGetLoanProviders();
    const loanProvidersData = useMemo(() => {
        if (!loanProvidersLoading && !loanProvidersEmpty && loanProviders) {
            return loanProviders.map((item: any) => item?.project_code);
        }
        return [];
    }, [loanProvidersLoading, loanProvidersEmpty, loanProviders]);

    const loanProvidersValue: string[] = useMemo(() => {
        if (!loanProvidersLoading && !loanProvidersEmpty && loanProviders) {
            return loanProviders.map((item: any) => item?.total_amount.toString());
        }
        return [];
    }, [loanProvidersLoading, loanProvidersEmpty, loanProviders]);

    // chart options
    const areaChartOptions = {
        chart: {
            id: 'new-stack-chart',
            type: 'bar',
            stacked: true,
            toolbar: {
                show: false
            }
        },
        fill: {
            opacity: [1, 0.9, 0.8, 0.7, 0.7, 0.7, 0.6, 0.5, 0.4, 0.3]
        },
        grid: {
            strokeDashArray: 4
        },
        dataLabels: {
            enabled: false
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
                theme.palette.primary.light,
                theme.palette.primary.light,
                theme.palette.primary.light,
                '#77CDFF',
                '#77CDFF',
                '#77CDFF',
                '#F95454',
                '#F95454',
                '#F95454'
            ],
            xaxis: {
                categories: loanProvidersData,
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
                        return formateCurrency(value, { label: true });
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
    }, [mode, primary, secondary, line, theme, loanProvidersData]);

    const [series, setSeries] = useState([
        {
            name: 'Amount',
            data: [...loanProvidersValue]
        }
    ]);

    useEffect(() => {
        setSeries([
            {
                name: 'Amount',
                data: [...loanProvidersValue]
            }
        ]);
    }, [loanProvidersValue]);

    return <ReactApexChart options={options} series={series as any} type="bar" height={350} />;
}

// ==============================|| CHART WIDGETS - MONTHLY REPORT ||============================== //

export default function LoanProvidersChart() {
    return (
        <MainCard>
            <Grid container spacing={1}>
                <Grid item xs={12} md={12}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
                        <Typography variant="h5">Internal Loan Providers</Typography>
                    </Stack>
                </Grid>
                <Grid item xs={12} md={12}>
                    <LoanDataChart />
                </Grid>
            </Grid>
        </MainCard>
    );
}
