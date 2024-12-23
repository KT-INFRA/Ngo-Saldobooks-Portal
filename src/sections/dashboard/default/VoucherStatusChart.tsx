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
import { useGetVoucherStatus } from 'api/dashboard';

// ==============================|| CHART ||============================== //

function VoucherStatusDataChart() {
    const theme = useTheme();
    const mode = theme.palette.mode;

    const { voucherStatus, voucherStatusLoading, voucherStatusEmpty } = useGetVoucherStatus();
    const titles = useMemo(() => ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'], []); 

    const values = useMemo(() => {
        if (!voucherStatusLoading && !voucherStatusEmpty && voucherStatus) {
            const last12Months = titles;

            return voucherStatus.map((item: any) => {
                const filledData = last12Months.map((monthName) => {
                    const found = item.data.find((dataItem: any) =>
                        dataItem.month === monthName
                    );

                    return found ? found.count : 0;
                });

                return {
                    name: item.voucher_status,
                    data: filledData
                };
            });
        }
        return [];
    }, [voucherStatusLoading, voucherStatusEmpty, voucherStatus, titles]);

    // chart options
    const areaChartOptions = {
        chart: {
            type: 'bar',
            stacked: true,
        },
        dataLabels: {
            enabled: false
        },
        plotOptions: {
            bar: {
                dataLabels: {
                    total: {
                        enabled: true,
                        offsetX: -13,
                        style: {
                            fontSize: '12px',
                            fontWeight: 900
                        }
                    }
                }
            },
        },
        stroke: {
            width: 1,
            colors: ['#fff']
        },
        fill: {
            opacity: 1
        },
        legend: {
            position: 'top',
            horizontalAlign: 'left',
            offsetX: 40
        }
    };

    const { primary, secondary } = theme.palette.text;
    const line = theme.palette.divider;

    const [options, setOptions] = useState<ChartProps>(areaChartOptions);

    useEffect(() => {
        setOptions((prevState) => ({
            ...prevState,
            colors: [theme.palette.primary.main, theme.palette.error.light, theme.palette.success.main, theme.palette.warning.light, '#6C48C5'],
            xaxis: {
                categories: titles,
                labels: {
                    style: {
                        colors: [
                            secondary,
                            secondary,
                            secondary,
                            secondary,
                            secondary,
                            secondary,
                            secondary,
                            secondary,
                            secondary,
                            secondary,
                            secondary,
                            secondary
                        ]
                    }
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
                    style: {
                        colors: [secondary]
                    }
                },
                title: {
                    text: undefined
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
    }, [mode, primary, secondary, line, theme, titles]);

    const [series, setSeries] = useState(values);

    useEffect(() => {
        setSeries(values);
    }, [values]);

    return <ReactApexChart options={options} series={series as any} type="bar" height={500} />;
}

// ==============================|| CHART WIDGETS - MONTHLY REPORT ||============================== //

export default function VoucherStatusChart() {
    return (
        <MainCard>
            <Grid container spacing={1}>
                <Grid item xs={12} md={12}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
                        <Typography variant="h5">Voucher Count by Status</Typography>
                    </Stack>
                </Grid>
                <Grid item xs={12} md={12}>
                    <VoucherStatusDataChart />
                </Grid>
            </Grid>
        </MainCard>
    );
}
