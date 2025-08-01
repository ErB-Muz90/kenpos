import PouchDB from 'pouchdb';
import pouchdbAdapterIdb from 'pouchdb-adapter-idb';
import pouchdbAdapterHttp from 'pouchdb-adapter-http';
import { CartItem, Sale } from '../types';

// Add adapters
PouchDB.plugin(pouchdbAdapterIdb);
PouchDB.plugin(pouchdbAdapterHttp);

// Database instances
let localDb: PouchDB.Database | null = null;
let remoteDb: PouchDB.Database | null = null;
let syncHandler: PouchDB.Replication.Sync<any> | null = null;

// Sync status tracking
let isSyncing = false;
let lastSyncError: Error | null = null;
let syncPaused = false;

// Database names
const LOCAL_DB_NAME = 'kenpos-local';
const REMOTE_DB_URL = 'http://admin:password@localhost:5984/kenpos'; // Default CouchDB URL

/**
 * Initialize the local PouchDB database
 * @returns Promise resolving to the database instance
 */
export async function initLocalDB(): Promise<PouchDB.Database> {
  if (localDb) {
    return localDb;
  }
  
  try {
    localDb = new PouchDB(LOCAL_DB_NAME, { adapter: 'idb' });
    console.log('[PouchDB] Local database initialized');
    return localDb;
  } catch (error) {
    console.error('[PouchDB] Failed to initialize local database:', error);
    throw error;
  }
}

/**
 * Initialize the remote PouchDB database connection
 * @param remoteUrl - URL of the remote CouchDB instance
 * @returns Promise resolving to the database instance
 */
export async function initRemoteDB(remoteUrl: string = REMOTE_DB_URL): Promise<PouchDB.Database> {
  try {
    remoteDb = new PouchDB(remoteUrl, { adapter: 'http' });
    console.log(`[PouchDB] Remote database initialized at ${remoteUrl}`);
    return remoteDb;
  } catch (error) {
    console.error('[PouchDB] Failed to initialize remote database:', error);
    throw error;
  }
}

/**
 * Start synchronization between local and remote databases
 * @param remoteUrl - Optional remote database URL
 * @returns Promise resolving when sync is started
 */
export async function startSync(remoteUrl?: string): Promise<void> {
  // Initialize databases if not already done
  if (!localDb) {
    await initLocalDB();
  }
  
  if (!remoteDb && remoteUrl) {
    await initRemoteDB(remoteUrl);
  }
  
  if (!localDb || !remoteDb) {
    console.warn('[PouchDB] Cannot start sync: both local and remote databases must be initialized');
    return;
  }
  
  // Stop any existing sync
  if (syncHandler) {
    syncHandler.cancel();
  }
  
  // Start continuous sync with conflict resolution
  syncHandler = localDb.sync(remoteDb, {
    live: true,
    retry: true,
    // Handle conflicts
    conflicts: true
  });
  
  syncHandler
    .on('change', (info) => {
      console.log('[PouchDB] Sync change:', info);
      isSyncing = true;
      lastSyncError = null;
      syncPaused = false;
    })
    .on('paused', (err) => {
      if (err) {
        console.log('[PouchDB] Sync paused due to error:', err);
        lastSyncError = err;
      } else {
        console.log('[PouchDB] Sync paused (no changes to sync)');
        syncPaused = true;
      }
      isSyncing = false;
    })
    .on('active', () => {
      console.log('[PouchDB] Sync active (replicating changes)');
      isSyncing = true;
      lastSyncError = null;
      syncPaused = false;
    })
    .on('denied', (err) => {
      console.error('[PouchDB] Sync denied:', err);
      lastSyncError = err;
      isSyncing = false;
    })
    .on('complete', (info) => {
      console.log('[PouchDB] Sync complete:', info);
      isSyncing = false;
    })
    .on('error', (err) => {
      console.error('[PouchDB] Sync error:', err);
      lastSyncError = err;
      isSyncing = false;
    });
  
  console.log('[PouchDB] Continuous sync started');
}

/**
 * Stop synchronization
 */
export function stopSync(): void {
  if (syncHandler) {
    syncHandler.cancel();
    syncHandler = null;
    console.log('[PouchDB] Sync stopped');
    isSyncing = false;
    syncPaused = false;
  }
}

/**
 * Get current sync status
 * @returns Object with sync status information
 */
export function getSyncStatus(): { isSyncing: boolean; syncPaused: boolean; lastError: Error | null } {
  return {
    isSyncing,
    syncPaused,
    lastError: lastSyncError
  };
}

