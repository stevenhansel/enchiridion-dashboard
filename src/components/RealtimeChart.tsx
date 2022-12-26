import { Line } from '@nivo/line';

const commonProperties = {
  width: 900,
  height: 400,
  margin: { top: 80, right: 20, bottom: 60, left: 80 },
  animate: true,
  enableSlices: 'x',
};

export const realtimeChartDateFormat = 'YYYY-MM-DDTHH:mm:ss';

type Props = {
  chartId: string;
  chartData: {
    x: string;
    y: number;
  }[];
};

const RealtimeChart = (props: Props) => {
  const { chartId, chartData } = props;

  return (
    <Line
      {...commonProperties}
      margin={{ top: 30, right: 50, bottom: 60, left: 50 }}
      data={[{ id: chartId, data: chartData }]}
      xScale={{
        type: 'time',
        format: '%Y-%m-%dT%H:%M:%S',
        precision: 'second',
      }}
      yScale={{ type: 'linear', max: 10 }}
      axisBottom={{
        format: '%S',
        tickValues: 'every 10 seconds',
        legend: ``,
        legendPosition: 'middle',
        legendOffset: 46,
      }}
      enablePoints={false}
      enableGridX={true}
      curve="linear"
      animate={false}
      isInteractive={false}
      enableSlices={false}
      useMesh={true}
      theme={{
        axis: { ticks: { text: { fontSize: 14 } } },
        grid: { line: { stroke: '#ddd', strokeDasharray: '1 2' } },
      }}
    />
  );
};

export default RealtimeChart;
