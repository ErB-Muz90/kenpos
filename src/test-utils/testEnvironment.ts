import { setupElectronEnvironment, cleanupElectronEnvironment } from './electronMock';

export const withElectronEnvironment = (testFn: () => void | Promise<void>) => {
  return async () => {
    const mocks = setupElectronEnvironment();
    try {
      await testFn();
    } finally {
      cleanupElectronEnvironment();
    }
    return mocks;
  };
};

export const withoutElectronEnvironment = (testFn: () => void | Promise<void>) => {
  return async () => {
    // Ensure Electron environment is not present
    if (typeof global !== 'undefined') {
      delete (global as any).isElectron;
      if (typeof global.window !== 'undefined') {
        delete (global.window as any).hardwareAPI;
      }
    }
    await testFn();
  };
};
