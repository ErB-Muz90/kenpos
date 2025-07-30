import { CartItem } from '../types';
import { isElectron } from '../src/utils/electronUtils';

// Type definitions for hardware functions
interface ReceiptData {
    items: CartItem[];
    total: number;
    payment: number;
    change: number;
}

interface DisplayData {
    line1: string;
    line2: string;
}

interface TagData {
    productName: string;
    price: number;
    barcode: string;
}

// Thermal Printer Functions
export const printReceipt = async (receiptData: ReceiptData): Promise<{ success: boolean; message: string }> => {
    if (!isElectron()) {
        console.warn('Hardware API not available - not running in Electron environment');
        return { success: false, message: 'Hardware API not available' };
    }

    try {
        const result = await (window as any).hardwareAPI.printReceipt(receiptData);
        return result;
    } catch (error) {
        console.error('Error printing receipt:', error);
        return { success: false, message: 'Failed to print receipt' };
    }
};

// Cash Drawer Functions
export const openCashDrawer = async (): Promise<{ success: boolean; message: string }> => {
    if (!isElectron()) {
        console.warn('Hardware API not available - not running in Electron environment');
        return { success: false, message: 'Hardware API not available' };
    }

    try {
        const result = await (window as any).hardwareAPI.openCashDrawer();
        return result;
    } catch (error) {
        console.error('Error opening cash drawer:', error);
        return { success: false, message: 'Failed to open cash drawer' };
    }
};

// Barcode Scanner Functions
export const listBarcodeScanners = async (): Promise<{ success: boolean; scanners?: any[]; error?: string }> => {
    if (!isElectron()) {
        console.warn('Hardware API not available - not running in Electron environment');
        return { success: false, error: 'Hardware API not available' };
    }

    try {
        const result = await (window as any).hardwareAPI.listBarcodeScanners();
        return result;
    } catch (error) {
        console.error('Error listing barcode scanners:', error);
        return { success: false, error: 'Failed to list barcode scanners' };
    }
};

// Customer Display Functions
export const updateCustomerDisplay = async (displayData: DisplayData): Promise<{ success: boolean; message: string }> => {
    if (!isElectron()) {
        console.warn('Hardware API not available - not running in Electron environment');
        return { success: false, message: 'Hardware API not available' };
    }

    try {
        const result = await (window as any).hardwareAPI.updateCustomerDisplay(displayData);
        return result;
    } catch (error) {
        console.error('Error updating customer display:', error);
        return { success: false, message: 'Failed to update customer display' };
    }
};

// Tag Printer Functions
export const printTag = async (tagData: TagData): Promise<{ success: boolean; message: string }> => {
    if (!isElectron()) {
        console.warn('Hardware API not available - not running in Electron environment');
        return { success: false, message: 'Hardware API not available' };
    }

    try {
        const result = await (window as any).hardwareAPI.printTag(tagData);
        return result;
    } catch (error) {
        console.error('Error printing tag:', error);
        return { success: false, message: 'Failed to print tag' };
    }
};

// Serial Port Functions
export const listSerialPorts = async (): Promise<{ success: boolean; ports?: any[]; error?: string }> => {
    if (!isElectron()) {
        console.warn('Hardware API not available - not running in Electron environment');
        return { success: false, error: 'Hardware API not available' };
    }

    try {
        const result = await (window as any).hardwareAPI.listSerialPorts();
        return result;
    } catch (error) {
        console.error('Error listing serial ports:', error);
        return { success: false, error: 'Failed to list serial ports' };
    }
};

// Export all functions as a single object
export const HardwareService = {
    printReceipt,
    openCashDrawer,
    listBarcodeScanners,
    updateCustomerDisplay,
    printTag,
    listSerialPorts,
    isElectron
};
