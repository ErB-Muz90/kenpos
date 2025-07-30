import '@testing-library/jest-dom';

// Mock window object properly for Electron environment
const mockWindow = {
  ...window,
  hardwareAPI: {
    printReceipt: jest.fn(),
    openCashDrawer: jest.fn(),
    listBarcodeScanners: jest.fn(),
    updateCustomerDisplay: jest.fn(),
    printTag: jest.fn(),
    listSerialPorts: jest.fn(),
  },
  // Mock other Electron-specific properties
  require: jest.fn(),
};

// Properly set up the global window mock
// Check if window property already exists to avoid redefinition errors
if (!(global as any).window) {
  Object.defineProperty(global, 'window', {
    value: mockWindow,
    writable: true,
    configurable: true,
  });
} else {
  // If window already exists, just update the hardwareAPI property
  (global as any).window.hardwareAPI = mockWindow.hardwareAPI;
}

// Also set other globals that might be needed
if (!(global as any).document) {
  Object.defineProperty(global, 'document', {
    value: window.document,
    writable: true,
    configurable: true,
  });
}

// Mock isElectron function
global.isElectron = () => true;

// Clean up mocks after each test
afterEach(() => {
  // Clear all mock function calls
  if ((global as any).window?.hardwareAPI) {
    Object.values((global as any).window.hardwareAPI).forEach((mockFn: any) => {
      if (typeof mockFn === 'function' && mockFn.mock) {
        mockFn.mockClear();
      }
    });
  }
  
  // Remove the hardwareAPI property from window to simulate non-Electron environment
  if ((global as any).window) {
    delete (global as any).window.hardwareAPI;
  }
  
  // Reset the isElectron function to return false
  global.isElectron = () => false;
});