/**
 * Resolve conflicts for a document
 * @param docId - ID of the document with conflicts
 * @returns Promise resolving when conflicts are resolved
 */
export async function resolveConflicts(docId: string): Promise<void> {
  if (!localDb) {
    throw new Error('Local database not initialized');
  }
  
  try {
    // Get the document with conflicts
    const doc: any = await localDb.get(docId, { conflicts: true });
    
    // Check if there are conflicts
    if (!doc._conflicts || doc._conflicts.length === 0) {
      console.log(`[PouchDB] No conflicts found for document ${docId}`);
      return;
    }
    
    console.log(`[PouchDB] Found ${doc._conflicts.length} conflicts for document ${docId}`);
    
    // Get all conflicting revisions
    const conflicts = await Promise.all(
      doc._conflicts.map((rev: string) => localDb.get(docId, { rev }))
    );
    
    // For simplicity, we'll choose the document with the most recent update
    // In a real application, you might want to implement more sophisticated conflict resolution
    const allVersions = [doc, ...conflicts];
    const winningDoc = allVersions.reduce((latest: any, current: any) => {
      const latestTime = latest.updatedAt ? new Date(latest.updatedAt).getTime() : 0;
      const currentTime = current.updatedAt ? new Date(current.updatedAt).getTime() : 0;
      return currentTime > latestTime ? current : latest;
    });
    
    // Remove the _conflicts property
    delete winningDoc._conflicts;
    
    // Delete all conflicting revisions
    const deletePromises = conflicts.map((conflictDoc: any) =>
      localDb.remove(conflictDoc._id, conflictDoc._rev)
    );
    
    await Promise.all(deletePromises);
    
    // Update the document with the winning version
    await localDb.put({
      ...winningDoc,
      _rev: doc._rev // Use the current revision
    });
    
    console.log(`[PouchDB] Resolved conflicts for document ${docId}`);
  } catch (error) {
    console.error(`[PouchDB] Failed to resolve conflicts for document ${docId}:`, error);
    throw error;
  }
}

// --- Cart Management ---

/**
 * Save cart items to the local database
 * @param cart - Array of cart items to save
 */
export async function saveCart(cart: CartItem[]): Promise<void> {
  if (!localDb) {
    await initLocalDB();
  }
  
  try {
    // Get existing cart document if it exists
    let existing: any = null;
    try {
      existing = await localDb.get('cart');
    } catch (err) {
      // Ignore if cart document doesn't exist
    }
    
    // Save cart document
    const cartDoc = {
      _id: 'cart',
      items: cart,
      updatedAt: new Date().toISOString(),
      // Include revision if updating existing document
      ...(existing ? { _rev: existing._rev } : {})
    };
    
    await localDb.put(cartDoc);
    console.log(`[PouchDB] Saved ${cart.length} items to cart`);
    
    // Resolve any conflicts for the cart document
    await resolveConflicts('cart');
  } catch (error) {
    console.error('[PouchDB] Failed to save cart:', error);
    throw error;
  }
}

/**
 * Get cart items from the local database
 * @returns Promise resolving to array of cart items
 */
export async function getCart(): Promise<CartItem[]> {
  if (!localDb) {
    await initLocalDB();
  }
  
  try {
    const doc: any = await localDb.get('cart');
    console.log(`[PouchDB] Retrieved ${doc.items.length} items from cart`);
    return doc.items || [];
  } catch (error) {
    if (error.name === 'not_found') {
      console.log('[PouchDB] No cart found, returning empty array');
      return [];
    }
    console.error('[PouchDB] Failed to retrieve cart:', error);
    throw error;
  }
}

/**
 * Clear cart from the local database
 */
export async function clearCart(): Promise<void> {
  if (!localDb) {
    await initLocalDB();
  }
  
  try {
    const doc: any = await localDb.get('cart');
    await localDb.remove(doc);
    console.log('[PouchDB] Cart cleared');
  } catch (error) {
    if (error.name === 'not_found') {
      console.log('[PouchDB] No cart to clear');
    } else {
      console.error('[PouchDB] Failed to clear cart:', error);
      throw error;
    }
  }
}

// --- Offline Order Queue ---

/**
 * Queue an order for offline storage
 * @param order - The sale/order to queue
 */
