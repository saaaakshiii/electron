import { app, BrowserWindow, Menu, Tray } from "electron";
import path from "path";
import { getAssetPath } from "./pathResolver.js";

export function createTray(mainWindow: BrowserWindow){
    const tray= new Tray(
        path.join(getAssetPath(), 
        process.platform==="darwin"? 'trayIconTemplate.png' : 'trayIcon.png'
    ));

    // menu that pops up when you click on the tray
    // []-> an array of options that we want to be clickable
    tray.setContextMenu(Menu.buildFromTemplate([
            {
                label: 'Show',
                click: ()=>{
                    mainWindow.show()
                    // MacOS
                    if(app.dock){
                        app.dock.show();
                    }
                },
            },
            {
            label: "Quit",
            click: ()=>app.quit(), 
            },
        ])
    );   
}
