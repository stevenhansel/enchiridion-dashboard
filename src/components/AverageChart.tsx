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

export const averageChartDateFormat = "YYYY-MM-DDTHH:mm:ss";

type Props = {
  chartId: string;
  deviceId: string;
  interval: string;
  range: string;
};

const AverageChart = (props: Props) => {
  const { chartId, deviceId } = props;

  const [interval, setInterval] = useState("minute");
  const [range, setRange] = useState("hour");
  const [format, setFormat] = useState("%M");
  const [tickValue, setTickValue] = useState("every 10 minutes");
  const [averageChartData, setAverageChartData] = useState<
    { x: string; y: number }[]
  >([]);

  const [getLivestream, { data: livestreamData }] =
    useLazyGetLivestreamDeviceQuery();

  useEffect(() => {
    getLivestream({
      deviceId,
      interval: interval,
      range: range,
      action: "average",
    });
  }, [interval, range]);

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
              onClick={() => {
                setInterval("minute");
                setRange("hour");
                setFormat("%M");
                setTickValue("every 10 minutes");
              }}
            >
              1M
            </Button>
            <Button
              variant="contained"
              size="small"
              onClick={() => {
                setInterval("hour");
                setRange("day");
                setFormat("%H");
                setTickValue("every 1 hour");
              }}
            >
              1H
            </Button>
            <Button
              variant="contained"
              size="small"
              onClick={() => {
                setInterval("day");
                setRange("week");
                setFormat("%D");
                setTickValue("every 1 day");
              }}
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
              format: "%Y-%m-%dT%H:%M:%S",
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
