import { ipcMain, WebContents } from "electron";

export function isDev() : boolean{
    return process.env.NODE_ENV == 'development';
}

// Adapter function, key=event, handler=datatype, generic type
// Key datatype here extends just the keys defined in EventPayloadMapping
// data type will be the return type of handler() which is the value of Key
export function ipcMainHandle<Key extends keyof EventPayloadMapping>(key: Key, handler: ()=> EventPayloadMapping[Key]){
    ipcMain.handle(key, ()=>handler()); // args- event, promise
}

// ********************************
// ipcMain.handle
// Adds a handler for an invokeable IPC. This handler will be called whenever a renderer calls ipcRenderer.invoke(channel, ...args).
// If listener returns a Promise, the eventual result of the promise will be returned as a reply to the remote caller. Otherwise, the return value of the listener will be used as the value of the reply.
// The event that is passed as the first argument to the handler is the same as that passed to a regular event listener. It includes information about which WebContents is the source of the invoke request.
// Errors thrown through handle in the main process are not transparent as they are serialized and only the message property from the original error is provided to the renderer process.
// **************************************************


// Sending the data from the backend to the frontend
export function ipcWebContentsSend<Key extends keyof EventPayloadMapping>(
    key: Key, 
    webContents: WebContents, // which browser window we want to send the data to
    payload: EventPayloadMapping[Key]
){
    webContents.send(key, payload);  
}