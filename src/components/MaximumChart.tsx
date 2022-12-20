import React, { useState, useEffect, useCallback } from "react";
import dayjs from "dayjs";

import { Typography, Button, ButtonGroup } from "@mui/material";

import { useLazyGetLivestreamDeviceQuery } from "../services/device";

import { Line } from "@nivo/line";

const commonProperties = {
  width: 900,
  height: 400,
  margin: { top: 80, right: 20, bottom: 60, left: 80 },
  animate: true,
  enableSlices: "x",
};

type Props = {
  chartId: string;
  deviceId: string;
  maxChartInterval: string;
  maxChartRange: string;
  setMaxChartInterval: React.Dispatch<React.SetStateAction<string>>;
  setMaxChartRange: React.Dispatch<React.SetStateAction<string>>;
};

const MaximumChart = (props: Props) => {
  const {
    chartId,
    deviceId,
    maxChartInterval,
    maxChartRange,
    setMaxChartRange,
    setMaxChartInterval,
  } = props;

  const [format, setFormat] = useState("%M");
  const [tickValue, setTickValue] = useState("every 10 minutes");
  const [xScaleFormat, setxScaleFormat] = useState("%Y-%m-%dT%H:%M:%S");
  const [maximumChartDateFormat, setMaximumChartDateFormat] = useState(
    "YYYY-MM-DDTHH:mm:ss"
  );
  const [maximumChartData, setMaximumChartData] = useState<
    { x: string; y: number }[]
  >([]);

  const [getLivestream, { data: livestreamData }] =
    useLazyGetLivestreamDeviceQuery();

  const handleFilterByMinute = useCallback(() => {
    setMaxChartInterval("minute");
    setMaxChartRange("hour");
    setFormat("%M");
    setTickValue("every 10 minutes");
    setMaximumChartDateFormat("YYYY-MM-DDTHH:mm:ss");
    setxScaleFormat("%Y-%m-%dT%H:%M:%S");
  }, [
    maxChartInterval,
    maxChartRange,
    format,
    tickValue,
    maximumChartDateFormat,
    xScaleFormat,
  ]);

  const handleFilterByHour = useCallback(() => {
    setMaxChartInterval("hour");
    setMaxChartRange("day");
    setFormat("%H");
    setTickValue("every 1 hour");
    setMaximumChartDateFormat("YYYY-MM-DDTHH:mm:ss");
    setxScaleFormat("%Y-%m-%dT%H:%M:%S");
  }, [
    maxChartInterval,
    maxChartRange,
    format,
    tickValue,
    maximumChartDateFormat,
    xScaleFormat,
  ]);

  const handleFilterByDay = useCallback(() => {
    setMaxChartInterval("day");
    setMaxChartRange("week");
    setFormat("%b %d");
    setTickValue("every 1 day");
    setMaximumChartDateFormat("YYYY-MM-DDTHH:mm:ss");
    setxScaleFormat("%Y-%m-%dT%H:%M:%S");
  }, [
    maxChartInterval,
    maxChartRange,
    format,
    tickValue,
    maximumChartDateFormat,
    xScaleFormat,
  ]);

  useEffect(() => {
    getLivestream({
      deviceId,
      interval: maxChartInterval,
      range: maxChartRange,
      action: "max",
    });
  }, [maxChartInterval, maxChartRange]);

  useEffect(() => {
    if (livestreamData === undefined) return;
    const data = livestreamData.contents.map((data) => ({
      x: dayjs(data.timestamp).format(maximumChartDateFormat),
      y: data.value,
    }));
    setMaximumChartData(data);
  }, [livestreamData, maximumChartDateFormat]);

  // "%Y-%m-%d" <- day format

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
              onClick={handleFilterByMinute}
            >
              1M
            </Button>
            <Button
              variant="contained"
              size="small"
              onClick={handleFilterByHour}
            >
              1H
            </Button>
            <Button
              variant="contained"
              size="small"
              onClick={handleFilterByDay}
            >
              1D
            </Button>
          </ButtonGroup>
          <Line
            {...commonProperties}
            margin={{ top: 30, right: 50, bottom: 60, left: 50 }}
            data={[{ id: chartId, data: maximumChartData }]}
            xScale={{
              type: "time",
              format: xScaleFormat,
              // precision: "minute",
              useUTC: false,
            }}
            yScale={{ type: "linear", max: 10 }}
            axisBottom={{
              format: format,
              tickValues: tickValue,
              legend: "time (per minute)",
              legendPosition: "middle",
              legendOffset: 40,
            }}
            axisLeft={{
              legend: "num of faces",
              legendOffset: 10,
            }}
            xFormat="time:%Y-%m-%d"
            curve="linear"
            enableSlices={false}
            useMesh={true}
          />
        </>
      ) : null}
    </>
  );
};

export default MaximumChart;
