import { useEffect, useMemo, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';

// third-party
import ReactApexChart, { Props as ChartProps } from 'react-apexcharts';

// types
import { ThemeMode } from 'config';
import { useGetFundingAgenciesFunds } from 'api/dashboard';
import { Grid, Stack, Typography } from '@mui/material';
import MainCard from 'components/MainCard';
import { formateCurrency } from 'utils/currency';

// chart options
const donutChartOptions = {
    chart: {
        type: 'donut',
        height: 320
    },
    legend: {
        show: true,
        position: 'top',
        horizontalAlign: 'center',
        offsetX: 0,
        offsetY: 0,
        labels: {
            useSeriesColors: true
        },
        markers: {
            size: 0
        },
        itemMargin: {
            horizontal: 15,
            vertical: 0
        }
    },
    dataLabels: {
        enabled: false
    }
};

// ==============================|| APEXCHART - PIE ||============================== //

function FundsChart() {
    const theme = useTheme();

    const mode = theme.palette.mode;

    const { primary } = theme.palette.text;
    const line = theme.palette.divider;
    const grey200 = theme.palette.secondary[200];
    const backColor = theme.palette.background.paper;

    const { funds, fundsLoading, fundsEmpty } = useGetFundingAgenciesFunds();

    const fundsAgency = useMemo(() => {
        if (!fundsLoading && !fundsEmpty && funds) {
            return funds.map((item: any) => item?.funding_agency);
        }
        return [];
    }, [fundsLoading, fundsEmpty, funds]);

    const fundsValue = useMemo(() => {
        if (!fundsLoading && !fundsEmpty && funds) {
            return funds.map((item: any) => item?.total_amount);
        }
        return [];
    }, [fundsLoading, fundsEmpty, funds]);

    const [options, setOptions] = useState<ChartProps>(donutChartOptions);
    const [series, setSeries] = useState(fundsValue);

    useEffect(() => {
        if (!fundsLoading && !fundsEmpty && funds) {
            const primary = theme.palette.primary.light;
            const info = theme.palette.info.light;
            const error = theme.palette.error.light;
            const warning = theme.palette.warning.light;
            const success = theme.palette.success.light;

            setOptions((prevState) => ({
                ...prevState,
                labels: fundsAgency,
                colors: [error, info, success, warning, primary],
                centerLabel: {
                    show: true,
                },
                plotOptions: {
                    pie: {
                        donut: {
                            labels: {
                                show: true,
                                value: {
                                    show: true,
                                    formatter: function (val: any) {
                                        return formateCurrency(val);
                                    }
                                },
                                total: {
                                    show: true,
                                    label: 'Total',
                                    fontWeight: 600,
                                    formatter: function (w: any) {
                                        return formateCurrency(w.globals.seriesTotals.reduce((a: any, b: any) => {
                                            return a + b
                                        }, 0))
                                    }
                                }
                            }
                        }
                    }
                },
                xaxis: {
                    labels: {
                        style: {
                            colors: [primary, primary, primary, primary, primary, primary, primary]
                        }
                    }
                },
                yaxis: {
                    labels: {
                        style: {
                            colors: [primary]
                        }
                    }
                },
                grid: {
                    borderColor: line
                },
                tooltip: {
                    fillSeriesColor: false,
                    y: {
                        formatter: (value: any) => {
                            return formateCurrency(value);
                        },
                    }
                },
                stroke: {
                    colors: [backColor]
                },
                theme: {
                    mode: mode === ThemeMode.DARK ? 'dark' : 'light'
                },
            }));
            setSeries(fundsValue);
        }
    }, [mode, primary, line, grey200, backColor, fundsAgency, fundsLoading, fundsEmpty, funds, fundsValue, theme.palette.warning.light, theme.palette.info.light, theme.palette.error.light, theme.palette.success.light, theme.palette.primary.light]);

    if (fundsLoading || fundsEmpty) {
        return null;
    }

    return <ReactApexChart options={options} series={series} type="donut" height={350} />
}

export default function FundingAgencyFundsChart() {
    return (
        <MainCard>
            <Grid container spacing={3}>
                <Grid item xs={12} md={12}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
                        <Typography variant="h5">Funding Agency Funds</Typography>
                    </Stack>
                </Grid>
                <Grid item xs={12} md={12}>
                    <FundsChart />
                </Grid>
            </Grid>
        </MainCard>
    );
}
