import storageService from "../services/storageService.js";

class MapStore extends EventTarget {
    constructor() {
        super();
        this.activeMap = null;
        this.activeMapTileSheets = null;
    }

    async saveMap(mapData){
        const newMap = {
            id: crypto.randomUUID(),
            metadata: mapData,
        }
        try {
            const record = await storageService.put("maps", newMap);
            if(record){
                this.activeMap = record;
                this.dispatchEvent(new CustomEvent("map:change", 
                    {
                        detail: { 
                            activeMap: this.activeMap
                        }
                    }
                ));
                alert("Map saved");
            }
        }catch(err){
            console.warn("Error al guardar el mapa: ", err);
        }
    }

    async updateMap(updatedMapData) {
        
        try{
            const record = await storageService.put("maps", updatedMapData);
            if(record){
                this.activeMap = record;
                this.dispatchEvent(new CustomEvent("map:change", 
                    {
                        detail: {
                            activeMap: this.activeMap
                        }
                    }
                ));
                alert("Map updated!");
            }
        }catch(err){
            console.warn(err);
        }
    }

    async loadMaps() {
        try{
            const records = await storageService.getAll("maps");
            if(records){
                return records;
            }
        }catch(err){
            console.warn(err);
        }
    }

    async getMap(mapId) {
        // 1. Limpiar memoria de la GPU cerrando los bitmaps del mapa anterior si existen
        if (this.activeMapTileSheets) {
            Object.values(this.activeMapTileSheets).forEach(sheet => {
                if (sheet.bitmap) {
                    sheet.bitmap.close();
                }
            });
        }

        this.activeMap = null;
        this.activeMapTileSheets = null;
        
        try {
            const map = await storageService.getById("maps", mapId);
            if (!map) {
                alert("No se encontro el mapa!");
                return; // Evita que el código siga ejecutándose si no hay mapa
            }

            if (map.tileSheets && map.tileSheets.length > 0) {
                // 2. Cargamos los datos y creamos los ImageBitmaps en paralelo
                const promises = map.tileSheets.map(async (id) => {
                    const ts = await storageService.getById("tileSheets", id);
                    
                    // Asegúrate de que ts.file sea la propiedad donde guardas el Blob/File en IndexedDB
                    const bitmap = await createImageBitmap(ts.file); 
                    
                    return {
                        id: ts.id,
                        name: ts.name,
                        bitmap: bitmap
                    };
                });
                
                const loadedSheets = await Promise.all(promises);
                
                // 3. Transformamos el arreglo en un diccionario para el Viewer y la UI
                this.activeMapTileSheets = loadedSheets.reduce((acc, sheet) => {
                    acc[sheet.id] = {
                        name: sheet.name,
                        bitmap: sheet.bitmap
                    };
                    return acc;
                }, {});
            } else {
                this.activeMapTileSheets = {};
            }

            this.activeMap = map;
            this.dispatchEvent(new CustomEvent("map:change", 
                {
                    detail: {
                        activeMap: this.activeMap,
                        activeMapTileSheets: this.activeMapTileSheets
                    }
                }
            ));

        } catch(err) {
            console.error("Hubo un error al buscar el mapa: ", err);
        }
    }

    async addTileSheetToMap(activeMap, tileSheet){
        try{
            if(!activeMap.tileSheets){
                activeMap.tileSheets = [];
            }

            if(activeMap.tileSheets.find((sheet) => sheet == tileSheet)) {
                alert("Esa hoja ya esta asignada al mapa");
                return;
            }

            activeMap.tileSheets.push(tileSheet);

            const record = await storageService.put("maps", activeMap);
            this.activeMap = record;

            // Solo cargamos el tilesheet recién agregado para no desperdiciar recursos
            // recreando los bitmaps que ya tenemos en memoria.
            const newSheetData = await storageService.getById("tileSheets", tileSheet);
            
            if (newSheetData && newSheetData.file) {
                const bitmap = await createImageBitmap(newSheetData.file);
                
                // Nos aseguramos de que el diccionario exista
                if (!this.activeMapTileSheets) {
                    this.activeMapTileSheets = {};
                }

                // Añadimos el nuevo tilesheet al diccionario
                this.activeMapTileSheets[tileSheet] = {
                    name: newSheetData.name,
                    bitmap: bitmap
                };
            }
            
            this.dispatchEvent(new CustomEvent("map:change", 
                {
                    detail: {
                        activeMap: this.activeMap,
                        activeMapTileSheets: this.activeMapTileSheets
                    }
                }
            ));

        }catch(err){
            console.error("Fallo la asignacion de la hoja de tiles al mapa: ", err);
        }
    }

