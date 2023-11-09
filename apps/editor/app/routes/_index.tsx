import { DataFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { H1 } from "~/components/Headings";
import Syntax from "~/components/syntax";
import { client } from "~/utils/clickhouse.server";
// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);
export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "Chart.js Line Chart",
    },
  },
};

export const loader = async ({ request }: DataFunctionArgs) => {
  const aggregate = await client.query({
    query: `SELECT COUNT(*) as views, hour FROM views GROUP BY toHour(date) as hour`,
    format: "JSON",
  });
  return json({ aggregate: await aggregate.json() });
};

export default function Index() {
  const { aggregate } = useLoaderData<typeof loader>();
  const chartData = [];
  const labels = [];
  aggregate.data?.map((row) => {
    chartData.push(Number(row.views));
    return labels.push(row.hour);
  });

  return (
    <div className="app-p-8 app-overflow-auto">
      <H1>Dashboard</H1>

      <Line
        options={options}
        data={{
          labels,
          datasets: [
            {
              fill: true,
              data: chartData,
              label: "views",
              borderColor: "rgb(53, 162, 235)",
              backgroundColor: "rgba(53, 162, 235, 0.5)",
            },
          ],
        }}
      />

      {/* <Syntax>{aggregate}</Syntax> */}
    </div>
  );
}
