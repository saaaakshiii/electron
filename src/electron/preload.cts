// import { getStaticData } from "./resourceManager"

const electron = require('electron') // CJS way of importing modules

// used to bridge data between electron context and main window
// will append whatever we're adding here to the window object
// methods in this function can be exposed to the window and the UI can use these
electron.contextBridge.exposeInMainWorld("electron", {
    subscribeStatistics : (callback) => 
        ipcOn('statistics', (stats)=>{
            callback(stats);
        }),
    subscribeChangeView : (callback)=>
        ipcOn('changeView', (stats)=>{
            callback(stats);
        }), // recieving events
    // invoke expects a response back from the destination
    // invoke will just return the value that the IPC main process returned as a promise 
    // so just defining what event we actually want to listen for is just plenty
    getStaticData : () => ipcInvoke('getStaticData'),
    sendFrameAction: (payload)=>ipcSend("sendFrameAction", payload),
} satisfies Window['electron'])

// Will take the event of generic key EventPayloadMapping
// and return a promise of the value of the generic key
// as invoke is an async function and it returns a promise and not simply the type
function ipcInvoke<Key extends keyof EventPayloadMapping>(
    key: Key
): Promise<EventPayloadMapping[Key]>{
    return electron.ipcRenderer.invoke(key);
}

// Everytime we use invoke, we need to await the backend's response
// Basically like a fetch request which is also always async

// ipcOn-> used for polling the static data
function ipcOn<Key extends keyof EventPayloadMapping>(
    key : Key,  
    callback : (payload: EventPayloadMapping[Key])=>void
){
    // whenever someone will call on, ipcOn will return unsubs function
    const cb = (_: Electron.IpcRendererEvent, payload: any)=>callback(payload); // shared function as we need to subs and unsub to the same func
    electron.ipcRenderer.on(key, cb); // subscribing
    // We donot want to immediately unsubscribe, so we need to convert the off to a function
    // so we can call when we want to unsubscribe
    return ()=>electron.ipcRenderer.off(key, cb)// unsubscribing from the prev fucntion
}

// typesafe send wrapper (from frontend to backend)
function ipcSend<Key extends keyof EventPayloadMapping> (
    key: Key,
    payload: EventPayloadMapping[Key]
){
    electron.ipcRenderer.send(key, payload);
}