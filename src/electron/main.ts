import {app, BrowserWindow, ipcMain} from "electron";
import path from "path";
import { isDev } from "./util.js";
import { getStaticData, pollResources } from "./resourceManager.js";
import { getPreloadPath, getUIPath } from "./pathResolver.js";
import {ipcMainHandle} from './util.js';
// type test = string;

// When the app is ready, run the function
app.on("ready", ()=>{
    const mainWindow = new BrowserWindow({
        webPreferences : {
            preload : getPreloadPath(), // telling the main.ts to run this script before the main script
            // and attach everything we want in the context bridge to our window under a keyword 'electron'
            // and just allow us to use specific things
        }
    });
    if(isDev()){
        mainWindow.loadURL('http://localhost:5123');
    }else{
        // mainWindow.loadFile(path.join(app.getAppPath(), "/dist-react/index.html")); // we cannot be sure of the path which will be on the 
        // user's computer so for that we use app.getAppPath(). this is the current URL that needs to be verified
        mainWindow.loadFile(getUIPath()); // generalized path
    }

    pollResources(mainWindow);

    ipcMainHandle("getStaticData", ()=>{
        return getStaticData(); // returns total storage, cpu usage and total memory in GB
    });
});

