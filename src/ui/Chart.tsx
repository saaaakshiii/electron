import { useMemo } from "react";
import { BaseChart } from "./BaseChart";

export type ChartProps = {
  data: number[];
  maxDataPoints: number;
};

export function Chart(props: ChartProps) {
  const prepareData = useMemo(() => {
    const points = props.data.map((point) => ({ value: point * 100 }));

    // creating an array, and the length of the array will be length that is missing 
    // from our points eg if we want 10 points but we only have 5, then we'll append an array
    // of length 5 at the end, so we will have 10 points
    return [
      ...points,
      ...Array.from({ length: props.maxDataPoints - points.length }).map(
        ()=>({ value : undefined})
      ), 
    ];
    return points;
  }, [props.data, props.maxDataPoints]); // whenever props.data changes, we have to update prepareData
  return <BaseChart data={prepareData} />;
}
