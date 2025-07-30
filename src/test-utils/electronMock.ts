export const createElectronMock = () => {
  const mockHardwareAPI = {
    printReceipt: jest.fn().mockResolvedValue({ success: true, message: 'Receipt printed successfully' }),
    openCashDrawer: jest.fn().mockResolvedValue({ success: true, message: 'Cash drawer opened successfully' }),
    listBarcodeScanners: jest.fn().mockResolvedValue({ success: true, scanners: [{ vendorId: '1234', productId: '5678' }] }),
    updateCustomerDisplay: jest.fn().mockResolvedValue({ success: true, message: 'Customer display updated successfully' }),
    printTag: jest.fn().mockResolvedValue({ success: true, message: 'Tag printed successfully' }),
    listSerialPorts: jest.fn().mockResolvedValue({ success: true, ports: [{ path: '/dev/ttyUSB0', manufacturer: 'Test Printer' }] }),
  };

  return { mockHardwareAPI };
};

// Store original window state for restoration
let originalWindow: any = undefined;
let originalIsElectron: any = undefined;

export const setupElectronEnvironment = () => {
  // Store original window if not already stored
  if (originalWindow === undefined) {
    originalWindow = typeof window !== 'undefined' ? { ...window } : undefined;
  }
  
  const { mockHardwareAPI } = createElectronMock();

  // Check if window property already exists
  if (typeof global !== 'undefined' && !(global as any).hasOwnProperty('window')) {
    // Define new window with hardware API only if it doesn't exist
    Object.defineProperty(global, 'window', {
      value: {
        ...(originalWindow || {}),
        hardwareAPI: mockHardwareAPI,
      },
      writable: true,
      configurable: true,
    });
  } else if (typeof global !== 'undefined' && (global as any).window) {
    // If window exists, just add/replace the hardwareAPI property
    (global as any).window.hardwareAPI = mockHardwareAPI;
  }

  // Override isElectron function
  originalIsElectron = (global as any).isElectron;
  (global as any).isElectron = () => true;

  return { mockHardwareAPI };
};

export const cleanupElectronEnvironment = () => {
  // Clear all mock calls
  if (typeof global !== 'undefined' && (global as any).window && (global as any).window.hardwareAPI) {
    Object.values((global as any).window.hardwareAPI).forEach((mockFn: any) => {
      if (typeof mockFn === 'function' && mockFn.mock) {
        mockFn.mockClear();
      }
    });
  }

  // Restore original isElectron function
  if (originalIsElectron !== undefined) {
    (global as any).isElectron = originalIsElectron;
  } else {
    delete (global as any).isElectron;
  }

  // Remove Electron-specific properties
  if (typeof global !== 'undefined' && (global as any).window) {
    delete (global as any).window.hardwareAPI;
    delete (global as any).window.isElectron;
  }
};

// Complete reset of Electron environment
export const resetElectronEnvironment = () => {
  // Clear mocks
  cleanupElectronEnvironment();
  
  // Remove window property entirely to reset to clean state
  if (typeof global !== 'undefined') {
    delete (global as any).window;
  }
  
  // Reset stored original values
  originalWindow = undefined;
  originalIsElectron = undefined;
};
