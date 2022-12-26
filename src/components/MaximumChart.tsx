import React, { useState, useEffect, useCallback, useMemo } from 'react';
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

type ChartProps = {
  id: string;
  data: { x: string; y: number }[];
  xScaleFormat: string;
  axisBottomFormat: string;
  axisBottomLegend: string;
  tickValue: string;
};

const Chart = (props: ChartProps) => {
  const {
    id,
    data,
    xScaleFormat,
    axisBottomFormat,
    axisBottomLegend,
    tickValue,
  } = props;
  return (
    <Line
      {...commonProperties}
      margin={{ top: 30, right: 50, bottom: 60, left: 50 }}
      data={[{ id, data }]}
      xScale={{
        type: 'time',
        format: xScaleFormat,
        // precision: "minute",
        useUTC: false,
      }}
      yScale={{ type: 'linear', max: 15 }}
      axisBottom={{
        format: axisBottomFormat,
        tickValues: tickValue,
        legend: axisBottomLegend,
        legendPosition: 'middle',
        legendOffset: 40,
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

type Props = {
  deviceId: string;
};

const MaximumChart = (props: Props) => {
  const { deviceId } = props;

  const [refreshChart, setRefreshChart] = useState(false);

  const [chartInterval, setChartInterval] = useState<ChartInterval>(
    ChartInterval.Minute
  );
  const [maximumChartData, setMaximumChartData] = useState<
    { x: string; y: number }[]
  >([]);

  const [getLivestream, { data: livestreamData }] =
    useLazyGetLivestreamDeviceQuery();

  const chart = useMemo(() => {
    if (chartInterval === ChartInterval.Minute) {
      return (
        <Chart
          id="maximum-minute-chart"
          data={maximumChartData}
          xScaleFormat="%Y-%m-%dT%H:%M:%S"
          axisBottomFormat="%M"
          axisBottomLegend="time (per minute)"
          tickValue="every 10 minutes"
        />
      );
    } else if (chartInterval === ChartInterval.Hour) {
      return (
        <Chart
          id="maximum-hour-chart"
          data={maximumChartData}
          xScaleFormat="%Y-%m-%dT%H:%M:%S"
          axisBottomFormat="%H"
          axisBottomLegend="time (per hour)"
          tickValue="every 1 hour"
        />
      );
    } else {
      return (
        <Chart
          id="maximum-day-chart"
          data={maximumChartData}
          xScaleFormat="%Y-%m-%d"
          axisBottomFormat="%b %d"
          axisBottomLegend="time (per day)"
          tickValue="every 1 day"
        />
      );
    }
  }, [maximumChartData]);

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
      action: 'max',
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

    setMaximumChartData(data);
  }, [livestreamData, chartInterval]);

  return (
    <>
      {maximumChartData.length > 0 ? (
        <>
          <Typography variant="h5" fontWeight="bold" sx={{ marginBottom: 1 }}>
            Maximum Chart
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

export default MaximumChart;
