// Polling that we'll start in an interval to inform the UI that there 
// were changes to resources so that it can be updated

import os from 'os';
import osUtils from 'os-utils';
// import { cpuUsage } from 'process';
import fs from "fs";
import { BrowserWindow } from 'electron';
import { ipcWebContentsSend } from './util.js';

const POLLING_INTERVAL = 500; //update twice every second

export function pollResources(mainWindow : BrowserWindow){
    setInterval(async ()=>{
        const cpuUsage = await getCpuUsage();
        const ramUsage = getRamUsage();
        const storageData = getStorageData();
        ipcWebContentsSend("statistics", mainWindow.webContents, {
            cpuUsage,
            ramUsage, 
            storageUsage : storageData.usage
        }); // on an event bus called statistics, we're sneding this data every 0.5 seconds 
        // if the frontend wants it can litsen to it
    }, POLLING_INTERVAL);
}

export function getStaticData(){
    const totalStorage = getStorageData().total;
    const cpuModel = os.cpus()[0].model;
    const totalMemoryGB = Math.floor(osUtils.totalmem()/1024);

    return {
        totalStorage,
        cpuModel,
        totalMemoryGB,
    };
}

function getCpuUsage(): Promise<number>{
    return new Promise(resolve=>{
        osUtils.cpuUsage(resolve);
    })
    // osUtils.cpuUsage((percentage)=>console.log(percentage));
}

function getRamUsage(){
    return 1-osUtils.freememPercentage();
}

function getStorageData(){
    const stats = fs.statfsSync(process.platform === 'win32' ? 'C://' : '/');
    const total = stats.bsize * stats.blocks;
    const free = stats.bsize * stats.bfree;

    return{
        total : Math.floor(total / 1_000_000_000), // to get storage space in GB
        usage : 1 - free / total,
    };
}