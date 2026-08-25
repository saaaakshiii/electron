// import { getStaticData } from "./resourceManager"

const electron = require('electron')

// used to bridge data between electron context and main window
// will append whatever we're adding here to the window object
// methods in this function can be exposed to the window and the UI can use these
electron.contextBridge.exposeInMainWorld("electron", {
    subscribeStatistics : (callback) => {
        // ipcRenderer= UI part of IPC protocol
        // on -> litsener
        // on recieving the statistics event, we would want to run the 
        // following function

        // @ts-ignore
        electron.ipcRenderer.on("statistics", (_, stats)=>{
            callback(stats);
        })
    },
    // invoke expects a response back from the destination
    // invoke will just return the value that the IPC main process returned as a promise 
    // so just defining what event we actually want to listen for is just plenty
    getStaticData : () => electron.ipcRenderer.invoke('getStaticData'),
} satisfies Window['electron'])

// Will take the event of generic key EventPayloadMapping
// and return a promise of the value of the generic key
// as invoke is an async function and it returns a promise and not simply the type
function ipcInvoke<Key extends keyof EventPayloadMapping>(
    key: Key,
): Promise<EventPayloadMapping[Key]>{
    return electron.ipcRenderer.invoke(key);
}

