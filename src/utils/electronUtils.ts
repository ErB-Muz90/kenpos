export const isElectron = (): boolean => {
  // More robust Electron detection
  try {
    // Check if we're in a browser environment first
    if (typeof window === 'undefined') {
      return false;
    }

    // Check for Electron-specific indicators
    const electronIndicators = [
      !!(window as any).hardwareAPI,
      typeof process !== 'undefined' && 
        typeof process.versions === 'object' && 
        !!(process.versions as any).electron,
      !!(window as any).require,
      (window as any).location?.protocol === 'file:',
    ];

    return electronIndicators.some(indicator => indicator === true);
  } catch (error) {
    return false;
  }
};
