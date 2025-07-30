import { contextBridge, ipcRenderer } from 'electron';

// Hardware API exposed to the renderer process
contextBridge.exposeInMainWorld('hardwareAPI', {
    // Thermal Printer Functions
    printReceipt: (receiptData) => ipcRenderer.invoke('print-receipt', receiptData),

    // Cash Drawer Functions
    openCashDrawer: () => ipcRenderer.invoke('open-cash-drawer'),

    // Barcode Scanner Functions
    listBarcodeScanners: () => ipcRenderer.invoke('list-barcode-scanners'),

    // Customer Display Functions
    updateCustomerDisplay: (displayData) => ipcRenderer.invoke('update-customer-display', displayData),

    // Tag Printer Functions
    printTag: (tagData) => ipcRenderer.invoke('print-tag', tagData),

    // Serial Port Functions
    listSerialPorts: () => ipcRenderer.invoke('list-serial-ports')
});
