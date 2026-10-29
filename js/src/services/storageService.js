import db from "../../core/db.js";

class StorageService {
    /**
     * Guarda o actualiza un registro en un Object Store
     */
    async put(storeName, data) {
        const database = await db.connect();

        return new Promise((resolve, reject) => {

            const tx = database.transaction(storeName, "readwrite");
            const store = tx.objectStore(storeName);
            const request = store.put(data);

            request.onsuccess = () => {
                const generatedKey = request.result;
                const savedRecord = typeof data === "object" && data !== null
                    ? { ...data, id: data.id ?? generatedKey }
                    : generatedKey;

                resolve(savedRecord);
            };

            request.onerror = () => reject(request.error);
            tx.onerror = () => reject(tx.error);
        });
    }

    /**
     * Obtiene todos los registros de un Object Store
     */
    async getAll(storeName) {
        const database = await db.connect();

        return new Promise((resolve, reject) => {
            const tx = database.transaction(storeName, "readonly");
            const store = tx.objectStore(storeName);
            const request = store.getAll();

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Obtiene un registro puntual por su ID
     */
    async getById(storeName, id) {
        const database = await db.connect();

        return new Promise((resolve, reject) => {
            const tx = database.transaction(storeName, "readonly");
            const store = tx.objectStore(storeName);
            const request = store.get(id);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }
}

export default new StorageService();