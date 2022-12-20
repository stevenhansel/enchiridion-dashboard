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
  avgChartInterval: string;
  avgChartRange: string;
  setAvgChartInterval: React.Dispatch<React.SetStateAction<string>>;
  setAvgChartRange: React.Dispatch<React.SetStateAction<string>>;
};

const AverageChart = (props: Props) => {
  const {
    chartId,
    deviceId,
    avgChartInterval,
    avgChartRange,
    setAvgChartInterval,
    setAvgChartRange,
  } = props;

  const [format, setFormat] = useState("%M");
  const [tickValue, setTickValue] = useState("every 10 minutes");
  const [averageChartDateFormat, setAverageChartDateFormat] = useState(
    "YYYY-MM-DDTHH:mm:ss"
  );
  const [xScaleFormat, setxScaleFormat] = useState("%Y-%m-%dT%H:%M:%S");
  const [] = useState("");
  const [averageChartData, setAverageChartData] = useState<
    { x: string; y: number }[]
  >([]);

  const [getLivestream, { data: livestreamData }] =
    useLazyGetLivestreamDeviceQuery();

  const handleFilterByMinute = useCallback(() => {
    setAvgChartInterval("minute");
    setAvgChartRange("hour");
    setFormat("%M");
    setTickValue("every 10 minutes");
    setAverageChartDateFormat("YYYY-MM-DDTHH:mm:ss");
    setxScaleFormat("%Y-%m-%dT%H:%M:%S");
  }, [
    avgChartInterval,
    avgChartRange,
    format,
    tickValue,
    averageChartDateFormat,
    xScaleFormat,
  ]);

  const handleFilterByHour = useCallback(() => {
    setAvgChartInterval("hour");
    setAvgChartRange("day");
    setFormat("%H");
    setTickValue("every 1 hour");
    setAverageChartDateFormat("YYYY-MM-DDTHH:mm:ss");
    setxScaleFormat("%Y-%m-%dT%H:%M:%S");
  }, [
    avgChartInterval,
    avgChartRange,
    format,
    tickValue,
    averageChartDateFormat,
    xScaleFormat,
  ]);

// setAverageChartDateFormat("YYYY-MM-DDTHH:mm:ss");
//     setxScaleFormat("%Y-%m-%dT%H:%M:%S");

  const handleFilterByDay = useCallback(() => {
    setAvgChartInterval("day");
    setAvgChartRange("week");
    setFormat("%d");
    setTickValue("every 1 day");
    setAverageChartDateFormat("YYYY-MM-DDTHH:mm:ss");
    setxScaleFormat("%Y-%m-%dT%H:%M:%S");
  }, [
    avgChartInterval,
    avgChartRange,
    format,
    tickValue,
    averageChartDateFormat,
    xScaleFormat,
  ]);

  useEffect(() => {
    getLivestream({
      deviceId,
      interval: avgChartInterval,
      range: avgChartRange,
      action: "average",
    });
  }, [avgChartInterval, avgChartRange]);

  useEffect(() => {
    if (livestreamData === undefined) return;
    const data = livestreamData.contents.map((data) => ({
      x: dayjs(data.timestamp).format(averageChartDateFormat),
      y: data.value,
    }));
    setAverageChartData(data);
  }, [livestreamData]);

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
            data={[{ id: chartId, data: averageChartData }]}
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
              legendOffset: 46,
            }}
            axisLeft={{
              legend: "num of faces",
              legendOffset: 10,
            }}
            xFormat="time:%Y-%m-%d %H:%M:%S"
            curve="linear"
            enableSlices={false}
            useMesh={true}
          />
        </>
      ) : null}
    </>
  );
};

export default AverageChart;