    async addTileClassToMap(mapId, newTileClass){
        try{
            const map = await storageService.getById("maps", mapId);
            if(!map){
                console.log("Map not found");
            }
            if(!map.tileClasses){
                map.tileClasses = [];
            }

            if(map.tileClasses.find((tileClass) => tileClass.name  == newTileClass.name)){
                alert("Tile class names cannot be duplicated")
                return;
            }

            map.tileClasses.push(newTileClass);
            const record = await storageService.put("maps", map);
            this.activeMap = record;
            this.dispatchEvent(new CustomEvent("map:change", 
                {
                    detail: {
                        activeMap: this.activeMap
                    }
                }
            ))
        }catch(err){
            console.error("Couldn't add tile class to map: ", err);
        }
        
    }

    async addTileToTileClass(mapId, payload) {
        try {
            const map = await storageService.getById("maps", mapId);
            if (!map) {
                console.error("Map not found");
                return;
            }

            if (!map.tileMappings) {
                map.tileMappings = {};
            }

            if (!map.tileMappings[payload.sheetId]) {
                map.tileMappings[payload.sheetId] = {};
            }

            map.tileMappings[payload.sheetId][payload.tileId] = payload.className;

            const record = await storageService.put("maps", map);
            
            this.activeMap = record;
            this.dispatchEvent(new CustomEvent("map:change", 
                {
                    detail: {
                        activeMap: this.activeMap,
                        activeMapTileSheets: this.activeMapTileSheets
                    }
                }
            ));
            
        } catch (err) {
            console.error("No se pudo asignar la clase al tile", err);
        }
    }

    async exportMapForEngine(mapId) {
        try {
            const map = await storageService.getById("maps", mapId.id);
            if (!map) {
                console.error("Mapa no encontrado");
                return;
            }
    
            // 1. Cargar múltiples TileSheets concurrentemente
            // Como ahora map.tileSheets es un array de UUIDs, iteramos sobre ellos
            const tileSheetsPromises = map.tileSheets.map(sheetId => 
                storageService.getById("tileSheets", sheetId)
            );
            
            // Esperamos a que todos los tilesheets se carguen de la base de datos
            const tileSheetsData = await Promise.all(tileSheetsPromises);
    
            // 2. Construir el arreglo de TileSheets para exportar
            const exportTileSheets = tileSheetsData.map(tsData => {
                if (!tsData) return null;
                const fileName = tsData.fileName || `${tsData.name}.png`;
                return {
                    id: tsData.id,
                    src: `src/world/assets/${fileName}`,
                    // Extraemos los mapeos correspondientes a este tilesheet específico
                    tileMappings: map.tileMappings ? (map.tileMappings[tsData.id] || {}) : {}
                };
            }).filter(ts => ts !== null); // Limpiar nulos en caso de que algún ID no exista
    
            // 3. Extraer el nombre de metadata para el archivo
            const mapName = map.metadata?.name || "Mapa_Sin_Nombre";
    
            // 4. Armar el objeto final exportable
            const exportObject = {
                id: map.id,
                name: mapName,
                tileSize: parseInt(map.metadata?.tileSize || 32),
                width: parseInt(map.metadata?.width || 0),
                height: parseInt(map.metadata?.height || 0),
                tileClasses: map.tileClasses || [],
                tileSheets: exportTileSheets,
                data: map.mapTiles || [] // Actualizado de levelData a mapTiles
            };
    
            // 5. Generar y descargar el archivo JSON
            const jsonString = JSON.stringify(exportObject, null, 2);
            
            const blob = new Blob([jsonString], { type: "application/json" });
            const url = URL.createObjectURL(blob);
    
            const downloadLink = document.createElement("a");
            downloadLink.href = url;
            downloadLink.download = `${mapName.replace(/\s+/g, '_').toLowerCase()}_export.json`;
            
            document.body.appendChild(downloadLink);
            downloadLink.click();
            
            document.body.removeChild(downloadLink);
            URL.revokeObjectURL(url);
    
            alert("Map exported!");
    
        } catch (error) {
            console.error("Error al exportar el mapa:", error);
        }
    }
}

const mapStore = new MapStore();
export default mapStore;


