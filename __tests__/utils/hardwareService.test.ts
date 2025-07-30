import { HardwareService } from '../../utils/hardwareService';
import { setupElectronEnvironment, cleanupElectronEnvironment } from '../../src/test-utils/electronMock';

let mockHardwareAPI: any;

describe('HardwareService', () => {
  beforeEach(() => {
    // Set up Electron environment
    const mocks = setupElectronEnvironment();
    mockHardwareAPI = mocks.mockHardwareAPI;
  });
  
  afterEach(() => {
    // Clean up Electron environment
    cleanupElectronEnvironment();
  });
  
  describe('isElectron', () => {
    it('should return true when running in Electron environment', () => {
      expect(HardwareService.isElectron()).toBe(true);
    });
    
    it('should return false when not running in Electron environment', () => {
      // Remove the hardwareAPI from window
      delete (global as any).window.hardwareAPI;
      expect(HardwareService.isElectron()).toBe(false);
    });
  });
  
  describe('printReceipt', () => {
    it('should call the hardware API to print a receipt', async () => {
      const receiptData = {
        items: [{ 
          id: '1', 
          name: 'Test Item', 
          price: 10.00, 
          quantity: 2, 
          stock: 100,
          sku: 'TEST123',
          category: 'Test Category',
          pricingType: 'inclusive' as const,
          productType: 'Inventory' as const,
          imageUrl: 'test.jpg'
        }],
        total: 20.00,
        payment: 25.00,
        change: 5.00
      };
      
      const result = await HardwareService.printReceipt(receiptData);
      
      expect(mockHardwareAPI.printReceipt).toHaveBeenCalledWith(receiptData);
      expect(result).toEqual({ success: true, message: 'Receipt printed successfully' });
    });
    
    it('should return an error when not running in Electron environment', async () => {
      // Remove the hardwareAPI from window
      delete (global as any).window.hardwareAPI;
      
      const receiptData = {
        items: [{ 
          id: '1', 
          name: 'Test Item', 
          price: 10.00, 
          quantity: 2, 
          stock: 100,
          sku: 'TEST123',
          category: 'Test Category',
          pricingType: 'inclusive' as const,
          productType: 'Inventory' as const,
          imageUrl: 'test.jpg'
        }],
        total: 20.00,
        payment: 25.00,
        change: 5.00
      };
      
      const result = await HardwareService.printReceipt(receiptData);
      
      expect(result).toEqual({ success: false, message: 'Hardware API not available' });
    });
  });
  
  describe('openCashDrawer', () => {
    it('should call the hardware API to open the cash drawer', async () => {
      const result = await HardwareService.openCashDrawer();
      
      expect(mockHardwareAPI.openCashDrawer).toHaveBeenCalled();
      expect(result).toEqual({ success: true, message: 'Cash drawer opened successfully' });
    });
    
    it('should return an error when not running in Electron environment', async () => {
      // Remove the hardwareAPI from window
      delete (global as any).window.hardwareAPI;
      
      const result = await HardwareService.openCashDrawer();
      
      expect(result).toEqual({ success: false, message: 'Hardware API not available' });
    });
  });
  
  describe('listBarcodeScanners', () => {
    it('should call the hardware API to list barcode scanners', async () => {
      const result = await HardwareService.listBarcodeScanners();
      
      expect(mockHardwareAPI.listBarcodeScanners).toHaveBeenCalled();
      expect(result).toEqual({ success: true, scanners: [{ vendorId: '1234', productId: '5678' }] });
    });
    
    it('should return an error when not running in Electron environment', async () => {
      // Remove the hardwareAPI from window
      delete (global as any).window.hardwareAPI;
      
      const result = await HardwareService.listBarcodeScanners();
      
      expect(result).toEqual({ success: false, error: 'Hardware API not available' });
    });
  });
  
  describe('updateCustomerDisplay', () => {
    it('should call the hardware API to update the customer display', async () => {
      const displayData = {
        line1: 'Test Line 1',
        line2: 'Test Line 2'
      };
      
      const result = await HardwareService.updateCustomerDisplay(displayData);
      
      expect(mockHardwareAPI.updateCustomerDisplay).toHaveBeenCalledWith(displayData);
      expect(result).toEqual({ success: true, message: 'Customer display updated successfully' });
    });
    
    it('should return an error when not running in Electron environment', async () => {
      // Remove the hardwareAPI from window
      delete (global as any).window.hardwareAPI;
      
      const displayData = {
        line1: 'Test Line 1',
        line2: 'Test Line 2'
      };
      
      const result = await HardwareService.updateCustomerDisplay(displayData);
      
      expect(result).toEqual({ success: false, message: 'Hardware API not available' });
    });
  });
  
  describe('printTag', () => {
    it('should call the hardware API to print a tag', async () => {
      const tagData = {
        productName: 'Test Product',
        price: 15.99,
        barcode: '123456789012'
      };
      
      const result = await HardwareService.printTag(tagData);
      
      expect(mockHardwareAPI.printTag).toHaveBeenCalledWith(tagData);
      expect(result).toEqual({ success: true, message: 'Tag printed successfully' });
    });
    
    it('should return an error when not running in Electron environment', async () => {
      // Remove the hardwareAPI from window
      delete (global as any).window.hardwareAPI;
      
      const tagData = {
        productName: 'Test Product',
        price: 15.99,
        barcode: '123456789012'
      };
      
      const result = await HardwareService.printTag(tagData);
      
      expect(result).toEqual({ success: false, message: 'Hardware API not available' });
    });
  });
  
  describe('listSerialPorts', () => {
    it('should call the hardware API to list serial ports', async () => {
      const result = await HardwareService.listSerialPorts();
      
      expect(mockHardwareAPI.listSerialPorts).toHaveBeenCalled();
      expect(result).toEqual({ success: true, ports: [{ path: '/dev/ttyUSB0', manufacturer: 'Test Printer' }] });
    });
    
    it('should return an error when not running in Electron environment', async () => {
      // Remove the hardwareAPI from window
      delete (global as any).window.hardwareAPI;
      
      const result = await HardwareService.listSerialPorts();
      
      expect(result).toEqual({ success: false, error: 'Hardware API not available' });
    });
  });
});
