/**
 * @param { string } key Key to store data
 * @param { any } data Data to store
 * @returns { Promise<void> } Promise that resolves when data is stored
 * @error { error } If error it will return object with error property
 */
export class SimpleIndexedDB {
  private dbName: string
  private storeName: string

  constructor(dbName: string, storeName: string) {
    this.dbName = dbName
    this.storeName = storeName
  }

  async set(key: any, data: any) {
    const request = window.indexedDB.open(this.dbName)

    request.onupgradeneeded = () => {
      const db = request.result
      db.createObjectStore(this.storeName)
    }

    request.onsuccess = () => {
      const db = request.result
      const transaction = db.transaction([this.storeName], 'readwrite')
      const store = transaction.objectStore(this.storeName)
      store.put(data, key)
    }
  }

  async get(key: any) {
    return new Promise((resolve) => {
      const request = window.indexedDB.open(this.dbName)
      let data: any

      request.onupgradeneeded = () => {
        const db = request.result
        db.createObjectStore(this.storeName)
      }

      request.onsuccess = async () => {
        const db = request.result
        const transaction = db.transaction([this.storeName], 'readonly')
        const store = transaction.objectStore(this.storeName)
        data = store.get(key)
        data.onsuccess = () => {
          resolve(data.result)
        }
      }
    })
  }

  async delete() {
    const request = window.indexedDB.open(this.dbName)

    request.onsuccess = () => {
      const db = request.result
      db.deleteObjectStore(this.storeName)
    }
  }
}
