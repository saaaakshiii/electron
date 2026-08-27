import { useEffect, useState } from "react";

// Custom hook for storing the stats data
// dataPointCount = the max amounts of data points to be displayed in the grid etc. so we need to basically 
// take care of this many data points and if we go over or under, we need to trim or pad the ends
export function useStatistics(dataPointCount: number) : Statistics[]{
    const [value, setValue] = useState<Statistics[]>([]); // we want a range of datapoints that we're going to define as parametre to this hook
    useEffect (()=>{
        const unsub = window.electron.subscribeStatistics((stats)=>{
            // we need the previous value to update the current value
            // we can access the previous data inside our callback and the return value
            // will be newData that is set
            setValue((prev) =>{
                const newData = [...prev, stats];
                
                // will just store latest data
                if(newData.length > dataPointCount){
                    newData.shift();
                }
                return newData;
            })
        });
        return unsub;
    }, []);

    return value;
}