export async function queueOrder(order: Sale): Promise<void> {
  if (!localDb) {
    await initLocalDB();
  }
  
  try {
    // Check if order already exists
    let existing: any = null;
    try {
      existing = await localDb.get(`order_${order.id}`);
    } catch (err) {
      // Ignore if order doesn't exist
    }
    
    const orderDoc = {
      _id: `order_${order.id}`,
      ...order,
      queuedAt: new Date().toISOString(),
      // Include revision if updating existing document
      ...(existing ? { _rev: existing._rev } : {})
    };
    
    await localDb.put(orderDoc);
    console.log(`[PouchDB] Queued order '${order.id}'`);
    
    // Resolve any conflicts for the order document
    await resolveConflicts(`order_${order.id}`);
  } catch (error) {
    console.error(`[PouchDB] Failed to queue order '${order.id}':`, error);
    throw error;
  }
}

/**
 * Get all queued orders
 * @returns Promise resolving to array of queued orders
 */
export async function getAllQueuedOrders(): Promise<Sale[]> {
  if (!localDb) {
    await initLocalDB();
  }
  
  try {
    const result = await localDb.allDocs({
      include_docs: true,
      startkey: 'order_',
      endkey: 'order_\ufff0'
    });
    
    const orders = result.rows
      .map(row => row.doc)
      .filter(doc => doc && doc._id.startsWith('order_'))
      .map(doc => {
        // Remove PouchDB metadata
        const { _id, _rev, ...order } = doc as any;
        return order as Sale;
      });
    
    console.log(`[PouchDB] Retrieved ${orders.length} queued orders`);
    return orders;
  } catch (error) {
    console.error('[PouchDB] Failed to retrieve queued orders:', error);
    throw error;
  }
}

/**
 * Get count of queued orders
 * @returns Promise resolving to number of queued orders
 */
export async function getQueuedOrderCount(): Promise<number> {
  const orders = await getAllQueuedOrders();
  return orders.length;
}

/**
 * Remove a queued order by ID
 * @param orderId - ID of the order to remove
 */
export async function removeQueuedOrder(orderId: string): Promise<void> {
  if (!localDb) {
    await initLocalDB();
  }
  
  try {
    const doc: any = await localDb.get(`order_${orderId}`);
    await localDb.remove(doc);
    console.log(`[PouchDB] Removed queued order '${orderId}'`);
  } catch (error) {
    if (error.name === 'not_found') {
      console.log(`[PouchDB] No queued order '${orderId}' to remove`);
    } else {
      console.error(`[PouchDB] Failed to remove queued order '${orderId}':`, error);
      throw error;
    }
  }
}

/**
 * Sync pending orders with remote server
 * @returns Promise resolving to sync results
 */
export async function syncPendingOrders(): Promise<{ success: number; failed: number }> {
  console.log('[PouchDB] Starting sync of pending orders...');
  
  // In offline mode, we rely on PouchDB's built-in sync
  // This function can be used for manual sync triggers
  if (!remoteDb) {
    console.log('[PouchDB] No remote database configured, relying on continuous sync');
    return { success: 0, failed: 0 };
  }
  
  try {
    // One-time sync
    await localDb.replicate.to(remoteDb);
    console.log('[PouchDB] Manual sync completed');
    return { success: 0, failed: 0 }; // PouchDB handles the actual syncing
  } catch (error) {
    console.error('[PouchDB] Manual sync failed:', error);
    return { success: 0, failed: 0 };
  }
}

/**
 * Initialize the database (alias for initLocalDB for compatibility)
 * @returns Promise resolving to the database instance
 */
export async function initDB(): Promise<PouchDB.Database> {
  return initLocalDB();
}

/**
 * Restore cart items (alias for saveCart for compatibility)
 * @param items - Array of cart items to restore
 */
export async function restoreCart(items: CartItem[]): Promise<void> {
  return saveCart(items);
}

/**
 * Restore queued orders (adds multiple orders to the queue)
 * @param orders - Array of orders to restore
 */
export async function restoreQueue(orders: Sale[]): Promise<void> {
  if (!localDb) {
    await initLocalDB();
  }
  
  try {
    // Clear existing orders first
    const existingOrders = await getAllQueuedOrders();
    for (const order of existingOrders) {
      await removeQueuedOrder(order.id);
    }
    
    // Add new orders
    for (const order of orders) {
      await queueOrder(order);
    }
    
    console.log(`[PouchDB] Restored ${orders.length} orders to queue`);
  } catch (error) {
    console.error('[PouchDB] Failed to restore queue:', error);
    throw error;
  }
}

/**
 * Get all queued orders (alias for compatibility)
 * @returns Promise resolving to array of queued orders
 */
// Removed duplicate function
