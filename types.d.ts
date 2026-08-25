// Will contain all types that we share between our frontend and backend
type Statistics ={
    cpuUsage : number;
    ramUsage : number;
    storageUsage : number;
};

type StaticData ={
    totalStorage : number;
    cpuModel : string;
    totalMemoryGB : number;
};

// Adapter mapping-
// events- statistics, getStaticData; types- Statistics, StaticData
type EventPayloadMapping = {
    statistics : Statistics;
    getStaticData : StaticData;
}

// Adding these data types to the window
// if we're redifing an interface that already exists (here, Window),
// then we're basically adding stuff to the existing interface
interface Window{
    electron : {
        subscribeStatistics : (callback: (statistics: Statistics)=>void)=> void;
        getStaticData : ()=> Promise<StaticData>;
    }
}