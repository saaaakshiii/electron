import {app, BrowserWindow, Menu} from "electron";
import { ipcMainOn, isDev } from "./util.js";
import { getStaticData, pollResources } from "./resourceManager.js";
import { getPreloadPath, getUIPath } from "./pathResolver.js";
import {ipcMainHandle} from './util.js';
import { createTray } from "./tray.js";
import { createMenu } from "./menu.js";
// type test = string;

Menu.setApplicationMenu(null);

// When the app is ready, run the function
app.on("ready", ()=>{
    const mainWindow = new BrowserWindow({
        webPreferences : {
            preload : getPreloadPath(), // telling the main.ts to run this script before the main script
            // and attach everything we want in the context bridge to our window under a keyword 'electron'
            // and just allow us to use specific things
        },
        frame : false,
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

    ipcMainOn("sendFrameAction", (payload)=>{
        switch(payload){
            case "CLOSE":
                mainWindow.close();
                break;
            case "MINIMIZE":
                mainWindow.minimize();
                break;
            case "MAXIMIZE":
                mainWindow.maximize();
                break;
        }
    })

    createTray(mainWindow);
    handleCloseEvents(mainWindow);
    createMenu(mainWindow); 
});


function handleCloseEvents(mainWindow: BrowserWindow){
    // to persist what events happened at what point in time, we need some sort of a variable
    let willClose = false;// we don't want the app to close by default

    mainWindow.on('close', (e)=>{
        if(willClose){
            return;
        }

        e.preventDefault();
        mainWindow.hide(); // enough for windows and linux

        // for mac os
        // A Dock | undefined property (Dock on macOS, undefined on all other platforms) 
        // that allows you to perform actions on your app icon in the user's dock. 
        if(app.dock){
            app.dock.hide();
        }
    });

    // "before-quit" runs before the app quits
    app.on("before-quit", ()=>{
        willClose=true;
    });  

    // when we want the window to show again
    mainWindow.on("show", ()=>{
        willClose=false;
    })
}

