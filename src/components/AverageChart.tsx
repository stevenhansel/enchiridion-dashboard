import React, { useState, useEffect, useMemo } from 'react';
import dayjs from 'dayjs';

import { Typography, Button, ButtonGroup } from '@mui/material';

import { useLazyGetLivestreamDeviceQuery } from '../services/device';

import { Line } from '@nivo/line';
import { ChartInterval } from '../types/constants';

const commonProperties = {
  width: 900,
  height: 400,
  margin: { top: 80, right: 20, bottom: 60, left: 80 },
  animate: true,
  enableSlices: 'x',
};

type Props = {
  deviceId: string;
};

type ChartData = {
  id: string;
  xScaleFormat: string;
  axisBottomFormat: string;
  tickValue: string;
  data: { x: string; y: number }[];
  axisBottomLegend: string;
};

const Chart = (props: ChartData) => {
  const {
    id,
    xScaleFormat,
    axisBottomFormat,
    tickValue,
    data,
    axisBottomLegend,
  } = props;
  return (
    <Line
      {...commonProperties}
      margin={{ top: 30, right: 50, bottom: 60, left: 50 }}
      data={[{ id: id, data: data }]}
      xScale={{
        type: 'time',
        format: xScaleFormat,
        // precision: "minute",
        useUTC: false,
      }}
      yScale={{ type: 'linear', max: 10 }}
      axisBottom={{
        format: axisBottomFormat,
        tickValues: tickValue,
        legend: axisBottomLegend,
        legendPosition: 'middle',
        legendOffset: 46,
      }}
      axisLeft={{
        legend: 'num of faces',
        legendOffset: 10,
      }}
      xFormat="time:%Y-%m-%d %H:%M:%S"
      curve="linear"
      enableSlices={false}
      useMesh={true}
    />
  );
};

const AverageChart = (props: Props) => {
  const { deviceId } = props;

  const [averageChartData, setAverageChartData] = useState<
    { x: string; y: number }[]
  >([]);

  const [refreshChart, setRefreshChart] = useState(false);

  const [chartInterval, setChartInterval] = useState<ChartInterval>(
    ChartInterval.Minute
  );

  const [getLivestream, { data: livestreamData }] =
    useLazyGetLivestreamDeviceQuery();

  const chart = useMemo(() => {
    if (chartInterval === ChartInterval.Minute) {
      return (
        <Chart
          id="average-minute-chart"
          data={averageChartData}
          xScaleFormat="%Y-%m-%dT%H:%M:%S"
          axisBottomFormat="%M"
          axisBottomLegend="time (per minute)"
          tickValue="every 10 minutes"
        />
      );
    } else if (chartInterval === ChartInterval.Hour) {
      return (
        <Chart
          id="average-hour-chart"
          data={averageChartData}
          xScaleFormat="%Y-%m-%dT%H:%M:%S"
          axisBottomFormat="%H"
          axisBottomLegend="time (per hour)"
          tickValue="every 1 hour"
        />
      );
    } else {
      return (
        <Chart
          id="average-day-chart"
          data={averageChartData}
          xScaleFormat="%Y-%m-%d"
          axisBottomFormat="%b %d"
          axisBottomLegend="time (per day)"
          tickValue="every 1 day"
        />
      );
    }
  }, [averageChartData]);

  useEffect(() => {
    let interval: string;
    let range: string;
    if (chartInterval === ChartInterval.Minute) {
      interval = 'minute';
      range = 'hour';
    } else if (chartInterval === ChartInterval.Hour) {
      interval = 'hour';
      range = 'day';
    } else {
      interval = 'day';
      range = 'week';
    }
    getLivestream({
      deviceId,
      interval,
      range,
      action: 'average',
    });
  }, [chartInterval, refreshChart]);

  useEffect(() => {
    if (livestreamData === undefined) return;
    let dateFormat: string;

    if (chartInterval === ChartInterval.Minute) {
      dateFormat = 'YYYY-MM-DDTHH:mm:ss';
    } else if (chartInterval === ChartInterval.Hour) {
      dateFormat = 'YYYY-MM-DDTHH:mm:ss';
    } else {
      dateFormat = 'YYYY-MM-DD';
    }

    const data = livestreamData.contents.map(data => ({
      x: dayjs(data.timestamp).format(dateFormat),
      y: data.value,
    }));

    setAverageChartData(data);
  }, [livestreamData, chartInterval]);

  return (
    <>
      {averageChartData.length > 0 ? (
        <>
          <Typography variant="h5" fontWeight="bold" sx={{ marginBottom: 1 }}>
            Average Chart
          </Typography>

          <ButtonGroup>
            <Button
              variant="contained"
              size="small"
              onClick={() => setChartInterval(ChartInterval.Minute)}
            >
              1M
            </Button>
            <Button
              variant="contained"
              size="small"
              onClick={() => setChartInterval(ChartInterval.Hour)}
            >
              1H
            </Button>
            <Button
              variant="contained"
              size="small"
              onClick={() => setChartInterval(ChartInterval.Day)}
            >
              1D
            </Button>
            <Button
              variant="contained"
              size="small"
              onClick={() => setRefreshChart(!refreshChart)}
            >
              refresh
            </Button>
          </ButtonGroup>

          {chart}
        </>
      ) : null}
    </>
  );
};

export default AverageChart;
