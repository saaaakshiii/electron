export type ChartProps = {
    data: number[];
    maxDataPoints: number;
    selectedView: "CPU" | "RAM" | "STORAGE";
};
export declare const COLOR_MAP: {
    CPU: {
        stroke: string;
        fill: string;
    };
    RAM: {
        stroke: string;
        fill: string;
    };
    STORAGE: {
        stroke: string;
        fill: string;
    };
};
export declare function Chart(props: ChartProps): import("react").JSX.Element;
