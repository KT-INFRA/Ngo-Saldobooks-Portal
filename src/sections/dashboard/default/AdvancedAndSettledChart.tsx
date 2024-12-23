import { useEffect, useMemo, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';

// third-party
import ReactApexChart, { Props as ChartProps } from 'react-apexcharts';

// project-imports
import { ThemeMode } from 'config';
import { useGetAdvAndSettled } from 'api/dashboard';
import { Grid, Stack, Typography } from '@mui/material';
import MainCard from 'components/MainCard';

// chart options
const areaChartOptions = {
    chart: {
        height: 350,
        type: 'area'
    },
    colors: ['primary.700', 'primary.main'],
    dataLabels: {
        enabled: false
    },
    stroke: {
        curve: 'smooth'
    },
    xaxis: {
        type: 'category'
    },
    legend: {
        show: true,
        fontFamily: `Inter var`,
        position: 'bottom',
        offsetX: 10,
        offsetY: 10,
        labels: {
            useSeriesColors: false
        },
        markers: {
            width: 16,
            height: 16,
            radius: 5
        },
        itemMargin: {
            horizontal: 15,
            vertical: 8
        }
    }
};

// ==============================|| APEXCHART - AREA ||============================== //

function AdvAndStDataChart() {
    const theme = useTheme();

    const { advNSettled, advNSettledLoading, advNSettledEmpty } = useGetAdvAndSettled();
    // Helper function to get last 12 months without the year
    const getLast12MonthNames = () => {
        const months = [];
        const date = new Date();

        for (let i = 0; i < 12; i++) {
            months.push(date.toLocaleString('default', { month: 'long' })); // Only month name
            date.setMonth(date.getMonth() - 1);
        }

        return months.reverse(); // Chronological order
    };

    const labels = useMemo(() => {
        if (!advNSettledLoading && !advNSettledEmpty && advNSettled) {
            return getLast12MonthNames();
        }
        return [];
    }, [advNSettledLoading, advNSettledEmpty, advNSettled]);

    const values = useMemo(() => {
        if (!advNSettledLoading && !advNSettledEmpty && advNSettled) {
            const last12Months = getLast12MonthNames();

            return advNSettled.map((item: any) => {
                const filledData = last12Months.map((monthName) => {
                    const found = item.data.find((dataItem: any) =>
                        dataItem.month === monthName
                    );

                    return found ? found.count : 0;
                });

                return {
                    name: item.name,
                    data: filledData
                };
            });
        }
        return [];
    }, [advNSettledLoading, advNSettledEmpty, advNSettled]);

    const mode = theme.palette.mode;
    const line = theme.palette.divider;
    const { primary, secondary } = theme.palette.text;

    const [options, setOptions] = useState<ChartProps>(areaChartOptions);
    useEffect(() => {
        setOptions((prevState) => ({
            ...prevState,
            colors: [theme.palette.primary[700], theme.palette.warning.main],
            xaxis: {
                categories: labels,
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
            legend: {
                labels: {
                    colors: 'secondary.main'
                }
            },
            theme: {
                mode: mode === ThemeMode.DARK ? 'dark' : 'light'
            }
        }));
    }, [mode, primary, secondary, line, theme, labels]);

    const [series, setSeries] = useState(
        values
    );

    useEffect(() => {
        setSeries(
            values
        );
    }, [values]);

    return (
        <div id="chart">
            <ReactApexChart options={options} series={series} type="area" height={350} />
        </div>
    );
}

export default function AdvancedAndSettledChart() {
    return (
        <MainCard>
            <Grid container spacing={1}>
                <Grid item xs={12} md={12}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
                        <Typography variant="h5">Advanced and Settled</Typography>
                    </Stack>
                </Grid>
                <Grid item xs={12} md={12}>
                    <AdvAndStDataChart />
                </Grid>
            </Grid>
        </MainCard>
    );
}
