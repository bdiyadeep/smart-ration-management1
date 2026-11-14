
const DB_NAME = "SmartRationDB";
const STORE_NAME = "transactions";
const DB_VERSION = 5;

// Open database and safely migrate existing transactions
function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      const upgradeTx = event.target.transaction;

      // Create the new store if it does not exist
      const targetStore = db.objectStoreNames.contains(STORE_NAME)
        ? upgradeTx.objectStore(STORE_NAME)
        : db.createObjectStore(STORE_NAME, { keyPath: "id" });

      // Copy records from old stores. Do NOT delete the old stores.
      ["offlineTransactions", "offline transaction", "transaction"].forEach((oldName) => {
        if (db.objectStoreNames.contains(oldName)) {
          const oldStore = upgradeTx.objectStore(oldName);
          const cursorRequest = oldStore.openCursor();

          cursorRequest.onsuccess = () => {
            const cursor = cursorRequest.result;

            if (cursor) {
              targetStore.put(cursor.value);
              cursor.continue();
            }
          };
        }
      });
    };

    request.onsuccess = () => {
      const db = request.result;
      db.onversionchange = () => db.close();
      resolve(db);
    };

    request.onerror = () => reject(request.error);
  });
}

// Save a transaction
export async function saveOfflineTransaction(transaction) {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);

    store.put(transaction);

    tx.oncomplete = () => {
      db.close();
      resolve(true);
    };

    tx.onerror = () => {
      db.close();
      reject(tx.error);
    };

    tx.onabort = () => {
      db.close();
      reject(tx.error);
    };
  });
}

// Get all saved transactions
export async function getOfflineTransactions() {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => {
      const transactions = request.result || [];

      transactions.sort(
        (a, b) =>
          Number(String(b.id).slice(3)) -
          Number(String(a.id).slice(3))
      );

      resolve(transactions);
    };

    request.onerror = () => reject(request.error);

    tx.oncomplete = () => db.close();

    tx.onerror = () => {
      db.close();
      reject(tx.error);
    };
  });
}

// Delete a transaction after successful synchronization
export async function deleteOfflineTransaction(id) {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);

    store.delete(id);

    tx.oncomplete = () => {
      db.close();
      resolve(true);
    };

    tx.onerror = () => {
      db.close();
      reject(tx.error);
    };

    tx.onabort = () => {
      db.close();
      reject(tx.error);
    };
  });
}
