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
import { useGetVoucherType } from 'api/dashboard';

// ==============================|| CHART ||============================== //

function VoucherTypeDataChart() {
    const theme = useTheme();
    const mode = theme.palette.mode;

    const { voucherType, voucherTypeLoading, voucherTypeEmpty } = useGetVoucherType();
    const titles = useMemo(() => ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'], []);

    const values = useMemo(() => {
        if (!voucherTypeLoading && !voucherTypeEmpty && voucherType) {
            const last12Months = titles;

            return voucherType.map((item: any) => {
                const filledData = last12Months.map((monthName) => {
                    const found = item.data.find((dataItem: any) =>
                        dataItem.month === monthName
                    );

                    return found ? found.count : 0;
                });

                return {
                    name: item.voucher_type,
                    data: filledData
                };
            });
        }
        return [];
    }, [voucherTypeLoading, voucherTypeEmpty, voucherType, titles]);
    // chart options
    const areaChartOptions = {
        chart: {
            type: 'bar',
            height: 350,
            stacked: true,
            // stackType: "100%",
        },
        plotOptions: {
            bar: {
                horizontal: true,
                dataLabels: {
                    total: {
                        enabled: true,
                        offsetX: 0,
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
            colors: [theme.palette.primary.main, '#77CDFF', '#F95454'],
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

export default function VoucherTypeChart() {
    return (
        <MainCard>
            <Grid container spacing={1}>
                <Grid item xs={12} md={12}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
                        <Typography variant="h5">Voucher Count by Type</Typography>
                    </Stack>
                </Grid>
                <Grid item xs={12} md={12}>
                    <VoucherTypeDataChart />
                </Grid>
            </Grid>
        </MainCard>
    );
}
