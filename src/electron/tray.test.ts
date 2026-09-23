// import {expect, Mock, test, vi} from 'vitest';
// import { createTray } from './tray.js';
// import { BrowserWindow, Menu } from 'electron';

// vi.mock("electron", ()=>{
//     return {
//         Tray: vi.fn().mockReturnValue({
//             setContextMenu : vi.fn(),
//         }),
//         app: {
//             getAppPath : vi.fn().mockReturnValue("/"),   
//             dock:{
//                 show:vi.fn(),
//             },
//             quit: vi.fn(),
//         },
//         Menu : {
//             buildFromTemplate : vi.fn(),
//         }
//     };
// });
// // we need a mainwindow to run the test. for that we need an object that has show() function.
// // vi.fn()-> will create a mock function, it should not do anything, we can test if the function was run
// // we can also go ahead and define custom behavior for this function
// const mainWindow = {show: vi.fn()} satisfies Partial<BrowserWindow> as any as BrowserWindow;

// test("", ()=>{
//     createTray(mainWindow);

//     const calls = (Menu.buildFromTemplate as any as     Mock).mock.calls;
//     const args = calls[0] as Parameters<typeof Menu.buildFromTemplate>;
//     const template = args[0];
//     expect(template).toHaveLength(2);

//     template[0]?.click?.(null as any, null as any, null as any);
//     expect(mainWindow.show).toHaveBeenCalled();
// })


import {expect, Mock, test, vi} from 'vitest';
import { app, BrowserWindow, Menu, Tray } from 'electron';

vi.mock("electron", ()=>{
    return {
        Tray: class{
            setContextMenu = vi.fn();
        },

        app : {
            getAppPath : vi.fn().mockReturnValue("/"),
            dock : {
                show : vi.fn(),
            },
            quit : vi.fn(),
        },

        Menu : {
            buildFromTemplate : vi.fn(),
        },
    };
});

import { createTray } from './tray.js';

const mainWindow = {
    show : vi.fn(),
} satisfies Partial <BrowserWindow> as any as BrowserWindow;

test ("creates tray and shows window", ()=>{
    createTray(mainWindow);

    const calls = (Menu.buildFromTemplate as any as Mock).mock.calls;
    const args = calls[0] as Parameters<typeof Menu.buildFromTemplate>;
    const template = args[0];

    expect(template).toHaveLength(2);
    expect(template[0].label).toEqual('Show');

    // testing show
    template[0]?.click?.(
        null as any,
        null as any,
        null as any
    );

    expect(mainWindow.show).toHaveBeenCalled();
    expect(app.dock?.show).toHaveBeenCalled();

    // testing quit
    template[1]?.click?.(null as any, null as any, null as any)
    expect(app.quit).toHaveBeenCalled();
});