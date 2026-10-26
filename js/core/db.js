class Database {
    constructor(dbName = "GameEditorDB", version = 1) {
        this.dbName = dbName;
        this.version = version;
        this.db = null;
    }

    /**
     * Abre la conexión con IndexedDB o devuelve la instancia activa en caché.
     */
    async connect() {
        if (this.db) return this.db;

        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);

            // Se ejecuta solo si la base de datos no existe o si sube la versión
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                console.log(`[IndexedDB] Inicializando esquema v${this.version}...`);

                // 1. Almacén para archivos binarios y metadatos de hojas de sprites
                if (!db.objectStoreNames.contains("spritesheets")) {
                    db.createObjectStore("spritesheets", { keyPath: "id" });
                    console.log("[IndexedDB] ObjectStore 'spritesheets' creado.");
                }

                // 2. Almacén para proyectos y matrices de niveles
                if (!db.objectStoreNames.contains("maps")) {
                    const mapStore = db.createObjectStore("maps", { keyPath: "id" });
                    mapStore.createIndex("name", "name", { unique: false });
                    mapStore.createIndex("updatedAt", "updatedAt", { unique: false });
                    console.log("[IndexedDB] ObjectStore 'maps' creado con índices.");
                }
            };

            request.onsuccess = (event) => {
                this.db = event.target.result;
                console.log(`[IndexedDB] Conexión establecida con éxito: ${this.dbName}`);
                resolve(this.db);
            };

            request.onerror = (event) => {
                console.error("[IndexedDB] Error al conectar:", event.target.error);
                reject(event.target.error);
            };
        });
    }

    /**
     * Cierra la conexión activa (útil si necesitas cambiar de base o reiniciar).
     */
    close() {
        if (this.db) {
            this.db.close();
            this.db = null;
            console.log("[IndexedDB] Conexión cerrada.");
        }
    }
}

// Instancia compartida por toda la aplicación
const db = new Database();
export default db;