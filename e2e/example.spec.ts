import { test, expect, _electron, ElectronApplication } from '@playwright/test';
import { resolve } from 'path';
import { electron } from 'process';
// we need to first initialize our electron app 
// and our main window before running any test

let electronApp: Awaited<ReturnType<typeof _electron.launch>>;
let mainPage : Awaited<ReturnType<typeof electronApp.firstWindow>>;

async function waitForPreloadScript(){
  return new Promise((resolve)=>{
    const interval = setInterval(async ()=>{
      const electronBridge= await mainPage.evaluate(()=>{
        return (window as Window & {electron?: any}).electron;
      });
      if(electronBridge){
        clearInterval(interval);
        resolve(true);
      }
    }, 100);
  });
}

test.beforeEach(async ()=>{
  electronApp = await _electron.launch({
    args:['.'],
    env:{
      ...process.env,
      NODE_ENV: 'development'
    },
  });
  mainPage = await electronApp.firstWindow(); // we are waiting for electron to open the mainWindow to start
  // the tests
  await waitForPreloadScript();
});

// cleaning up after each test (to avoid memory leaks)
test.afterEach(async()=>{
  await electronApp.close();
})

test('custom frame should minimize the mainWindow', async()=>{
  await mainPage.click('#minimize');
  // we need to find if the app was actually minimized
  const isMinimized = await electronApp.evaluate((electron)=>{
    return electron.BrowserWindow.getAllWindows()[0].isMinimized();
  }); // will give us an option to not only interact with the UI
  // but also electron internal code
  expect(isMinimized).toBeTruthy();
});

test('should create a custom menu', async()=>{
  const menu = await electronApp.evaluate((electron)=>{
    return electron.Menu.getApplicationMenu();
  });
  expect(menu).not.toBeNull();
  expect(menu?.items).toHaveLength(2);
  expect(menu?.items[0].submenu?.items).toHaveLength(2);
  expect(menu?.items[1].submenu?.items).toHaveLength(3);
  expect(menu?.items[1].label).toBe('View');
});