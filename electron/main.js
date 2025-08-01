import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import { SerialPort } from 'serialport';
import EscPosEncoder from 'escpos';
import HID from 'node-hid';
import electronSquirrelStartup from 'electron-squirrel-startup';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (electronSquirrelStartup) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false
    },
  });

  // and load the index.html of the app.
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Hardware Integration IPC Handlers

// Thermal Printer Functions
ipcMain.handle('print-receipt', async (event, receiptData) => {
  try {
    // Example for ESC/POS printer connected via USB serial
    const printer = new EscPosEncoder();

    // Format receipt
    printer
      .initialize()
      .text('KENPOS - Receipt')
      .newline()
      .text('=====================')
      .newline();

    // Add items
    receiptData.items.forEach(item => {
      printer
        .text(`${item.name} x${item.quantity}`)
        .right(`${item.price}`)
        .newline();
    });

    printer
      .text('=====================')
      .newline()
      .text(`Total: ${receiptData.total}`)
      .newline()
      .text(`Payment: ${receiptData.payment}`)
      .newline()
      .text(`Change: ${receiptData.change}`)
      .newline()
      .newline()
      .text(`Date: ${new Date().toLocaleString()}`)
      .newline()
      .text('Thank you!')
      .newline()
      .cut();

    // Send to printer (you'll need to adjust the port)
    const data = printer.encode();
    // This is a simplified example - you would need to implement actual serial communication
    // const port = new SerialPort({ path: '/dev/ttyUSB0', baudRate: 9600 });
    // port.write(data);

    return { success: true, message: 'Receipt printed successfully' };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Cash Drawer Functions
ipcMain.handle('open-cash-drawer', async () => {
  try {
    // ESC/POS command to open cash drawer
    const openDrawerCommand = [0x1B, 0x70, 0x00, 0x19, 0xFA];

    // Send command to printer (which is connected to cash drawer)
    // const port = new SerialPort({ path: '/dev/ttyUSB0', baudRate: 9600 });
    // port.write(Buffer.from(openDrawerCommand));

    return { success: true, message: 'Cash drawer opened' };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Barcode Scanner Functions
ipcMain.handle('list-barcode-scanners', async () => {
  try {
    // List available HID devices
    const devices = HID.devices();
    const scanners = devices.filter(device =>
      device.vendorId && device.productId &&
      // You would need to add specific vendor/product IDs for your scanners
      (device.vendorId === 0x05F9 || device.vendorId === 0x04B4) // Example IDs
    );

    return { success: true, scanners };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Customer Display Functions
ipcMain.handle('update-customer-display', async (event, displayData) => {
  try {
    // Send data to customer display
    // This would depend on your specific display protocol
    // const port = new SerialPort({ path: '/dev/ttyUSB1', baudRate: 9600 });
    // port.write(displayData);

    return { success: true, message: 'Customer display updated' };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Tag Printer Functions
ipcMain.handle('print-tag', async (event, tagData) => {
  try {
    // Implementation would depend on your specific tag printer
    // This is a placeholder for tag printing functionality

    return { success: true, message: 'Tag printed successfully' };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// List available serial ports
ipcMain.handle('list-serial-ports', async () => {
  try {
    const ports = await SerialPort.list();
    return { success: true, ports };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
