// Will contain all types that we share between our frontend and backend
// a type of contract between frontend and backend that will make sure that all our types are completely correct
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

// just a side effect function, no I/P, no O/P
type UnsubscribeFunction=()=>void;

// Adding these data types to the window
// if we're redifing an interface that already exists (here, Window),
// then we're basically adding stuff to the existing interface
interface Window{
    electron : {
        subscribeStatistics : (callback: (statistics: Statistics)=>void)=> UnsubscribeFunction;
        getStaticData : ()=> Promise<StaticData>;
    }
}